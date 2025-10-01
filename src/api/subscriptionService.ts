import { AxiosResponse } from 'axios';
import { apiService } from './api';

export interface Subscription {
  _id?: string;
  name: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'RON';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  category: 'entertainment' | 'utilities' | 'food' | 'health' | 'other';
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
  status: 'active' | 'expired' | 'cancelled';
  startDate?: string;
  renewalDate?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all subscriptions for a user
export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  // AxiosResponse
  const response: AxiosResponse<Subscription[]> = await apiService.get(`/v1/subscriptions/user/${userId}`);
  return response.data; 
  
}

// Create a new subscription
export async function createSubscription(data: Partial<Subscription>) {
  const response: AxiosResponse<Subscription> = await apiService.post('/v1/subscriptions', data);
  return response.data;
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  const response: AxiosResponse<Subscription> = await apiService.put(`/v1/subscriptions/${subscriptionId}/cancel`);
  return response.data;
}
