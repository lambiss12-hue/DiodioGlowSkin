'use client';
import Link from 'next/link';
import { usePanier } from '../context/PanierContext';

export default function HeaderClient() {
  const { totalArticles } = usePanier();

  return (
    <Link href="/panier" className="header-panier-btn" style={{
      position:'relative', display:'flex', alignItems:'center', gap:'8px',
      background:'transparent', border:'1px solid var(--gray-light)',
      padding:'8px 20px', borderRadius:'2px', textDecoration:'none',
      fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase',
      color:'var(--dark)', fontFamily:'DM Sans, sans-serif',
      transition:'all 0.2s'
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 2H3.5L5.5 10H12.5L14.5 4H4" stroke="#1C1C1E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6.5" cy="12.5" r="1" fill="#1C1C1E"/>
        <circle cx="11.5" cy="12.5" r="1" fill="#1C1C1E"/>
      </svg>
      <span className="header-panier-label">Panier</span>
      {totalArticles > 0 && (
        <span style={{
          position:'absolute', top:'-8px', right:'-8px',
          background:'var(--rose)', color:'white',
          fontSize:'10px', width:'18px', height:'18px',
          borderRadius:'50%', display:'flex', alignItems:'center',
          justifyContent:'center', fontWeight:600
        }}>
          {totalArticles}
        </span>
      )}
    </Link>
  );
}