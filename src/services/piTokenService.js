import { StellarSdk } from 'stellar-sdk';
import axios from 'axios';

class PiTokenService {
  constructor() {
    this.server = new StellarSdk.Server('https://api.testnet.minepi.com');
    this.networkPassphrase = 'Pi Testnet';
    this.tokenAsset = new StellarSdk.Asset(
      process.env.REACT_APP_TOKEN_CODE || 'PAILOT',
      process.env.REACT_APP_TOKEN_ISSUER
    );
  }

  /**
   * Initialize user's token account
   * @param {string} userPublicKey - User's public key
   * @returns {Promise<Object>} Transaction result
   */
  async initializeTokenAccount(userPublicKey) {
    try {
      const account = await this.server.loadAccount(userPublicKey);
      const fee = await this.server.fetchBaseFee();

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: this.tokenAsset,
            limit: '1000000' // Adjust limit as needed
          })
        )
        .setTimeout(30)
        .build();

      return transaction.toXDR();
    } catch (error) {
      console.error('Token account initialization error:', error);
      throw error;
    }
  }

  /**
   * Mint tokens to a user
   * @param {string} destinationPublicKey - Recipient's public key
   * @param {string} amount - Amount to mint
   * @returns {Promise<Object>} Transaction result
   */
  async mintTokens(destinationPublicKey, amount) {
    try {
      const issuerAccount = await this.server.loadAccount(process.env.REACT_APP_TOKEN_ISSUER);
      const fee = await this.server.fetchBaseFee();

      const transaction = new StellarSdk.TransactionBuilder(issuerAccount, {
        fee,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: this.tokenAsset,
            amount: amount.toString()
          })
        )
        .setTimeout(30)
        .build();

      return transaction.toXDR();
    } catch (error) {
      console.error('Token minting error:', error);
      throw error;
    }
  }

  /**
   * Transfer tokens between users
   * @param {string} senderPublicKey - Sender's public key
   * @param {string} recipientPublicKey - Recipient's public key
   * @param {string} amount - Amount to transfer
   * @returns {Promise<Object>} Transaction result
   */
  async transferTokens(senderPublicKey, recipientPublicKey, amount) {
    try {
      const senderAccount = await this.server.loadAccount(senderPublicKey);
      const fee = await this.server.fetchBaseFee();

      const transaction = new StellarSdk.TransactionBuilder(senderAccount, {
        fee,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: recipientPublicKey,
            asset: this.tokenAsset,
            amount: amount.toString()
          })
        )
        .setTimeout(30)
        .build();

      return transaction.toXDR();
    } catch (error) {
      console.error('Token transfer error:', error);
      throw error;
    }
  }

  /**
   * Get token balance for a user
   * @param {string} publicKey - User's public key
   * @returns {Promise<string>} Token balance
   */
  async getTokenBalance(publicKey) {
    try {
      const account = await this.server.loadAccount(publicKey);
      const balance = account.balances.find(
        b => b.asset_code === this.tokenAsset.code && b.asset_issuer === this.tokenAsset.issuer
      );
      return balance ? balance.balance : '0';
    } catch (error) {
      console.error('Balance check error:', error);
      throw error;
    }
  }

  /**
   * Get token transaction history for a user
   * @param {string} publicKey - User's public key
   * @returns {Promise<Array>} Transaction history
   */
  async getTokenHistory(publicKey) {
    try {
      const payments = await this.server
        .payments()
        .forAccount(publicKey)
        .join('transactions')
        .call();

      return payments.records.filter(
        payment =>
          payment.asset_code === this.tokenAsset.code &&
          payment.asset_issuer === this.tokenAsset.issuer
      );
    } catch (error) {
      console.error('Transaction history error:', error);
      throw error;
    }
  }

  /**
   * Submit a token transaction to the network
   * @param {string} signedXdr - Signed transaction XDR
   * @returns {Promise<Object>} Transaction result
   */
  async submitTransaction(signedXdr) {
    try {
      const transaction = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        this.networkPassphrase
      );
      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Transaction submission error:', error);
      throw error;
    }
  }

  /**
   * Burn tokens from a user's account
   * @param {string} holderPublicKey - Token holder's public key
   * @param {string} amount - Amount to burn
   * @returns {Promise<Object>} Transaction result
   */
  async burnTokens(holderPublicKey, amount) {
    try {
      const holderAccount = await this.server.loadAccount(holderPublicKey);
      const fee = await this.server.fetchBaseFee();

      const transaction = new StellarSdk.TransactionBuilder(holderAccount, {
        fee,
        networkPassphrase: this.networkPassphrase
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: process.env.REACT_APP_TOKEN_ISSUER,
            asset: this.tokenAsset,
            amount: amount.toString()
          })
        )
        .setTimeout(30)
        .build();

      return transaction.toXDR();
    } catch (error) {
      console.error('Token burning error:', error);
      throw error;
    }
  }

  /**
   * Check if a user's account is set up for the token
   * @param {string} publicKey - User's public key
   * @returns {Promise<boolean>} Whether account is set up
   */
  async isAccountSetup(publicKey) {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account.balances.some(
        b => b.asset_code === this.tokenAsset.code && b.asset_issuer === this.tokenAsset.issuer
      );
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}

export default new PiTokenService();
