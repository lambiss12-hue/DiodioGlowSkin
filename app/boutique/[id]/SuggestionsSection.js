'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function SuggestionsSection({ produit }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    async function charger() {
      // D'abord on cherche la même catégorie
      const { data } = await supabase
        .from('produits')
        .select('*')
        .eq('categorie', produit.categorie)
        .neq('id', produit.id)
        .limit(3);

      // Si pas assez dans la catégorie, on complète avec d'autres
      if (data && data.length < 3) {
        const { data: autres } = await supabase
          .from('produits')
          .select('*')
          .neq('id', produit.id)
          .neq('categorie', produit.categorie)
          .limit(3 - data.length);
        setSuggestions([...data, ...(autres || [])]);
      } else {
        setSuggestions(data || []);
      }
    }
    charger();
  }, [produit.id]);

  if (suggestions.length === 0) return null;

  return (
    <section className="px-section" style={{background:'var(--cream)', padding:'80px 60px', borderTop:'1px solid var(--gray-light)'}}>

      {/* TITRE */}
      <div style={{marginBottom:'48px'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Vous aimerez aussi
        </div>
        <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'40px', fontWeight:300, color:'var(--dark)'}}>
          Produits similaires
        </h2>
      </div>

      {/* GRILLE */}
      <div className="grid-collapse-3" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px'}}>
        {suggestions.map((p) => (
          <div key={p.id}
            style={{background:'white', position:'relative', overflow:'hidden', transition:'transform 0.4s ease, box-shadow 0.4s ease', cursor:'pointer'}}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.10)';
              e.currentTarget.querySelector('.sugg-overlay').style.opacity = '1';
              const lettre = e.currentTarget.querySelector('.sugg-letter');
              if (lettre) lettre.style.opacity = '0.5';
              const photo = e.currentTarget.querySelector('.sugg-photo');
              if (photo) photo.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.querySelector('.sugg-overlay').style.opacity = '0';
              const lettre = e.currentTarget.querySelector('.sugg-letter');
              if (lettre) lettre.style.opacity = '0.2';
              const photo = e.currentTarget.querySelector('.sugg-photo');
              if (photo) photo.style.transform = 'scale(1)';
            }}
          >
            {/* IMAGE */}
            <div style={{height:'240px', background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 100%)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.nom} className="sugg-photo" style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease'}} />
              ) : (
                <span className="sugg-letter" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'80px', fontWeight:300, color:'var(--rose)', opacity:0.2, transition:'opacity 0.4s ease'}}>
                  {p.nom.charAt(0)}
                </span>
              )}
              <div className="sugg-overlay" style={{position:'absolute', inset:0, background:'rgba(28,28,30,0.55)', display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.4s ease'}}>
                <span style={{color:'white', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.4)', paddingBottom:'4px'}}>
                  Voir le produit →
                </span>
              </div>
              {p.en_promotion && (
                <div style={{position:'absolute', top:'12px', left:'12px', background:'#C44', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'4px 10px', fontWeight:500, zIndex:2}}>Promo</div>
              )}
              {!p.en_promotion && p.est_nouveaute && (
                <div style={{position:'absolute', top:'12px', left:'12px', background:'var(--rose)', color:'white', fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', padding:'4px 10px', fontWeight:500, zIndex:2}}>Nouveauté</div>
              )}
              {!p.en_stock && (
                <div style={{position:'absolute', inset:0, background:'rgba(250,247,242,0.85)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)', zIndex:2}}>Épuisé</div>
              )}
            </div>

            {/* INFOS */}
            <div style={{padding:'20px', borderTop:'1px solid var(--gray-light)'}}>
              <div style={{fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'4px'}}>{p.categorie}</div>
              <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:'18px', fontWeight:400, color:'var(--dark)', marginBottom:'4px'}}>{p.nom}</div>
              <div style={{fontSize:'13px', color:'var(--gray)', fontWeight:300, marginBottom:'16px'}}>
                {p.poids} ·{' '}
                {p.en_promotion && p.prix_promo ? (
                  <>
                    <span style={{textDecoration:'line-through', opacity:0.7}}>{p.prix}</span>{' '}
                    <span style={{color:'#C44', fontWeight:500}}>{p.prix_promo}</span>
                  </>
                ) : p.prix}
              </div>
              <Link href={`/boutique/${p.id}`} className="btn-primary" style={{fontSize:'11px', padding:'8px 18px', display:'inline-block'}}>
                Voir le produit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}