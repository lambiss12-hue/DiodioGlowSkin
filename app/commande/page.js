'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { usePanier } from '../context/PanierContext';
import { supabase } from '../lib/supabase';
import { createClient } from '../lib/supabase-browser';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CODES_PAYS = [
  'SN','CI','ML','MR','GN','GW','GM','BF','TG','BJ','NE','CV','LR','SL','GH','NG','CM','GA','CG','CD','TD',
  'FR','BE','CH','LU','MC','DE','ES','IT','PT','GB','NL','IE','SE','NO','DK','FI','PL','AT','GR','TR',
  'MA','DZ','TN','EG','LY',
  'US','CA','BR','MX',
  'CN','JP','KR','IN','AE','SA','QA',
  'AF','AL','DZ','AS','AD','AO','AI','AQ','AG','AR','AM','AW','AU','AZ',
  'BS','BH','BD','BB','BY','BZ','BM','BT','BO','BA','BW','BN','BG','BI',
  'KH','KY','CF','CL','CO','KM','CK','CR','HR','CU','CY','CZ',
  'DJ','DM','DO',
  'EC','SV','GQ','ER','EE','ET',
  'FJ','FO','FM',
  'GE','GL','GD','GP','GU','GT','GY',
  'HT','HN','HK','HU',
  'IS','ID','IR','IQ','IL',
  'JM','JO',
  'KZ','KE','KI','KW','KG',
  'LA','LV','LB','LS','LI','LT',
  'MO','MK','MG','MW','MY','MV','MT','MH','MQ','MU','YT','MD','MN','ME','MS','MZ','MM',
  'NA','NR','NP','NC','NZ','NI',
  'OM',
  'PK','PW','PS','PA','PG','PY','PE','PH','PN','PR',
  'RE','RO','RU','RW',
  'KN','LC','VC','WS','SM','ST','RS','SC','SG','SK','SI','SB','SO','ZA','SS','LK','SD','SR','SZ',
  'TW','TJ','TZ','TH','TL','TO','TT','TM','TV',
  'UG','UA','UY','UZ',
  'VU','VA','VE','VN',
  'YE',
  'ZM','ZW',
];

function nomsPays() {
  try {
    const dn = new Intl.DisplayNames(['fr'], { type: 'region' });
    const noms = [...new Set(CODES_PAYS)]
      .map(code => dn.of(code))
      .filter(Boolean);
    return [...new Set(noms)].sort((a, b) => a.localeCompare(b, 'fr'));
  } catch {
    return ['Sénégal', 'France'];
  }
}

