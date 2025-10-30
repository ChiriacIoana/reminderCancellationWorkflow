import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src='/SD_logo_v1.png'
      alt='logo'
      width={30}
      height={10}
      priority
      className={className}
    />
  );
}
