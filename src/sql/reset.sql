DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "service" CASCADE;
DROP TABLE IF EXISTS "service_action" CASCADE;
DROP TABLE IF EXISTS "service_configuration" CASCADE;
DROP TABLE IF EXISTS "service_configuration_variable" CASCADE;
DROP TABLE IF EXISTS "service_type" CASCADE;
DROP TABLE IF EXISTS "service_variable" CASCADE;
DROP TABLE IF EXISTS "service_variable_role" CASCADE;
DROP TABLE IF EXISTS "target_payload" CASCADE;

CREATE TABLE "service_type"
(
   "id" SERIAL PRIMARY KEY NOT NULL,
   "type" VARCHAR(50) UNIQUE NOT NULL,
   "name" VARCHAR(50) NOT NULL
);

CREATE TABLE "service_action" 
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "name" VARCHAR(50) NOT NULL,
   "type_id" INTEGER REFERENCES "service_type" NOT NULL 
);

CREATE TABLE "service"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "name" VARCHAR(50) NOT NULL,
   "type_id" INTEGER REFERENCES "service_type" NOT NULL
);

CREATE TABLE "service_variable_role"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "type" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "service_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "default_key" VARCHAR(50) UNIQUE NOT NULL,
   "data_path" VARCHAR(100) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL,
   "role_id" INTEGER REFERENCES "service_variable_role" NOT NULL
);

CREATE TABLE "account"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "username" VARCHAR(50) UNIQUE NOT NULL,
   "password_hash" VARCHAR(150) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL
);

CREATE TABLE "target_payload"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "message_template" VARCHAR(300) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL
);

CREATE TABLE "service_configuration"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"host" VARCHAR(50),
	"token" VARCHAR(100),
   "account_id" INTEGER REFERENCES "account" NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL,
   "target_id" INTEGER REFERENCES "target_payload"
);
CREATE TABLE "service_configuration_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"custom_key" VARCHAR(50),
   "configuration_id" INTEGER REFERENCES "service_configuration" NOT NULL,
   "variable_id" INTEGER REFERENCES "service_variable" NOT NULL
);

INSERT INTO "service_type" VALUES 
 	(DEFAULT, 'respository', 'Репозиторий'),
 	(DEFAULT, 'task', 'Сервис задач'),
 	(DEFAULT, 'messenger', 'Мессенджер');

INSERT INTO "service_action" VALUES 
 	(DEFAULT, 'Ревью PR', (SELECT "id" FROM "service_type" WHERE "type"='respository')),
 	(DEFAULT, 'Упоминание', (SELECT "id" FROM "service_type" WHERE "type"='respository')),
 	(DEFAULT, 'Смена статуса', (SELECT "id" FROM "service_type" WHERE "type"='task'));
 	
INSERT INTO "service" VALUES 
	(DEFAULT, 'GitHub', (SELECT "id" FROM "service_type" WHERE "type"='respository')),
 	(DEFAULT, 'BitBucket', (SELECT "id" FROM "service_type" WHERE "type"='respository')),
	(DEFAULT, 'Telegram', (SELECT "id" FROM "service_type" WHERE "type"='messenger')),
 	(DEFAULT, 'VK', (SELECT "id" FROM "service_type" WHERE "type"='task'));

INSERT INTO "service_variable_role" VALUES 
 	(DEFAULT, 'messenger'),
 	(DEFAULT, 'text'),
 	(DEFAULT, 'username');
 	
INSERT INTO "service_variable" VALUES 
	(DEFAULT, 'REVIEWER_USERNAME', 'username', (SELECT "id" FROM "service" WHERE "name"='GitHub'), (SELECT "id" FROM "service_variable_role" WHERE "type"='username')),
	(DEFAULT, 'REVIEWER_MESSENGER', 'messenger', (SELECT "id" FROM "service" WHERE "name"='GitHub'), (SELECT "id" FROM "service_variable_role" WHERE "type"='messenger'));

INSERT INTO "account" VALUES 
	(DEFAULT, 'danixoon', '$2b$10$1N3RfmrbnJ/9xxfdmAv3/ezsyiSPvGjrtWmF6tbx8mAA1.wtjBPE6', (SELECT "id" FROM "service" WHERE "name"='Telegram'));
	