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

  const reseaux = [
    {
      nom: 'Instagram',
      lien: 'https://instagram.com/votre_compte',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#C8748A" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="4" stroke="#C8748A" strokeWidth="1.5"/>
          <circle cx="17.5" cy="6.5" r="1" fill="#C8748A"/>
        </svg>
      )
    },
    {
      nom: 'Facebook',
      lien: 'https://facebook.com/votre_page',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 2H15C13.67 2 12.4 2.53 11.46 3.46C10.53 4.4 10 5.67 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73 14.11 6.48 14.29 6.29C14.48 6.11 14.73 6 15 6H18V2Z" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      nom: 'WhatsApp',
      lien: 'https://wa.me/votrenumero',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20.0035 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.11 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh', paddingTop:'120px'}}>

      {/* HEADER */}
      <div className="px-section" style={{padding:'40px 60px 32px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Nous contacter
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300, color:'var(--dark)'}}>
          Contactez-nous
        </h1>
        <p style={{fontSize:'15px', color:'var(--gray)', marginTop:'12px'}}>Une question ? On vous répond dans les plus brefs délais.</p>
      </div>

      {/* CONTENU */}
      <div className="px-section grid-collapse-2" style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:'0', padding:'60px', alignItems:'start'}}>

        {/* FORMULAIRE */}
        <div className="contact-col-form" style={{paddingRight:'60px', borderRight:'1px solid var(--gray-light)'}}>
          {envoye ? (
            <div style={{textAlign:'center', padding:'80px 0'}}>
              <div style={{width:'80px', height:'80px', borderRadius:'50%', border:'1px solid var(--rose)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 32px'}}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16 L13 23 L26 10" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'16px', fontWeight:500}}>✦ Message envoyé</div>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'40px', fontWeight:300, color:'var(--dark)', marginBottom:'12px'}}>Merci !</h2>
              <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8}}>Nous vous répondrons très bientôt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'24px', maxWidth:'520px'}}>
              {[
                {name:'nom', label:'Nom complet', type:'text', placeholder:'Votre nom'},
                {name:'email', label:'Email', type:'email', placeholder:'votre@email.com'},
              ].map(field => (
                <div key={field.name}>
                  <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'white', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px'}}
                  />
                </div>
              ))}
              <div>
                <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Votre message..."
                  style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'white', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px', resize:'none'}}
                />
              </div>
              <button type="submit" className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', alignSelf:'flex-start'}}>
                Envoyer le message
              </button>
            </form>
          )}
        </div>

        {/* INFOS */}
        <div className="contact-col-infos" style={{paddingLeft:'60px', display:'flex', flexDirection:'column', gap:'32px'}}>

          {/* ADRESSE */}
          <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#C8748A" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="9" r="2.5" stroke="#C8748A" strokeWidth="1.5" fill="none"/>
              </svg>
              <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, color:'var(--dark)'}}>Nous trouver</p>
            </div>
            <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.9}}>
              Diodio Glow Skin<br/>
              Votre adresse ici<br/>
              Ville, Pays
            </p>
          </div>

          <div style={{height:'1px', background:'var(--gray-light)'}}></div>

          {/* HORAIRES */}
          <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#C8748A" strokeWidth="1.5" fill="none"/>
                <path d="M12 7 L12 12 L16 14" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, color:'var(--dark)'}}>Horaires</p>
            </div>
            {[
              {jour:'Lundi – Vendredi', heure:'9h – 19h'},
              {jour:'Samedi', heure:'10h – 18h'},
              {jour:'Dimanche', heure:'Fermé'},
            ].map(h => (
              <div key={h.jour} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{fontSize:'13px', color:'var(--gray)'}}>{h.jour}</span>
                <span style={{fontSize:'13px', color:'var(--dark)', fontWeight:500}}>{h.heure}</span>
              </div>
            ))}
          </div>

          <div style={{height:'1px', background:'var(--gray-light)'}}></div>

          {/* RÉSEAUX */}
          <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="2" stroke="#C8748A" strokeWidth="1.5" fill="none"/>
                <circle cx="12" cy="17" r="1" fill="#C8748A"/>
                <path d="M9 6 L15 6" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, color:'var(--dark)'}}>Réseaux sociaux</p>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
              {reseaux.map((reseau) => (
                <a
                  key={reseau.nom}
                  href={reseau.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{display:'flex', alignItems:'center', gap:'12px', padding:'12px 16px', background:'white', border:'1px solid var(--gray-light)', textDecoration:'none', color:'var(--dark)', fontSize:'13px', fontWeight:500, transition:'all 0.2s'}}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rose)'; e.currentTarget.style.color = 'var(--rose)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.color = 'var(--dark)'; }}
                >
                  {reseau.icon}
                  {reseau.nom}
                  <span style={{marginLeft:'auto', fontSize:'11px', color:'var(--gray)'}}>→</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}