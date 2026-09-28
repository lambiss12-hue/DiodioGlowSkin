'use client';
import { usePanier } from '../context/PanierContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Panier() {
  const { panier, supprimerDuPanier, modifierQuantite, viderPanier } = usePanier();

  const total = panier.reduce((acc, item) => {
    const prix = parseFloat(item.prix.replace(/[^0-9.]/g, ''));
    return acc + prix * item.quantite;
  }, 0);

  if (panier.length === 0) {
    return (
      <main style={{background:'var(--cream)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:'80px'}}>
        <div style={{textAlign:'center', maxWidth:'400px'}}>
          <div style={{
            width:'80px', height:'80px', border:'1px solid var(--gray-light)',
            borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 32px'
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 4H6L9 18H22L25 8H7" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="22" r="1.5" fill="#C8748A"/>
              <circle cx="20" cy="22" r="1.5" fill="#C8748A"/>
            </svg>
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)', marginBottom:'12px'}}>
            Votre panier est vide
          </h2>
          <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8, marginBottom:'40px'}}>
            Découvrez nos produits et ajoutez vos favoris pour commencer votre commande.
          </p>
          <Link href="/boutique" className="btn-primary">Découvrir la boutique</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh', paddingTop:'120px'}}>

      {/* TITRE */}
      <div className="px-section" style={{padding:'40px 60px 32px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Récapitulatif
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300, color:'var(--dark)'}}>
          Mon panier
          <span style={{fontSize:'24px', color:'var(--gray)', marginLeft:'16px', fontWeight:300}}>({panier.length} article{panier.length > 1 ? 's' : ''})</span>
        </h1>
      </div>

      {/* CONTENU */}
      <div className="grid-collapse-2" style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:'0', alignItems:'start'}}>

        {/* LISTE ARTICLES */}
        <div className="px-section" style={{padding:'0 60px', borderRight:'1px solid var(--gray-light)'}}>
          {panier.map((item, index) => (
            <div key={item.id} className="cart-item-row" style={{
              display:'grid', gridTemplateColumns:'80px 1fr auto',
              gap:'24px', alignItems:'center',
              padding:'32px 0',
              borderBottom: index < panier.length - 1 ? '1px solid var(--gray-light)' : 'none'
            }}>

              {/* VISUEL */}
              <div style={{
                width:'80px', height:'80px',
                background:'linear-gradient(135deg, #FDF4F6, #F0D6DC)',
                display:'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden'
              }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.nom} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--rose)', opacity:0.4}}>
                    {item.nom.charAt(0)}
                  </span>
                )}
              </div>

              {/* INFOS */}
              <div>
                <div style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'4px'}}>{item.categorie}</div>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:400, color:'var(--dark)', marginBottom:'4px'}}>{item.nom}</div>
                <div style={{fontSize:'13px', color:'var(--gray)', marginBottom:'16px'}}>{item.poids}</div>

                {/* QUANTITÉ */}
                <div style={{display:'flex', alignItems:'center', border:'1px solid var(--gray-light)', display:'inline-flex'}}>
                  <button onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                    style={{width:'36px', height:'36px', background:'transparent', border:'none', cursor:'pointer', fontSize:'16px', color:'var(--dark)'}}>−</button>
                  <span style={{width:'36px', textAlign:'center', fontSize:'14px', fontWeight:500}}>{item.quantite}</span>
                  <button onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                    style={{width:'36px', height:'36px', background:'transparent', border:'none', cursor:'pointer', fontSize:'16px', color:'var(--dark)'}}>+</button>
                </div>
              </div>

              {/* PRIX + SUPPRIMER */}
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:300, color: item.prix_original ? '#C44' : 'var(--dark)', marginBottom: item.prix_original ? '2px' : '12px'}}>
                  {item.prix}
                </div>
                {item.prix_original && (
                  <div style={{fontSize:'13px', color:'var(--gray)', textDecoration:'line-through', marginBottom:'8px'}}>
                    {item.prix_original}
                  </div>
                )}
                <button onClick={() => supprimerDuPanier(item.id)}
                  style={{background:'none', border:'none', cursor:'pointer', fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--gray)', textDecoration:'underline', fontFamily:'DM Sans, sans-serif'}}>
                  Retirer
                </button>
              </div>
            </div>
          ))}

          {/* VIDER */}
          <div style={{padding:'24px 0'}}>
            <button onClick={viderPanier}
              style={{background:'none', border:'none', cursor:'pointer', fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--gray)', fontFamily:'DM Sans, sans-serif'}}>
              Vider le panier
            </button>
          </div>
        </div>

        {/* RÉSUMÉ */}
<div className="cart-summary px-section" style={{padding:'40px', position:'sticky', top:'100px'}}>
  <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300, color:'var(--dark)', marginBottom:'32px'}}>
    Résumé
  </h3>

  {panier.map(item => (
    <div key={item.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
      <span style={{fontSize:'13px', color:'var(--gray)'}}>{item.nom} ×{item.quantite}</span>
      <span style={{fontSize:'13px', color:'var(--dark)', fontWeight:500}}>{item.prix}</span>
    </div>
  ))}

  {/* LIVRAISON */}
  <div style={{borderTop:'1px solid var(--gray-light)', marginTop:'24px', paddingTop:'24px'}}>
    <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', fontWeight:500, marginBottom:'16px'}}>
      Livraison
    </p>
    {[
      {zone:'Sénégal (Dakar et régions)', prix: total >= 50 ? 0 : 2.90, label: total >= 50 ? 'Offerte' : '2,90€'},
      {zone:'Afrique de l\'Ouest', prix: 9.90, label:'9,90€'},
      {zone:'Europe / International', prix: 19.90, label:'19,90€'},
    ].map((option) => (
      <div key={option.zone} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
        <span style={{fontSize:'13px', color:'var(--gray)'}}>{option.zone}</span>
        <span style={{fontSize:'13px', color: option.prix === 0 ? 'var(--rose)' : 'var(--dark)', fontWeight:500}}>
          {option.label}
        </span>
      </div>
    ))}
    {total >= 50 && (
      <div style={{
        background:'var(--rose-pale)', borderLeft:'2px solid var(--rose)',
        padding:'10px 14px', marginTop:'12px'
      }}>
        <p style={{fontSize:'11px', letterSpacing:'1px', color:'var(--rose)', textTransform:'uppercase'}}>
          ✦ Livraison offerte en France dès 50€
        </p>
      </div>
    )}
    {total < 50 && (
      <div style={{
        background:'#FAF7F2', borderLeft:'2px solid var(--gray-light)',
        padding:'10px 14px', marginTop:'12px'
      }}>
        <p style={{fontSize:'11px', color:'var(--gray)'}}>
          Plus que <strong style={{color:'var(--rose)'}}>{(50 - total).toFixed(2)}€</strong> pour la livraison offerte au Sénégal
        </p>
      </div>
    )}
  </div>

  {/* TOTAL */}
  <div style={{borderTop:'1px solid var(--gray-light)', marginTop:'24px', paddingTop:'24px', display:'flex', justifyContent:'space-between', marginBottom:'32px'}}>
    <span style={{fontSize:'13px', letterSpacing:'1px', textTransform:'uppercase', fontWeight:500, color:'var(--dark)'}}>Total estimé</span>
    <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300, color:'var(--rose)'}}>
      {(total >= 50 ? total : total + 4.90).toFixed(2)}€
    </span>
  </div>

  <Link href="/commande" className="btn-primary" style={{width:'100%', textAlign:'center', display:'block', marginBottom:'12px'}}>
  Passer la commande
</Link>

  <Link href="/boutique" style={{display:'block', textAlign:'center', fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--gray)', textDecoration:'none', marginTop:'16px'}}>
    ← Continuer mes achats
  </Link>

  

          {/* RÉASSURANCE */}
          <div style={{marginTop:'40px', paddingTop:'32px', borderTop:'1px solid var(--gray-light)', display:'flex', flexDirection:'column', gap:'16px'}}>
            {[
              {icon:'✦', text:'Livraison sécurisée'},
              {icon:'✦', text:'Paiement 100% sécurisé'},
              {icon:'✦', text:'Retours sous 14 jours'},
            ].map(item => (
              <div key={item.text} style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <span style={{color:'var(--rose)', fontSize:'10px'}}>✦</span>
                <span style={{fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--gray)'}}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}