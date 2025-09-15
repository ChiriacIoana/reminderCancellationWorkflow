import React from 'react';

interface NotificationCardProps {
  title: string;
  time: string;
  location: string;
  offset?: boolean;
  stackIndex?: number;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  time,
  location,
  offset = false,
  stackIndex = 0
}) => {
  const negativeMargin = `-${stackIndex * 68}px`;
  const zIndex = 50 - stackIndex;
  const scale = 1 - stackIndex * 0.1;

  return (
    <div
      className={`relative rounded-xl bg-zinc-800 p-4 text-white shadow-lg ${offset ? 'z-0 -mt-5' : 'z-10'} `}
      style={{
        marginTop: stackIndex === 0 ? undefined : negativeMargin,
        zIndex,
        transform: `scale(${scale})`
      }}
    >
      <div className='flex items-center justify-between text-xs font-semibold'>
        <span>{title}</span>
        <span className='text-xs text-zinc-400'>{time}</span>
      </div>
      <div className='mt-1 text-xs text-zinc-300'>{location}</div>
    </div>
  );
};

export default NotificationCard;
