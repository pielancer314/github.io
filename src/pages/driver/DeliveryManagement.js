import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { FaTruck, FaCoins, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import usePiPlatform from '../../hooks/usePiPlatform';
import usePiToken from '../../hooks/usePiToken';

const calculateReward = (delivery) => {
  let reward = 5; // Base reward

  // On-time delivery bonus
  if (delivery.status === 'completed' && delivery.completedOnTime) {
    reward += 2;
  }

  // High rating bonus
  if (delivery.rating >= 4.5) {
    reward += 3;
  }

  // Long distance bonus
  if (delivery.distance > 10) {
    reward += 2;
  }

  return reward;
};

const DeliveryManagement = () => {
  const toast = useToast();
  const { user, createDeliveryPayment, shareDelivery } = usePiPlatform();
  const { mintRewardTokens, balance } = usePiToken(user?.publicKey);

  const [activeDelivery, setActiveDelivery] = useState(null);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [center, setCenter] = useState({
    lat: 14.5995,
    lng: 120.9842
  });

  useEffect(() => {
    // Load delivery history
    const loadDeliveryHistory = async () => {
      try {
        const response = await fetch('/api/deliveries/history');
        const data = await response.json();
        setDeliveryHistory(data);
      } catch (error) {
        console.error('Error loading delivery history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load delivery history',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadDeliveryHistory();
  }, [toast]);

  const handleAcceptDelivery = async (delivery) => {
    try {
      setLoading(true);
      
      // Accept the delivery through backend
      const response = await fetch(`/api/deliveries/${delivery.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverId: user.uid }),
      });
      
      if (!response.ok) throw new Error('Failed to accept delivery');
      
      const updatedDelivery = await response.json();
      setActiveDelivery(updatedDelivery);
      
      toast({
        title: 'Success',
        description: 'Delivery accepted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error accepting delivery:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept delivery',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async () => {
    try {
      setLoading(true);
      
      // Complete delivery payment
      const paymentResult = await createDeliveryPayment({
        amount: activeDelivery.amount,
        deliveryDetails: {
          id: activeDelivery.id,
          from: activeDelivery.pickup,
          to: activeDelivery.dropoff
        }
      });
      
      if (!paymentResult) throw new Error('Payment failed');
      
      // Update delivery status
      const response = await fetch(`/api/deliveries/${activeDelivery.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId: user.uid,
          paymentId: paymentResult.identifier
        }),
      });
      
      if (!response.ok) throw new Error('Failed to complete delivery');
      
      const completedDelivery = await response.json();
      
      // Calculate and mint reward tokens
      const reward = calculateReward(completedDelivery);
      await mintRewardTokens(reward.toString());
      
      // Share delivery completion
      await shareDelivery(completedDelivery);
      
      setActiveDelivery(null);
      setDeliveryHistory(prev => [completedDelivery, ...prev]);
      
      toast({
        title: 'Success',
        description: `Delivery completed! You earned ${reward} PAILOT tokens`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete delivery',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Delivery Management</Heading>
          <Stat textAlign="right">
            <StatLabel>PAILOT Balance</StatLabel>
            <StatNumber>{balance} PAILOT</StatNumber>
            <StatHelpText>Your reward tokens</StatHelpText>
          </Stat>
        </Flex>

        {activeDelivery && (
          <Box p={6} borderWidth={1} borderRadius="lg" bg="white">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Active Delivery</Heading>
              
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="bold">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    Pickup
                  </Text>
                  <Text>{activeDelivery.pickup}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    Dropoff
                  </Text>
                  <Text>{activeDelivery.dropoff}</Text>
                </Box>
              </SimpleGrid>

              <Box h="300px" borderRadius="lg" overflow="hidden">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={13}
                  >
                    <Marker position={activeDelivery.pickupCoords} />
                    <Marker position={activeDelivery.dropoffCoords} />
                  </GoogleMap>
                </LoadScript>
              </Box>

              <Progress value={activeDelivery.progress} colorScheme="green" />

              <Button
                colorScheme="green"
                size="lg"
                isLoading={loading}
                onClick={handleCompleteDelivery}
              >
                Complete Delivery
              </Button>
            </VStack>
          </Box>
        )}

        <Box>
          <Heading size="md" mb={4}>Available Deliveries</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {deliveryHistory
              .filter(delivery => delivery.status === 'pending')
              .map(delivery => (
                <Box
                  key={delivery.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="white"
                >
                  <VStack spacing={2} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Badge colorScheme="purple">{delivery.type}</Badge>
                      <Text fontWeight="bold">${delivery.amount}</Text>
                    </Flex>
                    
                    <Text>
                      <Icon as={FaMapMarkerAlt} mr={2} />
                      {delivery.pickup}
                    </Text>
                    <Text>
                      <Icon as={FaMapMarkerAlt} mr={2} />
                      {delivery.dropoff}
                    </Text>
                    
                    <Button
                      colorScheme="blue"
                      size="sm"
                      isLoading={loading}
                      onClick={() => handleAcceptDelivery(delivery)}
                    >
                      Accept Delivery
                    </Button>
                  </VStack>
                </Box>
              ))}
          </SimpleGrid>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Delivery History</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {deliveryHistory
              .filter(delivery => delivery.status !== 'pending')
              .map(delivery => (
                <Box
                  key={delivery.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="white"
                >
                  <VStack spacing={2} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Badge
                        colorScheme={
                          delivery.status === 'completed' ? 'green' : 'red'
                        }
                      >
                        {delivery.status}
                      </Badge>
                      <Text fontWeight="bold">${delivery.amount}</Text>
                    </Flex>
                    
                    <Text>
                      <Icon as={FaTruck} mr={2} />
                      {delivery.distance}km
                    </Text>
                    
                    <Text>
                      <Icon as={FaStar} mr={2} />
                      {delivery.rating} / 5.0
                    </Text>
                    
                    <Text>
                      <Icon as={FaCoins} mr={2} />
                      +{calculateReward(delivery)} PAILOT
                    </Text>
                  </VStack>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default DeliveryManagement;
