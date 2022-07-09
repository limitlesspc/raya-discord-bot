-- CreateTable
CREATE TABLE "User" (
    "id" CHAR(18) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "counts" JSONB,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uid" CHAR(18) NOT NULL,
    "name" STRING NOT NULL,
    "songs" JSONB NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ratio" (
    "id" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" STRING NOT NULL,

    CONSTRAINT "Ratio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" STRING NOT NULL,
    "fileName" STRING NOT NULL,
    "size" INT4 NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Y7Image" (
    "id" STRING NOT NULL,
    "fileName" STRING NOT NULL,
    "size" INT4 NOT NULL,
    "width" INT2 NOT NULL,
    "height" INT2 NOT NULL,

    CONSTRAINT "Y7Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Y7GIF" (
    "id" STRING NOT NULL,
    "fileName" STRING NOT NULL,
    "size" INT4 NOT NULL,
    "width" INT2 NOT NULL,
    "height" INT2 NOT NULL,
    "frames" INT2 NOT NULL,

    CONSTRAINT "Y7GIF_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_uid_name_key" ON "Playlist"("uid", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ratio_text_key" ON "Ratio"("text");

-- CreateIndex
CREATE UNIQUE INDEX "Image_fileName_key" ON "Image"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "Y7Image_fileName_key" ON "Y7Image"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "Y7GIF_fileName_key" ON "Y7GIF"("fileName");
