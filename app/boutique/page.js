import { supabase } from '../lib/supabase';
import BoutiqueClient from './BoutiqueClient';

export default async function Boutique() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p style={{paddingTop:'160px', textAlign:'center', color:'var(--rose)'}}>Erreur de chargement.</p>;
  }

console.log('Produits:', produits);
console.log('Erreur:', error);
  if (error) {
  console.error('Erreur:', JSON.stringify(error));
  return <div style={{paddingTop:'160px', textAlign:'center', color:'var(--rose)'}}>Erreur : {error.message}</div>;
}
  return (
    <main style={{background:'var(--cream)', minHeight:'100vh'}}>

      {/* HERO */}
      <section className="px-section" style={{paddingTop:'140px', paddingBottom:'60px', paddingLeft:'60px', paddingRight:'60px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Nos créations
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'56px', fontWeight:300, color:'var(--dark)', marginBottom:'16px', letterSpacing:'-1px'}}>
          La boutique
        </h1>
        <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.8, maxWidth:'480px'}}>
          Chaque produit est formulé avec soin, à partir d'ingrédients naturels sélectionnés pour sublimer votre peau.
        </p>
      </section>

      <BoutiqueClient produits={produits} />

    </main>
  );
}