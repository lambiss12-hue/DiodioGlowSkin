import FicheProduitClient from './FicheProduitClient';
import { supabase } from '../../lib/supabase';

export default async function FicheProduit({ params }) {
  const { id } = await params;

  const { data: produit, error } = await supabase
    .from('produits')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !produit) {
    return (
      <main className="pt-40 px-16 text-center">
        <p className="text-gray-500 text-xl">Produit introuvable.</p>
      </main>
    );
  }

  return <FicheProduitClient produit={produit} />;
}