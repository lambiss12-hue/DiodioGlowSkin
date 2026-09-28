import "./globals.css";
import Link from "next/link";
import { PanierProvider } from "./context/PanierContext";
import HeaderClient from "./components/HeaderClient";
import NavLinks from './components/NavLinks';
import AuthNavLink from './components/AuthNavLink';
import MobileNav from './components/MobileNav';

import { Cormorant_Garamond, DM_Sans, Great_Vibes } from 'next/font/google';

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

export const metadata = {
  title: "Diodio Glow Skin",
  description: "Révélez votre éclat naturel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable}`}>
      <body className="bg-[#FAF7F2]" suppressHydrationWarning>
        <PanierProvider>

         <header className="px-section" style={{
  position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
  padding: '0 60px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  height: '72px',
  background: 'rgba(250, 247, 242, 0.95)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(200, 116, 138, 0.10)'
}}>

  {/* LOGO */}
  <Link href="/" style={{
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: '20px', fontWeight: 300, letterSpacing: '4px',
    color: 'var(--dark)', textDecoration: 'none',
    display: 'flex', alignItems: 'center', gap: '10px',
    whiteSpace: 'nowrap', flexShrink: 0
  }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="13" stroke="#C8748A" strokeWidth="0.8" opacity="0.4"/>
      <path d="M14 4 C14 4 8 9 8 15 C8 19 11 22 14 22 C17 22 20 19 20 15 C20 9 14 4 14 4Z" fill="#F0D6DC"/>
      <path d="M14 7 C14 7 9 11 9 16 C9 19 11.5 21 14 21 C16.5 21 19 19 19 16 C19 11 14 7 14 7Z" fill="#C8748A" opacity="0.5"/>
      <path d="M14 11 C14 11 11 14 11 17 C11 19 12.5 20 14 20 C15.5 20 17 19 17 17 C17 14 14 11 14 11Z" fill="#C8748A"/>
    </svg>
    DIODIO <span style={{color:'var(--rose)', margin:'0 2px'}}>✦</span> GLOW SKIN
  </Link>

  {/* NAV CENTRE (desktop) */}
  <NavLinks/>

  {/* DROITE */}
  <div className="header-gap" style={{display:'flex', alignItems:'center', gap:'16px'}}>

    {/* NAV MOBILE (hamburger) */}
    <MobileNav />

    {/* CONNEXION / PROFIL */}
    <AuthNavLink />

    {/* SÉPARATEUR */}
    <div style={{width:'1px', height:'20px', background:'var(--gray-light)'}}></div>

    {/* PANIER */}
    <HeaderClient />
  </div>

</header>

          {children}

          <footer style={{ background: 'var(--dark)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

            <div className="px-section grid-collapse-3" style={{
              padding: '64px 60px 48px', display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px'
            }}>

              {/* MARQUE */}
              <div>
                <span style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '20px', fontWeight: 300, letterSpacing: '3px', color: 'white'
                }}>DIODIO <span style={{color:'var(--rose)'}}>✦</span> GLOW SKIN</span>
                <p style={{fontSize:'13px', color:'rgba(255,255,255,0.4)', lineHeight:1.8, marginTop:'16px', maxWidth:'280px'}}>
                  Révélez votre éclat naturel au quotidien, avec des soins et produits pensés pour vous.
                </p>
                <div style={{display:'flex', gap:'12px', marginTop:'24px'}}>
                  {[
                    { nom: 'Instagram', lien: 'https://instagram.com/votre_compte', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                        <circle cx="12" cy="12" r="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,0.5)"/>
                      </svg>
                    )},
                    { nom: 'Facebook', lien: 'https://facebook.com/votre_page', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 2H15C13.67 2 12.4 2.53 11.46 3.46C10.53 4.4 10 5.67 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73 14.11 6.48 14.29 6.29C14.48 6.11 14.73 6 15 6H18V2Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )},
                    { nom: 'WhatsApp', lien: 'https://wa.me/votrenumero', icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20.0035 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.11 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )},
                  ].map(r => (
                    <a key={r.nom} href={r.lien} target="_blank" rel="noopener noreferrer" aria-label={r.nom}
                      className="footer-social"
                      style={{
                        width:'34px', height:'34px', display:'flex', alignItems:'center', justifyContent:'center',
                        border:'1px solid rgba(255,255,255,0.15)', borderRadius:'50%'
                      }}>
                      {r.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* NAVIGATION */}
              <div>
                <div style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', fontWeight:600, marginBottom:'22px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{width:'24px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
                  Navigation
                </div>
                <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
                  {[['/', 'Accueil'], ['/boutique','Boutique'], ['/rendezvous','Soins'], ['/promotions','Promotions'], ['/mon-parcours','Mon parcours'], ['/contact','Contact']].map(([href,label]) => (
                    <Link key={href} href={href} className="footer-link" style={{
                      fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none'
                    }}>{label}</Link>
                  ))}
                </div>
              </div>

              {/* CONTACT */}
              <div>
                <div style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', fontWeight:600, marginBottom:'22px', display:'flex', alignItems:'center', gap:'10px'}}>
                  <span style={{width:'24px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
                  Nous trouver
                </div>
                <p style={{fontSize:'13px', color:'rgba(255,255,255,0.5)', lineHeight:1.9, marginBottom:'16px'}}>
                  Votre adresse ici<br/>Ville, Pays
                </p>
                <div style={{display:'flex', flexDirection:'column', gap:'6px', marginBottom:'20px'}}>
                  {[
                    { jour: 'Lun – Ven', heure: '9h – 19h' },
                    { jour: 'Samedi', heure: '10h – 18h' },
                    { jour: 'Dimanche', heure: 'Fermé' },
                  ].map(h => (
                    <div key={h.jour} style={{display:'flex', justifyContent:'space-between', gap:'24px', fontSize:'12px'}}>
                      <span style={{color:'rgba(255,255,255,0.35)'}}>{h.jour}</span>
                      <span style={{color:'rgba(255,255,255,0.5)'}}>{h.heure}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="footer-cta" style={{fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', textDecoration:'none', borderBottom:'1px solid rgba(200,116,138,0.4)', paddingBottom:'2px', display:'inline-block'}}>
                  Nous écrire →
                </Link>
              </div>

            </div>

            {/* BAS DE PAGE */}
            <div className="px-section" style={{
              padding: '24px 60px', borderTop: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '12px'
            }}>
              <p style={{fontSize:'12px', color:'rgba(255,255,255,0.3)', letterSpacing:'1px'}}>
                © {new Date().getFullYear()} Diodio Glow Skin. Tous droits réservés.
              </p>
              <p style={{fontSize:'11px', color:'rgba(255,255,255,0.25)', letterSpacing:'1px'}}>
                Beauté naturelle & luxe accessible
              </p>
            </div>
          </footer>

        </PanierProvider>
      </body>
    </html>
  );
}