import "./globals.css";
import Link from "next/link";
import { PanierProvider } from "./context/PanierContext";
import HeaderClient from "./components/HeaderClient";

export const metadata = {
  title: "Diodio Glow Skin",
  description: "Votre beauté, notre priorité",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <PanierProvider>

          <header className="fixed top-0 left-0 w-full z-50 bg-pink-50 px-8 py-4 flex items-center justify-between shadow-sm">
            <Link href="/" className="text-pink-600 text-3xl" style={{fontFamily:'Playfair Display, serif'}}>
              Diodio Glow Skin
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Accueil</Link>
              <Link href="/boutique" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Boutique</Link>
              <Link href="/rendezvous" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Rendez-vous</Link>
              <Link href="/contact" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">Contact</Link>
              <HeaderClient />
              <Link href="/auth" className="text-gray-600 hover:text-pink-600 font-medium transition-colors">
                Connexion
              </Link>
              <Link href="/profil" className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-700 transition-colors">
                Mon compte
              </Link>
            </nav>
          </header>

          {children}

          <footer className="bg-pink-50 text-center py-6 text-gray-500 text-sm">
            © 2025 Diodio Glow Skin — Tous droits réservés.
          </footer>

        </PanierProvider>
      </body>
    </html>
  );
}