import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uuid,
  varchar,
  integer,
  date,
  jsonb,
  pgEnum,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// IMPORTANT! ID fields should ALWAYS use UUID types, EXCEPT the BetterAuth tables.

// ============================================================================
// ENUMS
// ============================================================================

export const zoneFiscaleEnum = pgEnum("zone_fiscale", [
  "A_BIS",
  "A",
  "B1",
  "B2",
  "C"
]);

export const tensionLocativeEnum = pgEnum("tension_locative", [
  "tres_tendu",
  "tendu",
  "equilibre",
  "detendu"
]);

export const niveauLoyerEnum = pgEnum("niveau_loyer", [
  "haut",
  "moyen",
  "bas"
]);

export const leadStatutEnum = pgEnum("lead_statut", [
  "nouveau",
  "contacte",
  "qualifie",
  "prospect_chaud",
  "perdu",
  "converti"
]);


export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_account_idx").on(table.providerId, table.accountId),
  ]
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ============================================================================
// BUSINESS TABLES (Simulateur Loi Jeanbrun)
// ============================================================================

/**
 * Table villes - Données marché immobilier par commune
 */
export const villes = pgTable(
  "villes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    codeInsee: varchar("code_insee", { length: 5 }).notNull().unique(),
    nom: text("nom").notNull(),
    departement: varchar("departement", { length: 3 }).notNull(),
    region: text("region"),
    zoneFiscale: zoneFiscaleEnum("zone_fiscale").notNull(),
    tensionLocative: tensionLocativeEnum("tension_locative"),
    niveauLoyer: niveauLoyerEnum("niveau_loyer"),
    prixM2Moyen: integer("prix_m2_moyen"), // Prix en centimes
    loyerM2Moyen: integer("loyer_m2_moyen"), // Loyer mensuel en centimes
    populationCommune: integer("population_commune"),
    slug: text("slug").notNull().unique(),
    espoId: text("espo_id"), // ID dans EspoCRM
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("villes_code_insee_idx").on(table.codeInsee),
    index("villes_slug_idx").on(table.slug),
  ]
);

/**
 * Table programmes - Programmes immobiliers neufs
 */
export const programmes = pgTable(
  "programmes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    villeId: uuid("ville_id")
      .notNull()
      .references(() => villes.id, { onDelete: "cascade" }),
    nom: text("nom").notNull(),
    promoteur: text("promoteur"),
    adresse: text("adresse"),
    codePostal: varchar("code_postal", { length: 5 }),
    prixMin: integer("prix_min"), // En centimes
    prixMax: integer("prix_max"), // En centimes
    surfaceMin: integer("surface_min"), // m² × 100 pour gérer décimales
    surfaceMax: integer("surface_max"), // m² × 100
    dateLivraison: date("date_livraison"),
    actif: boolean("actif").default(true).notNull(),
    espoId: text("espo_id"), // ID EspoCRM
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("programmes_ville_id_idx").on(table.villeId),
    index("programmes_actif_idx").on(table.actif),
  ]
);

/**
 * Table simulations - Simulations fiscales utilisateur
 */
export const simulations = pgTable(
  "simulations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    villeId: uuid("ville_id").references(() => villes.id, { onDelete: "set null" }),
    programmeId: uuid("programme_id").references(() => programmes.id, { onDelete: "set null" }),
    inputData: jsonb("input_data"), // Données saisies dans le wizard
    resultats: jsonb("resultats"), // Résultats calculs fiscaux
    montantInvestissement: integer("montant_investissement"), // En centimes
    rendementBrut: integer("rendement_brut"), // % × 100 (ex: 5.50% = 550)
    economieImpots10Ans: integer("economie_impots_10_ans"), // En centimes
    estComplet: boolean("est_complet").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("simulations_user_id_idx").on(table.userId),
    index("simulations_ville_id_idx").on(table.villeId),
  ]
);

/**
 * Table leads - Prospects découverte patrimoniale
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    simulationId: uuid("simulation_id").references(() => simulations.id, { onDelete: "set null" }),
    email: text("email").notNull(),
    telephone: varchar("telephone", { length: 20 }),
    prenom: text("prenom"),
    nom: text("nom"),
    statut: leadStatutEnum("statut").default("nouveau").notNull(),
    consentementRgpd: boolean("consentement_rgpd").default(false).notNull(),
    consentementMarketing: boolean("consentement_marketing").default(false).notNull(),
    dateConsentement: timestamp("date_consentement"),
    sourceUtm: text("source_utm"), // UTM tracking
    espoId: text("espo_id"), // ID EspoCRM
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("leads_email_idx").on(table.email),
    index("leads_statut_idx").on(table.statut),
  ]
);

/**
 * Table quotas - Gestion packs payants utilisateur
 */
export const quotas = pgTable(
  "quotas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    packType: text("pack_type"), // 'decouverte', 'essentiel', 'premium'
    simulationsRestantes: integer("simulations_restantes").default(0).notNull(),
    pdfsRestantes: integer("pdfs_restantes").default(0).notNull(),
    dateExpiration: timestamp("date_expiration"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("quotas_user_id_idx").on(table.userId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const villesRelations = relations(villes, ({ many }) => ({
  programmes: many(programmes),
  simulations: many(simulations),
}));

export const programmesRelations = relations(programmes, ({ one, many }) => ({
  ville: one(villes, {
    fields: [programmes.villeId],
    references: [villes.id],
  }),
  simulations: many(simulations),
}));

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  simulations: many(simulations),
  leads: many(leads),
  quota: one(quotas, {
    fields: [user.id],
    references: [quotas.userId],
  }),
}));

export const simulationsRelations = relations(simulations, ({ one }) => ({
  user: one(user, {
    fields: [simulations.userId],
    references: [user.id],
  }),
  ville: one(villes, {
    fields: [simulations.villeId],
    references: [villes.id],
  }),
  programme: one(programmes, {
    fields: [simulations.programmeId],
    references: [programmes.id],
  }),
  lead: one(leads, {
    fields: [simulations.id],
    references: [leads.simulationId],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  user: one(user, {
    fields: [leads.userId],
    references: [user.id],
  }),
  simulation: one(simulations, {
    fields: [leads.simulationId],
    references: [simulations.id],
  }),
}));

export const quotasRelations = relations(quotas, ({ one }) => ({
  user: one(user, {
    fields: [quotas.userId],
    references: [user.id],
  }),
}));
