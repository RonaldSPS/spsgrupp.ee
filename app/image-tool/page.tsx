"use client";

import { useState } from "react";

const locations = [
  { value: "hero", label: "Hero Section" },
  { value: "services", label: "Services Cards" },
  { value: "trust", label: "Trust Section" },
  { value: "industries", label: "Industries Section" },
  { value: "testimonials", label: "Testimonials" },
];

const dimensions: Record<string, { width: number; height: number }[]> = {
  hero: [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
    { width: 640, height: 360 },
  ],
  services: [
    { width: 800, height: 400 },
    { width: 400, height: 200 },
  ],
  trust: [{ width: 920, height: 460 }],
  industries: [{ width: 800, height: 460 }],
  testimonials: [{ width: 400, height: 400 }],
};

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("services");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; images?: string[]; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("location", location);

    try {
      const response = await fetch("/api/image-resize", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Image Resizer to WebP</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {locations.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              Target sizes: {dimensions[location].map(d => `${d.width}x${d.height}`).join(", ")}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Processing..." : "Convert to WebP"}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-lg ${result.success ? "bg-green-50" : "bg-red-50"}`}>
            {result.success ? (
              <>
                <p className="font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-600 mt-1">Generated images:</p>
                <ul className="mt-2 text-sm text-green-700">
                  {result.images?.map((img, i) => (
                    <li key={i}>{img}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-red-800">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}