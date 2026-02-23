'use client';

import { createContext, useContext, useState } from 'react';

const PanierContext = createContext();

export function PanierProvider({ children }) {
  const [panier, setPanier] = useState([]);

  function ajouterAuPanier(produit, quantite = 1) {
    setPanier(prev => {
      const existant = prev.find(item => item.id === produit.id);
      if (existant) {
        return prev.map(item =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prev, { ...produit, quantite }];
    });
  }

  function supprimerDuPanier(id) {
    setPanier(prev => prev.filter(item => item.id !== id));
  }

  function modifierQuantite(id, quantite) {
    if (quantite <= 0) {
      supprimerDuPanier(id);
      return;
    }
    setPanier(prev =>
      prev.map(item => item.id === id ? { ...item, quantite } : item)
    );
  }

  function viderPanier() {
    setPanier([]);
  }

  const totalArticles = panier.reduce((acc, item) => acc + item.quantite, 0);

  return (
    <PanierContext.Provider value={{
      panier, ajouterAuPanier, supprimerDuPanier, modifierQuantite, viderPanier, totalArticles
    }}>
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  return useContext(PanierContext);
}