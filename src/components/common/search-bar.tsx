import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className='text-foreground/50 flex w-80 items-center gap-2 rounded-full bg-white px-4 py-1.5'>
      <Search size={20} />
      <input
        placeholder='Search...'
        className='placeholder:text-foreground/50 bg-transparent outline-none placeholder:text-sm placeholder:font-semibold'
      />
    </div>
  );
}
