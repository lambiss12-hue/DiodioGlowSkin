'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { IconeSoin } from '../components/IconesSoins';

const creneaux = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function Rendezvous() {
  const [soins, setSoins] = useState([]);
  const [chargementSoins, setChargementSoins] = useState(true);
  const [etape, setEtape] = useState(1);
  const [soinsChoisis, setSoinsChoisis] = useState([]);
  const [dateChoisie, setDateChoisie] = useState('');
  const [creneauChoisi, setCreneauChoisi] = useState('');
  const [form, setForm] = useState({ nom: '', email: '', telephone: '' });
  const [confirme, setConfirme] = useState(false);
  const [chargementEnvoi, setChargementEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState('');
  const [soinDetails, setSoinDetails] = useState(null);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase
        .from('soins')
        .select('*')
        .eq('actif', true)
        .order('created_at', { ascending: true });
      setSoins(data || []);
      setChargementSoins(false);
    }
    charger();
  }, []);

  function toggleSoin(s) {
    setSoinsChoisis(prev =>
      prev.find(x => x.id === s.id)
        ? prev.filter(x => x.id !== s.id)
        : [...prev, s]
    );
  }

  function estChoisi(s) {
    return !!soinsChoisis.find(x => x.id === s.id);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleConfirmer(e) {
    e.preventDefault();
    setChargementEnvoi(true);
    setErreurEnvoi('');
    const { error } = await supabase.from('rendezvous').insert([{
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      soin: soinsChoisis.map(s => s.nom).join(' + '),
      date: dateChoisie,
      creneau: creneauChoisi,
      statut: 'en_attente',
    }]);

    if (error) {
      setErreurEnvoi("Une erreur est survenue, veuillez réessayer.");
    } else {
      setConfirme(true);
    }
    setChargementEnvoi(false);
  }

  function reset() {
    setConfirme(false);
    setEtape(1);
    setSoinsChoisis([]);
    setDateChoisie('');
    setCreneauChoisi('');
    setForm({ nom: '', email: '', telephone: '' });
  }

  if (confirme) {
    return (
      <main style={{background:'var(--cream)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', paddingTop:'80px'}}>
        <div style={{textAlign:'center', maxWidth:'480px'}}>
          <div style={{width:'80px', height:'80px', borderRadius:'50%', border:'1px solid var(--rose)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 32px'}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16 L13 23 L26 10" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'16px', fontWeight:500}}>
            ✦ Rendez-vous confirmé
          </div>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'44px', fontWeight:300, color:'var(--dark)', marginBottom:'16px'}}>
            À très bientôt !
          </h2>
          <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8, marginBottom:'8px'}}>
            <strong style={{color:'var(--dark)'}}>{soinsChoisis.map(s => s.nom).join(' + ')}</strong>
          </p>
          <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8, marginBottom:'32px'}}>
            Le <strong style={{color:'var(--dark)'}}>{dateChoisie}</strong> à <strong style={{color:'var(--dark)'}}>{creneauChoisi}</strong>
          </p>
          <p style={{fontSize:'13px', color:'var(--gray)', marginBottom:'48px'}}>
            Un email de confirmation sera envoyé à <strong style={{color:'var(--rose)'}}>{form.email}</strong>
          </p>
          <button onClick={reset} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
            Prendre un autre rendez-vous
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh', paddingTop:'120px'}}>

      {/* HEADER */}
      <div className="px-section" style={{padding:'40px 60px 32px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'11px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Institut de beauté
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300, color:'var(--dark)'}}>
          Prendre rendez-vous
        </h1>
      </div>

      {/* ÉTAPES */}
      <div className="px-section etapes-bar" style={{padding:'24px 60px', borderBottom:'1px solid var(--gray-light)', display:'flex', gap:'0'}}>
        {['Choisir les soins', 'Date & heure', 'Vos coordonnées'].map((label, i) => (
          <div key={i} style={{display:'flex', alignItems:'center', flex:1}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
              <div style={{
                width:'28px', height:'28px', borderRadius:'50%',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'12px', fontWeight:600, flexShrink:0,
                background: etape > i + 1 ? 'var(--rose)' : etape === i + 1 ? 'var(--dark)' : 'transparent',
                color: etape >= i + 1 ? 'white' : 'var(--gray)',
                border: etape <= i + 1 ? '1px solid var(--gray-light)' : 'none',
              }}>
                {etape > i + 1 ? '✓' : i + 1}
              </div>
              <span className="etape-label" style={{fontSize:'12px', letterSpacing:'1.5px', textTransform:'uppercase', color: etape === i + 1 ? 'var(--dark)' : 'var(--gray)', fontWeight: etape === i + 1 ? 500 : 400, whiteSpace:'nowrap'}}>
                {label}
              </span>
            </div>
            {i < 2 && <div style={{flex:1, height:'1px', background:'var(--gray-light)', margin:'0 20px'}}></div>}
          </div>
        ))}
      </div>

      <div className="px-section" style={{padding:'60px'}}>

        {/* ÉTAPE 1 — SOINS */}
        {etape === 1 && (
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'32px', fontWeight:300, color:'var(--dark)', marginBottom:'12px'}}>
              Quels soins souhaitez-vous ?
            </h2>
            <p style={{fontSize:'13px', color:'var(--gray)', marginBottom:'40px', letterSpacing:'0.5px'}}>
              Vous pouvez sélectionner plusieurs soins.
            </p>

            {chargementSoins ? (
              <p style={{fontSize:'14px', color:'var(--gray)', marginBottom:'32px'}}>Chargement des soins...</p>
            ) : soins.length === 0 ? (
              <p style={{fontSize:'14px', color:'var(--gray)', marginBottom:'32px'}}>Aucun soin disponible pour le moment.</p>
            ) : (
            <div className="grid-collapse-3" style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px', maxWidth:'800px', marginBottom:'32px'}}>
              {soins.map((s) => (
                <div key={s.id}
                  onClick={() => toggleSoin(s)}
                  style={{
                    background: estChoisi(s) ? 'var(--dark)' : 'white',
                    padding:'32px', cursor:'pointer',
                    border: estChoisi(s) ? '1px solid var(--dark)' : '1px solid var(--gray-light)',
                    transition:'all 0.35s ease',
                    position:'relative', overflow:'hidden'
                  }}
                  onMouseEnter={e => {
                    if (!estChoisi(s)) {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 20px 48px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = 'var(--rose)';
                      e.currentTarget.querySelector('.soin-icon').style.transform = 'scale(1.15) rotate(-5deg)';
                      e.currentTarget.querySelector('.soin-line').style.width = '40px';
                      e.currentTarget.querySelector('.soin-name').style.color = 'var(--rose)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!estChoisi(s)) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'var(--gray-light)';
                      e.currentTarget.querySelector('.soin-icon').style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.querySelector('.soin-line').style.width = '0px';
                      e.currentTarget.querySelector('.soin-name').style.color = 'var(--dark)';
                    }
                  }}
                >
                  {/* LIGNE DÉCORATIVE */}
                  <div className="soin-line" style={{position:'absolute', top:0, left:0, height:'2px', background:'var(--rose)', width:'0px', transition:'width 0.4s ease'}}></div>

                  {/* CHECKBOX */}
                  <div style={{
                    position:'absolute', top:'16px', right:'16px',
                    width:'20px', height:'20px', borderRadius:'50%',
                    border: estChoisi(s) ? 'none' : '1px solid var(--gray-light)',
                    background: estChoisi(s) ? 'var(--rose)' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    transition:'all 0.2s'
                  }}>
                    {estChoisi(s) && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  {/* ICÔNE */}
                  <div className="soin-icon" style={{marginBottom:'24px', transition:'transform 0.4s ease', display:'inline-block'}}>
                    <IconeSoin nom={s.emoji} size={40} />
                  </div>

                  {/* NOM */}
                  <h3 className="soin-name" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:300, color: estChoisi(s) ? 'white' : 'var(--dark)', marginBottom:'8px', transition:'color 0.3s ease'}}>
                    {s.nom}
                  </h3>

                  {/* DURÉE + PRIX */}
                  <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color: estChoisi(s) ? 'var(--rose-light)' : 'var(--rose)', marginBottom:'16px'}}>
                    {[s.duree, s.prix].filter(Boolean).join(' · ')}
                  </p>

                  {/* DESC */}
                  <p style={{fontSize:'13px', lineHeight:1.7, color: estChoisi(s) ? 'rgba(255,255,255,0.6)' : 'var(--gray)'}}>
                    {s.description}
                  </p>

                  {/* STATUT + DÉTAILS */}
                  <div style={{marginTop:'24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px'}}>
                    <span style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color: estChoisi(s) ? 'var(--rose-light)' : 'var(--rose)'}}>
                      {estChoisi(s) ? '✓ Sélectionné' : 'Choisir ce soin →'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSoinDetails(s); }}
                      style={{
                        background:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif',
                        fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase',
                        textDecoration:'underline', padding:0,
                        border:'none',
                        color: estChoisi(s) ? 'rgba(255,255,255,0.6)' : 'var(--gray)'
                      }}>
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* MODALE DÉTAILS */}
            {soinDetails && (
              <div onClick={() => setSoinDetails(null)} style={{position:'fixed', inset:0, background:'rgba(28,28,30,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
                <div onClick={(e) => e.stopPropagation()} style={{background:'white', width:'100%', maxWidth:'480px', maxHeight:'85vh', overflowY:'auto', padding:'40px', position:'relative'}}>
                  <button onClick={() => setSoinDetails(null)} style={{position:'absolute', top:'20px', right:'20px', background:'none', border:'none', cursor:'pointer', fontSize:'24px', color:'var(--gray)', lineHeight:1}}>×</button>

                  <div style={{marginBottom:'20px'}}>
                    <IconeSoin nom={soinDetails.emoji} size={40} />
                  </div>

                  <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'30px', fontWeight:300, color:'var(--dark)', marginBottom:'8px'}}>
                    {soinDetails.nom}
                  </h3>
                  <p style={{fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'24px'}}>
                    {[soinDetails.duree, soinDetails.prix].filter(Boolean).join(' · ')}
                  </p>

                  {soinDetails.description && (
                    <p style={{fontSize:'14px', lineHeight:1.8, color:'var(--gray)', marginBottom:'28px'}}>
                      {soinDetails.description}
                    </p>
                  )}

                  {soinDetails.bienfaits && (
                    <div style={{marginBottom:'24px'}}>
                      <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, color:'var(--dark)', marginBottom:'8px'}}>Bienfaits</p>
                      <p style={{fontSize:'14px', lineHeight:1.8, color:'var(--gray)'}}>{soinDetails.bienfaits}</p>
                    </div>
                  )}

                  {soinDetails.contre_indications && (
                    <div style={{background:'#FFF5F5', borderLeft:'2px solid #E88', padding:'14px 18px', marginBottom:'28px'}}>
                      <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, color:'#C44', marginBottom:'8px'}}>Contre-indications</p>
                      <p style={{fontSize:'14px', lineHeight:1.8, color:'#A33'}}>{soinDetails.contre_indications}</p>
                    </div>
                  )}

                  <button
                    onClick={() => { toggleSoin(soinDetails); setSoinDetails(null); }}
                    className="btn-primary"
                    style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', width:'100%'}}>
                    {estChoisi(soinDetails) ? 'Retirer ce soin' : 'Choisir ce soin'}
                  </button>
                </div>
              </div>
            )}

            {/* RÉCAP SÉLECTION */}
            {soinsChoisis.length > 0 && (
              <div style={{background:'white', borderLeft:'2px solid var(--rose)', padding:'14px 20px', marginBottom:'24px', display:'inline-flex', alignItems:'center', gap:'16px'}}>
                <span style={{fontSize:'13px', color:'var(--gray)'}}>
                  {soinsChoisis.length} soin{soinsChoisis.length > 1 ? 's' : ''} sélectionné{soinsChoisis.length > 1 ? 's' : ''} :
                </span>
                <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'16px', color:'var(--dark)'}}>
                  {soinsChoisis.map(s => s.nom).join(' + ')}
                </span>
              </div>
            )}

            <div>
              <button
                onClick={() => soinsChoisis.length > 0 && setEtape(2)}
                className="btn-primary"
                style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: soinsChoisis.length > 0 ? 1 : 0.5}}>
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 — DATE & HEURE */}
        {etape === 2 && (
          <div>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'32px', fontWeight:300, color:'var(--dark)', marginBottom:'40px'}}>
              Choisissez une date et un créneau
            </h2>

            {/* RÉCAP SOINS */}
            <div style={{background:'white', padding:'20px 24px', borderLeft:'2px solid var(--rose)', marginBottom:'40px', display:'inline-flex', alignItems:'center', gap:'16px'}}>
              <span style={{fontSize:'13px', color:'var(--gray)'}}>Soins sélectionnés :</span>
              <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'18px', color:'var(--dark)'}}>
                {soinsChoisis.map(s => s.nom).join(' + ')}
              </span>
              <span style={{fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)'}}>
                {soinsChoisis.map(s => s.duree).join(' · ')}
              </span>
            </div>

            <div className="grid-collapse-2" style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'60px', alignItems:'start', maxWidth:'700px'}}>
              <div>
                <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'16px', fontWeight:500}}>Date</label>
                <input
                  type="date"
                  value={dateChoisie}
                  onChange={(e) => setDateChoisie(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{padding:'14px 16px', border:'1px solid var(--gray-light)', background:'white', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px', width:'100%', maxWidth:'260px'}}
                />
              </div>
              <div>
                <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'16px', fontWeight:500}}>Créneau horaire</label>
                <div className="creneaux-grid" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px'}}>
                  {creneaux.map((c) => (
                    <button key={c}
                      onClick={() => setCreneauChoisi(c)}
                      style={{
                        padding:'12px', fontSize:'13px', fontWeight:500,
                        border: creneauChoisi === c ? '1px solid var(--dark)' : '1px solid var(--gray-light)',
                        background: creneauChoisi === c ? 'var(--dark)' : 'white',
                        color: creneauChoisi === c ? 'white' : 'var(--dark)',
                        cursor:'pointer', fontFamily:'DM Sans, sans-serif', transition:'all 0.2s'
                      }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:'flex', gap:'12px', marginTop:'48px'}}>
              <button onClick={() => setEtape(1)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>← Retour</button>
              <button
                onClick={() => dateChoisie && creneauChoisi && setEtape(3)}
                className="btn-primary"
                style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: dateChoisie && creneauChoisi ? 1 : 0.5}}>
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 — COORDONNÉES */}
        {etape === 3 && (
          <div style={{maxWidth:'500px'}}>
            <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'32px', fontWeight:300, color:'var(--dark)', marginBottom:'32px'}}>
              Vos coordonnées
            </h2>

            {/* RÉCAP */}
            <div style={{background:'white', padding:'20px 24px', borderLeft:'2px solid var(--rose)', marginBottom:'40px'}}>
              <p style={{fontSize:'13px', color:'var(--gray)', marginBottom:'4px'}}>
                <strong style={{color:'var(--dark)'}}>{soinsChoisis.map(s => s.nom).join(' + ')}</strong>
              </p>
              <p style={{fontSize:'13px', color:'var(--gray)'}}>
                Le {dateChoisie} à {creneauChoisi}
              </p>
            </div>

            <form onSubmit={handleConfirmer} style={{display:'flex', flexDirection:'column', gap:'20px'}}>
              {[
                {name:'nom', label:'Nom complet', type:'text', placeholder:'Votre nom'},
                {name:'email', label:'Email', type:'email', placeholder:'votre@email.com'},
                {name:'telephone', label:'Téléphone', type:'tel', placeholder:'+33 6 00 00 00 00'},
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
                    placeholder={field.placeholder}
                    required
                    style={{width:'100%', padding:'14px 16px', border:'1px solid var(--gray-light)', background:'white', fontSize:'14px', color:'var(--dark)', outline:'none', fontFamily:'DM Sans, sans-serif', borderRadius:'2px'}}
                  />
                </div>
              ))}

              {erreurEnvoi && (
                <p style={{fontSize:'13px', color:'#C44'}}>{erreurEnvoi}</p>
              )}

              <div style={{display:'flex', gap:'12px', marginTop:'12px'}}>
                <button type="button" onClick={() => setEtape(2)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>← Retour</button>
                <button type="submit" disabled={chargementEnvoi} className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: chargementEnvoi ? 0.6 : 1}}>
                  {chargementEnvoi ? 'Envoi...' : 'Confirmer le rendez-vous ✓'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}