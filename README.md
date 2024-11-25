# Blockchain Transport Coop Platform

A blockchain-powered transportation management system built on Pi Network for efficient goods and services delivery in the Philippines.

## Features

- 🚚 Real-time delivery tracking
- 💰 Pi Network payment integration
- 🎁 token rewards system
- 📱 Mobile-first responsive design
- 🗺️ Google Maps integration
- 🔒 Secure blockchain transactions

## Technology Stack

- Frontend: React 18
- State Management: Zustand
- UI Framework: Chakra UI
- Blockchain: Pi Network
- Maps: Google Maps API
- Logging: Winston

## Pi Network Integration

### Payment Features
- Secure Pi payment processing
- Dynamic fee calculation
- Real-time transaction status
- Payment webhooks
- Driver earnings distribution

### Token Features
- Token rewards
- Performance-based bonuses
- Token balance tracking
- Transaction history
- Token transfers

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/pielancer314/github.io.git
cd github.io
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your configuration:
```env
REACT_APP_PI_API_KEY=your_pi_api_key
REACT_APP_TOKEN_ISSUER=your_token_issuer
REACT_APP_TOKEN_CODE=PAILOT
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key
```

5. Start the development server:
```bash
npm start
```

## Reward System

Drivers earn PAILOT tokens for completed deliveries:
- Base reward: 5 PAILOT tokens
- On-time delivery: +2 tokens
- High rating (≥4.5): +3 tokens
- Long distance (>10km): +2 tokens

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

PielancerPH - [@pielancer314](https://github.com/pielancer314)

Project Link: [https://github.com/pielancer314/github.io](https://github.com/pielancer314/github.io)
