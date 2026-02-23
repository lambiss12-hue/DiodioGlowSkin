'use client';

import Link from 'next/link';
import { usePanier } from '../context/PanierContext';

export default function HeaderClient() {
  const { totalArticles } = usePanier();

  return (
    <Link href="/panier" className="relative bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors">
      🛒 Panier
      {totalArticles > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {totalArticles}
        </span>
      )}
    </Link>
  );
}