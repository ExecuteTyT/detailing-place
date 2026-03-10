import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB (before conversion)
const VALID_FOLDERS = ["hero", "works", "blog", "team", "studio", "before-after", "portfolio", "misc"] as const;
type UploadFolder = (typeof VALID_FOLDERS)[number];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "misc";
    // Optional: exact filename (without extension). Used for hero images: "ppf" → "ppf.webp"
    const targetName = formData.get("targetName") as string | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Файл не выбран" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Неподдерживаемый формат. Разрешены: JPEG, PNG, WebP, AVIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Файл слишком большой. Максимум 10 МБ." },
        { status: 400 }
      );
    }

    const targetFolder: UploadFolder = VALID_FOLDERS.includes(folder as UploadFolder)
      ? (folder as UploadFolder)
      : "misc";

    // Hero images go to /public/images/hero/ (convention path), others to /public/uploads/{folder}/
    const isHero = targetFolder === "hero" && targetName;
    const baseDir = isHero
      ? path.join(process.cwd(), "public", "images", "hero")
      : path.join(process.cwd(), "public", "uploads", targetFolder);
    await mkdir(baseDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to WebP with sharp
    const isAlreadyWebp = file.type === "image/webp";
    const webpBuffer = await sharp(buffer)
      .webp({ quality: isAlreadyWebp ? 90 : 82 })
      .toBuffer();

    // Determine filename
    let webpFilename: string;
    if (targetName) {
      // Sanitize target name
      const safeName = targetName.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
      webpFilename = `${safeName}.webp`;
    } else {
      const timestamp = Date.now();
      const baseName = file.name
        .replace(/\.[^.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .substring(0, 50);
      webpFilename = `${timestamp}-${baseName}.webp`;
    }

    const filepath = path.join(baseDir, webpFilename);
    await writeFile(filepath, webpBuffer);

    const url = isHero
      ? `/images/hero/${webpFilename}`
      : `/uploads/${targetFolder}/${webpFilename}`;
    const originalSize = buffer.length;
    const compressedSize = webpBuffer.length;

    return NextResponse.json({
      url,
      originalSize,
      compressedSize,
      savings: Math.round((1 - compressedSize / originalSize) * 100),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файла" },
      { status: 500 }
    );
  }
}
