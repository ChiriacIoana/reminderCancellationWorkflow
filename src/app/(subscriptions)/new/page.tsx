'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubscription, Subscription } from '@/src/api/subscriptionService';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { date } from 'zod';

export default function NewSubscriptionPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<Subscription['category']>();
  const [currency, setCurrency] = useState<Subscription['currency']>();
  const [frequency, setFrequency] = useState<Subscription['frequency']>();
  const [paymentMethod, setPaymentMethod] = useState<Subscription['paymentMethod']>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createSubscription({
        name,
        price:parseFloat(price),
        category,
        currency,
        frequency,
        paymentMethod,
        status: 'active', // default
      });

      //save to localStorage
      const newSub = {
        //nush inca ce sa fac aici la id
        id: `SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name,
        price: parseFloat(price),
        status: 'active',
        startDate: new Date().toISOString(),
        nextBillingDate: new Date().toISOString(),
        lastPayment: 'just now',
        category: category,
      };

      const existingSub = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      localStorage.setItem('subscriptions', JSON.stringify([...existingSub, newSub]));

      router.push('/dashboard'); // redirect after success
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create subscription');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">New Subscription</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="Service name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={category || ''}
          onChange={(e) => setCategory(e.target.value as Subscription['category'])}
          className="rounded border p-2"
        >
          <option value="">Select category</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="food">Food</option>
          <option value="health">Health</option>
          <option value="other">Other</option>
        </select>

        <select
          value={currency || ''}
          onChange={(e) => setCurrency(e.target.value as Subscription['currency'])}
          className="rounded border p-2"
        >
          <option value="">Select currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="INR">INR</option>
          <option value="RON">RON</option>
        </select>

        <select
          value={frequency || ''}
          onChange={(e) => setFrequency(e.target.value as Subscription['frequency'])}
          className="rounded border p-2"
        >
          <option value="">Select frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <select
          value={paymentMethod || ''}
          onChange={(e) => setPaymentMethod(e.target.value as Subscription['paymentMethod'])}
          className="rounded border p-2"
        >
          <option value="">Select payment method</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Subscription'}
        </Button>
      </form>
    </div>
  );
}
