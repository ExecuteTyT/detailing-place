CREATE TABLE `work_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`work_id` integer NOT NULL,
	`image` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON UPDATE no action ON DELETE cascade
);
