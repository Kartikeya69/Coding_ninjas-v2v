'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground select-none">
      <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
      </Link>
      
      {paths.map((path, idx) => {
        const routeTo = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        const formattedName = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
            {isLast ? (
              <span className="text-white font-semibold truncate max-w-[120px]">{formattedName}</span>
            ) : (
              <Link href={routeTo} className="hover:text-white transition-colors truncate max-w-[120px]">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumb;
