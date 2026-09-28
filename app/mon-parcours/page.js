import Link from 'next/link';

const SECTIONS = [
  {
    eyebrow: 'Les Débuts',
    titre: 'Une Passion Née',
    paragraphes: [
      "Mon amour pour la beauté et le bien-être a commencé dès mon plus jeune âge. Fascinée par l'art de sublimer la peau et de révéler la beauté naturelle de chaque personne, j'ai rapidement compris que c'était ma vocation.",
      "J'ai commencé par me former auprès des meilleurs professionnels du secteur, accumulant des années d'expérience et de savoir-faire dans les techniques les plus avancées de soins esthétiques.",
    ],
  },
  {
    eyebrow: 'La Formation',
    titre: 'Excellence & Expertise',
    paragraphes: [
      "Ma quête d'excellence m'a menée à suivre des formations certifiantes dans les plus prestigieuses écoles d'esthétique, tant au niveau local qu'international. J'ai approfondi mes connaissances en :",
    ],
    liste: [
      'Soins du visage et techniques anti-âge',
      'Massages thérapeutiques et bien-être',
      'Cosmétologie et produits de beauté',
      "Gestion d'institut et relation client",
    ],
  },
  {
    eyebrow: "L'Expérience",
    titre: 'Des Années de Pratique',
    paragraphes: [
      "Au fil des années, j'ai eu le privilège de travailler avec des centaines de clientes, chacune avec ses besoins uniques. Cette expérience m'a permis de développer une approche personnalisée et une écoute attentive qui sont aujourd'hui au cœur de ma pratique.",
      "J'ai également eu l'opportunité de collaborer avec des marques de renom et de participer à des événements beauté, enrichissant constamment mes compétences et ma vision de l'esthétique moderne.",
    ],
  },
  {
    eyebrow: 'La Vision',
    titre: 'Naissance de Diodio Glow Skin',
    paragraphes: [
      "Forte de toutes ces expériences, j'ai ressenti le besoin de créer un espace unique où chaque personne pourrait se sentir écoutée, choyée et sublimée. C'est ainsi qu'est née l'idée de Diodio Glow Skin.",
      "Mon objectif était clair : créer un institut de beauté qui allie expertise professionnelle, produits de qualité supérieure et une approche personnalisée. Un lieu où la beauté rencontre le bien-être, où chaque détail compte et où chaque cliente repart avec un éclat renouvelé.",
      "Diodio Glow Skin est bien plus qu'un institut de beauté : c'est un projet de cœur, une vision de la beauté authentique et naturelle, un engagement envers l'excellence et la satisfaction de chaque cliente.",
    ],
  },
  {
    eyebrow: "Aujourd'hui",
    titre: 'Notre Engagement',
    paragraphes: [
      "Aujourd'hui, Diodio Glow Skin est devenu une référence dans le domaine de la beauté à Dakar. Nous continuons à évoluer, à nous former et à innover pour vous offrir toujours le meilleur.",
      "Mon engagement reste inchangé : vous offrir une expérience exceptionnelle, des soins de qualité et un accompagnement personnalisé pour révéler votre beauté naturelle et renforcer votre confiance en vous.",
    ],
  },
];

