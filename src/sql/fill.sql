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
   "passport_hash" VARCHAR(150) NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL
);

CREATE TABLE "payload"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
   "message_template" VARCHAR(300) NOT NULL
);

CREATE TABLE "service_configuration"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"host" VARCHAR(50),
	"token" VARCHAR(100),
   "account_id" INTEGER REFERENCES "account" NOT NULL,
   "service_id" INTEGER REFERENCES "service" NOT NULL,
   "payload_id" INTEGER REFERENCES "payload" NOT NULL
);
CREATE TABLE "service_configuration_variable"
(
	"id" SERIAL PRIMARY KEY NOT NULL,
	"custom_key" VARCHAR(50),
   "configuration_id" INTEGER REFERENCES "service_configuration" NOT NULL,
   "variable_id" INTEGER REFERENCES "service_variable" NOT NULL
);