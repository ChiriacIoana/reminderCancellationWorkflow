'use client';

import { cancelSubscription, getUserSubscriptions } from '@/src/api/subscriptionService';
import GlowButton from '@/src/components/common/glow-button';
import Header from '@/src/components/common/header';
import MainCard from '@/src/components/common/main-card';
import SearchBar from '@/src/components/common/search-bar';
import { get } from 'http';
import {
  CreditCard,
  Calendar,
  AlertCircle,
  Plus,
  Users,
  DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Subscription = {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  nextBillingDate: string;
  lastPayment: string;
  category: string;
  description?: string;
};

export default function Page() {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  const mockSubscriptions: Subscription[] = [
    {
      id: 'SUB-1A2B3C',
      name: 'Netflix Premium',
      price: 15.99,
      status: 'active',
      startDate: '2024-01-15',
      nextBillingDate: '2024-12-15',
      lastPayment: '2h',
      category: 'Entertainment'
    },
    {
      id: 'SUB-4D5E6F',
      name: 'Spotify Family',
      price: 9.99,
      status: 'active',
      startDate: '2024-03-01',
      nextBillingDate: '2024-12-01',
      lastPayment: '1d',
      category: 'Music'
    },
    {
      id: 'SUB-7G8H9I',
      name: 'Adobe Creative Suite',
      price: 52.99,
      status: 'cancelled',
      startDate: '2024-02-10',
      nextBillingDate: '2024-12-10',
      lastPayment: '3d',
      category: 'Software'
    },
    {
      id: 'SUB-0J1K2L',
      name: 'Amazon Prime',
      price: 8.99,
      status: 'active',
      startDate: '2024-01-01',
      nextBillingDate: '2024-12-01',
      lastPayment: '2h',
      category: 'Shopping'
    },
    {
      id: 'SUB-3M4N5O',
      name: 'Microsoft 365',
      price: 6.99,
      status: 'expired',
      startDate: '2023-11-15',
      nextBillingDate: '2024-11-15',
      lastPayment: '1d',
      category: 'Software'
    },
    {
      id: 'SUB-6P7Q8R',
      name: 'Disney+',
      price: 7.99,
      status: 'active',
      startDate: '2024-04-20',
      nextBillingDate: '2024-12-20',
      lastPayment: '3d',
      category: 'Entertainment'
    }
  ];

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      
      setTimeout(() => {
        //load mock data
        const initial = mockSubscriptions;
        //load any saved subs from localStorage
        const saved = JSON.parse(localStorage.getItem('subscriptions') || '[]');
        //merge them together
        setSubscriptions([...initial, ...saved]);
        setLoading(false);
      }, 1000)
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = () => {
    router.push('/new');
    console.log('Create new subscription');
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
  try {
    const cancelled = await cancelSubscription(subscriptionId);

    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, status: cancelled.status } : sub
      )
    );

    // Update localStorage too
    const updatedSubs = subscriptions.map((sub) =>
      sub.id === subscriptionId ? { ...sub, status: cancelled.status } : sub
    );
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));

    console.log(`Subscription ${subscriptionId} cancelled`);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
  }
};

  // Filter subscriptions based on selected filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return sub.status === 'active';
    if (selectedFilter === 'cancelled') return sub.status === 'cancelled' || sub.status === 'expired';
    return true;
  });

  // Group subscriptions by category
  const groupedSubscriptions = filteredSubscriptions.reduce((groups, subscription) => {
    const category = subscription.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push({
      label: subscription.id.split('-')[1], // Use part of ID as label
      service: subscription.name,
      price: subscription.price,
      status: subscription.status,
      nextBilling: subscription.nextBillingDate,
      lastPayment: subscription.lastPayment,
      subscriptionId: subscription.id,
      category: subscription.category
    });
    return groups;
  }, {} as Record<string, any[]>);

  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalMonthlyCost = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className='flex w-full flex-col gap-6 rounded-xl'>
      <Header
        title='Subscriptions'
        buttonText='Create'
        buttonIcon={<Plus size={20} />}
        buttonOnClick={handleCreateSubscription}
        summary={
          <div className='text-muted-foreground flex gap-1 overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap'>
            You have{' '}
            <span className='text-foreground flex items-center gap-1'>
              <CreditCard size={20} />
              {totalSubscriptions} subscriptions
            </span>{' '}
            registered.
          </div>
        }
      />

      <div className='flex items-center gap-4'>
        <SearchBar />
        <div className='flex items-center gap-2'>
          <GlowButton
            className='rounded-full px-4'
            variant={selectedFilter === 'all' ? 'default' : 'muted'}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </GlowButton>
          <GlowButton
            className='rounded-full px-4'
            variant={selectedFilter === 'active' ? 'default' : 'muted'}
            onClick={() => setSelectedFilter('active')}
          >
            Active
          </GlowButton>
          <GlowButton
            className='rounded-full px-4'
            variant={selectedFilter === 'cancelled' ? 'default' : 'muted'}
            onClick={() => setSelectedFilter('cancelled')}
          >
            Cancelled
          </GlowButton>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading subscriptions...</div>
        </div>
      ) : (
        Object.entries(groupedSubscriptions).map(([category, items]) => (
          <MainCard
            key={category}
            title={`${category} Services`}
            subtitle={`${items.length} subscription${items.length !== 1 ? 's' : ''}`}
            icon={category === 'Entertainment' ? <CreditCard size={18} /> : 
                  category === 'Software' ? <Users size={18} /> : 
                  <DollarSign size={18} />}
            items={items}
            handleCancelSubscription={handleCancelSubscription}
          >
            <div className='flex gap-4 p-2 text-black'>
              <div className='flex flex-col rounded-xl bg-gray-100 px-5 py-4 shadow-sm'>
                <span className='text-lg font-bold'>{activeSubscriptions}</span>
                <span className='text-sm font-semibold'>active</span>
              </div>
              <div className='flex flex-col rounded-xl bg-gray-100 px-5 py-4 shadow-sm'>
                <span className='text-lg font-bold'>${totalMonthlyCost.toFixed(2)}</span>
                <span className='text-sm font-semibold'>monthly</span>
              </div>
              <div className='flex flex-col rounded-xl bg-gray-100 px-5 py-4 shadow-sm'>
                <div className='flex justify-end'>
                  <button className='rounded bg-white px-3 py-1 text-sm font-semibold shadow-sm hover:bg-gray-200'>
                    <div className='flex items-center gap-1 font-bold text-black'>
                      Manage All
                      <AlertCircle className='h-4 w-4' />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </MainCard>
        ))
      )}
    </div>
  );
}