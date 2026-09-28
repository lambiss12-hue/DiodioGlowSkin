'use client';
import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import { ICONES_SOINS, IconeSoin } from '../components/IconesSoins';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState('produits');
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function verifierAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }

      const { data: admin } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', user.id)
        .single();

      if (!admin) { router.push('/'); return; }
      setUser(user);
      setChargement(false);
    }
    verifierAdmin();
  }, []);

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  if (chargement) {
    return (
      <main style={{background:'var(--cream)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:300, color:'var(--gray)'}}>Chargement...</p>
      </main>
    );
  }

  return (
    <main className="grid-collapse-2" style={{background:'var(--cream)', minHeight:'100vh', paddingTop:'72px', display:'grid', gridTemplateColumns:'240px 1fr'}}>

      {/* SIDEBAR */}
      <div className="admin-sidebar" style={{background:'var(--dark)', padding:'40px 0', display:'flex', flexDirection:'column', minHeight:'calc(100vh - 72px)'}}>
        <div style={{padding:'0 24px 32px', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <p style={{fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'8px'}}>Administration</p>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'18px', fontWeight:300, color:'white'}}>Diodio Glow Skin</p>
        </div>

        <nav style={{padding:'24px 0', flex:1}}>
          {[
            {id:'produits', label:'Produits', icon:(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            )},
            {id:'commandes', label:'Commandes', icon:(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2H3.5L5.5 10H12.5L14.5 5H4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="6.5" cy="13" r="1" fill="currentColor"/>
                <circle cx="11.5" cy="13" r="1" fill="currentColor"/>
              </svg>
            )},
            {id:'rendezvous', label:'Rendez-vous', icon:(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5 2 L5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M11 2 L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M2 7 L14 7" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            )},
            {id:'soins', label:'Soins', icon:(
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M8 10 L8 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M5 12 L8 14 L11 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            )},
          ].map(item => (
            <button key={item.id}
              onClick={() => setOnglet(item.id)}
              style={{
                width:'100%', padding:'12px 24px',
                display:'flex', alignItems:'center', gap:'12px',
                background: onglet === item.id ? 'rgba(200,116,138,0.15)' : 'transparent',
                border:'none', cursor:'pointer',
                borderLeft: onglet === item.id ? '2px solid var(--rose)' : '2px solid transparent',
                color: onglet === item.id ? 'white' : 'rgba(255,255,255,0.4)',
                fontSize:'13px', fontFamily:'DM Sans, sans-serif',
                textAlign:'left', transition:'all 0.2s'
              }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{padding:'24px', borderTop:'1px solid rgba(255,255,255,0.05)'}}>
          <p style={{fontSize:'12px', color:'rgba(255,255,255,0.3)', marginBottom:'12px'}}>{user?.email}</p>
          <button onClick={handleDeconnexion}
            style={{background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', padding:'8px 16px', cursor:'pointer', fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', fontFamily:'DM Sans, sans-serif', width:'100%', transition:'all 0.2s'}}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div style={{padding:'48px', overflowY:'auto'}}>
        {onglet === 'produits' && <AdminProduits supabase={supabase} />}
        {onglet === 'commandes' && <AdminCommandes supabase={supabase} />}
        {onglet === 'rendezvous' && <AdminRendezvous supabase={supabase} />}
        {onglet === 'soins' && <AdminSoins supabase={supabase} />}
      </div>

    </main>
  );
}

/* ─── PRODUITS ─── */
function AdminProduits({ supabase }) {
  const [produits, setProduits] = useState([]);
  const [modal, setModal] = useState(false);
  const FORM_VIDE = { nom:'', prix:'', poids:'', categorie:'laits', description:'', ingredients:'', application:'', conseils:'', image_url:'', est_nouveaute:false, en_stock:true, en_promotion:false, prix_promo:'' };
  const [form, setForm] = useState(FORM_VIDE);
  const [editId, setEditId] = useState(null);
  const [chargement, setChargement] = useState(false);

  useEffect(() => { charger(); }, []);

  async function charger() {
    const { data } = await supabase.from('produits').select('*').order('created_at', { ascending: false });
    setProduits(data || []);
  }

  function ouvrirModal(produit = null) {
    if (produit) {
      const sansNull = Object.fromEntries(Object.entries(produit).map(([k, v]) => [k, v ?? '']));
      setForm({ ...FORM_VIDE, ...sansNull });
      setEditId(produit.id);
    } else {
      setForm(FORM_VIDE);
      setEditId(null);
    }
    setModal(true);
  }

  async function handleSauvegarder() {
    setChargement(true);
    const { id, created_at, ...donnees } = form;
    const { error } = editId
      ? await supabase.from('produits').update(donnees).eq('id', editId)
      : await supabase.from('produits').insert([donnees]);

    if (error) {
      console.error('Erreur sauvegarde produit:', error);
      alert(`Erreur lors de l'enregistrement : ${error.message}`);
      setChargement(false);
      return;
    }

    await charger();
    setModal(false);
    setChargement(false);
  }

  async function handleSupprimer(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    const { error } = await supabase.from('produits').delete().eq('id', id);
    if (error) { console.error('Erreur suppression produit:', error); alert(`Erreur : ${error.message}`); return; }
    await charger();
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px'}}>
        <div>
          <p style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'8px'}}>Gestion</p>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)'}}>Produits</h2>
        </div>
        <button onClick={() => ouvrirModal()} className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
          + Ajouter un produit
        </button>
      </div>

      {/* STATS */}
      <div className="grid-collapse-4" style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'40px'}}>
        {[
          {label:'Total produits', valeur: produits.length},
          {label:'En stock', valeur: produits.filter(p => p.en_stock).length},
          {label:'Nouveautés', valeur: produits.filter(p => p.est_nouveaute).length},
          {label:'En promotion', valeur: produits.filter(p => p.en_promotion).length},
        ].map(s => (
          <div key={s.label} style={{background:'white', padding:'24px', borderLeft:'2px solid var(--rose)'}}>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)'}}>{s.valeur}</p>
            <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)', marginTop:'4px'}}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* TABLEAU */}
      <div style={{background:'white'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'}}>
          <span>Produit</span>
          <span>Prix</span>
          <span>Catégorie</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>
        {produits.map(p => (
          <div key={p.id} style={{display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
              <div style={{width:'48px', height:'48px', background:'linear-gradient(135deg,#FDF4F6,#F0D6DC)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.nom} style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                ) : (
                  <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'20px', color:'var(--rose)', opacity:0.4}}>{p.nom.charAt(0)}</span>
                )}
              </div>
              <div>
                <p style={{fontSize:'14px', fontWeight:500, color:'var(--dark)'}}>{p.nom}</p>
                <p style={{fontSize:'12px', color:'var(--gray)'}}>{p.poids}</p>
              </div>
            </div>
            <span style={{fontSize:'14px', color:'var(--dark)', fontWeight:500}}>
              {p.en_promotion && p.prix_promo ? (
                <>
                  <span style={{textDecoration:'line-through', color:'var(--gray)', fontWeight:400, marginRight:'6px'}}>{p.prix}</span>
                  <span style={{color:'var(--rose)'}}>{p.prix_promo}</span>
                </>
              ) : p.prix}
            </span>
            <span style={{fontSize:'11px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', background:'var(--rose-pale)', padding:'4px 10px'}}>{p.categorie}</span>
            <span style={{fontSize:'11px', color: p.en_stock ? '#4CAF50' : 'var(--gray)'}}>
              {p.en_stock ? '● En stock' : '○ Épuisé'}
            </span>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={() => ouvrirModal(p)} style={{background:'none', border:'1px solid var(--gray-light)', padding:'6px 14px', cursor:'pointer', fontSize:'11px', color:'var(--dark)', fontFamily:'DM Sans, sans-serif'}}>
                Modifier
              </button>
              <button onClick={() => handleSupprimer(p.id)} style={{background:'none', border:'1px solid #FFE0E0', padding:'6px 14px', cursor:'pointer', fontSize:'11px', color:'#C44', fontFamily:'DM Sans, sans-serif'}}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
          <div style={{background:'white', width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', padding:'40px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300}}>{editId ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={() => setModal(false)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'24px', color:'var(--gray)'}}>×</button>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {[
                {name:'nom', label:'Nom', placeholder:'Nom du produit'},
                {name:'prix', label:'Prix', placeholder:'12€'},
                {name:'poids', label:'Poids / Contenance', placeholder:'250ml'},
                {name:'image_url', label:'URL Image (Cloudinary)', placeholder:'https://res.cloudinary.com/...'},
                {name:'description', label:'Description', placeholder:'Description...', textarea:true},
                {name:'ingredients', label:'Ingrédients', placeholder:'Ingrédients...', textarea:true},
                {name:'application', label:"Mode d'application", placeholder:'Application...', textarea:true},
                {name:'conseils', label:'Conseils', placeholder:'Conseils...', textarea:true},
              ].map(field => (
                <div key={field.name}>
                  <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'6px', fontWeight:500}}>{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      value={form[field.name]}
                      onChange={e => setForm({...form, [field.name]: e.target.value})}
                      placeholder={field.placeholder}
                      rows={3}
                      style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none', resize:'vertical'}}
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field.name]}
                      onChange={e => setForm({...form, [field.name]: e.target.value})}
                      placeholder={field.placeholder}
                      style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none'}}
                    />
                  )}
                </div>
              ))}

              {/* CATÉGORIE */}
              <div>
                <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'6px', fontWeight:500}}>Catégorie</label>
                <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
                  style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none', background:'white'}}>
                  {['laits','savons','parfums','gammes'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* PRIX PROMO */}
              {form.en_promotion && (
                <div>
                  <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'6px', fontWeight:500}}>Prix promo</label>
                  <input
                    type="text"
                    value={form.prix_promo}
                    onChange={e => setForm({...form, prix_promo: e.target.value})}
                    placeholder="9 000 FCFA"
                    style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none'}}
                  />
                </div>
              )}

              {/* TOGGLES */}
              <div style={{display:'flex', gap:'24px', flexWrap:'wrap'}}>
                {[
                  {key:'est_nouveaute', label:'Nouveauté'},
                  {key:'en_stock', label:'En stock'},
                  {key:'en_promotion', label:'En promotion'},
                ].map(t => (
                  <label key={t.key} style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
                    <div
                      onClick={() => setForm({...form, [t.key]: !form[t.key]})}
                      style={{
                        width:'40px', height:'22px', borderRadius:'11px',
                        background: form[t.key] ? 'var(--rose)' : 'var(--gray-light)',
                        position:'relative', cursor:'pointer', transition:'background 0.2s'
                      }}>
                      <div style={{
                        position:'absolute', top:'3px',
                        left: form[t.key] ? '21px' : '3px',
                        width:'16px', height:'16px', borderRadius:'50%',
                        background:'white', transition:'left 0.2s',
                        boxShadow:'0 1px 4px rgba(0,0,0,0.15)'
                      }}></div>
                    </div>
                    <span style={{fontSize:'13px', color:'var(--dark)'}}>{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{display:'flex', gap:'12px', marginTop:'32px'}}>
              <button onClick={() => setModal(false)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
                Annuler
              </button>
              <button onClick={handleSauvegarder} disabled={chargement} className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: chargement ? 0.6 : 1}}>
                {chargement ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── COMMANDES ─── */
function AdminCommandes({ supabase }) {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.from('commandes').select('*').order('created_at', { ascending: false });
      setCommandes(data || []);
    }
    charger();
  }, []);

  async function changerStatut(id, statut) {
    await supabase.from('commandes').update({ statut }).eq('id', id);
    setCommandes(prev => prev.map(c => c.id === id ? {...c, statut} : c));
  }

  const couleurStatut = {
    'en_attente': '#F5A623',
    'confirmée': '#4CAF50',
    'expédiée': '#2196F3',
    'livrée': '#9C27B0',
    'annulée': '#F44336',
  };

  return (
    <div>
      <div style={{marginBottom:'40px'}}>
        <p style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'8px'}}>Gestion</p>
        <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)'}}>Commandes</h2>
      </div>

      {/* STATS */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'40px'}}>
        {[
          {label:'Total', valeur: commandes.length, color:'var(--dark)'},
          {label:'En attente', valeur: commandes.filter(c => c.statut === 'en_attente').length, color:'#F5A623'},
          {label:'Confirmées', valeur: commandes.filter(c => c.statut === 'confirmée').length, color:'#4CAF50'},
          {label:'Livrées', valeur: commandes.filter(c => c.statut === 'livrée').length, color:'#9C27B0'},
        ].map(s => (
          <div key={s.label} style={{background:'white', padding:'20px', borderLeft:`2px solid ${s.color}`}}>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'32px', fontWeight:300, color:s.color}}>{s.valeur}</p>
            <p style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)', marginTop:'4px'}}>{s.label}</p>
          </div>
        ))}
      </div>

      {commandes.length === 0 ? (
        <div style={{background:'white', padding:'60px', textAlign:'center'}}>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:300, color:'var(--gray)'}}>Aucune commande pour l'instant</p>
        </div>
      ) : (
        <div style={{background:'white'}}>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'}}>
            <span>Date</span><span>Client</span><span>Total</span><span>Statut</span><span>Action</span>
          </div>
          {commandes.map(c => (
            <div key={c.id} style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', alignItems:'center'}}>
              <span style={{fontSize:'12px', color:'var(--gray)', whiteSpace:'nowrap'}}>
                {new Date(c.created_at).toLocaleDateString('fr-FR')}
              </span>
              <div>
                <p style={{fontSize:'14px', fontWeight:500, color:'var(--dark)'}}>{c.nom}</p>
                <p style={{fontSize:'12px', color:'var(--gray)'}}>{c.email}</p>
              </div>
              <span style={{fontSize:'14px', fontWeight:500, color:'var(--dark)', whiteSpace:'nowrap'}}>{c.total}</span>
              <span style={{fontSize:'11px', padding:'4px 10px', background: `${couleurStatut[c.statut]}15`, color: couleurStatut[c.statut], whiteSpace:'nowrap'}}>
                {c.statut}
              </span>
              <select
                value={c.statut}
                onChange={e => changerStatut(c.id, e.target.value)}
                style={{padding:'6px 10px', border:'1px solid var(--gray-light)', fontSize:'11px', fontFamily:'DM Sans, sans-serif', outline:'none', background:'white', cursor:'pointer'}}>
                {['en_attente','confirmée','expédiée','livrée','annulée'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── RENDEZ-VOUS ─── */
function AdminRendezvous({ supabase }) {
  const [rdvs, setRdvs] = useState([]);

  useEffect(() => {
    async function charger() {
      const { data } = await supabase.from('rendezvous').select('*').order('created_at', { ascending: false });
      setRdvs(data || []);
    }
    charger();
  }, []);

  return (
    <div>
      <div style={{marginBottom:'40px'}}>
        <p style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'8px'}}>Gestion</p>
        <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)'}}>Rendez-vous</h2>
      </div>

      {rdvs.length === 0 ? (
        <div style={{background:'white', padding:'60px', textAlign:'center'}}>
          <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:300, color:'var(--gray)'}}>Aucun rendez-vous pour l'instant</p>
        </div>
      ) : (
        <div style={{background:'white'}}>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'}}>
            <span>Date</span><span>Client</span><span>Soin</span><span>Créneau</span>
          </div>
          {rdvs.map(r => (
            <div key={r.id} style={{display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', alignItems:'center'}}>
              <span style={{fontSize:'12px', color:'var(--gray)', whiteSpace:'nowrap'}}>
                {new Date(r.created_at).toLocaleDateString('fr-FR')}
              </span>
              <div>
                <p style={{fontSize:'14px', fontWeight:500, color:'var(--dark)'}}>{r.nom}</p>
                <p style={{fontSize:'12px', color:'var(--gray)'}}>{r.email}</p>
              </div>
              <span style={{fontSize:'12px', color:'var(--rose)', background:'var(--rose-pale)', padding:'4px 10px'}}>{r.soin}</span>
              <span style={{fontSize:'13px', fontWeight:500, color:'var(--dark)'}}>{r.date} · {r.creneau}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── SOINS ─── */
function AdminSoins({ supabase }) {
  const [soins, setSoins] = useState([]);
  const [modal, setModal] = useState(false);
  const FORM_VIDE = { nom:'', duree:'', prix:'', description:'', bienfaits:'', contre_indications:'', emoji:'soin', actif:true };
  const [form, setForm] = useState(FORM_VIDE);
  const [editId, setEditId] = useState(null);
  const [chargement, setChargement] = useState(false);

  useEffect(() => { charger(); }, []);

  async function charger() {
    const { data } = await supabase.from('soins').select('*').order('created_at', { ascending: true });
    setSoins(data || []);
  }

  function ouvrirModal(soin = null) {
    if (soin) {
      const soinSansNull = Object.fromEntries(Object.entries(soin).map(([k, v]) => [k, v ?? '']));
      setForm({ ...FORM_VIDE, ...soinSansNull, actif: soin.actif });
      setEditId(soin.id);
    } else {
      setForm(FORM_VIDE);
      setEditId(null);
    }
    setModal(true);
  }

  async function handleSauvegarder() {
    setChargement(true);
    const { id, created_at, ...donnees } = form;
    const { error } = editId
      ? await supabase.from('soins').update(donnees).eq('id', editId)
      : await supabase.from('soins').insert([donnees]);

    if (error) {
      console.error('Erreur sauvegarde soin:', error);
      alert(`Erreur lors de l'enregistrement : ${error.message}`);
      setChargement(false);
      return;
    }

    await charger();
    setModal(false);
    setChargement(false);
  }

  async function handleSupprimer(id) {
    if (!confirm('Supprimer ce soin ?')) return;
    const { error } = await supabase.from('soins').delete().eq('id', id);
    if (error) { console.error('Erreur suppression soin:', error); alert(`Erreur : ${error.message}`); return; }
    await charger();
  }

  return (
    <div>
      {/* HEADER */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'40px'}}>
        <div>
          <p style={{fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'8px'}}>Gestion</p>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'36px', fontWeight:300, color:'var(--dark)'}}>Soins</h2>
        </div>
        <button onClick={() => ouvrirModal()} className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
          + Ajouter un soin
        </button>
      </div>

      {/* TABLEAU */}
      <div style={{background:'white'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)'}}>
          <span>Soin</span>
          <span>Durée</span>
          <span>Prix</span>
          <span>Statut</span>
          <span>Actions</span>
        </div>
        {soins.map(s => (
          <div key={s.id} style={{display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'16px', padding:'16px 24px', borderBottom:'1px solid var(--gray-light)', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
              <div style={{width:'48px', height:'48px', background:'linear-gradient(135deg,#FDF4F6,#F0D6DC)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <IconeSoin nom={s.emoji} size={24} />
              </div>
              <div>
                <p style={{fontSize:'14px', fontWeight:500, color:'var(--dark)'}}>{s.nom}</p>
                <p style={{fontSize:'12px', color:'var(--gray)'}}>{s.description}</p>
              </div>
            </div>
            <span style={{fontSize:'13px', color:'var(--dark)'}}>{s.duree}</span>
            <span style={{fontSize:'13px', color:'var(--dark)', fontWeight:500}}>{s.prix || '—'}</span>
            <span style={{fontSize:'11px', color: s.actif ? '#4CAF50' : 'var(--gray)'}}>
              {s.actif ? '● Actif' : '○ Masqué'}
            </span>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={() => ouvrirModal(s)} style={{background:'none', border:'1px solid var(--gray-light)', padding:'6px 14px', cursor:'pointer', fontSize:'11px', color:'var(--dark)', fontFamily:'DM Sans, sans-serif'}}>
                Modifier
              </button>
              <button onClick={() => handleSupprimer(s.id)} style={{background:'none', border:'1px solid #FFE0E0', padding:'6px 14px', cursor:'pointer', fontSize:'11px', color:'#C44', fontFamily:'DM Sans, sans-serif'}}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {soins.length === 0 && (
          <div style={{padding:'60px', textAlign:'center'}}>
            <p style={{fontFamily:'Cormorant Garamond, serif', fontSize:'24px', fontWeight:300, color:'var(--gray)'}}>Aucun soin pour l'instant</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
          <div style={{background:'white', width:'100%', maxWidth:'500px', maxHeight:'90vh', overflowY:'auto', padding:'40px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px'}}>
              <h3 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:300}}>{editId ? 'Modifier le soin' : 'Nouveau soin'}</h3>
              <button onClick={() => setModal(false)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'24px', color:'var(--gray)'}}>×</button>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              {[
                {name:'nom', label:'Nom', placeholder:'Soin du visage'},
                {name:'duree', label:'Durée', placeholder:'60 min'},
                {name:'prix', label:'Prix', placeholder:'15 000 FCFA'},
                {name:'description', label:'Description', placeholder:'Description...', textarea:true},
                {name:'bienfaits', label:'Bienfaits', placeholder:'Hydrate en profondeur, apaise les rougeurs...', textarea:true},
                {name:'contre_indications', label:'Contre-indications', placeholder:'Grossesse, peau lésée, allergie connue...', textarea:true},
              ].map(field => (
                <div key={field.name}>
                  <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'6px', fontWeight:500}}>{field.label}</label>
                  {field.textarea ? (
                    <textarea
                      value={form[field.name]}
                      onChange={e => setForm({...form, [field.name]: e.target.value})}
                      placeholder={field.placeholder}
                      rows={3}
                      style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none', resize:'vertical'}}
                    />
                  ) : (
                    <input
                      type="text"
                      value={form[field.name]}
                      onChange={e => setForm({...form, [field.name]: e.target.value})}
                      placeholder={field.placeholder}
                      style={{width:'100%', padding:'12px', border:'1px solid var(--gray-light)', fontSize:'13px', fontFamily:'DM Sans, sans-serif', outline:'none'}}
                    />
                  )}
                </div>
              ))}

              {/* SÉLECTEUR D'ICÔNE */}
              <div>
                <label style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'10px', fontWeight:500}}>Icône</label>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'8px'}}>
                  {ICONES_SOINS.map(({ cle, label, Icone }) => (
                    <button
                      key={cle}
                      type="button"
                      onClick={() => setForm({ ...form, emoji: cle })}
                      title={label}
                      style={{
                        display:'flex', flexDirection:'column', alignItems:'center', gap:'6px',
                        padding:'12px 6px', cursor:'pointer',
                        background: form.emoji === cle ? 'var(--rose-pale)' : 'white',
                        border: form.emoji === cle ? '1px solid var(--rose)' : '1px solid var(--gray-light)',
                      }}>
                      <Icone size={22} />
                      <span style={{fontSize:'9px', letterSpacing:'0.5px', textTransform:'uppercase', color:'var(--gray)', textAlign:'center'}}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TOGGLE ACTIF */}
              <label style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
                <div
                  onClick={() => setForm({...form, actif: !form.actif})}
                  style={{
                    width:'40px', height:'22px', borderRadius:'11px',
                    background: form.actif ? 'var(--rose)' : 'var(--gray-light)',
                    position:'relative', cursor:'pointer', transition:'background 0.2s'
                  }}>
                  <div style={{
                    position:'absolute', top:'3px',
                    left: form.actif ? '21px' : '3px',
                    width:'16px', height:'16px', borderRadius:'50%',
                    background:'white', transition:'left 0.2s',
                    boxShadow:'0 1px 4px rgba(0,0,0,0.15)'
                  }}></div>
                </div>
                <span style={{fontSize:'13px', color:'var(--dark)'}}>Visible sur le site</span>
              </label>
            </div>

            <div style={{display:'flex', gap:'12px', marginTop:'32px'}}>
              <button onClick={() => setModal(false)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
                Annuler
              </button>
              <button onClick={handleSauvegarder} disabled={chargement} className="btn-primary" style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: chargement ? 0.6 : 1}}>
                {chargement ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}