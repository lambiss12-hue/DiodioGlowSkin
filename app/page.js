import Link from 'next/link';
import CarouselHero from './components/CarouselHero';
import { supabase } from './lib/supabase';
import { IconeSoin } from './components/IconesSoins';

export default async function Accueil() {
  const [{ data: produitsPhares }, { data: soinsAccueil }] = await Promise.all([
    supabase.from('produits').select('*').eq('en_stock', true).order('en_promotion', { ascending: false }).order('created_at', { ascending: false }).limit(3),
    supabase.from('soins').select('*').eq('actif', true).order('created_at', { ascending: true }).limit(3),
  ]);

  return (
    <main style={{fontFamily:'DM Sans, sans-serif', background:'var(--cream)'}}>

      {/* HERO */}
      <section className="grid-collapse-2" style={{minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', paddingTop:'80px'}}>

        {/* GAUCHE */}
        <div className="px-section" style={{display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 60px', background:'var(--cream)'}}>
          <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'24px', display:'flex', alignItems:'center', gap:'12px'}}>
            <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
            Beauté naturelle & luxe accessible
          </div>
          <h1 className="heading-hero" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'72px', fontWeight:300, lineHeight:1.05, color:'var(--dark)', marginBottom:'28px', letterSpacing:'-1px'}}>
            Révélez votre<br/>
            éclat <em style={{
  fontStyle: 'italic',
  color: 'var(--rose)',
  fontFamily: 'Cormorant Garamond, serif',
}}>naturel</em>
          </h1>
          <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.8, maxWidth:'380px', marginBottom:'48px'}}>
            Des soins artisanaux formulés avec soin, pour sublimer votre peau au quotidien. Laits de corps, savons et senteurs d'exception.
          </p>
          <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
            <Link href="/boutique" className="btn-primary">Découvrir la boutique</Link>
            <Link href="/rendezvous" className="btn-secondary">Prendre rendez-vous</Link>
          </div>
        </div>

        {/* DROITE */}
      {/* DROITE — CAROUSEL */}
<div className="hero-media" style={{
  background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 60%, #E8C5CE 100%)',
  position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
  overflow:'hidden'
}}>
  <CarouselHero produits={produitsPhares || []} />
