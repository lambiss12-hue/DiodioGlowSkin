import Link from 'next/link';

export default function Accueil() {
  return (
    <main>

      {/* HERO */}
      <section className="flex items-center justify-between px-16 pt-40 pb-24 bg-white">
        <div className="max-w-lg">
          <h2 className="text-5xl text-pink-600 mb-6 leading-tight">
            Votre beauté,<br />notre priorité
          </h2>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Découvrez nos laits de corps, savons et senteurs,
            et profitez de soins professionnels dans notre institut.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/boutique" className="btn-rose">Découvrir la boutique</Link>
            <Link href="/rendezvous" className="btn-blanc">Prendre rendez-vous</Link>
          </div>
        </div>
        <div className="w-80 h-80 bg-pink-100 rounded-3xl flex items-center justify-center text-6xl shadow-lg">
          🌸
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="bg-pink-50 px-16 py-16">
        <h2 className="text-3xl text-pink-600 text-center mb-10">✨ Nouveautés</h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {[
            { nom: "Lait de corps Rose", prix: "12€", emoji: "🌹" },
            { nom: "Gamme Testeur Collagène", prix: "15 000 FCFA", emoji: "💎" },
            { nom: "Parfum Vanille", prix: "18€", emoji: "🌿" },
          ].map((p) => (
            <div key={p.nom} className="bg-white rounded-2xl p-6 w-56 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="text-5xl mb-4">{p.emoji}</div>
              <h3 className="text-pink-600 font-semibold mb-2">{p.nom}</h3>
              <p className="text-gray-500 mb-4">{p.prix}</p>
              <Link href="/boutique" className="btn-rose text-sm px-4 py-2">Voir</Link>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-16 py-16 text-center">
        <h2 className="text-3xl text-pink-600 mb-10">Nos services</h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {[
            { emoji: "💆", label: "Soin du visage" },
            { emoji: "🤲", label: "Massage relaxant" },
            { emoji: "💅", label: "Beauté des mains" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 bg-pink-50 rounded-2xl flex items-center justify-center text-5xl">
                {s.emoji}
              </div>
              <p className="font-medium text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}