export default function MonParcours() {
  return (
    <main style={{background:'var(--cream)', minHeight:'100vh'}}>

      {/* BREADCRUMB */}
      <div className="px-section" style={{paddingTop:'110px', paddingLeft:'60px', paddingRight:'60px', paddingBottom:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
        <Link href="/" style={{fontSize:'12px', letterSpacing:'1px', color:'var(--gray)', textDecoration:'none', textTransform:'uppercase'}}>Accueil</Link>
        <span style={{color:'var(--gray-light)'}}>—</span>
        <span style={{fontSize:'12px', letterSpacing:'1px', color:'var(--rose)', textTransform:'uppercase'}}>Mon parcours</span>
      </div>

      {/* HERO */}
      <section className="px-section grid-collapse-2" style={{padding:'32px 60px 56px', display:'grid', gridTemplateColumns:'320px 1fr', gap:'56px', alignItems:'center'}}>
        <div style={{position:'relative', maxWidth:'320px'}}>
          <div style={{position:'absolute', top:'-20px', left:'-20px', width:'100%', height:'100%', background:'var(--rose-light)', zIndex:0}}></div>
          <img
            src="https://maisondiodioglowskin.com/images/directrice.webp"
            alt="Diodio, fondatrice de Diodio Glow Skin"
            style={{width:'100%', height:'auto', aspectRatio:'4/5', objectFit:'cover', display:'block', position:'relative', zIndex:1, boxShadow:'0 24px 64px rgba(0,0,0,0.10)'}}
          />
        </div>
        <div style={{maxWidth:'460px'}}>
          <div className="eyebrow" style={{marginBottom:'16px'}}>Son histoire</div>
          <h1 className="heading-hero" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'52px', fontWeight:300, color:'var(--dark)', marginBottom:'12px', lineHeight:1.1}}>
            Diodio
          </h1>
          <p style={{fontSize:'14px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)'}}>
            Fondatrice & Directrice de Diodio Glow Skin
          </p>
        </div>
      </section>

      {/* SECTIONS — LIGNE DE VIE */}
      <div className="px-section" style={{padding:'0 60px 72px', maxWidth:'720px', margin:'0 auto'}}>
        <div style={{position:'relative'}}>

          {/* LIGNE VERTICALE */}
          <div style={{position:'absolute', left:'7px', top:'6px', bottom:'6px', width:'1px', background:'var(--gray-light)'}}></div>

          {SECTIONS.map((s, i) => {
            const estActuel = i === SECTIONS.length - 1;
            return (
            <div key={s.titre} style={{position:'relative', paddingLeft:'40px', paddingTop: i === 0 ? '0' : '40px', paddingBottom:'40px'}}>

              {/* POINT */}
              <span style={{
                position:'absolute', left: estActuel ? '-3px' : '0px', top: i === 0 ? '6px' : '46px',
                width: estActuel ? '21px' : '15px', height: estActuel ? '21px' : '15px', borderRadius:'50%',
                background: estActuel ? 'var(--rose)' : 'var(--cream)', border:'2px solid var(--rose)', boxSizing:'border-box',
                boxShadow: estActuel ? '0 0 0 4px var(--rose-pale)' : 'none'
              }}></span>

              <div style={estActuel ? {
                background:'white', padding:'28px 32px', borderLeft:'2px solid var(--rose)',
                boxShadow:'0 16px 40px rgba(0,0,0,0.06)'
              } : undefined}>
                <div className="eyebrow" style={{marginBottom:'14px'}}>{s.eyebrow}</div>
                <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize: estActuel ? '32px' : '30px', fontWeight:300, color:'var(--dark)', marginBottom:'16px'}}>
                  {s.titre}
                </h2>
                {s.paragraphes.map((p, j) => (
                  <p key={j} style={{fontSize:'15px', color: estActuel ? 'var(--dark)' : 'var(--gray)', lineHeight:1.8, marginBottom:'14px'}}>
                    {p}
                  </p>
                ))}
                {s.liste && (
                  <ul style={{margin:'8px 0 0', padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:'10px'}}>
                    {s.liste.map(item => (
                      <li key={item} style={{display:'flex', alignItems:'baseline', gap:'10px', fontSize:'15px', color:'var(--gray)', lineHeight:1.6}}>
                        <span style={{color:'var(--rose)', fontSize:'11px'}}>✦</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );})}

          {/* SIGNATURE */}
          <div style={{position:'relative', paddingLeft:'40px', paddingTop:'40px'}}>
            <span style={{
              position:'absolute', left:'0px', top:'46px',
              width:'15px', height:'15px', borderRadius:'50%',
              background:'var(--rose)', border:'2px solid var(--rose)', boxSizing:'border-box'
            }}></span>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontStyle:'italic', color:'var(--dark)', marginBottom:'20px'}}>
              Avec toute ma passion,
            </p>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'26px', fontWeight:400, color:'var(--dark)'}}>Diodio</p>
            <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--rose)', marginTop:'4px'}}>Fondatrice & Directrice</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="px-section" style={{background:'var(--dark)', padding:'80px 60px', textAlign:'center'}}>
        <h2 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'40px', fontWeight:300, color:'white', marginBottom:'12px'}}>
          Prête à découvrir votre éclat ?
        </h2>
        <p style={{color:'rgba(255,255,255,0.5)', fontSize:'15px', marginBottom:'40px'}}>
          Rejoignez-nous pour une expérience beauté unique et personnalisée
        </p>
        <div style={{display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap'}}>
          <Link href="/boutique" className="btn-secondary" style={{border:'1px solid white', color:'white'}}>Découvrir nos services</Link>
          <Link href="/rendezvous" className="btn-primary" style={{borderColor:'var(--rose)'}}>Réserver un soin</Link>
        </div>
      </section>

    </main>
  );
}
