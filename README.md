# Blockchain Transport Coop Platform

A blockchain-powered transportation management system for efficient goods delivery in the Philippines, built on the Pi Network blockchain.

## 🌟 Features

- Real-time delivery tracking with Google Maps integration
- Pi Network payment integration
- Token rewards system for drivers
- Driver-customer matching
- Mobile-first responsive design
- Secure blockchain transactions
- Real-time notifications

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/transport-coop-platform.git
cd transport-coop-platform
```

2. Set up environment variables:
- Create a `.env` file in the root directory
- Add the following variables:
  ```
  GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  PI_API_KEY=your_pi_network_api_key
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 💻 Tech Stack

### Frontend
- React 18
- Zustand (State Management)
- Chakra UI
- Pi Network SDK
- Google Maps API
- Socket.IO Client

### Backend
- Node.js with Express
- MongoDB
- JWT Authentication
- Stellar SDK
- Winston (Logging)
- Socket.IO

## 🏆 Token Reward System

Drivers can earn tokens based on:
- Base reward: 5 tokens
- On-time delivery: +2 tokens
- High rating (≥4.5): +3 tokens
- Long-distance deliveries (>10km): +2 tokens
- Multiple items (>5): +1 token
- Clean delivery: +1 token
- Maximum reward: 15 tokens

## 🔒 Security Features

- JWT authentication for secure API access
- Secure token transactions using Stellar blockchain
- Environment-specific configurations
- Role-based access control
- Data encryption

## 📱 Mobile Responsiveness

The platform is designed with a mobile-first approach, ensuring:
- Responsive layout for all screen sizes
- Touch-friendly interface
- Optimized performance on mobile devices
- Progressive Web App (PWA) capabilities

## 🌍 API Documentation

Detailed API documentation is available at `/api/docs` when running the development server.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact us at support@transportcoop.com or join our [Discord community](https://discord.gg/transportcoop).

## 🙏 Acknowledgments

- Pi Network team for blockchain infrastructure
- Google Maps for location services
- Open source community for various tools and libraries

---

Made with ❤️ for the Philippine logistics community
