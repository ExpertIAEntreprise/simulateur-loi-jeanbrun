import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
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
  numeric
} from "drizzle-orm/pg-core";

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

export const platformEnum = pgEnum("platform", [
  "jeanbrun",
  "stop-loyer"
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "dispatched",
  "contacted",
  "converted",
  "lost"
]);

export const pricingModelEnum = pgEnum("pricing_model", [
  "per_lead",
  "commission",
  "hybrid"
]);

// ============================================================================
// BETTER AUTH TABLES (Text IDs - Required by Better Auth)
// ============================================================================

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
// BUSINESS TABLES
// ============================================================================

/**
 * Table villes - Donnees marche immobilier par commune
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
    prixM2Moyen: integer("prix_m2_moyen"),
    loyerM2Moyen: integer("loyer_m2_moyen"),
    populationCommune: integer("population_commune"),
    slug: text("slug").notNull().unique(),
    espoId: text("espo_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("villes_code_insee_idx").on(table.codeInsee),
    index("villes_slug_idx").on(table.slug),
    index("villes_zone_tension_idx").on(table.zoneFiscale, table.tensionLocative),
    index("villes_departement_idx").on(table.departement),
  ]
);

/**
 * Table promoters - Promoteurs immobiliers partenaires
 */
export const promoters = pgTable(
  "promoters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }),
    conventionSignedAt: date("convention_signed_at"),
    pricingModel: pricingModelEnum("pricing_model").notNull(),
    pricePerLead: numeric("price_per_lead", { precision: 10, scale: 2 }),
    commissionRate: numeric("commission_rate", { precision: 5, scale: 2 }),
    zones: text("zones").array().notNull().default([]),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("promoters_active_idx").on(table.active),
  ]
);

/**
 * Table brokers - Courtiers en credit partenaires
 */
export const brokers = pgTable(
  "brokers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    contactName: text("contact_name").notNull(),
    contactEmail: text("contact_email").notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }),
    contractSignedAt: date("contract_signed_at"),
    pricePerLead: numeric("price_per_lead", { precision: 10, scale: 2 }).notNull(),
    zones: text("zones").array().notNull().default([]),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("brokers_active_idx").on(table.active),
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
    promoterId: uuid("promoter_id")
      .references(() => promoters.id, { onDelete: "set null" }),
    nom: text("nom").notNull(),
    promoteur: text("promoteur"),
    adresse: text("adresse"),
    codePostal: varchar("code_postal", { length: 5 }),
    prixMin: integer("prix_min"),
    prixMax: integer("prix_max"),
    surfaceMin: integer("surface_min"),
    surfaceMax: integer("surface_max"),
    dateLivraison: date("date_livraison"),
    eligibleJeanbrun: boolean("eligible_jeanbrun").default(false).notNull(),
    eligiblePtz: boolean("eligible_ptz").default(false).notNull(),
    authorized: boolean("authorized").default(false).notNull(),
    specialOffers: jsonb("special_offers"),
    actif: boolean("actif").default(true).notNull(),
    espoId: text("espo_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("programmes_ville_id_idx").on(table.villeId),
    index("programmes_actif_idx").on(table.actif),
    index("programmes_ville_actif_idx").on(table.villeId, table.actif),
    index("programmes_promoter_id_idx").on(table.promoterId),
    index("programmes_authorized_idx").on(table.authorized),
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
    inputData: jsonb("input_data"),
    resultats: jsonb("resultats"),
    montantInvestissement: integer("montant_investissement"),
    rendementBrut: integer("rendement_brut"),
    economieImpots10Ans: integer("economie_impots_10_ans"),
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
    index("simulations_user_complet_idx").on(table.userId, table.estComplet),
    index("simulations_programme_id_idx").on(table.programmeId),
  ]
);

