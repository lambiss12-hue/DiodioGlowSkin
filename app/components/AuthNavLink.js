'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase-browser';

const IconeProfil = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="5" r="3" stroke="#6B6B6B" strokeWidth="1.2" fill="none"/>
    <path d="M2 14 C2 11 4.5 9 8 9 C11.5 9 14 11 14 14" stroke="#6B6B6B" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconeDeconnexion = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M8 17 L4.5 17 Q3 17 3 15.5 L3 4.5 Q3 3 4.5 3 L8 3" stroke="#C8748A" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
    <path d="M9 10 L17 10" stroke="#C8748A" strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M13.5 6.5 L17 10 L13.5 13.5" stroke="#C8748A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IconeModifier = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M11 2 L14 5 L5 14 L2 14 L2 11 Z" stroke="#C8748A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const COULEUR_STATUT = {
  'en_attente': '#F5A623',
  'confirmée': '#4CAF50',
  'expédiée': '#2196F3',
  'livrée': '#9C27B0',
  'annulée': '#F44336',
};

export default function AuthNavLink() {
  const [connecte, setConnecte] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [user, setUser] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [rdvs, setRdvs] = useState([]);
  const [chargementHistorique, setChargementHistorique] = useState(true);
  const [edition, setEdition] = useState(false);
  const [formEdit, setFormEdit] = useState({ nom: '', email: '' });
  const [chargementEdit, setChargementEdit] = useState(false);
  const [messageEdit, setMessageEdit] = useState(null);
  const wrapperRef = useRef(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setConnecte(!!user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setConnecte(!!session?.user);
      if (!session?.user) { setOuvert(false); setUser(null); }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOuvert(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function toggleDropdown() {
    if (ouvert) { setOuvert(false); return; }
    setOuvert(true);
    if (user) return;

    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    setUser(u);
    setFormEdit({ nom: u.user_metadata?.nom || '', email: u.email });

    const [{ data: cmd }, { data: rdv }] = await Promise.all([
      supabase.from('commandes').select('*').eq('email', u.email).order('created_at', { ascending: false }),
      supabase.from('rendezvous').select('*').eq('email', u.email).order('created_at', { ascending: false }),
    ]);
    setCommandes(cmd || []);
    setRdvs(rdv || []);
    setChargementHistorique(false);
  }

  async function handleDeconnexion() {
    await supabase.auth.signOut();
    setOuvert(false);
    router.push('/');
  }

  async function handleEnregistrerInfos() {
    setChargementEdit(true);
    setMessageEdit(null);

    const emailModifie = formEdit.email !== user?.email;
    const attributs = { data: { nom: formEdit.nom } };
    if (emailModifie) attributs.email = formEdit.email;

    const { data, error } = await supabase.auth.updateUser(attributs, {
      emailRedirectTo: `${window.location.origin}/`,
    });

    if (error) {
      setMessageEdit({ type: 'erreur', texte: error.message });
    } else {
      if (data?.user) setUser(data.user);
      setEdition(false);
      setMessageEdit(emailModifie
        ? { type: 'succes', texte: `Un email de confirmation a été envoyé à ${formEdit.email}.` }
        : { type: 'succes', texte: 'Vos informations ont été mises à jour.' }
      );
    }
    setChargementEdit(false);
  }

  function annulerEdition() {
    setFormEdit({ nom: user?.user_metadata?.nom || '', email: user?.email || '' });
    setEdition(false);
    setMessageEdit(null);
  }

  if (!connecte) {
    return (
      <Link href="/auth" style={{
        fontSize: '11px', fontWeight: 500, letterSpacing: '2px',
        textTransform: 'uppercase', color: 'var(--gray)',
        textDecoration: 'none', transition: 'color 0.3s',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <IconeProfil />
        Connexion
      </Link>
    );
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button onClick={toggleDropdown} aria-label="Mon compte" style={{
        display: 'flex', alignItems: 'center', background: 'none',
        border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: 0
      }}>
        <IconeProfil />
      </button>

      {ouvert && (
        <div className="profil-dropdown" style={{
          position: 'absolute', top: 'calc(100% + 18px)', right: 0,
          width: '340px', maxHeight: '75vh', overflowY: 'auto',
          background: 'white', border: '1px solid var(--gray-light)',
          boxShadow: '0 16px 48px rgba(28,28,30,0.14)',
          padding: '24px', zIndex: 200
        }}>
          {!user ? (
            <p style={{ fontSize: '13px', color: 'var(--gray)', textAlign: 'center', padding: '16px 0' }}>Chargement...</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--rose)', fontWeight: 500 }}>
                  Mon espace
                </span>
                <button onClick={handleDeconnexion} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  <IconeDeconnexion />
                  <span style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: '#C44' }}>Déconnexion</span>
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%', background: 'var(--rose)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: 'white'
                }}>
                  {(formEdit.nom || user.email)[0].toUpperCase()}
                </div>

                {edition ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <input
                      type="text"
                      value={formEdit.nom}
                      onChange={e => setFormEdit({ ...formEdit, nom: e.target.value })}
                      placeholder="Votre nom"
                      style={{ fontSize: '13px', padding: '7px 9px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px', color: 'var(--dark)' }}
                    />
                    <input
                      type="email"
                      value={formEdit.email}
                      onChange={e => setFormEdit({ ...formEdit, email: e.target.value })}
                      placeholder="votre@email.com"
                      style={{ fontSize: '12px', padding: '7px 9px', border: '1px solid var(--gray-light)', outline: 'none', fontFamily: 'DM Sans, sans-serif', borderRadius: '2px', color: 'var(--dark)' }}
                    />
                  </div>
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', color: 'var(--dark)' }}>
                      {user.user_metadata?.nom || 'Client'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.email}
                    </p>
                  </div>
                )}

                {!edition && (
                  <button onClick={() => { setEdition(true); setMessageEdit(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                    <IconeModifier />
                  </button>
                )}
              </div>

              {edition && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button onClick={handleEnregistrerInfos} disabled={chargementEdit} className="btn-primary"
                    style={{ border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: '8px 16px', fontSize: '11px', opacity: chargementEdit ? 0.6 : 1 }}>
                    {chargementEdit ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button onClick={annulerEdition} className="btn-secondary"
                    style={{ border: '1px solid var(--dark)', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: '8px 16px', fontSize: '11px' }}>
                    Annuler
                  </button>
                </div>
              )}

              {messageEdit && (
                <div style={{
                  background: messageEdit.type === 'erreur' ? '#FFF5F5' : 'var(--rose-pale)',
                  borderLeft: `2px solid ${messageEdit.type === 'erreur' ? '#E88' : 'var(--rose)'}`,
                  padding: '10px 12px', marginBottom: '16px'
                }}>
                  <p style={{ fontSize: '12px', color: messageEdit.type === 'erreur' ? '#C44' : 'var(--rose)' }}>{messageEdit.texte}</p>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--gray-light)', margin: '16px 0' }}></div>

              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: '10px' }}>
                Mes commandes
              </p>
              {chargementHistorique ? (
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Chargement...</p>
              ) : commandes.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Aucune commande pour l'instant.</p>
              ) : (
                <div>
                  {commandes.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-light)' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '2px' }}>
                          {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.livraison || c.adresse}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--dark)' }}>{c.total}</span>
                        <span style={{ fontSize: '10px', padding: '3px 8px', background: `${COULEUR_STATUT[c.statut] || 'var(--gray)'}15`, color: COULEUR_STATUT[c.statut] || 'var(--gray)', whiteSpace: 'nowrap' }}>
                          {c.statut}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--gray-light)', margin: '16px 0' }}></div>

              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--dark)', marginBottom: '10px' }}>
                Mes rendez-vous
              </p>
              {chargementHistorique ? (
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Chargement...</p>
              ) : rdvs.length === 0 ? (
                <p style={{ fontSize: '12px', color: 'var(--gray)' }}>Aucun rendez-vous pour l'instant.</p>
              ) : (
                <div>
                  {rdvs.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-light)' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '11px', color: 'var(--rose)', marginBottom: '2px' }}>{r.date} · {r.creneau}</p>
                        <p style={{ fontSize: '12px', color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.soin}</p>
                      </div>
                      <span style={{ fontSize: '10px', padding: '3px 8px', background: `${COULEUR_STATUT[r.statut] || 'var(--gray)'}15`, color: COULEUR_STATUT[r.statut] || 'var(--gray)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {r.statut || 'en_attente'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
