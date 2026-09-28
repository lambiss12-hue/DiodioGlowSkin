'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const BG_ROTATION = [
  'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 100%)',
  'linear-gradient(135deg, #FFFBF0 0%, #F5E8C8 100%)',
  'linear-gradient(135deg, #F5F0FF 0%, #E8DCFF 100%)',
];

const SLIDE_AMBIANCE = {
  id: 'ambiance1',
  label: 'Notre univers',
  badgeColor: 'var(--rose)',
  titre: 'La beauté naturelle',
  sous: 'Diodio Glow Skin',
  prix: null,
  prixPromo: null,
  href: '/boutique',
  bg: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
  image_url: 'https://res.cloudinary.com/dnaedu1qz/image/upload/v1771878514/welcomepic_kjyz9w.jpg',
};

export default function CarouselHero({ produits = [] }) {
  const slides = [
    ...produits.map((p, i) => ({
      id: p.id,
      label: p.en_promotion ? 'Promo' : p.est_nouveaute ? 'Nouveauté' : 'Notre sélection',
      badgeColor: p.en_promotion ? '#C44' : 'var(--rose)',
      titre: p.nom,
      sous: [p.poids, p.categorie].filter(Boolean).join(' · '),
      prix: p.prix,
      prixPromo: p.en_promotion ? p.prix_promo : null,
      href: `/boutique/${p.id}`,
      bg: BG_ROTATION[i % BG_ROTATION.length],
      image_url: p.image_url || null,
    })),
    SLIDE_AMBIANCE,
  ];

  const [actif, setActif] = useState(0);
  const [anime, setAnime] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnime(false);
      setTimeout(() => {
        setActif(prev => (prev + 1) % slides.length);
        setAnime(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function goTo(i) {
    setAnime(false);
    setTimeout(() => {
      setActif(i);
      setAnime(true);
    }, 200);
  }

  const slide = slides[actif];

  return (
    <div className="hero-media" style={{width:'100%', height:'100%', position:'relative', minHeight:'100vh'}}>

      {/* SLIDE */}
      <div className="hero-media" style={{
        width:'100%', height:'100%', minHeight:'100vh',
        background: slide.bg,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'background 0.6s ease',
        flexDirection:'column', gap:'0'
      }}>

        {/* IMAGE OU LETTRE */}
        <div style={{
          width:'260px', height:'320px', background:'white',
          boxShadow:'0 24px 64px rgba(0,0,0,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
          opacity: anime ? 1 : 0,
          transform: anime ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition:'all 0.5s ease',
          position:'relative', overflow:'hidden'
        }}>
          {slide.image_url ? (
            <img
  src={slide.image_url}
  alt={slide.titre}
  style={{
    position:'absolute', top:0, left:0,
    width:'100%', height:'100%',
    objectFit:'cover', objectPosition:'center',
    opacity: anime ? 1 : 0,
    transition:'opacity 0.5s ease',
  }}
/>
          ) : (
            <span style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'120px',
              fontWeight:300, color:'var(--rose)', opacity:0.2
            }}>
              {slide.titre.charAt(0)}
            </span>
          )}
          {/* BADGE */}
          <div style={{
            position:'absolute', top:'16px', left:'0',
            background: slide.badgeColor, color:'white',
            fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase',
            padding:'5px 14px', fontWeight:500
          }}>{slide.label}</div>
        </div>

        {/* INFOS */}
        <div style={{
          background:'white', padding:'24px 32px', width:'260px',
          borderTop:'2px solid var(--rose)',
          opacity: anime ? 1 : 0,
          transform: anime ? 'translateY(0)' : 'translateY(12px)',
          transition:'all 0.5s ease 0.1s',
        }}>
          <p style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'6px'}}>{slide.sous}</p>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:400, color:'var(--dark)', marginBottom:'4px'}}>{slide.titre}</p>
          <p style={{fontSize:'16px', color:'var(--gray)', fontWeight:300, marginBottom:'16px', display:'flex', alignItems:'baseline', gap:'8px'}}>
            {slide.prixPromo ? (
              <>
                <span style={{color:'#C44', fontWeight:500}}>{slide.prixPromo}</span>
                <span style={{fontSize:'13px', textDecoration:'line-through', opacity:0.7}}>{slide.prix}</span>
              </>
            ) : slide.prix}
          </p>
          <Link href={slide.href} style={{
            fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase',
            color:'var(--dark)', textDecoration:'none',
            borderBottom:'1px solid var(--dark)', paddingBottom:'2px'
          }}>Voir le produit →</Link>
        </div>
      </div>

      {/* DOTS */}
      <div style={{
        position:'absolute', bottom:'40px', left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:'10px', alignItems:'center'
      }}>
        {slides.map((_, i) => (
          <button key={i}
            onClick={() => goTo(i)}
            style={{
              width: actif === i ? '28px' : '8px',
              height:'8px', borderRadius:'4px',
              background: actif === i ? 'var(--rose)' : 'rgba(200,116,138,0.3)',
              border:'none', cursor:'pointer',
              transition:'all 0.3s ease', padding:0
            }}
          />
        ))}
      </div>

      {/* FLÈCHES */}
      <button
        onClick={() => goTo((actif - 1 + slides.length) % slides.length)}
        style={{
          position:'absolute', left:'20px', top:'50%', transform:'translateY(-50%)',
          width:'40px', height:'40px', borderRadius:'50%',
          background:'white', border:'none', cursor:'pointer',
          boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'16px', color:'var(--dark)'
        }}>←</button>
      <button
        onClick={() => goTo((actif + 1) % slides.length)}
        style={{
          position:'absolute', right:'20px', top:'50%', transform:'translateY(-50%)',
          width:'40px', height:'40px', borderRadius:'50%',
          background:'white', border:'none', cursor:'pointer',
          boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'16px', color:'var(--dark)'
        }}>→</button>

    </div>
  );
}