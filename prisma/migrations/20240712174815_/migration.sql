-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "publicId" VARCHAR,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "type" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."changelog" (
    "id" SERIAL NOT NULL,
    "objectType" VARCHAR,
    "objectId" INTEGER,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,
    "objectAttr" VARCHAR NOT NULL,

    CONSTRAINT "changelog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" SERIAL NOT NULL,
    "objectType" VARCHAR NOT NULL,
    "objectId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "replyTo" INTEGER,
    "creatorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reportTypes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "group" VARCHAR NOT NULL,
    "markerColor" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "reportTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR,
    "streetNumber" INTEGER,
    "streetName" VARCHAR,
    "postalCode" VARCHAR,
    "neighborhood" VARCHAR,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "location" JSONB NOT NULL,
    "images" JSON,
    "status" VARCHAR NOT NULL,
    "details" TEXT,
    "reportTypeId" INTEGER NOT NULL,
    "assignedTo" VARCHAR,
    "scheduledDate" TIMESTAMPTZ(6),
    "creatorId" UUID,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "public"."users"("publicId");

-- AddForeignKey
ALTER TABLE "public"."changelog" ADD CONSTRAINT "changelog_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("publicId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("publicId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reportTypeId_fkey" FOREIGN KEY ("reportTypeId") REFERENCES "public"."reportTypes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."users"("publicId") ON DELETE NO ACTION ON UPDATE NO ACTION;
