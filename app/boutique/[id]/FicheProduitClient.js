'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePanier } from '../../context/PanierContext';
import SuggestionsSection from './SuggestionsSection';

export default function FicheProduitClient({ produit }) {
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const { ajouterAuPanier } = usePanier();
  const router = useRouter();

  if (!produit) {
    return (
      <main style={{paddingTop:'160px', textAlign:'center'}}>
        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300, color:'var(--gray)'}}>Produit introuvable.</p>
        <Link href="/boutique" className="btn-primary" style={{marginTop:'32px', display:'inline-block'}}>Retour à la boutique</Link>
      </main>
    );
  }

  const produitPourPanier = produit.en_promotion && produit.prix_promo
    ? { ...produit, prix: produit.prix_promo, prix_original: produit.prix }
    : produit;

  function handleAjouterAuPanier() {
    ajouterAuPanier(produitPourPanier, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  }

  function handleAcheterMaintenant() {
    ajouterAuPanier(produitPourPanier, quantite);
    router.push('/commande');
  }

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh'}}>

      {/* BREADCRUMB */}
      <div className="px-section" style={{paddingTop:'120px', paddingLeft:'60px', paddingRight:'60px', paddingBottom:'24px', display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap'}}>
        <Link href="/" style={{fontSize:'12px', letterSpacing:'1px', color:'var(--gray)', textDecoration:'none', textTransform:'uppercase'}}>Accueil</Link>
        <span style={{color:'var(--gray-light)'}}>—</span>
        <Link href="/boutique" style={{fontSize:'12px', letterSpacing:'1px', color:'var(--gray)', textDecoration:'none', textTransform:'uppercase'}}>Boutique</Link>
        <span style={{color:'var(--gray-light)'}}>—</span>
        <span style={{fontSize:'12px', letterSpacing:'1px', color:'var(--rose)', textTransform:'uppercase'}}>{produit.nom}</span>
      </div>

      {/* CONTENU PRINCIPAL */}
      <section className="grid-collapse-2" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0', minHeight:'80vh'}}>

        {/* IMAGE GAUCHE */}
        <div className="fiche-image" style={{
          background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 60%, #E8C5CE 100%)',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative', minHeight:'600px'
        }}>
          <span className="fiche-letter" style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'180px',
            fontWeight:300, color:'var(--rose)', opacity:0.2, letterSpacing:'-4px',
            userSelect:'none'
          }}>
            {produit.nom.charAt(0)}
          </span>

          {produit.en_promotion && (
            <div style={{
              position:'absolute', top:'32px', left:'32px',
              background:'#C44', color:'white',
              fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase',
              padding:'6px 14px', fontWeight:500
            }}>Promo</div>
          )}
          {!produit.en_promotion && produit.est_nouveaute && (
            <div style={{
              position:'absolute', top:'32px', left:'32px',
              background:'var(--rose)', color:'white',
              fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase',
              padding:'6px 14px', fontWeight:500
            }}>Nouveauté</div>
          )}

          {!produit.en_stock && (
            <div style={{
              position:'absolute', inset:0, background:'rgba(250,247,242,0.85)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'
            }}>Épuisé</div>
          )}

          <div style={{
            position:'absolute', bottom:'32px', right:'32px',
            background:'white', padding:'16px 20px',
            boxShadow:'0 8px 32px rgba(0,0,0,0.08)',
            borderLeft:'2px solid var(--rose)'
          }}>
            <p style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'4px'}}>{produit.categorie}</p>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'16px', fontWeight:400}}>{produit.poids}</p>
          </div>
        </div>

        {/* INFOS DROITE */}
        <div className="px-section" style={{padding:'60px', display:'flex', flexDirection:'column', justifyContent:'center', background:'white'}}>

          <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'16px', fontWeight:500, display:'flex', alignItems:'center', gap:'12px'}}>
            <span style={{width:'24px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
            {produit.categorie}
          </div>

          <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'52px', fontWeight:300, color:'var(--dark)', marginBottom:'8px', lineHeight:1.05, letterSpacing:'-1px'}}>
            {produit.nom}
          </h1>

          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'32px', fontWeight:300, color:'var(--rose)', marginBottom:'32px', display:'flex', alignItems:'baseline', gap:'14px', flexWrap:'wrap'}}>
            {produit.en_promotion && produit.prix_promo ? (
              <>
                <span style={{color:'#C44'}}>{produit.prix_promo}</span>
                <span style={{fontSize:'18px', color:'var(--gray)', textDecoration:'line-through'}}>{produit.prix}</span>
              </>
            ) : produit.prix}
          </p>

          <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.8, marginBottom:'40px', maxWidth:'420px'}}>
            {produit.description}
          </p>

          {/* QUANTITÉ */}
          {produit.en_stock && (
            <div style={{display:'flex', alignItems:'center', gap:'20px', marginBottom:'32px'}}>
              <span style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'}}>Quantité</span>
              <div style={{display:'flex', alignItems:'center', border:'1px solid var(--gray-light)'}}>
                <button onClick={() => setQuantite(q => Math.max(1, q - 1))} style={{
                  width:'44px', height:'44px', background:'transparent', border:'none',
                  fontSize:'18px', cursor:'pointer', color:'var(--dark)',
                  fontFamily:'DM Sans, sans-serif', transition:'background 0.2s'
                }}>−</button>
                <span style={{width:'44px', textAlign:'center', fontSize:'15px', fontWeight:500, color:'var(--dark)'}}>{quantite}</span>
                <button onClick={() => setQuantite(q => q + 1)} style={{
                  width:'44px', height:'44px', background:'transparent', border:'none',
                  fontSize:'18px', cursor:'pointer', color:'var(--dark)',
                  fontFamily:'DM Sans, sans-serif', transition:'background 0.2s'
                }}>+</button>
              </div>
            </div>
          )}

          {/* BOUTONS */}
          {produit.en_stock ? (
            <div style={{display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'48px'}}>
              <button onClick={handleAjouterAuPanier} className="btn-primary" style={{minWidth:'200px'}}>
                {ajoute ? '✓ Ajouté au panier' : 'Ajouter au panier'}
              </button>
              <button onClick={handleAcheterMaintenant} className="btn-secondary" style={{minWidth:'160px'}}>
                Acheter maintenant
              </button>
            </div>
          ) : (
            <div style={{marginBottom:'48px'}}>
              <span style={{fontSize:'13px', letterSpacing:'1px', color:'var(--gray)', textTransform:'uppercase'}}>Produit indisponible</span>
            </div>
          )}

          {/* SÉPARATEUR */}
          <div style={{borderTop:'1px solid var(--gray-light)', paddingTop:'40px', display:'flex', flexDirection:'column', gap:'28px'}}>
            {[
              {label:'Ingrédients', contenu: produit.ingredients},
              {label:"Mode d'application", contenu: produit.application},
              {label:'Conseils', contenu: produit.conseils},
            ].map((section) => (
              <div key={section.label}>
                <p style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--dark)', fontWeight:500, marginBottom:'8px'}}>{section.label}</p>
                <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8}}>{section.contenu}</p>
              </div>
            ))}
          </div>

          <Link href="/boutique" style={{
            marginTop:'40px', fontSize:'12px', letterSpacing:'2px',
            textTransform:'uppercase', color:'var(--gray)', textDecoration:'none',
            display:'flex', alignItems:'center', gap:'8px'
          }}>
            ← Retour à la boutique
          </Link>

        </div>
      </section>

            {/* SUGGESTIONS */}
      <SuggestionsSection produit={produit} />

    </main>
  );
}