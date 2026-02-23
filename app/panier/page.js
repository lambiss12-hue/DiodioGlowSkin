'use client';

import { usePanier } from '../context/PanierContext';
import Link from 'next/link';

export default function Panier() {
  const { panier, supprimerDuPanier, modifierQuantite, viderPanier } = usePanier();

  const total = panier.reduce((acc, item) => {
    const prix = parseFloat(item.prix.replace(/[^0-9.]/g, ''));
    return acc + prix * item.quantite;
  }, 0);

  if (panier.length === 0) {
    return (
      <main className="pt-40 px-16 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h2 className="text-3xl text-pink-600 mb-4" style={{fontFamily:'Playfair Display, serif'}}>
          Votre panier est vide
        </h2>
        <p className="text-gray-500 mb-8">Découvrez nos produits et ajoutez-en à votre panier.</p>
        <Link href="/boutique" className="btn-rose">Voir la boutique</Link>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-20 px-16">
      <h2 className="text-4xl text-pink-600 mb-10" style={{fontFamily:'Playfair Display, serif'}}>
        Mon panier
      </h2>

      <div className="flex gap-12 flex-wrap">

        {/* LISTE */}
        <div className="flex-1 min-w-72 space-y-4">
          {panier.map(item => (
            <div key={item.id} className="bg-pink-50 rounded-2xl p-5 flex items-center gap-6">
              <div className="text-5xl w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                {item.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{item.nom}</h3>
                <p className="text-pink-600 font-bold">{item.prix}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                  className="w-8 h-8 rounded-lg bg-white text-pink-600 font-bold hover:bg-pink-100 transition-colors shadow-sm"
                >−</button>
                <span className="w-8 text-center font-semibold">{item.quantite}</span>
                <button
                  onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                  className="w-8 h-8 rounded-lg bg-white text-pink-600 font-bold hover:bg-pink-100 transition-colors shadow-sm"
                >+</button>
              </div>
              <button
                onClick={() => supprimerDuPanier(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-xl ml-2"
              >✕</button>
            </div>
          ))}

          <button
            onClick={viderPanier}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors mt-2"
          >
            Vider le panier
          </button>
        </div>

        {/* RÉSUMÉ */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white border border-pink-100 rounded-2xl p-6 shadow-sm sticky top-32">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Résumé</h3>
            <div className="space-y-3 mb-6">
              {panier.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                  <span>{item.nom} x{item.quantite}</span>
                  <span>{item.prix}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-pink-100 pt-4 flex justify-between font-bold text-gray-800 text-lg mb-6">
              <span>Total estimé</span>
              <span className="text-pink-600">{total.toFixed(2)}€</span>
            </div>
            <button className="btn-rose w-full text-center">
              Passer la commande
            </button>
            <Link href="/boutique" className="block text-center text-sm text-pink-500 hover:text-pink-700 mt-4 transition-colors">
              ← Continuer mes achats
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}