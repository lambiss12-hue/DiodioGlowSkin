import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="px-section" style={{
      background: 'var(--cream)', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '120px 60px 80px', textAlign: 'center'
    }}>
      <div style={{ maxWidth: '480px' }}>

        <svg width="56" height="56" viewBox="0 0 28 28" fill="none" style={{ margin: '0 auto 32px' }}>
          <circle cx="14" cy="14" r="13" stroke="#C8748A" strokeWidth="0.8" opacity="0.4"/>
          <path d="M14 4 C14 4 8 9 8 15 C8 19 11 22 14 22 C17 22 20 19 20 15 C20 9 14 4 14 4Z" fill="#F0D6DC"/>
          <path d="M14 7 C14 7 9 11 9 16 C9 19 11.5 21 14 21 C16.5 21 19 19 19 16 C19 11 14 7 14 7Z" fill="#C8748A" opacity="0.5"/>
          <path d="M14 11 C14 11 11 14 11 17 C11 19 12.5 20 14 20 C15.5 20 17 19 17 17 C17 14 14 11 14 11Z" fill="#C8748A"/>
        </svg>

        <div style={{
          fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase',
          color: 'var(--rose)', fontWeight: 500, marginBottom: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
        }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--rose)', display: 'inline-block' }}></span>
          Erreur 404
          <span style={{ width: '32px', height: '1px', background: 'var(--rose)', display: 'inline-block' }}></span>
        </div>

        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '52px', fontWeight: 300, color: 'var(--dark)', marginBottom: '20px' }}>
          Page introuvable
        </h1>

        <p style={{ fontSize: '15px', color: 'var(--gray)', lineHeight: 1.7, marginBottom: '40px' }}>
          Cette page s'est envolée, un peu comme le temps qu'on prend pour soi.
          Elle n'existe plus ou a changé d'adresse.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
          <Link href="/boutique" className="btn-secondary">Voir la boutique</Link>
        </div>

      </div>
    </main>
  );
}
