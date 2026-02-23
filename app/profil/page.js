'use client';
import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Profil() {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);
      setChargement(false);
    }
    getUser();
  }, []);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (chargement) {
    return (
      <main className="pt-40 text-center">
        <p className="text-pink-400">Chargement...</p>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-20 px-16">
      <h2 className="text-4xl text-pink-600 mb-8" style={{fontFamily:'Playfair Display, serif'}}>
        Mon espace
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl">

        {/* INFOS */}
        <div className="bg-pink-50 rounded-2xl p-6 col-span-2">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.user_metadata?.nom?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {user.user_metadata?.nom || 'Client'}
              </h3>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="border-t border-pink-100 pt-4">
            <p className="text-sm text-gray-400">
              Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-4">
          <Link href="/boutique"
            className="block bg-white border border-pink-100 rounded-2xl p-5 hover:border-pink-300 transition-colors">
            <div className="text-2xl mb-2">🛍️</div>
            <p className="font-semibold text-gray-800 text-sm">Boutique</p>
          </Link>
          <Link href="/rendezvous"
            className="block bg-white border border-pink-100 rounded-2xl p-5 hover:border-pink-300 transition-colors">
            <div className="text-2xl mb-2">📅</div>
            <p className="font-semibold text-gray-800 text-sm">Rendez-vous</p>
          </Link>
          <button onClick={handleDeconnexion}
            className="w-full bg-white border border-pink-100 rounded-2xl p-5 hover:border-red-200 transition-colors text-left">
            <div className="text-2xl mb-2">🚪</div>
            <p className="font-semibold text-red-400 text-sm">Déconnexion</p>
          </button>
        </div>

      </div>
    </main>
  );
}