</div>
      </section>

      {/* MARQUEE */}
      <div style={{background:'var(--dark)', padding:'16px 0', overflow:'hidden'}}>
        <div style={{display:'flex', animation:'marquee 20s linear infinite', whiteSpace:'nowrap'}}>
          {[...Array(2)].map((_,i) => (
            <div key={i} style={{display:'flex', flexShrink:0}}>
              {['Laits de corps','Savons artisanaux','Parfums naturels','Soin du visage','Massage relaxant','Beauté des mains'].map(item => (
                <div key={item} style={{display:'flex', alignItems:'center', gap:'20px', padding:'0 40px', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'rgba(255,255,255,0.5)'}}>
                  <span>{item}</span>
                  <span style={{width:'4px', height:'4px', borderRadius:'50%', background:'var(--rose)', display:'inline-block'}}></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUITS PHARES */}
      <section className="px-section" style={{padding:'100px 60px', background:'var(--cream)'}}>
        <div style={{display:'flex', flexWrap:'wrap', gap:'16px', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'60px'}}>
          <div>
            <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'12px', fontWeight:500, display:'flex', alignItems:'center', gap:'12px'}}>
              <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
              Notre sélection
            </div>
            <h2 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300, color:'var(--dark)'}}>Produits phares</h2>
          </div>
          <Link href="/boutique" style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)', textDecoration:'none', borderBottom:'1px solid var(--gray-light)', paddingBottom:'4px'}}>Voir tout →</Link>
        </div>
        <div className="grid-collapse-3" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px'}}>
          {!produitsPhares || produitsPhares.length === 0 ? (
            <p style={{color:'var(--gray)', fontSize:'14px', gridColumn:'1 / -1'}}>Aucun produit disponible pour le moment.</p>
          ) : produitsPhares.map((p) => (
            <Link key={p.id} href={`/boutique/${p.id}`} className="pf-card" style={{background:'white', position:'relative', overflow:'hidden', textDecoration:'none', display:'block'}}>
              <div className="pf-image" style={{height:'320px', background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 100%)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.nom} className="pf-photo" style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <span className="pf-letter" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'80px', fontWeight:300, color:'var(--rose)', opacity:0.3, letterSpacing:'-2px'}}>
                    {p.nom.charAt(0)}
                  </span>
                )}
                <div className="pf-overlay" style={{position:'absolute', inset:0, background:'rgba(28,28,30,0.55)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0}}>
                  <span style={{color:'white', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.4)', paddingBottom:'4px'}}>
                    Voir le produit →
                  </span>
                </div>
              </div>
              {p.en_promotion && (
                <div style={{position:'absolute', top:'16px', left:'16px', background:'#C44', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'5px 12px', fontWeight:500}}>Promo</div>
              )}
              {!p.en_promotion && p.est_nouveaute && (
                <div style={{position:'absolute', top:'16px', left:'16px', background:'var(--rose)', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'5px 12px', fontWeight:500}}>Nouveauté</div>
              )}
              <div style={{padding:'24px', borderTop:'1px solid var(--gray-light)'}}>
                <div style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'6px'}}>{p.categorie}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:400, color:'var(--dark)', marginBottom:'4px'}}>{p.nom}</div>
                <div style={{fontSize:'14px', color:'var(--gray)', fontWeight:300, marginBottom:'16px'}}>
                  {p.poids} ·{' '}
                  {p.en_promotion && p.prix_promo ? (
                    <>
                      <span style={{textDecoration:'line-through', opacity:0.7}}>{p.prix}</span>{' '}
                      <span style={{color:'#C44', fontWeight:500}}>{p.prix_promo}</span>
                    </>
                  ) : p.prix}
                </div>
                <span className="btn-primary" style={{fontSize:'11px', padding:'10px 20px'}}>Voir le produit</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-section grid-collapse-2" style={{background:'var(--dark)', padding:'100px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center'}}>
        <div>
          <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'16px', fontWeight:500}}>Institut de beauté</div>
          <h2 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300, color:'white', marginBottom:'20px', lineHeight:1.1}}>Des soins<br/>d'exception</h2>
          <p style={{color:'rgba(255,255,255,0.5)', fontSize:'15px', lineHeight:1.8, maxWidth:'360px', marginBottom:'40px'}}>Prenez soin de vous dans notre institut. Nos expertes vous accueillent dans un cadre serein et raffiné.</p>
          <Link href="/rendezvous" className="btn-primary" style={{borderColor:'var(--rose)'}}>Réserver un soin</Link>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'2px'}}>
          {!soinsAccueil || soinsAccueil.length === 0 ? (
            <p style={{color:'rgba(255,255,255,0.4)', fontSize:'13px', padding:'28px 32px'}}>Aucun soin disponible pour le moment.</p>
          ) : soinsAccueil.map((s) => (
            <Link key={s.id} href="/rendezvous" className="soin-row" style={{background:'rgba(255,255,255,0.04)', padding:'28px 32px', display:'flex', alignItems:'center', gap:'24px', borderLeft:'2px solid transparent', textDecoration:'none'}}>
              <span className="soin-row-icon" style={{display:'inline-flex'}}>
                <IconeSoin nom={s.emoji} size={44} />
              </span>
              <div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:300, color:'white'}}>{s.nom}</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.4)', marginTop:'3px', letterSpacing:'1px', textTransform:'uppercase'}}>{[s.duree, s.prix].filter(Boolean).join(' · ')} · Sur rendez-vous</div>
              </div>
              <span className="soin-row-arrow" style={{marginLeft:'auto', color:'rgba(255,255,255,0.3)', fontSize:'18px'}}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FONDATRICE */}
      <section className="px-section grid-collapse-2" style={{padding:'100px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center', background:'var(--cream)'}}>
        <div style={{position:'relative'}}>
          <div style={{position:'absolute', top:'-20px', left:'-20px', width:'100%', height:'100%', background:'var(--rose-light)', zIndex:0}}></div>
          <img
            src="https://maisondiodioglowskin.com/images/directrice.webp"
            alt="Diodio, fondatrice de Diodio Glow Skin"
            style={{width:'100%', height:'auto', aspectRatio:'4/5', objectFit:'cover', display:'block', position:'relative', zIndex:1, boxShadow:'0 24px 64px rgba(0,0,0,0.10)'}}
          />
        </div>
        <div>
          <div className="eyebrow" style={{marginBottom:'20px'}}>La fondatrice</div>
          <h2 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'44px', fontWeight:300, color:'var(--dark)', marginBottom:'24px', lineHeight:1.15}}>
            Diodio, votre experte beauté
          </h2>
          <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.9, marginBottom:'20px', maxWidth:'460px'}}>
            Passionnée par la beauté et le bien-être, notre directrice met son expertise et son exigence au service de chaque cliente. Son objectif : vous offrir une expérience unique, alliant soins de haute qualité, écoute et conseils personnalisés.
          </p>
          <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.9, marginBottom:'32px', maxWidth:'460px'}}>
            À travers Diodio Glow Skin, elle a imaginé un lieu chaleureux où chaque détail est pensé pour sublimer votre peau et révéler votre éclat naturel.
          </p>
          <div style={{marginBottom:'36px'}}>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:400, color:'var(--dark)'}}>Diodio</p>
            <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginTop:'2px'}}>Fondatrice & Directrice</p>
          </div>
          <Link href="/mon-parcours" className="btn-primary">Mon parcours →</Link>
        </div>
      </section>

      {/* VALEURS */}
      <section className="px-section grid-collapse-4" style={{padding:'100px 60px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'40px', borderTop:'1px solid var(--gray-light)', background:'var(--cream)'}}>
        {[
          {num:'100%', title:'Naturel', desc:"Ingrédients soigneusement sélectionnés, sans produits chimiques nocifs"},
          {num:'500+', title:'Clientes', desc:"Une communauté fidèle qui nous fait confiance depuis des années"},
          {num:'15+', title:'Produits', desc:"Une gamme complète pour chaque besoin et chaque type de peau"},
          {num:'5★', title:'Satisfaction', desc:"Votre satisfaction est notre priorité absolue à chaque commande"},
        ].map((v) => (
          <div key={v.title} style={{textAlign:'center'}}>
            <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'56px', fontWeight:300, color:'var(--rose-light)', lineHeight:1, marginBottom:'16px'}}>{v.num}</div>
            <div style={{fontSize:'13px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, marginBottom:'8px', color:'var(--dark)'}}>{v.title}</div>
            <div style={{fontSize:'13px', color:'var(--gray)', lineHeight:1.7}}>{v.desc}</div>
          </div>
        ))}
      </section>

      <style>{`
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        .pf-card { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s ease; }
        .pf-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.10); }
        .pf-letter { transition: transform 0.45s ease, opacity 0.45s ease; }
        .pf-card:hover .pf-letter { transform: scale(1.1); opacity: 0.5; }
        .pf-photo { transition: transform 0.6s ease; }
        .pf-card:hover .pf-photo { transform: scale(1.08); }
        .pf-overlay { transition: opacity 0.4s ease; }
        .pf-card:hover .pf-overlay { opacity: 1; }

        .soin-row { transition: background 0.35s ease, border-color 0.35s ease, padding-left 0.35s ease; }
        .soin-row:hover { background: rgba(255,255,255,0.08) !important; border-left-color: var(--rose) !important; padding-left: 40px !important; }
        .soin-row-icon { transition: transform 0.35s ease; display: inline-flex; }
        .soin-row:hover .soin-row-icon { transform: scale(1.12) rotate(-4deg); }
        .soin-row-arrow { transition: transform 0.35s ease, color 0.35s ease; display: inline-block; }
        .soin-row:hover .soin-row-arrow { transform: translateX(6px); color: var(--rose) !important; }
      `}</style>

    </main>
  );
}