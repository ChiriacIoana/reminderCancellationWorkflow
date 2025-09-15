import { Button } from '@/src/components/ui/button';
import {
  CreditCard,
  ChevronLeft,
  Copy,
  EllipsisVertical,
  Pencil,
  Calendar,
  DollarSign,
  Tag,
  AlertCircle
} from 'lucide-react';

type SubscriptionModalLayoutProps = {
  serviceName: string;
  category: string;
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  lastPayment: string;
  subscriptionId: string;
  nextBilling: string;
  setModalOpen: (open: boolean) => void;
};

export default function SubscriptionModalLayout({
  serviceName,
  category,
  price,
  status,
  lastPayment,
  subscriptionId,
  nextBilling,
  setModalOpen
}: SubscriptionModalLayoutProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'expired':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getServiceIcon = (serviceName: string) => {
    // You can customize icons based on service name
    const name = serviceName.toLowerCase();
    if (name.includes('netflix') || name.includes('disney') || name.includes('hulu')) {
      return '🎬';
    } else if (name.includes('spotify') || name.includes('apple music') || name.includes('music')) {
      return '🎵';
    } else if (name.includes('office') || name.includes('adobe') || name.includes('software')) {
      return '💻';
    } else if (name.includes('amazon') || name.includes('shop')) {
      return '🛒';
    }
    return '💳';
  };

  return (
    <div className='relative h-full w-full p-2 pt-10'>
      <Button
        variant='outline'
        size='sm'
        className='absolute top-0 left-4 flex h-8 w-8 cursor-pointer items-center rounded-xl'
        onClick={() => setModalOpen(false)}
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <div className='absolute top-0 right-4 flex items-center gap-2'>
        <h2 className='text-xs font-medium text-gray-400'>
          Next billing {new Date(nextBilling).toLocaleDateString()}
        </h2>
        <Button
          variant='outline'
          size='sm'
          className='flex cursor-pointer items-center rounded-xl'
        >
          <Pencil className='h-4 w-4' />
          Edit
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='flex cursor-pointer items-center rounded-xl text-red-600 hover:bg-red-50'
        >
          <AlertCircle className='h-4 w-4' />
          Cancel
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='flex h-8 w-8 cursor-pointer items-center rounded-xl'
        >
          <EllipsisVertical className='h-4 w-4' />
        </Button>
      </div>
      <div className='mx-3xl max-w-2xl p-2'>
        <div>
          <div className='grid grid-cols-6 gap-3.5'>
            {/* Main Service Card */}
            <div className='col-span-3 row-span-2 rounded-xl border border-gray-200 bg-white p-4'>
              <div className='flex flex-col items-center justify-center h-full'>
                <div className='text-6xl mb-4'>
                  {getServiceIcon(serviceName)}
                </div>
                <h1 className='text-gray-800 text-3xl font-semibold text-center'>
                  {serviceName}
                </h1>
                <div className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize border ${getStatusColor(status)}`}>
                  {status}
                </div>
              </div>
            </div>

            {/* Category Card */}
            <div className='col-span-2 space-y-3 rounded-xl border border-gray-200 bg-white p-2 pl-3'>
              <div className='text-gray-400 text-sm font-semibold'>Category</div>
              <div className='flex items-center gap-2'>
                <Tag className='h-6 w-6 text-blue-500' />
                <span className='text-lg font-bold'>{category}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className='col-span-1 space-y-2 rounded-xl border border-gray-200 bg-white p-1 pl-3'>
              <div className='text-2xl font-bold text-green-600'>${price}</div>
              <div className='text-gray-500 text-sm font-semibold'>per month</div>
            </div>

            {/* Last Payment Card */}
            <div className='col-span-1 space-y-4 space-x-4 rounded-xl border border-gray-200 bg-white p-2 pl-3'>
              <div className='text-sm font-semibold text-gray-500'>
                Last payment
              </div>
              <div className='font-medium text-green-600'>
                {lastPayment} ago
              </div>
            </div>

            {/* Subscription ID Card */}
            <div className='col-span-2 space-y-4 rounded-xl border border-gray-200 bg-white p-3 pl-3'>
              <div className='text-sm font-semibold text-gray-500'>
                Subscription ID
              </div>
              <div className='flex items-center gap-2 rounded-md bg-neutral-100 p-2'>
                <span className='font-mono text-sm flex-1'>{subscriptionId}</span>
                <Button variant='ghost' size='sm' className='p-1'>
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Next Billing Card */}
            <div className='col-span-3 space-y-4 rounded-xl border border-gray-200 bg-white p-3'>
              <div className='text-sm font-semibold text-gray-500'>
                Next Billing Date
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-blue-500' />
                <span className='text-lg font-bold'>
                  {new Date(nextBilling).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>

            {/* Monthly Cost Breakdown */}
            <div className='col-span-3 space-y-4 rounded-xl border border-gray-200 bg-white p-3'>
              <div className='text-sm font-semibold text-gray-500'>
                Cost Breakdown
              </div>
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Monthly subscription</span>
                  <span className='font-semibold'>${price.toFixed(2)}</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Annual cost</span>
                  <span className='font-bold text-lg'>${(price * 12).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex gap-3 justify-center'>
            <Button 
              variant='outline' 
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4' />
              Edit Subscription
            </Button>
            <Button 
              variant='outline' 
              className='flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-200'
            >
              <AlertCircle className='h-4 w-4' />
              Cancel Subscription
            </Button>
            <Button 
              variant='default' 
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700'
            >
              <CreditCard className='h-4 w-4' />
              Update Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}