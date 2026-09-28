'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav-desktop" style={{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: '32px', alignItems: 'center'
    }}>
      {[['/', 'Accueil'], ['/boutique', 'Boutique'], ['/rendezvous', 'Soins'], ['/promotions', 'Promotions'], ['/contact', 'Contact']].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={`nav-link ${href === '/promotions' ? 'nav-link--promo' : ''} ${pathname === href ? 'nav-link--active' : ''}`}
          style={{
            fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
            textTransform: 'uppercase',
            color: pathname === href ? 'var(--dark)' : href === '/promotions' ? '#C44' : 'var(--gray)',
            textDecoration: 'none',
            transition: 'color 0.3s'
          }}>
          {label}
        </Link>
      ))}
    </nav>
  );
}