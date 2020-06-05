DROP TABLE IF EXISTS "account" CASCADE;
DROP TABLE IF EXISTS "service" CASCADE;
DROP TABLE IF EXISTS "service_type" CASCADE;
DROP TABLE IF EXISTS "service_action" CASCADE;
DROP TABLE IF EXISTS "service_action_variable" CASCADE;
DROP TABLE IF EXISTS "service_configuration" CASCADE;
DROP TABLE IF EXISTS "service_configuration_variable" CASCADE;
DROP TABLE IF EXISTS "service_variable" CASCADE;
DROP TABLE IF EXISTS "service_variable_role" CASCADE;
DROP TABLE IF EXISTS "service_notification" CASCADE;
DROP TABLE IF EXISTS "service_notification_variable" CASCADE;


CREATE TABLE "service"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"type" VARCHAR(50) UNIQUE NOT NULL,
   "name" VARCHAR(50) NOT NULL
);

CREATE TABLE "service_action" 
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"type" VARCHAR(50) NOT NULL,
   "name" VARCHAR(50) NOT NULL,
   "service_id" INTEGER REFERENCES "service" ON DELETE CASCADE NOT NULL,
   
   UNIQUE("service_id", "type")
);

CREATE TABLE "service_variable_role"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "type" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE "service_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "default_key" VARCHAR(50) NOT NULL,
   "name" VARCHAR(50) NOT NULL,
   "data_path" VARCHAR(100) NOT NULL,
   "service_id" INTEGER REFERENCES "service" ON DELETE CASCADE NOT NULL,
   "role_id" INTEGER REFERENCES "service_variable_role" NOT NULL,
   
   UNIQUE("default_key", "service_id")
);
-- Не может быть дубликатов с одинаковым default_key и service_id
CREATE UNIQUE INDEX idx_service_variable__default_key
ON "service_variable"("default_key", "service_id");

CREATE TABLE "account"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "username" VARCHAR(50) UNIQUE NOT NULL,
   "service_username" VARCHAR(50) NOT NULL,
   "password_hash" VARCHAR(150) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL
);

CREATE TABLE "service_configuration"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"token" VARCHAR(100),
   "account_id" INTEGER REFERENCES "account" ON DELETE CASCADE NOT NULL,
   "service_id" INTEGER REFERENCES "service" ON DELETE CASCADE NOT NULL
);

CREATE TABLE "service_configuration_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"custom_key" VARCHAR(50),
   "configuration_id" INTEGER REFERENCES "service_configuration" ON DELETE CASCADE NOT NULL,
   "variable_id" INTEGER REFERENCES "service_variable" NOT NULL
);

CREATE TABLE "service_action_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"type" VARCHAR(50) NOT NULL,
	"name" VARCHAR(50) NOT NULL,
   "action_id" INTEGER REFERENCES "service_action" ON DELETE CASCADE NOT NULL,
   
   UNIQUE("type", "action_id")
);

-- Не может быть дубликатов с одинаковым custom_key и configuration_id
CREATE UNIQUE INDEX idx_service_configuration_variable__custom_key
ON "service_configuration_variable"("custom_key", "configuration_id")
WHERE "custom_key" IS NOT NULL;

CREATE TABLE "service_notification"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "message_template" VARCHAR(300) NOT NULL,
   "variable_id" INTEGER REFERENCES "service_configuration_variable" NOT NULL,
   "configuration_id" INTEGER REFERENCES "service_configuration" ON DELETE CASCADE NOT NULL,
   "action_id" INTEGER REFERENCES "service_action" NOT NULL
);

CREATE TABLE "service_notification_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"value" VARCHAR(100) NULL DEFAULT '',
   "variable_id" INTEGER REFERENCES "service_action_variable" NOT NULL,
   "notification_id" INTEGER REFERENCES "service_notification" ON DELETE CASCADE NOT NULL,
   
   UNIQUE ("notification_id", "variable_id")
);

CREATE OR REPLACE FUNCTION f_create_configuration_variables()
  RETURNS TRIGGER AS
'
BEGIN
	INSERT INTO "service_configuration_variable" ("configuration_id", "variable_id")
	SELECT NEW."id", "service_variable"."id"
   FROM "service_variable"
   WHERE "service_variable"."service_id"=NEW."service_id";
   RETURN NEW;
END;
' LANGUAGE 'plpgsql';

-- При создании конфигурации - создать соответствующие таблицы с переменными
CREATE TRIGGER "t_create_configuration_variables"
	AFTER INSERT ON "service_configuration"
	FOR EACH ROW EXECUTE PROCEDURE f_create_configuration_variables();