function normaliser(texte) {
  return texte
    .normalize('NFD')
    .split('')
    .map(car => {
      const code = car.codePointAt(0);
      if (code >= 0x0300 && code <= 0x036f) return '';
      const estLettreOuChiffre = (code >= 48 && code <= 57) || (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
      return estLettreOuChiffre ? car : ' ';
    })
    .join('')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function paysDepuisLocale() {
  try {
    const locale = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    const code = locale.split('-')[1]?.toUpperCase();
    if (!code) return null;
    const dn = new Intl.DisplayNames(['fr'], { type: 'region' });
    const nom = dn.of(code);
    return nom && nom !== code ? nom : null;
  } catch {
    return null;
  }
}

const FORMAT_PAR_DEFAUT = [2, 2, 2, 2, 2];

const INDICATIFS = [
  { pays: 'Sénégal', iso: 'SN', code: '221', prefixes: ['70', '75', '76', '77', '78'], format: [2, 3, 2, 2] },
  { pays: "Côte d'Ivoire", iso: 'CI', code: '225', prefixes: ['01', '05', '07'], format: [2, 2, 2, 2, 2] },
  { pays: 'Mali', iso: 'ML', code: '223', prefixes: ['6', '7', '9'], format: [2, 2, 2, 2] },
  { pays: 'Mauritanie', iso: 'MR', code: '222', prefixes: ['2', '3', '4'], format: [2, 2, 2, 2] },
  { pays: 'Guinée', iso: 'GN', code: '224', prefixes: ['6'], format: [3, 2, 2, 2] },
  { pays: 'Gambie', iso: 'GM', code: '220', prefixes: ['2', '3', '6', '7', '9'], format: [3, 4] },
  { pays: 'Guinée-Bissau', iso: 'GW', code: '245', prefixes: ['95', '96', '97'], format: [3, 4] },
  { pays: 'Burkina Faso', iso: 'BF', code: '226', prefixes: ['5', '6', '7'], format: [2, 2, 2, 2] },
  { pays: 'Togo', iso: 'TG', code: '228', prefixes: ['7', '9'], format: [2, 2, 2, 2] },
  { pays: 'Bénin', iso: 'BJ', code: '229', prefixes: ['4', '5', '6', '9'], format: [2, 2, 2, 2] },
  { pays: 'Niger', iso: 'NE', code: '227', prefixes: ['8', '9'], format: [2, 2, 2, 2] },
  { pays: 'Cap-Vert', iso: 'CV', code: '238', prefixes: ['5', '9'], format: [3, 2, 2] },
  { pays: 'Ghana', iso: 'GH', code: '233', prefixes: ['2', '5'], format: [2, 3, 4] },
  { pays: 'Nigéria', iso: 'NG', code: '234', prefixes: ['70', '80', '81', '90', '91'], format: [3, 3, 4] },
  { pays: 'Cameroun', iso: 'CM', code: '237', prefixes: ['6'], format: [1, 2, 2, 2, 2] },
  { pays: 'France', iso: 'FR', code: '33', prefixes: ['06', '07'], format: [2, 2, 2, 2, 2] },
  { pays: 'Belgique', iso: 'BE', code: '32', prefixes: ['04', '46', '47', '48', '49'], format: [2, 2, 2, 2] },
  { pays: 'Suisse', iso: 'CH', code: '41', prefixes: ['07'], format: [2, 3, 2, 2] },
  { pays: 'Maroc', iso: 'MA', code: '212', prefixes: [], format: [2, 2, 2, 2] },
  { pays: 'Algérie', iso: 'DZ', code: '213', prefixes: [], format: [2, 2, 2, 2] },
  { pays: 'Tunisie', iso: 'TN', code: '216', prefixes: ['9'], format: [2, 3, 3] },
  { pays: 'Espagne', iso: 'ES', code: '34', prefixes: ['6', '7'], format: [3, 3, 3] },
  { pays: 'Italie', iso: 'IT', code: '39', prefixes: ['3'], format: [3, 3, 4] },
  { pays: 'États-Unis', iso: 'US', code: '1', prefixes: [], format: [3, 3, 4] },
];

function detecterIndicatif(valeur) {
  const brut = (valeur || '').replace(/[^0-9+]/g, '');
  if (!brut) return null;

  if (brut.startsWith('+') || brut.startsWith('00')) {
    const chiffres = brut.startsWith('+') ? brut.slice(1) : brut.slice(2);
    for (const longueur of [3, 2, 1]) {
      const trouve = INDICATIFS.find(i => i.code === chiffres.slice(0, longueur));
      if (trouve) return trouve;
    }
    return null;
  }

  for (const longueur of [2, 1]) {
    const debut = brut.slice(0, longueur);
    const trouve = INDICATIFS.find(i => i.prefixes.includes(debut));
    if (trouve) return trouve;
  }
  return null;
}

function formaterNumero(brut, pattern) {
  const avecPlus = brut.trimStart().startsWith('+');
  if (avecPlus) return brut.replace(/[^0-9+ ]/g, '');

  const chiffres = brut.replace(/[^0-9]/g, '');
  if (!chiffres) return '';

  const groupes = [];
  let i = 0;
  for (const taille of pattern) {
    if (i >= chiffres.length) break;
    groupes.push(chiffres.slice(i, i + taille));
    i += taille;
  }
  if (i < chiffres.length) groupes.push(chiffres.slice(i));

  return groupes.join(' ');
}

function ChampTelephone({ name, label, value, onChange, placeholder }) {
  const indicatif = detecterIndicatif(value);
  const pattern = indicatif?.format || FORMAT_PAR_DEFAUT;

  function handleInputChange(e) {
    const formate = formaterNumero(e.target.value, pattern);
    onChange({ target: { name, value: formate } });
  }

  return (
    <div>
      <label style={{display:'block', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
        {label}
      </label>
      <div style={{display:'flex', alignItems:'stretch', border:'1px solid var(--gray-light)', background:'white', borderRadius:'2px'}}>
        <div style={{
          display:'flex', alignItems:'center', gap:'8px', padding:'0 12px',
          borderRight:'1px solid var(--gray-light)',
          fontSize:'14px', color: indicatif ? 'var(--dark)' : 'var(--gray)', whiteSpace:'nowrap'
        }}>
          {indicatif ? (
            <img
              src={`https://flagcdn.com/24x18/${indicatif.iso.toLowerCase()}.png`}
              width={20} height={15}
              alt={indicatif.pays}
              style={{borderRadius:'2px', display:'block', objectFit:'cover'}}
            />
          ) : (
            <span style={{width:'20px', height:'15px', display:'block', background:'var(--gray-light)', borderRadius:'2px'}}></span>
          )}
          <span>{indicatif ? `+${indicatif.code}` : '+…'}</span>
        </div>
        <input
          type="tel"
          name={name}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{
            flex:1, minWidth:0, padding:'16px 18px', border:'none', outline:'none',
            fontSize:'15px', color:'var(--dark)', fontFamily:'DM Sans, sans-serif', background:'transparent'
          }}
        />
      </div>
    </div>
  );
}

const ZONES_LIVRAISON = [
  { id: 'senegal', label: 'Sénégal (Dakar et régions)', prix: 2.90 },
  { id: 'afrique', label: 'Afrique de l\'Ouest', prix: 9.90 },
  { id: 'international', label: 'Europe / International', prix: 19.90 },
];

const NOMS_AFRIQUE_OUEST = [
  "Côte d'Ivoire", 'Mali', 'Mauritanie', 'Guinée', 'Gambie', 'Guinée-Bissau',
  'Burkina Faso', 'Togo', 'Bénin', 'Niger', 'Cap-Vert', 'Ghana', 'Nigéria', 'Cameroun',
];

function zoneDepuisPays(paysTexte) {
  const p = normaliser(paysTexte || '');
  if (!p) return null;
  if (p === normaliser('Sénégal')) return ZONES_LIVRAISON.find(z => z.id === 'senegal');
  if (NOMS_AFRIQUE_OUEST.some(n => normaliser(n) === p)) return ZONES_LIVRAISON.find(z => z.id === 'afrique');
  return ZONES_LIVRAISON.find(z => z.id === 'international');
}

const HORAIRES_BOUTIQUE = [
  { jour: 'Lundi – Vendredi', heure: '9h – 19h' },
  { jour: 'Samedi', heure: '10h – 18h' },
  { jour: 'Dimanche', heure: 'Fermé' },
];

const MODES_PAIEMENT = [
  { id: 'carte', label: 'Carte bancaire', desc: 'Visa, Mastercard — via Stripe', icon: '💳' },
  { id: 'wave', label: 'Wave', desc: 'Paiement mobile Wave', icon: '〰️' },
  { id: 'orange', label: 'Orange Money', desc: 'Paiement mobile Orange Money', icon: '🟠' },
];

export default function Commande() {
  const { panier, viderPanier } = usePanier();
  const router = useRouter();
  const [etape, setEtape] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '', whatsapp: '',
    adresse: '', ville: '', pays: 'Sénégal',
  });
  const [modeRecuperation, setModeRecuperation] = useState('livraison');
  const [modePaiement, setModePaiement] = useState('');
  const [paysOuvert, setPaysOuvert] = useState(false);
  const paysRef = useRef(null);
  const listePays = useMemo(() => nomsPays(), []);

  useEffect(() => {
    const paysDetecte = paysDepuisLocale();
    if (paysDetecte) {
      setForm(f => ({ ...f, pays: paysDetecte }));
    }
  }, []);

  useEffect(() => {
    async function preremplirDepuisCompte() {
      const supabaseAuth = createClient();
      const { data: { user } } = await supabaseAuth.auth.getUser();
      if (!user) return;

      setForm(f => ({
        ...f,
        nom: f.nom || user.user_metadata?.nom || '',
        email: f.email || user.email || '',
      }));

      const { data: derniereCommande } = await supabase
        .from('commandes')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (derniereCommande) {
        setForm(f => ({
          ...f,
          telephone: f.telephone || derniereCommande.telephone || '',
          whatsapp: f.whatsapp || derniereCommande.whatsapp || '',
          adresse: f.adresse || derniereCommande.adresse?.split(',')[0]?.trim() || '',
          ville: f.ville || derniereCommande.ville || '',
          pays: derniereCommande.pays || f.pays,
        }));
      }
    }
    preremplirDepuisCompte();
  }, []);

  useEffect(() => {
    function handleClicExterieur(e) {
      if (paysRef.current && !paysRef.current.contains(e.target)) {
        setPaysOuvert(false);
      }
    }
    document.addEventListener('mousedown', handleClicExterieur);
    return () => document.removeEventListener('mousedown', handleClicExterieur);
  }, []);

  const paysFiltres = listePays.filter(p =>
    normaliser(p).includes(normaliser(form.pays))
  );

  const sousTotal = panier.reduce((acc, item) => {
    const prix = parseFloat(item.prix.replace(/[^0-9.]/g, ''));
    return acc + prix * item.quantite;
  }, 0);

  const zoneDetectee = modeRecuperation === 'boutique' ? null : zoneDepuisPays(form.pays);

  const fraisLivraison = modeRecuperation === 'boutique'
    ? 0
    : (sousTotal >= 50 && zoneDetectee?.id === 'senegal' ? 0 : (zoneDetectee?.prix ?? 2.90));

  const total = sousTotal + fraisLivraison;

  const modesPaiementAffiches = [
    ...MODES_PAIEMENT,
    modeRecuperation === 'boutique'
      ? { id: 'reception', label: 'Paiement en boutique', desc: 'Espèces au retrait de la commande', icon: '🏬' }
      : { id: 'reception', label: 'Paiement à la livraison', desc: 'Espèces à la réception', icon: '🚪' },
  ];

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleConfirmer() {
    setChargement(true);
    const { error } = await supabase.from('commandes').insert([{
      nom: form.nom,
      email: form.email,
      telephone: form.telephone,
      whatsapp: form.whatsapp || form.telephone,
      adresse: modeRecuperation === 'boutique' ? 'Retrait en boutique' : `${form.adresse}, ${form.ville}, ${form.pays}`,
      ville: modeRecuperation === 'boutique' ? null : form.ville,
      pays: modeRecuperation === 'boutique' ? null : form.pays,
      mode_recuperation: modeRecuperation,
      articles: panier,
      total: `${total.toFixed(2)}€`,
      livraison: modeRecuperation === 'boutique' ? 'Retrait en boutique' : zoneDetectee?.label,
      paiement: modesPaiementAffiches.find(m => m.id === modePaiement)?.label,
      statut: 'en_attente',
    }]);

    if (!error) {
      viderPanier();
      setEtape(4);
    }
    setChargement(false);
  }

  if (panier.length === 0 && etape !== 4) {
    return (
      <main style={{background:'var(--cream)', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign:'center'}}>
          <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'38px', fontWeight:300, marginBottom:'16px'}}>Votre panier est vide</h2>
          <Link href="/boutique" className="btn-primary">Voir la boutique</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{background:'var(--cream)', minHeight:'100vh', paddingTop:'120px'}}>

      {/* HEADER PAGE */}
      <div className="px-section" style={{padding:'40px 60px 32px', borderBottom:'1px solid var(--gray-light)'}}>
        <div style={{fontSize:'12px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', fontWeight:500, marginBottom:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
          <span style={{width:'32px', height:'1px', background:'var(--rose)', display:'inline-block'}}></span>
          Finaliser ma commande
        </div>
        <h1 className="heading-xl" style={{fontFamily:'Cormorant Garamond, serif', fontSize:'52px', fontWeight:300, color:'var(--dark)'}}>
          Commande
        </h1>
      </div>

      {/* ÉTAPES INDICATEUR */}
      {etape < 4 && (
        <div className="px-section etapes-bar" style={{padding:'24px 60px', borderBottom:'1px solid var(--gray-light)', display:'flex', gap:'0'}}>
          {['Livraison', 'Paiement', 'Confirmation'].map((label, i) => (
            <div key={i} style={{display:'flex', alignItems:'center', flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{
                  width:'30px', height:'30px', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'13px', fontWeight:600, flexShrink:0,
                  background: etape > i + 1 ? 'var(--rose)' : etape === i + 1 ? 'var(--dark)' : 'transparent',
                  color: etape >= i + 1 ? 'white' : 'var(--gray)',
                  border: etape <= i + 1 ? '1px solid var(--gray-light)' : 'none',
                }}>
                  {etape > i + 1 ? '✓' : i + 1}
                </div>
                <span className="etape-label" style={{fontSize:'13px', letterSpacing:'1.5px', textTransform:'uppercase', color: etape === i + 1 ? 'var(--dark)' : 'var(--gray)', fontWeight: etape === i + 1 ? 500 : 400, whiteSpace:'nowrap'}}>
                  {label}
                </span>
              </div>
              {i < 2 && <div style={{flex:1, height:'1px', background:'var(--gray-light)', margin:'0 20px'}}></div>}
            </div>
          ))}
        </div>
      )}

      {/* CONTENU */}
      <div className="grid-collapse-2" style={{display:'grid', gridTemplateColumns: etape === 4 ? '1fr' : '1fr 420px', minHeight:'60vh'}}>

        <div className="px-section" style={{padding:'48px 60px'}}>

          {/* ÉTAPE 1 — LIVRAISON */}
          {etape === 1 && (
            <div style={{maxWidth:'640px'}}>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'34px', fontWeight:300, marginBottom:'32px', color:'var(--dark)'}}>
                {modeRecuperation === 'boutique' ? 'Retrait & coordonnées' : 'Informations de livraison'}
              </h2>

              {/* MODE DE RÉCUPÉRATION */}
              <div style={{marginBottom:'32px'}}>
                <label style={{display:'block', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'16px', fontWeight:500}}>
                  Mode de récupération
                </label>
                <div className="grid-collapse-2" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  {[
                    { id: 'livraison', titre: 'Livraison à domicile', desc: 'Le tarif dépend de votre adresse' },
                    { id: 'boutique', titre: 'Retrait en boutique', desc: 'Gratuit — récupérez sur place' },
                  ].map(option => (
                    <div key={option.id}
                      onClick={() => setModeRecuperation(option.id)}
                      style={{
                        padding:'16px 20px', cursor:'pointer',
                        border: modeRecuperation === option.id ? '1px solid var(--dark)' : '1px solid var(--gray-light)',
                        background: modeRecuperation === option.id ? 'var(--dark)' : 'white',
                        transition:'all 0.2s'
                      }}>
                      <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px'}}>
                        <div style={{
                          width:'17px', height:'17px', borderRadius:'50%', flexShrink:0,
                          border: modeRecuperation === option.id ? '4px solid var(--rose)' : '1px solid var(--gray-light)',
                          background: modeRecuperation === option.id ? 'white' : 'transparent'
                        }}></div>
                        <span style={{fontSize:'15px', fontWeight:500, color: modeRecuperation === option.id ? 'white' : 'var(--dark)'}}>{option.titre}</span>
                      </div>
                      <p style={{fontSize:'13px', marginLeft:'27px', color: modeRecuperation === option.id ? 'rgba(255,255,255,0.6)' : 'var(--gray)'}}>{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-collapse-2" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
                {[
                  {name:'nom', label:'Nom complet', placeholder:'Votre nom', full:true},
                  {name:'email', label:'Email', placeholder:'votre@email.com', type:'email', full:true},
                ].map(field => (
                  <div key={field.name} style={{gridColumn: field.full ? 'span 2' : 'span 1'}}>
                    <label style={{display:'block', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={{
                        width:'100%', padding:'16px 18px',
                        border:'1px solid var(--gray-light)', background:'white',
                        fontSize:'15px', color:'var(--dark)', outline:'none',
                        fontFamily:'DM Sans, sans-serif', borderRadius:'2px'
                      }}
                    />
                  </div>
                ))}

                {/* TÉLÉPHONE & WHATSAPP — indicatif + drapeau détectés automatiquement */}
                <ChampTelephone
                  name="telephone"
                  label="Téléphone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                />
                <ChampTelephone
                  name="whatsapp"
                  label="WhatsApp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  placeholder="Si différent du téléphone"
                />

                {modeRecuperation === 'livraison' && [
                  {name:'adresse', label:'Adresse de livraison', placeholder:'Adresse complète de livraison', full:true},
                  {name:'ville', label:'Ville', placeholder:'Dakar'},
                ].map(field => (
                  <div key={field.name} style={{gridColumn: field.full ? 'span 2' : 'span 1'}}>
                    <label style={{display:'block', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={{
                        width:'100%', padding:'16px 18px',
                        border:'1px solid var(--gray-light)', background:'white',
                        fontSize:'15px', color:'var(--dark)', outline:'none',
                        fontFamily:'DM Sans, sans-serif', borderRadius:'2px'
                      }}
                    />
                  </div>
                ))}

                {/* PAYS — recherche avec détection automatique, détermine le tarif de livraison */}
                {modeRecuperation === 'livraison' && (
                  <div ref={paysRef} style={{gridColumn:'span 1', position:'relative'}}>
                    <label style={{display:'block', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', marginBottom:'8px', fontWeight:500}}>
                      Pays
                    </label>
                    <input
                      type="text"
                      name="pays"
                      value={form.pays}
                      onChange={handleChange}
                      onFocus={(e) => { setPaysOuvert(true); e.target.select(); }}
                      placeholder="Rechercher un pays"
                      autoComplete="off"
                      style={{
                        width:'100%', padding:'16px 18px',
                        border:'1px solid var(--gray-light)', background:'white',
                        fontSize:'15px', color:'var(--dark)', outline:'none',
                        fontFamily:'DM Sans, sans-serif', borderRadius:'2px'
                      }}
                    />
                    {paysOuvert && paysFiltres.length > 0 && (
                      <div style={{
                        position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:10,
                        background:'white', border:'1px solid var(--gray-light)', borderRadius:'2px',
                        maxHeight:'220px', overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.08)'
                      }}>
                        {paysFiltres.map(nom => (
                          <div
                            key={nom}
                            onClick={() => { setForm(f => ({ ...f, pays: nom })); setPaysOuvert(false); }}
                            style={{
                              padding:'10px 16px', fontSize:'15px', cursor:'pointer',
                              color: nom === form.pays ? 'var(--rose)' : 'var(--dark)',
                              background: nom === form.pays ? 'var(--rose-pale)' : 'transparent'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--rose-pale)'}
                            onMouseLeave={e => e.currentTarget.style.background = nom === form.pays ? 'var(--rose-pale)' : 'transparent'}
                          >
                            {nom}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ZONE DE LIVRAISON — déterminée automatiquement par l'adresse */}
              {modeRecuperation === 'livraison' && zoneDetectee && (
                <div style={{
                  marginTop:'8px', padding:'16px 20px',
                  background:'var(--rose-pale)', borderLeft:'2px solid var(--rose)',
                  display:'flex', justifyContent:'space-between', alignItems:'center'
                }}>
                  <div>
                    <p style={{fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'4px'}}>Zone détectée</p>
                    <p style={{fontSize:'15px', color:'var(--dark)'}}>{zoneDetectee.label}</p>
                  </div>
                  <span style={{fontSize:'16px', fontWeight:500, color:'var(--rose)'}}>
                    {fraisLivraison === 0 ? 'Offerte' : `${fraisLivraison.toFixed(2)}€`}
                  </span>
                </div>
              )}

              {/* RETRAIT EN BOUTIQUE — infos pratiques */}
              {modeRecuperation === 'boutique' && (
                <div style={{marginTop:'8px', background:'white', border:'1px solid var(--gray-light)', padding:'24px', display:'flex', gap:'32px', flexWrap:'wrap'}}>
                  <div>
                    <p style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', fontWeight:500, marginBottom:'8px'}}>Adresse</p>
                    <p style={{fontSize:'14px', color:'var(--gray)', lineHeight:1.8}}>Diodio Glow Skin<br/>Votre adresse ici<br/>Ville, Pays</p>
                  </div>
                  <div>
                    <p style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'var(--dark)', fontWeight:500, marginBottom:'8px'}}>Horaires</p>
                    {HORAIRES_BOUTIQUE.map(h => (
                      <div key={h.jour} style={{display:'flex', justifyContent:'space-between', gap:'24px', fontSize:'13px', marginBottom:'4px'}}>
                        <span style={{color:'var(--gray)'}}>{h.jour}</span>
                        <span style={{color:'var(--dark)', fontWeight:500}}>{h.heure}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  const infosBase = form.nom && form.email;
                  const infosLivraison = modeRecuperation === 'boutique' || (form.adresse && form.ville);
                  if (infosBase && infosLivraison) setEtape(2);
                }}
                className="btn-primary"
                style={{marginTop:'40px', border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
                Continuer vers le paiement →
              </button>
            </div>
          )}

          {/* ÉTAPE 2 — PAIEMENT */}
          {etape === 2 && (
            <div style={{maxWidth:'640px'}}>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'34px', fontWeight:300, marginBottom:'32px', color:'var(--dark)'}}>
                Mode de paiement
              </h2>

              <div style={{display:'flex', flexDirection:'column', gap:'8px', marginBottom:'40px'}}>
                {modesPaiementAffiches.map(mode => (
                  <div key={mode.id}
                    onClick={() => setModePaiement(mode.id)}
                    style={{
                      display:'flex', alignItems:'center', gap:'16px',
                      padding:'20px 24px', cursor:'pointer',
                      border: modePaiement === mode.id ? '1px solid var(--dark)' : '1px solid var(--gray-light)',
                      background: modePaiement === mode.id ? 'var(--dark)' : 'white',
                      transition:'all 0.2s'
                    }}>
                    <div style={{
                      width:'17px', height:'17px', borderRadius:'50%', flexShrink:0,
                      border: modePaiement === mode.id ? '4px solid var(--rose)' : '1px solid var(--gray-light)',
                      background: modePaiement === mode.id ? 'white' : 'transparent'
                    }}></div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'15px', fontWeight:500, color: modePaiement === mode.id ? 'white' : 'var(--dark)', marginBottom:'2px'}}>{mode.label}</div>
                      <div style={{fontSize:'13px', color: modePaiement === mode.id ? 'rgba(255,255,255,0.5)' : 'var(--gray)'}}>{mode.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {modePaiement === 'carte' && (
                <div style={{background:'var(--rose-pale)', borderLeft:'2px solid var(--rose)', padding:'16px 20px', marginBottom:'32px'}}>
                  <p style={{fontSize:'13px', color:'var(--rose)', letterSpacing:'1px'}}>
                    ✦ Vous serez redirigé vers Stripe pour finaliser le paiement de manière sécurisée.
                  </p>
                </div>
              )}

              {(modePaiement === 'wave' || modePaiement === 'orange') && (
                <div style={{background:'var(--rose-pale)', borderLeft:'2px solid var(--rose)', padding:'16px 20px', marginBottom:'32px'}}>
                  <p style={{fontSize:'13px', color:'var(--rose)', letterSpacing:'1px'}}>
                    ✦ Vous recevrez un lien de paiement mobile par SMS après confirmation.
                  </p>
                </div>
              )}

              <div style={{display:'flex', gap:'12px'}}>
                <button onClick={() => setEtape(1)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
                  ← Retour
                </button>
                <button
                  onClick={() => modePaiement && setEtape(3)}
                  className="btn-primary"
                  style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: modePaiement ? 1 : 0.5}}>
                  Vérifier ma commande →
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 — RÉCAPITULATIF */}
          {etape === 3 && (
            <div style={{maxWidth:'640px'}}>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'34px', fontWeight:300, marginBottom:'32px', color:'var(--dark)'}}>
                Vérifier ma commande
              </h2>

              {/* INFOS LIVRAISON */}
              <div style={{background:'white', padding:'24px', marginBottom:'16px', borderLeft:'2px solid var(--gray-light)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                  <span style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500}}>
                    {modeRecuperation === 'boutique' ? 'Retrait en boutique' : 'Livraison'}
                  </span>
                  <button onClick={() => setEtape(1)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', fontFamily:'DM Sans, sans-serif'}}>Modifier</button>
                </div>
                <p style={{fontSize:'15px', color:'var(--gray)', lineHeight:1.8}}>
                  {form.nom}<br/>
                  {modeRecuperation === 'boutique' ? 'Retrait en boutique' : <>{form.adresse}<br/>{form.ville}, {form.pays}<br/></>}
                  {form.email} · {form.telephone}{form.whatsapp && ` · WhatsApp : ${form.whatsapp}`}
                </p>
              </div>

              {/* INFOS PAIEMENT */}
              <div style={{background:'white', padding:'24px', marginBottom:'32px', borderLeft:'2px solid var(--gray-light)'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                  <span style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500}}>Paiement</span>
                  <button onClick={() => setEtape(2)} style={{background:'none', border:'none', cursor:'pointer', fontSize:'12px', letterSpacing:'1px', textTransform:'uppercase', color:'var(--rose)', fontFamily:'DM Sans, sans-serif'}}>Modifier</button>
                </div>
                <p style={{fontSize:'15px', color:'var(--gray)'}}>{modesPaiementAffiches.find(m => m.id === modePaiement)?.label}</p>
              </div>

              {/* ARTICLES */}
              <div style={{marginBottom:'32px'}}>
                {panier.map(item => (
                  <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderBottom:'1px solid var(--gray-light)'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                      <div style={{width:'48px', height:'48px', background:'linear-gradient(135deg,#FDF4F6,#F0D6DC)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.nom} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        ) : (
                          <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'21px', color:'var(--rose)', opacity:0.4}}>{item.nom.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div style={{fontSize:'15px', color:'var(--dark)', fontWeight:500}}>{item.nom}</div>
                        <div style={{fontSize:'13px', color:'var(--gray)'}}>×{item.quantite}</div>
                      </div>
                    </div>
                    <span style={{fontSize:'15px', color:'var(--dark)', fontWeight:500}}>{item.prix}</span>
                  </div>
                ))}
              </div>

              <div style={{display:'flex', gap:'12px'}}>
                <button onClick={() => setEtape(2)} className="btn-secondary" style={{border:'1px solid var(--dark)', cursor:'pointer', fontFamily:'DM Sans, sans-serif'}}>
                  ← Retour
                </button>
                <button
                  onClick={handleConfirmer}
                  disabled={chargement}
                  className="btn-primary"
                  style={{border:'none', cursor:'pointer', fontFamily:'DM Sans, sans-serif', opacity: chargement ? 0.6 : 1}}>
                  {chargement ? 'Traitement...' : 'Confirmer la commande ✓'}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 4 — CONFIRMATION */}
          {etape === 4 && (
            <div style={{maxWidth:'600px', margin:'0 auto', textAlign:'center', padding:'80px 0'}}>
              <div style={{
                width:'80px', height:'80px', borderRadius:'50%',
                border:'1px solid var(--rose)', display:'flex', alignItems:'center',
                justifyContent:'center', margin:'0 auto 32px'
              }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16 L13 23 L26 10" stroke="#C8748A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{fontSize:'12px', letterSpacing:'4px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'16px', fontWeight:500}}>
                ✦ Commande confirmée
              </div>
              <h2 style={{fontFamily:'Cormorant Garamond, serif', fontSize:'52px', fontWeight:300, color:'var(--dark)', marginBottom:'16px'}}>
                Merci {form.nom.split(' ')[0]} !
              </h2>
              <p style={{fontSize:'16px', color:'var(--gray)', lineHeight:1.8, marginBottom:'48px'}}>
                Votre commande a bien été enregistrée. Un email de confirmation sera envoyé à <strong style={{color:'var(--dark)'}}>{form.email}</strong>.
              </p>

              {/* RÉCAPITULATIF FINAL */}
              <div style={{background:'white', padding:'32px', textAlign:'left', marginBottom:'40px'}}>
                <p style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, marginBottom:'20px'}}>Récapitulatif</p>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                  <span style={{fontSize:'14px', color:'var(--gray)'}}>Sous-total</span>
                  <span style={{fontSize:'14px', color:'var(--dark)'}}>{sousTotal.toFixed(2)}€</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                  <span style={{fontSize:'14px', color:'var(--gray)'}}>{modeRecuperation === 'boutique' ? 'Retrait en boutique' : 'Livraison'}</span>
                  <span style={{fontSize:'14px', color:'var(--dark)'}}>{fraisLivraison === 0 ? 'Offerte' : `${fraisLivraison.toFixed(2)}€`}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', paddingTop:'16px', borderTop:'1px solid var(--gray-light)', marginTop:'8px'}}>
                  <span style={{fontSize:'14px', fontWeight:500, textTransform:'uppercase', letterSpacing:'1px'}}>Total payé</span>
                  <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'26px', fontWeight:300, color:'var(--rose)'}}>{total.toFixed(2)}€</span>
                </div>
              </div>

              <div style={{display:'flex', gap:'12px', justifyContent:'center'}}>
                <Link href="/" className="btn-secondary" style={{border:'1px solid var(--dark)'}}>Retour à l'accueil</Link>
                <Link href="/boutique" className="btn-primary">Continuer mes achats</Link>
              </div>
            </div>
          )}

        </div>

        {/* RÉSUMÉ LATÉRAL */}
        {etape < 4 && (
          <div className="cart-summary" style={{borderLeft:'1px solid var(--gray-light)', padding:'48px 40px', position:'sticky', top:'100px', background:'white'}}>
            <p style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:500, marginBottom:'24px', color:'var(--dark)'}}>
              Votre commande
            </p>
            {panier.map(item => (
              <div key={item.id} style={{display:'flex', gap:'12px', alignItems:'center', marginBottom:'16px'}}>
                <div style={{width:'44px', height:'44px', background:'linear-gradient(135deg,#FDF4F6,#F0D6DC)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.nom} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'19px', color:'var(--rose)', opacity:0.4}}>{item.nom.charAt(0)}</span>
                  )}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'14px', color:'var(--dark)', fontWeight:500}}>{item.nom}</div>
                  <div style={{fontSize:'13px', color:'var(--gray)'}}>×{item.quantite}</div>
                </div>
                <span style={{fontSize:'14px', color:'var(--dark)'}}>{item.prix}</span>
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--gray-light)', marginTop:'20px', paddingTop:'20px'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                <span style={{fontSize:'14px', color:'var(--gray)'}}>Sous-total</span>
                <span style={{fontSize:'14px', color:'var(--dark)'}}>{sousTotal.toFixed(2)}€</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'16px'}}>
                <span style={{fontSize:'14px', color:'var(--gray)'}}>{modeRecuperation === 'boutique' ? 'Retrait en boutique' : 'Livraison'}</span>
                <span style={{fontSize:'14px', color:'var(--dark)'}}>{fraisLivraison === 0 ? 'Offerte' : `${fraisLivraison.toFixed(2)}€`}</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span style={{fontSize:'13px', fontWeight:500, textTransform:'uppercase', letterSpacing:'1px'}}>Total</span>
                <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:'26px', fontWeight:300, color:'var(--rose)'}}>{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}