# Diodio Glow Skin

Site vitrine, boutique en ligne et prise de rendez-vous pour l'institut de beauté **Diodio Glow Skin** (Dakar).

Construit avec [Next.js](https://nextjs.org) (App Router, Turbopack, React Compiler) et [Supabase](https://supabase.com) (base de données Postgres + authentification).

## Fonctionnalités

- **Boutique** : catalogue de produits par catégorie, fiche produit, suggestions de produits similaires, gestion du stock (`en_stock`) et des promotions (`en_promotion` / `prix_promo`).
- **Panier & commande** : panier persistant côté client, tunnel de commande en plusieurs étapes (livraison, paiement, récapitulatif), détection automatique de la zone de livraison.
- **Rendez-vous** : sélection de soins (avec prix, durée, bienfaits, contre-indications), choix d'une date/créneau, confirmation.
- **Promotions** : page dédiée aux produits en promotion, mise en avant sur l'accueil et dans le carrousel.
- **Compte client** : connexion/inscription, menu déroulant depuis la navbar (infos, historique commandes/rendez-vous), sans page dédiée.
- **Page "Mon parcours"** : présentation de la fondatrice.
- **Panneau d'administration** (`/admin`, accès restreint) : gestion des produits, soins, commandes et rendez-vous.

## Stack technique

- Next.js 16 (App Router, Turbopack, Server Components)
- React 19 + React Compiler
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Tailwind CSS 4 (styles utilitaires globaux ; la majorité de l'UI est en styles inline avec des tokens CSS définis dans `app/globals.css`)

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

Le site est alors accessible sur [http://localhost:3000](http://localhost:3000).

### Variables d'environnement

Voir `.env.example`. Les deux variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) se trouvent dans le dashboard Supabase sous *Project Settings → API*.

## Base de données (Supabase)

Tables principales utilisées par l'application :

| Table | Description |
|---|---|
| `produits` | Catalogue boutique (`nom`, `prix`, `poids`, `categorie`, `description`, `ingredients`, `application`, `conseils`, `image_url`, `est_nouveaute`, `en_stock`, `en_promotion`, `prix_promo`) |
| `soins` | Soins proposés au rendez-vous (`nom`, `duree`, `prix`, `description`, `bienfaits`, `contre_indications`, `emoji` — clé d'icône, voir `app/components/IconesSoins.js`, `actif`) |
| `commandes` | Commandes passées depuis le tunnel de commande |
| `rendezvous` | Rendez-vous pris depuis `/rendezvous` |
| `admins` | Emails autorisés à accéder à `/admin`. RLS activée : chaque utilisateur connecté ne peut lire que sa propre ligne (`auth.email() = email`) |

Toutes les tables sont interrogées côté client avec la clé anonyme (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) : pensez à activer Row Level Security et des policies adaptées sur toute nouvelle table.

### Devenir administrateur

Il n'existe pas d'interface pour se déclarer admin (sécurité). Ajoutez votre email dans la table `admins` directement depuis le SQL Editor de Supabase :

```sql
insert into admins (email) values ('votre-email@exemple.com');
```

## Structure du projet

```
app/
  admin/          Panneau d'administration
  auth/           Connexion / inscription
  boutique/       Catalogue + fiche produit
  commande/       Tunnel de commande
  components/     Composants partagés (navbar, icônes, carrousel...)
  contact/        Page contact
  context/        Contexte panier (React Context)
  lib/            Clients Supabase (browser + serveur)
  mon-parcours/   Page fondatrice
  panier/         Panier
  promotions/     Produits en promotion
  rendezvous/     Prise de rendez-vous
  globals.css     Tokens de design + classes utilitaires responsives
  layout.js       Layout racine (navbar, footer)
```

## Git & branches

- `main` : branche stable, déployée.
- `dev` : branche de travail pour les changements en cours ; on merge vers `main` une fois une fonctionnalité stabilisée et vérifiée.
- Pour un changement expérimental ou risqué, créer une branche dédiée à partir de `dev`.

Chaque changement doit donner lieu à un commit avec un message descriptif.

## Scripts

```bash
npm run dev     # serveur de dev (Turbopack)
npm run build   # build de production
npm run start   # démarre le build de production
npm run lint    # ESLint
```
