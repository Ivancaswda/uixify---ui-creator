ALTER TABLE "projects" ADD COLUMN "screenCount" integer DEFAULT 4;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "screenShot" json;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "apiKey" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "isPremium" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripeCustomerId" varchar;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "credits";