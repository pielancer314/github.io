import { useState, useEffect } from 'react';
import piTokenService from '../services/piTokenService';

export const usePiToken = (userPublicKey) => {
  const [balance, setBalance] = useState('0');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeToken = async () => {
      if (!userPublicKey) return;

      try {
        setLoading(true);
        // Check if account is set up for PAILOT tokens
        const isSetup = await piTokenService.isAccountSetup(userPublicKey);
        
        if (!isSetup) {
          const txXDR = await piTokenService.initializeTokenAccount(userPublicKey);
          // User needs to sign and submit the transaction
          return txXDR;
        }

        // Get initial balance and history
        const [currentBalance, txHistory] = await Promise.all([
          piTokenService.getTokenBalance(userPublicKey),
          piTokenService.getTokenHistory(userPublicKey)
        ]);

        setBalance(currentBalance);
        setHistory(txHistory);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeToken();
  }, [userPublicKey]);

  const mintRewardTokens = async (amount) => {
    try {
      if (!userPublicKey) throw new Error('User public key not provided');

      const txXDR = await piTokenService.mintTokens(userPublicKey, amount);
      // Update balance after successful minting
      const newBalance = await piTokenService.getTokenBalance(userPublicKey);
      setBalance(newBalance);
      return txXDR;
    } catch (error) {
      console.error('Mint reward tokens error:', error);
      throw error;
    }
  };

  const transferTokens = async (recipientPublicKey, amount) => {
    try {
      if (!userPublicKey) throw new Error('User public key not provided');

      const txXDR = await piTokenService.transferTokens(
        userPublicKey,
        recipientPublicKey,
        amount
      );
      // Update balance after successful transfer
      const newBalance = await piTokenService.getTokenBalance(userPublicKey);
      setBalance(newBalance);
      return txXDR;
    } catch (error) {
      console.error('Transfer tokens error:', error);
      throw error;
    }
  };

  const burnTokens = async (amount) => {
    try {
      if (!userPublicKey) throw new Error('User public key not provided');

      const txXDR = await piTokenService.burnTokens(userPublicKey, amount);
      // Update balance after successful burning
      const newBalance = await piTokenService.getTokenBalance(userPublicKey);
      setBalance(newBalance);
      return txXDR;
    } catch (error) {
      console.error('Burn tokens error:', error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    try {
      if (!userPublicKey) return;

      const newBalance = await piTokenService.getTokenBalance(userPublicKey);
      setBalance(newBalance);
    } catch (error) {
      console.error('Refresh balance error:', error);
      throw error;
    }
  };

  const refreshHistory = async () => {
    try {
      if (!userPublicKey) return;

      const newHistory = await piTokenService.getTokenHistory(userPublicKey);
      setHistory(newHistory);
    } catch (error) {
      console.error('Refresh history error:', error);
      throw error;
    }
  };

  const submitSignedTransaction = async (signedXDR) => {
    try {
      const result = await piTokenService.submitTransaction(signedXDR);
      // Refresh balance and history after successful transaction
      await Promise.all([refreshBalance(), refreshHistory()]);
      return result;
    } catch (error) {
      console.error('Submit transaction error:', error);
      throw error;
    }
  };

  return {
    balance,
    history,
    loading,
    error,
    mintRewardTokens,
    transferTokens,
    burnTokens,
    refreshBalance,
    refreshHistory,
    submitSignedTransaction
  };
};

export default usePiToken;
