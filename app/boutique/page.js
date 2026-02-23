import Link from 'next/link';
import { supabase } from '../lib/supabase';

const categories = [
  { id: "tous", label: "Tous" },
  { id: "laits", label: "Laits de corps" },
  { id: "savons", label: "Savons" },
  { id: "parfums", label: "Parfums" },
  { id: "gammes", label: "Gammes" },
];

export default async function Boutique() {
  const { data: produits, error } = await supabase
    .from('produits')
    .select('*')
    .order('created_at', { ascending: false });
if (error) {
  console.error('Erreur Supabase:', JSON.stringify(error));
  return <p className="pt-40 text-center text-red-400">Erreur : {error.message}</p>;
}

  return (
    <main>
      <section className="pt-32 pb-6 px-16 bg-white">
        <h2 className="text-4xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>
          Nos produits
        </h2>
        <p className="text-gray-500">Découvrez toute notre gamme de soins naturels</p>
      </section>

      <section className="px-16 pb-6 flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <span key={cat.id}
            className="px-5 py-2 rounded-full border-2 border-pink-200 text-pink-600 text-sm font-medium cursor-pointer hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-200">
            {cat.label}
          </span>
        ))}
      </section>

      <section className="px-16 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {produits.map((p) => (
            <div key={p.id}
              className="bg-pink-50 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              {p.est_nouveaute && (
                <span className="bg-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">
                  ✨ Nouveauté
                </span>
              )}
              <div className="w-full h-48 bg-white rounded-xl flex items-center justify-center text-6xl mb-5 shadow-sm">
                {p.emoji}
              </div>
              <h3 className="text-pink-600 text-lg font-semibold mb-1">{p.nom}</h3>
              <p className="text-gray-400 text-sm mb-1">{p.poids}</p>
              <p className="text-gray-700 font-bold text-lg mb-5">{p.prix}</p>
              {p.en_stock ? (
                <Link href={`/boutique/${p.id}`} className="btn-rose text-sm px-4 py-2 block text-center">
                  Voir le produit
                </Link>
              ) : (
                <span className="block text-center text-gray-400 text-sm py-2">Rupture de stock</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}