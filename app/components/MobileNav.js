'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LIENS = [['/', 'Accueil'], ['/boutique', 'Boutique'], ['/rendezvous', 'Soins'], ['/promotions', 'Promotions'], ['/contact', 'Contact']];

export default function MobileNav() {
  const [ouvert, setOuvert] = useState(false);
  const pathname = usePathname();

  return (
    <div className="nav-mobile-toggle" style={{ position: 'relative', alignItems: 'center' }}>
      <button
        onClick={() => setOuvert(o => !o)}
        aria-label="Menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ width: '22px', height: '1.5px', background: 'var(--dark)', transition: 'all 0.3s ease', transform: ouvert ? 'translateY(6.5px) rotate(45deg)' : 'none' }}></span>
        <span style={{ width: '22px', height: '1.5px', background: 'var(--dark)', transition: 'all 0.3s ease', opacity: ouvert ? 0 : 1 }}></span>
        <span style={{ width: '22px', height: '1.5px', background: 'var(--dark)', transition: 'all 0.3s ease', transform: ouvert ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}></span>
      </button>

      <div style={{
        position: 'fixed', top: '72px', left: 0, right: 0,
        background: 'var(--cream)', borderBottom: '1px solid var(--gray-light)',
        boxShadow: '0 16px 32px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column',
        maxHeight: ouvert ? '380px' : '0px',
        opacity: ouvert ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s ease, opacity 0.3s ease',
        zIndex: 99,
      }}>
        {LIENS.map(([href, label]) => (
          <Link key={href} href={href} onClick={() => setOuvert(false)} style={{
            padding: '18px 24px',
            fontSize: '13px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase',
            color: pathname === href ? 'var(--rose)' : href === '/promotions' ? '#C44' : 'var(--dark)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--gray-light)',
          }}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
