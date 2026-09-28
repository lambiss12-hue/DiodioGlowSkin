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
        options: {
          data: { nom: form.nom },
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });
      if (error) { setErreur(error.message); setChargement(false); return; }
      setErreur('success');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) { setErreur('Email ou mot de passe incorrect.'); setChargement(false); return; }
      router.push('/');
    }
    setChargement(false);
  }

  return (
    <main className="grid-collapse-2" style={{background:'var(--cream)', minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr', paddingTop:'72px'}}>

      {/* GAUCHE — VISUEL */}
      <div className="auth-visual" style={{
        background:'linear-gradient(135deg, #FDF4F6 0%, #F0D6DC 60%, #E8C5CE 100%)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'60px', position:'relative', overflow:'hidden'
      }}>
        {/* LOGO GRAND */}
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{marginBottom:'24px'}}>
            <circle cx="40" cy="40" r="38" stroke="#C8748A" strokeWidth="0.8" opacity="0.3"/>
            <path d="M40 10 C40 10 22 24 22 42 C22 54 30 62 40 64 C50 62 58 54 58 42 C58 24 40 10 40 10Z" fill="#F0D6DC"/>
            <path d="M40 18 C40 18 25 30 25 44 C25 54 32 60 40 62 C48 60 55 54 55 44 C55 30 40 18 40 18Z" fill="#C8748A" opacity="0.5"/>
            <path d="M40 28 C40 28 30 38 30 48 C30 54 35 58 40 59 C45 58 50 54 50 48 C50 38 40 28 40 28Z" fill="#C8748A"/>
          </svg>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300, letterSpacing:'4px', color:'var(--dark)'}}>
            DIODIO <span style={{color:'var(--rose)'}}>✦</span> GLOW SKIN
          </p>
        </div>

        {/* CITATIONS */}
        <div style={{maxWidth:'320px', textAlign:'center'}}>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:300, fontStyle:'italic', color:'var(--dark)', lineHeight:1.6, marginBottom:'16px'}}>
            "Révélez votre éclat naturel au quotidien."
          </p>
          <div style={{width:'32px', height:'1px', background:'var(--rose)', margin:'0 auto'}}></div>
        </div>

        {/* DÉCORATION */}
        <div style={{position:'absolute', bottom:'40px', right:'40px', opacity:0.15}}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <circle cx="60" cy="60" r="58" stroke="#C8748A" strokeWidth="1"/>
            <circle cx="60" cy="60" r="40" stroke="#C8748A" strokeWidth="1"/>
            <circle cx="60" cy="60" r="22" stroke="#C8748A" strokeWidth="1"/>
          </svg>
        </div>
      </div>

      {/* DROITE — FORMULAIRE */}
      <div className="px-section" style={{display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 60px', background:'white'}}>

        {/* TOGGLE */}
        <div style={{display:'flex', background:'var(--cream)', padding:'4px', marginBottom:'48px', width:'fit-content'}}>
          {['connexion', 'inscription'].map((m) => (
            <button key={m}
              onClick={() => { setMode(m); setErreur(''); }}
              style={{
                padding:'10px 28px', fontSize:'11px', letterSpacing:'2px',
                textTransform:'uppercase', fontWeight:500, cursor:'pointer',
                border:'none', fontFamily:'DM Sans, sans-serif',
                background: mode === m ? 'white' : 'transparent',
                color: mode === m ? 'var(--dark)' : 'var(--gray)',
                boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition:'all 0.2s'
              }}>
              {m === 'connexion' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* TITRE */}
        <div style={{marginBottom:'40px'}}>
          <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
            <span style={{width:'24px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
            {mode === 'connexion' ? 'Bon retour' : 'Bienvenue'}
          </div>
          <h1 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'42px', fontWeight:300, color:'var(--dark)', lineHeight:1.1}}>
            {mode === 'connexion' ? 'Se connecter' : 'Créer un compte'}
          </h1>
          <p style={{fontSize:'14px', color:'var(--gray)', marginTop:'12px', lineHeight:1.7}}>
            {mode === 'connexion'
              ? 'Accédez à votre espace client Diodio Glow Skin.'
              : 'Rejoignez la famille Diodio Glow Skin.'}
          </p>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'20px', maxWidth:'400px'}}>
          {mode === 'inscription' && (
            <div>
              <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>Nom complet</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                placeholder="Votre nom"
                style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'var(--cream)', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px'}}
              />
            </div>
          )}

          <div>
            <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              placeholder="votre@email.com"
              style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'var(--cream)', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px'}}
            />
          </div>

          <div>
            <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              placeholder="••••••••"
              style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'var(--cream)', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px'}}
            />
          </div>

          {erreur && erreur !== 'success' && (
            <div style={{background:'#FFF5F5', borderLeft:'2px solid #E88', padding:'12px 16px'}}>
              <p style={{fontSize:'13px', color:'#C44'}}>{erreur}</p>
            </div>
          )}

          {erreur === 'success' && (
            <div style={{background:'var(--rose-pale)', borderLeft:'2px solid var(--rose)', padding:'12px 16px'}}>
              <p style={{fontSize:'13px', color:'var(--rose)'}}>✦ Compte créé ! Vérifiez votre email pour confirmer.</p>
            </div>
          )}

          <button type="submit" disabled={chargement}
            className="btn-primary"
            style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', marginTop:'8px', opacity: chargement ? 0.6 : 1}}>
            {chargement ? 'Chargement...' : mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

      </div>
    </main>
  );
}