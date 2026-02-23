'use client';
import { useState } from 'react';

const soins = [
  { id: 1, nom: "Soin du visage", duree: "60 min", prix: "À définir", emoji: "💆" },
  { id: 2, nom: "Massage relaxant", duree: "60-90 min", prix: "À définir", emoji: "🤲" },
  { id: 3, nom: "Beauté des mains", duree: "45 min", prix: "À définir", emoji: "💅" },
];

const creneaux = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function Rendezvous() {
  const [etape, setEtape] = useState(1);
  const [soinChoisi, setSoinChoisi] = useState(null);
  const [dateChoisie, setDateChoisie] = useState('');
  const [creneauChoisi, setCreneauChoisi] = useState('');
  const [form, setForm] = useState({ nom: '', email: '', telephone: '' });
  const [confirme, setConfirme] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleConfirmer(e) {
    e.preventDefault();
    setConfirme(true);
  }

  if (confirme) {
    return (
      <main className="pt-40 pb-20 px-16 text-center">
        <div className="text-6xl mb-6">🌸</div>
        <h2 className="text-4xl text-pink-600 mb-4" style={{fontFamily:'Playfair Display, serif'}}>
          Rendez-vous confirmé !
        </h2>
        <p className="text-gray-500 mb-2">Soin : <strong>{soinChoisi?.nom}</strong></p>
        <p className="text-gray-500 mb-2">Date : <strong>{dateChoisie}</strong> à <strong>{creneauChoisi}</strong></p>
        <p className="text-gray-500 mb-8">Un email de confirmation sera envoyé à <strong>{form.email}</strong></p>
        <button onClick={() => { setConfirme(false); setEtape(1); setSoinChoisi(null); setDateChoisie(''); setCreneauChoisi(''); setForm({ nom: '', email: '', telephone: '' }); }}
          className="btn-blanc px-8">
          Prendre un autre rendez-vous
        </button>
      </main>
    );
  }

  return (
    <main className="pt-36 pb-20 px-16">
      <h2 className="text-4xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>
        Prendre rendez-vous
      </h2>
      <p className="text-gray-500 mb-10">Réservez votre soin en quelques étapes.</p>

      {/* ÉTAPES */}
      <div className="flex items-center gap-4 mb-12">
        {['Choisir le soin', 'Date & heure', 'Vos infos'].map((label, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${etape > i + 1 ? 'bg-green-400 text-white' : etape === i + 1 ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-400'}`}>
              {etape > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${etape === i + 1 ? 'text-pink-600' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <div className="w-12 h-px bg-pink-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* ÉTAPE 1 — SOIN */}
      {etape === 1 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Quel soin souhaitez-vous ?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            {soins.map((s) => (
              <div key={s.id}
                onClick={() => setSoinChoisi(s)}
                className={`border-2 rounded-2xl p-6 cursor-pointer text-center transition-all duration-200 ${soinChoisi?.id === s.id ? 'border-pink-600 bg-pink-50' : 'border-pink-100 hover:border-pink-300'}`}>
                <div className="text-4xl mb-3">{s.emoji}</div>
                <h4 className="font-semibold text-gray-800 mb-1">{s.nom}</h4>
                <p className="text-gray-400 text-sm">{s.duree}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => soinChoisi && setEtape(2)}
            className={`mt-8 btn-rose px-10 ${!soinChoisi ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Suivant →
          </button>
        </div>
      )}

      {/* ÉTAPE 2 — DATE & HEURE */}
      {etape === 2 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Choisissez une date et un créneau</h3>
          <div className="flex gap-10 flex-wrap">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
              <input
                type="date"
                value={dateChoisie}
                onChange={(e) => setDateChoisie(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Créneau horaire</label>
              <div className="grid grid-cols-4 gap-3">
                {creneaux.map((c) => (
                  <button key={c}
                    onClick={() => setCreneauChoisi(c)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200 ${creneauChoisi === c ? 'bg-pink-600 text-white border-pink-600' : 'border-pink-200 text-pink-600 hover:border-pink-400'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setEtape(1)} className="btn-blanc px-8">← Retour</button>
            <button
              onClick={() => dateChoisie && creneauChoisi && setEtape(3)}
              className={`btn-rose px-10 ${!dateChoisie || !creneauChoisi ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 — INFOS */}
      {etape === 3 && (
        <div className="max-w-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Vos coordonnées</h3>

          {/* RÉCAPITULATIF */}
          <div className="bg-pink-50 rounded-2xl p-5 mb-8">
            <p className="text-sm text-gray-600 mb-1">🌸 <strong>{soinChoisi?.nom}</strong></p>
            <p className="text-sm text-gray-600">📅 {dateChoisie} à {creneauChoisi}</p>
          </div>

          <form onSubmit={handleConfirmer} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                placeholder="Votre nom"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="votre@email.com"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
              <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required
                placeholder="+33 6 00 00 00 00"
                className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors" />
            </div>
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => setEtape(2)} className="btn-blanc px-8">← Retour</button>
              <button type="submit" className="btn-rose px-10">Confirmer le rendez-vous ✓</button>
            </div>
          </form>
        </div>
      )}

    </main>
  );
}