CREATE TYPE "public"."lead_status" AS ENUM('new', 'dispatched', 'contacted', 'converted', 'lost');--> statement-breakpoint
CREATE TYPE "public"."niveau_loyer" AS ENUM('haut', 'moyen', 'bas');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('jeanbrun', 'stop-loyer');--> statement-breakpoint
CREATE TYPE "public"."pricing_model" AS ENUM('per_lead', 'commission', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."tension_locative" AS ENUM('tres_tendu', 'tendu', 'equilibre', 'detendu');--> statement-breakpoint
CREATE TYPE "public"."zone_fiscale" AS ENUM('A_BIS', 'A', 'B1', 'B2', 'C');--> statement-breakpoint
CREATE TABLE "brokers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" varchar(20),
	"contract_signed_at" date,
	"price_per_lead" numeric(10, 2) NOT NULL,
	"zones" text[] DEFAULT '{}' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" "platform" NOT NULL,
	"source_page" text,
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"email" text NOT NULL,
	"telephone" varchar(20),
	"prenom" text,
	"nom" text,
	"consent_promoter" boolean DEFAULT false NOT NULL,
	"consent_broker" boolean DEFAULT false NOT NULL,
	"consent_newsletter" boolean DEFAULT false NOT NULL,
	"consent_date" timestamp,
	"simulation_data" jsonb,
	"score" integer,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"promoter_id" uuid,
	"broker_id" uuid,
	"dispatched_promoter_at" timestamp,
	"dispatched_broker_at" timestamp,
	"converted_at" timestamp,
	"revenue_promoter" numeric(10, 2),
	"revenue_broker" numeric(10, 2),
	"user_id" text,
	"simulation_id" uuid,
	"espo_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "programmes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ville_id" uuid NOT NULL,
	"promoter_id" uuid,
	"nom" text NOT NULL,
	"promoteur" text,
	"adresse" text,
	"code_postal" varchar(5),
	"prix_min" integer,
	"prix_max" integer,
	"surface_min" integer,
	"surface_max" integer,
	"date_livraison" date,
	"eligible_jeanbrun" boolean DEFAULT false NOT NULL,
	"eligible_ptz" boolean DEFAULT false NOT NULL,
	"authorized" boolean DEFAULT false NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"espo_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promoters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" varchar(20),
	"convention_signed_at" date,
	"pricing_model" "pricing_model" NOT NULL,
	"price_per_lead" numeric(10, 2),
	"commission_rate" numeric(5, 2),
	"zones" text[] DEFAULT '{}' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "simulations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"ville_id" uuid,
	"programme_id" uuid,
	"input_data" jsonb,
	"resultats" jsonb,
	"montant_investissement" integer,
	"rendement_brut" integer,
	"economie_impots_10_ans" integer,
	"est_complet" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "villes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code_insee" varchar(5) NOT NULL,
	"nom" text NOT NULL,
	"departement" varchar(3) NOT NULL,
	"region" text,
	"zone_fiscale" "zone_fiscale" NOT NULL,
	"tension_locative" "tension_locative",
	"niveau_loyer" "niveau_loyer",
	"prix_m2_moyen" integer,
	"loyer_m2_moyen" integer,
	"population_commune" integer,
	"slug" text NOT NULL,
	"espo_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "villes_code_insee_unique" UNIQUE("code_insee"),
	CONSTRAINT "villes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_promoter_id_promoters_id_fk" FOREIGN KEY ("promoter_id") REFERENCES "public"."promoters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_broker_id_brokers_id_fk" FOREIGN KEY ("broker_id") REFERENCES "public"."brokers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_simulation_id_simulations_id_fk" FOREIGN KEY ("simulation_id") REFERENCES "public"."simulations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_ville_id_villes_id_fk" FOREIGN KEY ("ville_id") REFERENCES "public"."villes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "programmes" ADD CONSTRAINT "programmes_promoter_id_promoters_id_fk" FOREIGN KEY ("promoter_id") REFERENCES "public"."promoters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_ville_id_villes_id_fk" FOREIGN KEY ("ville_id") REFERENCES "public"."villes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "simulations" ADD CONSTRAINT "simulations_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brokers_active_idx" ON "brokers" USING btree ("active");--> statement-breakpoint
CREATE INDEX "leads_platform_idx" ON "leads" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_user_id_idx" ON "leads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "leads_simulation_id_idx" ON "leads" USING btree ("simulation_id");--> statement-breakpoint
CREATE INDEX "leads_promoter_id_idx" ON "leads" USING btree ("promoter_id");--> statement-breakpoint
CREATE INDEX "leads_broker_id_idx" ON "leads" USING btree ("broker_id");--> statement-breakpoint
CREATE INDEX "programmes_ville_id_idx" ON "programmes" USING btree ("ville_id");--> statement-breakpoint
CREATE INDEX "programmes_actif_idx" ON "programmes" USING btree ("actif");--> statement-breakpoint
CREATE INDEX "programmes_ville_actif_idx" ON "programmes" USING btree ("ville_id","actif");--> statement-breakpoint
CREATE INDEX "programmes_promoter_id_idx" ON "programmes" USING btree ("promoter_id");--> statement-breakpoint
CREATE INDEX "programmes_authorized_idx" ON "programmes" USING btree ("authorized");--> statement-breakpoint
CREATE INDEX "promoters_active_idx" ON "promoters" USING btree ("active");--> statement-breakpoint
CREATE INDEX "simulations_user_id_idx" ON "simulations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "simulations_ville_id_idx" ON "simulations" USING btree ("ville_id");--> statement-breakpoint
CREATE INDEX "simulations_user_complet_idx" ON "simulations" USING btree ("user_id","est_complet");--> statement-breakpoint
CREATE INDEX "simulations_programme_id_idx" ON "simulations" USING btree ("programme_id");--> statement-breakpoint
CREATE INDEX "villes_code_insee_idx" ON "villes" USING btree ("code_insee");--> statement-breakpoint
CREATE INDEX "villes_slug_idx" ON "villes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "villes_zone_tension_idx" ON "villes" USING btree ("zone_fiscale","tension_locative");--> statement-breakpoint
CREATE INDEX "villes_departement_idx" ON "villes" USING btree ("departement");