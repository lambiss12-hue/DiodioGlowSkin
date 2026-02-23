'use client';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ nom: '', email: '', message: '' });
  const [envoye, setEnvoye] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnvoye(true);
  }

  return (
    <main className="pt-36 pb-20 px-16">
      <h2 className="text-4xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>
        Contactez-nous
      </h2>
      <p className="text-gray-500 mb-12">Une question ? On vous répond dans les plus brefs délais.</p>

      <div className="flex gap-16 flex-wrap">

        {/* FORMULAIRE */}
        <div className="flex-1 min-w-72">
          {envoye ? (
            <div className="bg-pink-50 rounded-2xl p-10 text-center">
              <div className="text-5xl mb-4">🌸</div>
              <h3 className="text-2xl text-pink-600 mb-2" style={{fontFamily:'Playfair Display, serif'}}>
                Message envoyé !
              </h3>
              <p className="text-gray-500">Merci, nous vous répondrons très bientôt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  placeholder="Votre nom"
                  className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Votre message..."
                  className="w-full border border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 transition-colors resize-none"
                />
              </div>
              <button type="submit" className="btn-rose px-10">
                Envoyer le message
              </button>
            </form>
          )}
        </div>

        {/* INFOS */}
        <div className="w-72 flex-shrink-0 space-y-6">
          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📍 Nous trouver</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Diodio Glow Skin<br />
              Votre adresse ici<br />
              Ville, Pays
            </p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">🕐 Horaires</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Lundi – Vendredi : 9h – 19h<br />
              Samedi : 10h – 18h<br />
              Dimanche : Fermé
            </p>
          </div>
          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📱 Réseaux sociaux</h3>
            <p className="text-gray-500 text-sm">Instagram • Facebook • WhatsApp</p>
          </div>
        </div>

      </div>
    </main>
  );
}