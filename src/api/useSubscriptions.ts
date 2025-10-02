import { useState } from 'react';
import { cancelSubscription } from '@/src/api/subscriptionService';

export type Subscription = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  nextBillingDate: string;
  lastPayment: string;
  category: string;
  description?: string;
};

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCancelSubscription = async (subscriptionId: string, isMock?: boolean) => {
    if (isMock) {
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
        )
      );
      console.log(`Mock subscription ${subscriptionId} cancelled locally`);
      return;
    }

    try {
      const cancelled = await cancelSubscription(subscriptionId);
      setSubscriptions(prev =>
        prev.map(sub =>
          sub._id === subscriptionId ? { ...sub, status: cancelled.status } : sub
        )
      );
      
      const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const updatedSaved = saved.map((sub: Subscription) =>
        sub._id === subscriptionId ? { ...sub, status: cancelled.status } : sub
      );
      localStorage.setItem('subscriptions', JSON.stringify(updatedSaved));

      console.log(`Subscription ${subscriptionId} cancelled`);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string, isMock?: boolean) => {
    if (isMock) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
      console.log(`Mock subscription ${subscriptionId} deleted`);
      return;
    }

    try {
      setSubscriptions(prev => prev.filter(sub => sub._id !== subscriptionId));
      
      const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const updatedSaved = saved.filter((sub: Subscription) => sub._id !== subscriptionId);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSaved));

      console.log(`Subscription ${subscriptionId} deleted from dashboard`);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  return {
    subscriptions,
    setSubscriptions,
    loading,
    setLoading,
    handleCancelSubscription,
    handleDeleteSubscription
  };
}