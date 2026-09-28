const COULEUR = '#C8748A';

const IconeSoinDefaut = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <path d="M11 2 C11 2 4 10 4 15 C4 18.9 7.1 22 11 22 C14.9 22 18 18.9 18 15 C18 10 11 2 11 2Z" stroke={COULEUR} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IconeVisage = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <circle cx="8" cy="9" r="0.9" fill={COULEUR}/>
    <circle cx="14" cy="9" r="0.9" fill={COULEUR}/>
    <path d="M8 13.5 Q11 16 14 13.5" stroke={COULEUR} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconeCorps = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="5" r="2.6" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <path d="M5 20 C5 15 7.5 12 11 12 C14.5 12 17 15 17 20" stroke={COULEUR} strokeWidth="1.3" strokeLinecap="round" fill="none"/>
  </svg>
);

const IconeMassage = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <ellipse cx="11" cy="18" rx="7" ry="2.2" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <ellipse cx="11" cy="13" rx="5" ry="1.8" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <ellipse cx="11" cy="9" rx="3" ry="1.4" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
  </svg>
);

const IconeBeauteMains = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <rect x="8" y="10" width="6" height="10" rx="1.2" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <path d="M9.5 10 L9.5 7 Q9.5 5.5 11 5.5 Q12.5 5.5 12.5 7 L12.5 10" stroke={COULEUR} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
  </svg>
);

const IconeEpilation = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <path d="M4 18 C4 10 10 4 18 4 C18 12 12 18 4 18Z" stroke={COULEUR} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
    <path d="M6 16 C10 12 13 9 17 5" stroke={COULEUR} strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const IconeCoiffure = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <circle cx="6" cy="6" r="2" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <circle cx="6" cy="16" r="2" stroke={COULEUR} strokeWidth="1.3" fill="none"/>
    <path d="M7.5 7.5 L18 17" stroke={COULEUR} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M7.5 14.5 L18 5" stroke={COULEUR} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IconeBienEtre = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="1.6" fill={COULEUR}/>
    <ellipse cx="11" cy="6" rx="2" ry="4" stroke={COULEUR} strokeWidth="1.1" fill="none"/>
    <ellipse cx="11" cy="16" rx="2" ry="4" stroke={COULEUR} strokeWidth="1.1" fill="none"/>
    <ellipse cx="6" cy="11" rx="4" ry="2" stroke={COULEUR} strokeWidth="1.1" fill="none"/>
    <ellipse cx="16" cy="11" rx="4" ry="2" stroke={COULEUR} strokeWidth="1.1" fill="none"/>
  </svg>
);

export const ICONES_SOINS = [
  { cle: 'soin', label: 'Soin', Icone: IconeSoinDefaut },
  { cle: 'visage', label: 'Visage', Icone: IconeVisage },
  { cle: 'corps', label: 'Corps', Icone: IconeCorps },
  { cle: 'massage', label: 'Massage', Icone: IconeMassage },
  { cle: 'beaute-mains', label: 'Mains & pieds', Icone: IconeBeauteMains },
  { cle: 'epilation', label: 'Épilation', Icone: IconeEpilation },
  { cle: 'coiffure', label: 'Coiffure', Icone: IconeCoiffure },
  { cle: 'bien-etre', label: 'Bien-être', Icone: IconeBienEtre },
];

export function IconeSoin({ nom, size = 28 }) {
  const trouve = ICONES_SOINS.find(i => i.cle === nom);
  const Icone = trouve ? trouve.Icone : IconeSoinDefaut;
  return <Icone size={size} />;
}