-- При создании нотификейшена - 
CREATE OR REPLACE FUNCTION f_create_notification_variables()
  RETURNS TRIGGER AS
'
BEGIN
	IF tg_op = ''UPDATE'' THEN
		DELETE FROM "service_notification_variable" WHERE "service_notification_variable"."notification_id"=OLD."id";
	END IF;
	INSERT INTO "service_notification_variable" ("variable_id", "notification_id")
	SELECT "service_action_variable"."id", NEW."id"
   FROM "service_action_variable"
   WHERE "service_action_variable"."action_id"=NEW."action_id";
   RETURN NEW;
END;
' LANGUAGE 'plpgsql';

-- При создании нотификейщна - создать соответствующие таблицы с переменными
CREATE TRIGGER "f_create_notification_variables"
	AFTER INSERT OR UPDATE ON "service_notification"
	FOR EACH ROW EXECUTE PROCEDURE f_create_notification_variables();

INSERT INTO "service" VALUES 
	(DEFAULT, 'github', 'GitHub'),
 	(DEFAULT, 'bitbucket','BitBucket'),
	(DEFAULT, 'telegram','Telegram'),
 	(DEFAULT, 'vk', 'Вконтакте');

INSERT INTO "service_action" VALUES 
 	(DEFAULT, 'review', 'Ревью PR', (SELECT "id" FROM "service" WHERE "type"='github')),
 	(DEFAULT, 'notification', 'Упоминание', (SELECT "id" FROM "service" WHERE "type"='github')),
 	(DEFAULT, 'post', 'Пост группы', (SELECT "id" FROM "service" WHERE "type"='vk'));

INSERT INTO "service_variable_role" VALUES 
 	(DEFAULT, 'messenger'),
 	(DEFAULT, 'text'),
 	(DEFAULT, 'username');
 	
INSERT INTO "service_variable" VALUES 
	(DEFAULT, 'REVIEWER_USERNAME', 'Имя ревьювера', 'username', (SELECT "id" FROM "service" WHERE "type"='github'), (SELECT "id" FROM "service_variable_role" WHERE "type"='username')),
	(DEFAULT, 'REVIEWER_MESSENGER', 'Мессенджер ревьювера', 'messenger', (SELECT "id" FROM "service" WHERE "type"='github'), (SELECT "id" FROM "service_variable_role" WHERE "type"='messenger')),
	(DEFAULT, 'POST_AUTHOR', 'Автор поста', 'username', (SELECT "id" FROM "service" WHERE "type"='vk'), (SELECT "id" FROM "service_variable_role" WHERE "type"='username')),
	(DEFAULT, 'POST_DATE', 'Дата поста', 'date', (SELECT "id" FROM "service" WHERE "type"='vk'), (SELECT "id" FROM "service_variable_role" WHERE "type"='text')),
	(DEFAULT, 'POST_URL', 'Ссылка на пост', 'url', (SELECT "id" FROM "service" WHERE "type"='vk'), (SELECT "id" FROM "service_variable_role" WHERE "type"='text')),
	(DEFAULT, 'MESSENGER', 'Логин отправки', 'action.messenger', (SELECT "id" FROM "service" WHERE "type"='vk'), (SELECT "id" FROM "service_variable_role" WHERE "type"='messenger'));
	
INSERT INTO "service_action_variable" VALUES 
	(DEFAULT, 'group_id', 'Ид. группы', (SELECT "service_action"."id" FROM "service_action" INNER JOIN "service" ON "service_action"."service_id"="service"."id" WHERE "service"."type"='vk'));

INSERT INTO "account" VALUES 
	(DEFAULT, 'danixoon', 'danixoon', '$2b$10$1N3RfmrbnJ/9xxfdmAv3/ezsyiSPvGjrtWmF6tbx8mAA1.wtjBPE6', (SELECT "id" FROM "service" WHERE "name"='Telegram')),
	(DEFAULT, 'test', 'ercassam', '$2b$10$5DfwDM13mL3rzXiEGkRtPuSnY6nLSGda/mh6B9VIH.tLB5cAH7kjC', (SELECT "id" FROM "service" WHERE "name"='Telegram'));
	
-- INSERT INTO "service_configuration" VALUES (DEFAULT, NULL, 1, 1);
-- INSERT INTO "service_notification" VALUES (DEFAULT, 'hi', 2, 1, 3);
	