'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePanier } from '../../context/PanierContext';

export default function FicheProduitClient({ produit }) {
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const { ajouterAuPanier } = usePanier();

  if (!produit) {
    return (
      <main className="pt-40 px-16 text-center">
        <p className="text-gray-500 text-xl">Produit introuvable.</p>
        <Link href="/boutique" className="btn-rose mt-6 inline-block">Retour à la boutique</Link>
      </main>
    );
  }

  function handleAjouterAuPanier() {
    ajouterAuPanier(produit, quantite);
    setAjoute(true);
    setTimeout(() => setAjoute(false), 2000);
  }

  return (
    <main className="pt-36 pb-20 px-16 flex gap-16 flex-wrap">

      <div className="w-96 h-96 bg-pink-50 rounded-3xl flex items-center justify-center text-8xl shadow-md flex-shrink-0">
        {produit.emoji}
      </div>

      <div className="flex-1 min-w-72">
        <p className="text-pink-400 text-sm font-medium uppercase tracking-widest mb-2">{produit.categorie}</p>
        <h2 className="text-4xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>{produit.nom}</h2>
        <p className="text-gray-400 mb-4">{produit.poids}</p>
        <p className="text-3xl font-bold text-gray-800 mb-6">{produit.prix}</p>
        <p className="text-gray-500 leading-relaxed mb-8">{produit.description}</p>

        {/* QUANTITÉ */}
        <div className="flex items-center gap-4 mb-8">
          <span className="font-semibold text-gray-700">Quantité :</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setQuantite(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 font-bold text-lg hover:bg-pink-200 transition-colors">−</button>
            <span className="w-10 text-center font-semibold text-lg">{quantite}</span>
            <button onClick={() => setQuantite(q => q + 1)}
              className="w-9 h-9 rounded-lg bg-pink-100 text-pink-600 font-bold text-lg hover:bg-pink-200 transition-colors">+</button>
          </div>
        </div>

        {/* BOUTONS */}
        <div className="flex gap-4 flex-wrap mb-10">
          <button onClick={handleAjouterAuPanier} className="btn-rose px-8">
            {ajoute ? '✅ Ajouté !' : 'Ajouter au panier 🛒'}
          </button>
          <button className="btn-blanc px-8">Acheter maintenant</button>
        </div>

        <Link href="/boutique" className="text-pink-500 hover:text-pink-700 text-sm font-medium transition-colors">
          ← Retour à la boutique
        </Link>

        <div className="mt-10 border-t border-pink-100 pt-8 space-y-6">
          <div>
            <h3 className="text-pink-600 font-semibold mb-2">🧪 Ingrédients</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{produit.ingredients}</p>
          </div>
          <div>
            <h3 className="text-pink-600 font-semibold mb-2">✋ Mode d'application</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{produit.application}</p>
          </div>
          <div>
            <h3 className="text-pink-600 font-semibold mb-2">💡 Conseils</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{produit.conseils}</p>
          </div>
        </div>
      </div>

    </main>
  );
}