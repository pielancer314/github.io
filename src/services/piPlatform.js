const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000',
});

class PiPlatform {
  constructor() {
    this.sdk = window.Pi;
    if (!this.sdk) {
      throw new Error('Pi SDK not found. Please run in Pi Browser.');
    }
    this.init();
  }

  init() {
    this.sdk.init({
      version: '2.0',
      sandbox: process.env.NODE_ENV !== 'production'
    });
  }

  // Authentication
  async signIn() {
    try {
      const scopes = ['payments', 'username', 'wallet_address'];
      const auth = await this.sdk.authenticate(scopes, this.onIncompletePayment.bind(this));
      await this.signInUser(auth);
      return auth;
    } catch (error) {
      console.error('Pi Authentication Error:', error);
      throw error;
    }
  }

  async signInUser(authResult) {
    try {
      const response = await axiosInstance.post('/api/auth/signin', {
        accessToken: authResult.accessToken,
        uid: authResult.user.uid,
        username: authResult.user.username
      });
      return response.data;
    } catch (error) {
      console.error('Backend signin error:', error);
      throw error;
    }
  }

  // Payment Flow
  async createPayment({ amount, memo, metadata }) {
    try {
      const paymentData = {
        amount: amount.toString(),
        memo,
        metadata
      };

      const payment = await this.sdk.createPayment(paymentData);
      
      // Record payment in backend
      await axiosInstance.post('/api/payments/create', {
        paymentId: payment.identifier,
        amount,
        memo,
        metadata
      });

      return payment;
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error;
    }
  }

  async submitPayment(paymentId) {
    try {
      const approvalResult = await this.sdk.submitPayment(paymentId);
      
      // Update payment status in backend
      await axiosInstance.post('/api/payments/approve', {
        paymentId,
        txid: approvalResult.transaction.txid
      });

      return approvalResult;
    } catch (error) {
      console.error('Payment submission error:', error);
      throw error;
    }
  }

  async completePayment(paymentId) {
    try {
      const completionResult = await this.sdk.completePayment(paymentId);
      
      // Update payment status in backend
      await axiosInstance.post('/api/payments/complete', {
        paymentId,
        txid: completionResult.transaction.txid
      });

      return completionResult;
    } catch (error) {
      console.error('Payment completion error:', error);
      throw error;
    }
  }

  async cancelPayment(paymentId) {
    try {
      const cancellationResult = await this.sdk.cancelPayment(paymentId);
      
      // Update payment status in backend
      await axiosInstance.post('/api/payments/cancel', {
        paymentId
      });

      return cancellationResult;
    } catch (error) {
      console.error('Payment cancellation error:', error);
      throw error;
    }
  }

  // Handle incomplete payments
  async onIncompletePayment(payment) {
    try {
      // Check payment status from backend
      const { data: paymentStatus } = await axiosInstance.get(
        `/api/payments/status/${payment.identifier}`
      );

      if (paymentStatus.status === 'pending') {
        await this.completePayment(payment.identifier);
      }
    } catch (error) {
      console.error('Error handling incomplete payment:', error);
      throw error;
    }
  }

  // Order management
  async createOrder(orderData) {
    try {
      const response = await axiosInstance.post('/api/orders/create', orderData);
      return response.data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  }

  async getOrderStatus(orderId) {
    try {
      const response = await axiosInstance.get(`/api/orders/status/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Order status fetch error:', error);
      throw error;
    }
  }

  // User management
  async getUserProfile() {
    try {
      const response = await axiosInstance.get('/api/user/profile');
      return response.data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async updateUserProfile(profileData) {
    try {
      const response = await axiosInstance.put('/api/user/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  // Transaction history
  async getTransactionHistory() {
    try {
      const response = await axiosInstance.get('/api/transactions/history');
      return response.data;
    } catch (error) {
      console.error('Transaction history fetch error:', error);
      throw error;
    }
  }

  // Platform utilities
  async shareContent(content) {
    try {
      await this.sdk.share({
        title: content.title,
        text: content.text,
        url: content.url
      });
    } catch (error) {
      console.error('Content sharing error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const piPlatform = new PiPlatform();
export default piPlatform;
