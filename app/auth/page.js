'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase-browser';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [mode, setMode] = useState('connexion');
  const [form, setForm] = useState({ email: '', password: '', nom: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreur('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    if (mode === 'inscription') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nom: form.nom } }
      });
      if (error) { setErreur(error.message); setChargement(false); return; }
      setErreur('✅ Compte créé ! Vérifiez votre email pour confirmer.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) { setErreur('Email ou mot de passe incorrect.'); setChargement(false); return; }
      router.push('/profil');
    }
    setChargement(false);
  }

  return (
    <main className="pt-36 pb-20 flex justify-center px-4">
      <div className="w-full max-w-md">

        {/* TOGGLE */}
        <div className="flex bg-pink-50 rounded-2xl p-1 mb-8">
          <button
            onClick={() => setMode('connexion')}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'connexion' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}>
            Connexion
          </button>
          <button
            onClick={() => setMode('inscription')}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'inscription' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}>
            Inscription
          </button>
        </div>

        <h2 className="text-3xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>
          {mode === 'connexion' ? 'Bon retour 🌸' : 'Créer un compte'}
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          {mode === 'connexion' ? 'Connectez-vous à votre espace client.' : 'Rejoignez la famille Diodio Glow Skin.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'inscription' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                placeholder="Votre nom"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="votre@email.com"
              className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              placeholder="••••••••"
              className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
          </div>

          {erreur && (
            <p className={`text-sm px-4 py-3 rounded-xl ${erreur.startsWith('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
              {erreur}
            </p>
          )}

          <button type="submit" disabled={chargement}
            className={`btn-rose w-full text-center py-3 ${chargement ? 'opacity-60 cursor-not-allowed' : ''}`}>
            {chargement ? 'Chargement...' : mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

      </div>
    </main>
  );
}