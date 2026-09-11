'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    // 1. Read parameters directly from the browser window to bypass React Hook lifecycle dependencies
    const params = new URLSearchParams(window.location.search);
    const currentSearch = params.get('search') || '';
    
    if (query.trim() === currentSearch.trim()) return;

    const delayDebounce = setTimeout(() => {
      const nextParams = new URLSearchParams(window.location.search);
      
      if (query.trim()) {
        nextParams.set('search', query.trim());
      } else {
        nextParams.delete('search');
      }
      
      // Always reset back to page 1 on fresh text changes
      nextParams.set('page', '1');

      router.push(`?${nextParams.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, router]);

  return (
    <div className="flex items-center justify-between border rounded-md py-0">
      <Input
        type="text"
        placeholder="Search User"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-none rounded-none rounded-l p-0 pl-2"
      />
      <div className='border-l'>
        <Search className="p-1" />
      </div>
    </div>
  );
}
