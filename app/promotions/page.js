import { supabase } from '../lib/supabase';
import PromotionsClient from './PromotionsClient';

export default async function Promotions() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select('*')
    .eq('en_promotion', true)
    .order('created_at', { ascending: false });

  if (error) {
    return <div style={{paddingTop:'160px', textAlign:'center', color:'var(--rose)'}}>Erreur : {error.message}</div>;
  }

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh'}}>

      {/* HERO */}
      <section className="px-section" style={{paddingTop:'140px', paddingBottom:'60px', paddingLeft:'60px', paddingRight:'60px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'#C44', fontWeight:500, marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'#C44', display:'inline-block'}}></span>
          Offres du moment
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'56px', fontWeight:300, color:'var(--dark)', marginBottom:'16px', letterSpacing:'-1px'}}>
          Promotions
        </h1>
        <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.8, maxWidth:'480px'}}>
          Profitez de nos offres exceptionnelles, pour un temps limité.
        </p>
      </section>

      <PromotionsClient produits={produits || []} />

    </main>
  );
}
