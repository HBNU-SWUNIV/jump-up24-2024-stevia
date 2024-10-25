-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "student_id" INTEGER NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "department" VARCHAR(20) NOT NULL,
    "phone_no" VARCHAR(15) NOT NULL,
    "email" VARCHAR(254) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "building_room" (
    "id" UUID NOT NULL,
    "building_location" VARCHAR(20) NOT NULL,
    "building_name" VARCHAR(20) NOT NULL,
    "room_no" INTEGER NOT NULL,
    "room_image_url" TEXT NOT NULL,

    CONSTRAINT "building_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation" (
    "id" UUID NOT NULL,
    "usage_time" VARCHAR(20) NOT NULL,
    "reserve_time" TIMESTAMP NOT NULL,
    "reserver_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" UUID NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "password" VARCHAR(128) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_student_id_key" ON "user"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_admin_id_key" ON "admin"("admin_id");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_reserver_id_fkey" FOREIGN KEY ("reserver_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "building_room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
