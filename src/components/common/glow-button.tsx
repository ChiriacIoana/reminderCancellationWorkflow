import { Button } from '@/src/components/ui/button';
import { cn } from '@/lib/utils';

export default function GlowButton({
  icon,
  children,
  className,
  variant = 'default',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'variant'> & {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'muted';
}) {
  return (
    <Button
      {...props}
      className={cn(
        'rounded-2xl bg-gradient-to-t from-sky-400 to-blue-500 px-7 py-5 text-white drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]',
        variant === 'muted' &&
          'text-muted-foreground hover:bg-muted-foreground/10 hover:text-muted-foreground bg-white drop-shadow-none',
        className
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1 font-bold [text-shadow:_0px_0px_14px_rgb(255_255_255_/_1.00)]',
          variant === 'muted' && 'text-shadow-none'
        )}
      >
        {icon}
        {children}
      </span>
    </Button>
  );
}
