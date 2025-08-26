CREATE TABLE `diseases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`disease_name` text NOT NULL,
	`medicine_measures` text NOT NULL,
	`fever` integer DEFAULT false,
	`headache` integer DEFAULT false,
	`cough` integer DEFAULT false,
	`nausea` integer DEFAULT false,
	`vomiting` integer DEFAULT false,
	`chest_pain` integer DEFAULT false,
	`breathlessness` integer DEFAULT false,
	`abdominal_pain` integer DEFAULT false,
	`sore_throat` integer DEFAULT false,
	`runny_nose` integer DEFAULT false,
	`body_aches` integer DEFAULT false,
	`sweating` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
