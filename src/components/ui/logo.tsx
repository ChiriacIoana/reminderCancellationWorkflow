import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src='/logo.png'
      alt='Lightway Logo'
      width={30}
      height={10}
      priority
      className={className}
    />
  );
}
