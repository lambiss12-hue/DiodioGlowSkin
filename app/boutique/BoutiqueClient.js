'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePanier } from '../context/PanierContext';

const categories = [
  { id: "tous", label: "Tous" },
  { id: "laits", label: "Laits de corps" },
  { id: "savons", label: "Savons" },
  { id: "parfums", label: "Parfums" },
  { id: "gammes", label: "Gammes" },
];

export default function BoutiqueClient({ produits }) {
  const [categorieActive, setCategorieActive] = useState('tous');
  const [ajoutesIds, setAjoutesIds] = useState([]);
  const { ajouterAuPanier } = usePanier();

  const produitsFiltres = categorieActive === 'tous'
    ? produits
    : produits.filter(p => p.categorie === categorieActive);

  function handleAjouterAuPanier(e, produit) {
    e.preventDefault();
    const produitPourPanier = produit.en_promotion && produit.prix_promo
      ? { ...produit, prix: produit.prix_promo, prix_original: produit.prix }
      : produit;
    ajouterAuPanier(produitPourPanier, 1);
    setAjoutesIds(prev => [...prev, produit.id]);
    setTimeout(() => {
      setAjoutesIds(prev => prev.filter(id => id !== produit.id));
    }, 2000);
  }

  return (
    <>
      {/* FILTRES */}
      <section className="px-section" style={{padding:'32px 60px', display:'flex', gap:'12px', flexWrap:'wrap', borderBottom:'1px solid var(--gray-light)'}}>
        {categories.map((cat) => (
          <button key={cat.id}
            onClick={() => setCategorieActive(cat.id)}
            style={{
              padding:'8px 24px', borderRadius:'2px',
              border: categorieActive === cat.id ? '1px solid var(--dark)' : '1px solid var(--gray-light)',
              background: categorieActive === cat.id ? 'var(--dark)' : 'transparent',
              color: categorieActive === cat.id ? 'white' : 'var(--gray)',
              fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase',
              cursor:'pointer', fontFamily:'DM Sans, sans-serif',
              transition:'all 0.2s'
            }}>
            {cat.label}
          </button>
        ))}
      </section>

      {/* GRILLE */}
      <section className="px-section" style={{padding:'48px 60px 60px'}}>
        <div className="grid-collapse-3" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px'}}>
          {produitsFiltres.map((p) => (
           <div key={p.id} style={{background:'white', position:'relative', overflow:'hidden', transition:'transform 0.4s ease, box-shadow 0.4s ease', cursor:'pointer'}}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.10)';
                e.currentTarget.querySelector('.prod-img-overlay').style.opacity = '1';
                e.currentTarget.querySelector('.prod-img-letter').style.transform = 'scale(1.1)';
                e.currentTarget.querySelector('.prod-img-letter').style.opacity = '0.5';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.prod-img-overlay').style.opacity = '0';
                e.currentTarget.querySelector('.prod-img-letter').style.transform = 'scale(1)';
                e.currentTarget.querySelector('.prod-img-letter').style.opacity = '0.3';
            }}
            >
            <Link
              href={p.en_stock ? `/boutique/${p.id}` : '#'}
              onClick={e => { if (!p.en_stock) e.preventDefault(); }}
              style={{height:'300px', background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 100%)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', cursor: p.en_stock ? 'pointer' : 'default'}}>

                {/* LETTRE */}
                <span className="prod-img-letter" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'80px', fontWeight:300, color:'var(--rose)', opacity:0.3, letterSpacing:'-2px', transition:'all 0.4s ease'}}>
                {p.nom.charAt(0)}
                </span>

                {/* OVERLAY AU HOVER */}
                <div className="prod-img-overlay" style={{position:'absolute', inset:0, background:'rgba(28,28,30,0.55)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.4s ease'}}>
                <span style={{color:'white', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.4)', paddingBottom:'4px'}}>
                    Voir le produit →
                </span>
                </div>

                {p.en_promotion && (
                <div style={{position:'absolute', top:'16px', left:'16px', background:'#C44', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'5px 12px', fontWeight:500, zIndex:2}}>Promo</div>
                )}
                {!p.en_promotion && p.est_nouveaute && (
                <div style={{position:'absolute', top:'16px', left:'16px', background:'var(--rose)', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'5px 12px', fontWeight:500, zIndex:2}}>Nouveauté</div>
                )}
                {!p.en_stock && (
                <div style={{position:'absolute', inset:0, background:'rgba(250,247,242,0.85)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)', zIndex:2}}>Épuisé</div>
                )}
            </Link>

            <div style={{padding:'24px', borderTop:'1px solid var(--gray-light)'}}>
                <div style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'6px'}}>{p.categorie}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:400, color:'var(--dark)', marginBottom:'4px'}}>{p.nom}</div>
                <div style={{fontSize:'13px', color:'var(--gray)', fontWeight:300, marginBottom:'20px'}}>
                  {p.poids} ·{' '}
                  {p.en_promotion && p.prix_promo ? (
                    <>
                      <span style={{textDecoration:'line-through', opacity:0.7}}>{p.prix}</span>{' '}
                      <span style={{color:'#C44', fontWeight:500}}>{p.prix_promo}</span>
                    </>
                  ) : p.prix}
                </div>
                {p.en_stock ? (
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                  <Link href={`/boutique/${p.id}`} className="btn-primary" style={{fontSize:'11px', padding:'10px 20px', display:'inline-block'}}>
                      Voir le produit
                  </Link>
                  <button
                    onClick={(e) => handleAjouterAuPanier(e, p)}
                    className="btn-secondary"
                    style={{fontSize:'11px', padding:'10px 20px'}}
                  >
                    {ajoutesIds.includes(p.id) ? '✓ Ajouté' : 'Ajouter au panier'}
                  </button>
                </div>
                ) : (
                <span style={{fontSize:'11px', letterSpacing:'1px', color:'var(--gray)', textTransform:'uppercase'}}>Indisponible</span>
                )}
            </div>
            </div>
          ))}
        </div>

        {produitsFiltres.length === 0 && (
          <div style={{textAlign:'center', padding:'80px', color:'var(--gray)'}}>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300}}>Aucun produit dans cette catégorie</p>
          </div>
        )}
      </section>
    </>
  );
}