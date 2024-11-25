import { useState, useEffect } from 'react';
import piPlatform from '../services/piPlatform';

export const usePiPlatform = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializePi = async () => {
      try {
        setLoading(true);
        const auth = await piPlatform.signIn();
        setUser(auth.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializePi();
  }, []);

  const createDeliveryPayment = async ({ amount, deliveryDetails }) => {
    try {
      const payment = await piPlatform.createPayment({
        amount,
        memo: `Delivery Payment - ${deliveryDetails.from} to ${deliveryDetails.to}`,
        metadata: {
          type: 'delivery',
          details: deliveryDetails
        }
      });

      const approval = await piPlatform.submitPayment(payment.identifier);
      return approval;
    } catch (error) {
      console.error('Delivery payment error:', error);
      throw error;
    }
  };

  const shareDelivery = async (delivery) => {
    try {
      await piPlatform.shareContent({
        title: 'PailotPH Delivery',
        text: `Check out my delivery from ${delivery.from} to ${delivery.to}!`,
        url: `${window.location.origin}/delivery/${delivery.id}`
      });
    } catch (error) {
      console.error('Share delivery error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    error,
    createDeliveryPayment,
    shareDelivery,
    platform: piPlatform
  };
};

export default usePiPlatform;
