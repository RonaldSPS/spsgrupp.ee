import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Define image dimensions per location
const imageConfigs: Record<string, { width: number; height: number }[]> = {
  // Hero section - responsive sizes
  "hero": [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 640, height: 360 },
  ],
  // Service cards - 400x200
  "services": [
    { width: 800, height: 400 },
    { width: 400, height: 200 },
  ],
  // Trust section
  "trust": [
    { width: 920, height: 460 },
  ],
  // Industries section - 800x460 for the slider
  "industries": [
    { width: 800, height: 460 },
    { width: 1600, height: 920 },
  ],
  // Testimonials
  "testimonials": [
    { width: 400, height: 400 },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const location = formData.get("location") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!location || !imageConfigs[location]) {
      return NextResponse.json(
        { error: `Invalid location. Valid options: ${Object.keys(imageConfigs).join(", ")}` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic import sharp
    const sharp = require("sharp");

    const configs = imageConfigs[location];
    const results: string[] = [];

    for (const config of configs) {
      // Generate filename with size suffix
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const filename = `${baseName}-${config.width}x${config.height}.webp`;
      const outputDir = path.join(process.cwd(), "public", "images", location);
      const outputPath = path.join(outputDir, filename);

      // Create directory if it doesn't exist
      await mkdir(outputDir, { recursive: true });

      // Resize and convert to WebP
      await sharp(buffer)
        .resize(config.width, config.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      results.push(`/images/${location}/${filename}`);
    }

    return NextResponse.json({
      success: true,
      location,
      images: results,
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}

// Get available locations
export async function GET() {
  return NextResponse.json({
    locations: Object.keys(imageConfigs),
    configs: imageConfigs,
  });
}