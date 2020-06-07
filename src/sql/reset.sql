DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE "service"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"key" VARCHAR(50) UNIQUE NOT NULL,
   "role" INTEGER NOT NULL
);

CREATE TABLE "action" 
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"key" VARCHAR(50) NOT NULL,
	"service_id" INTEGER REFERENCES "service" ON DELETE CASCADE NOT NULL,
   
   UNIQUE("service_id", "key"),
   -- Для создания вторичного ключа от notice
   UNIQUE("service_id", "id")
);


CREATE TABLE "account"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "username" VARCHAR(50) UNIQUE NOT NULL,
   "password" VARCHAR(150) NOT NULL,
   "nickname" VARCHAR(50) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL
);

CREATE TABLE "config"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"token" VARCHAR(100) NULL,
   "account_id" INTEGER REFERENCES "account" ON DELETE CASCADE NOT NULL,
   "service_id" INTEGER REFERENCES "service" ON DELETE CASCADE NOT NULL,

-- Временное решение для ограничения создания множества конфигураций у одного пользователя
   UNIQUE("account_id", "service_id")
);

CREATE TABLE "notice"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "message_template" VARCHAR(300) NOT NULL,
   "config_id" INTEGER REFERENCES "config" ON DELETE CASCADE NOT NULL,
   
   "action_id" INTEGER NOT NULL,
   "service_id" INTEGER NOT NULL,

   FOREIGN KEY ("action_id", "service_id") REFERENCES "action"("id", "service_id") ON DELETE CASCADE
 );

CREATE TABLE "notice_target" (
   "id" SERIAL PRIMARY KEY NOT NULL,
   "notice_id" INTEGER REFERENCES "notice" ON DELETE CASCADE NOT NULL,
   "action_id" INTEGER REFERENCES "action" ON DELETE CASCADE NOT NULL,

   -- Если NULL - выбираем из notice_value пользовательское значение по коду,
   -- забитому в коде бота
   "target_key" VARCHAR(50) NULL

   -- UNIQUE("notice_id", "action_id")
);

-- TODO Триггер на удаление если изменилось событие у нотиса
CREATE OR REPLACE FUNCTION f_delete_if_action_changed()
  RETURNS TRIGGER AS
'
BEGIN
	IF OLD."action_id"!=NEW."action_id" THEN
		DELETE FROM "notice_values" WHERE "notice_id"=OLD."id";
		DELETE FROM "notice_actions" WHERE "notice_id"=OLD."id";
	END IF;
   RETURN NEW;
END;
' LANGUAGE 'plpgsql';

CREATE TABLE "notice_value"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"name" VARCHAR(50) NOT NULL,
	"key" VARCHAR(50) NOT NULL,
   "value" VARCHAR(50) NOT NULL,
   "notice_id" INTEGER REFERENCES "notice" ON DELETE CASCADE,
   
   UNIQUE("notice_id", "key")
);

CREATE TABLE "notice_query"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"name" VARCHAR(50) NOT NULL,
   "key" VARCHAR(50) NOT NULL,
   "custom_key" VARCHAR(50) NOT NULL DEFAULT '',
   "role" INTEGER NOT NULL,
   "notice_id" INTEGER REFERENCES "notice" ON DELETE CASCADE NOT NULL,
   
   UNIQUE("key", "notice_id")
);