/**
 * Table leads - Prospects qualifies (generation de leads)
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    platform: platformEnum("platform").notNull(),
    sourcePage: text("source_page"),
    utmSource: varchar("utm_source", { length: 255 }),
    utmMedium: varchar("utm_medium", { length: 255 }),
    utmCampaign: varchar("utm_campaign", { length: 255 }),
    email: text("email").notNull(),
    telephone: varchar("telephone", { length: 20 }),
    prenom: text("prenom"),
    nom: text("nom"),
    consentPromoter: boolean("consent_promoter").default(false).notNull(),
    consentBroker: boolean("consent_broker").default(false).notNull(),
    consentNewsletter: boolean("consent_newsletter").default(false).notNull(),
    consentDate: timestamp("consent_date"),
    unsubscribeToken: varchar("unsubscribe_token", { length: 64 }),
    simulationData: jsonb("simulation_data"),
    score: integer("score"),
    status: leadStatusEnum("status").default("new").notNull(),
    promoterId: uuid("promoter_id")
      .references(() => promoters.id, { onDelete: "set null" }),
    brokerId: uuid("broker_id")
      .references(() => brokers.id, { onDelete: "set null" }),
    dispatchedPromoterAt: timestamp("dispatched_promoter_at"),
    dispatchedBrokerAt: timestamp("dispatched_broker_at"),
    convertedAt: timestamp("converted_at"),
    revenuePromoter: numeric("revenue_promoter", { precision: 10, scale: 2 }),
    revenueBroker: numeric("revenue_broker", { precision: 10, scale: 2 }),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    simulationId: uuid("simulation_id").references(() => simulations.id, { onDelete: "set null" }),
    espoId: text("espo_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("leads_platform_idx").on(table.platform),
    index("leads_status_idx").on(table.status),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_email_idx").on(table.email),
    index("leads_user_id_idx").on(table.userId),
    index("leads_simulation_id_idx").on(table.simulationId),
    index("leads_promoter_id_idx").on(table.promoterId),
    index("leads_broker_id_idx").on(table.brokerId),
  ]
);

// ============================================================================
// RELATIONS
// ============================================================================

export const villesRelations = relations(villes, ({ many }) => ({
  programmes: many(programmes),
  simulations: many(simulations),
}));

export const promotersRelations = relations(promoters, ({ many }) => ({
  programmes: many(programmes),
  leads: many(leads),
}));

export const brokersRelations = relations(brokers, ({ many }) => ({
  leads: many(leads),
}));

export const programmesRelations = relations(programmes, ({ one, many }) => ({
  ville: one(villes, {
    fields: [programmes.villeId],
    references: [villes.id],
  }),
  promoter: one(promoters, {
    fields: [programmes.promoterId],
    references: [promoters.id],
  }),
  simulations: many(simulations),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  simulations: many(simulations),
  leads: many(leads),
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
  promoter: one(promoters, {
    fields: [leads.promoterId],
    references: [promoters.id],
  }),
  broker: one(brokers, {
    fields: [leads.brokerId],
    references: [brokers.id],
  }),
}));

// ============================================================================
// INFERRED TYPES (Source of truth - DO NOT duplicate in /src/types)
// ============================================================================

export type Ville = InferSelectModel<typeof villes>;
export type NewVille = InferInsertModel<typeof villes>;

export type Programme = InferSelectModel<typeof programmes>;
export type NewProgramme = InferInsertModel<typeof programmes>;

export type Simulation = InferSelectModel<typeof simulations>;
export type NewSimulation = InferInsertModel<typeof simulations>;

export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;

export type Promoter = InferSelectModel<typeof promoters>;
export type NewPromoter = InferInsertModel<typeof promoters>;

export type Broker = InferSelectModel<typeof brokers>;
export type NewBroker = InferInsertModel<typeof brokers>;

export type User = InferSelectModel<typeof user>;
export type NewUser = InferInsertModel<typeof user>;

export type Session = InferSelectModel<typeof session>;
export type Account = InferSelectModel<typeof account>;
export type Verification = InferSelectModel<typeof verification>;
