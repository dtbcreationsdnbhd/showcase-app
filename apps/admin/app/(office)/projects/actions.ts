"use server";

import { revalidatePath } from "next/cache";

import { projectTable } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const BUCKET = "project-images";

type CreateResult = { ok: true } | { ok: false; message: string };

export async function createShowcaseProject(
  formData: FormData,
): Promise<CreateResult> {
  const name = String(formData.get("name") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const challenge = String(formData.get("challenge") ?? "").trim();
  const solution = String(formData.get("solution") ?? "").trim();
  const mainImage = imageFile(formData.get("mainImage"));
  const detailImages = formData
    .getAll("detailImages")
    .map(imageFile)
    .filter((file): file is File => file !== null);

  if (!name || tags.length === 0 || !challenge || !solution) {
    return { ok: false, message: "Fill in every field." };
  }

  if (!mainImage || detailImages.length === 0) {
    return {
      ok: false,
      message: "Upload a main image and at least one detail image.",
    };
  }

  const imageProblem = [mainImage, ...detailImages]
    .map(imageError)
    .find((message) => message !== null);
  if (imageProblem) {
    return { ok: false, message: imageProblem };
  }

  let table: ReturnType<typeof projectTable>;
  try {
    table = projectTable();
  } catch {
    return {
      ok: false,
      message: "Missing NEXT_PUBLIC_PROJECT_TABLE.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sign in to create a project." };
  }

  const id = crypto.randomUUID();
  const mainPath = `${id}/main.${extension(mainImage)}`;
  const detailPaths = detailImages.map(
    (file, index) => `${id}/detail-${index}.${extension(file)}`,
  );
  const uploaded = [mainPath];

  const mainUpload = await supabase.storage.from(BUCKET).upload(mainPath, mainImage, {
    contentType: mainImage.type,
    upsert: false,
  });

  if (mainUpload.error) {
    return { ok: false, message: saveError(mainUpload.error.message) };
  }

  for (let index = 0; index < detailImages.length; index += 1) {
    const file = detailImages[index];
    const path = detailPaths[index];
    const upload = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (upload.error) {
      await supabase.storage.from(BUCKET).remove(uploaded);
      return { ok: false, message: saveError(upload.error.message) };
    }

    uploaded.push(path);
  }

  const mainUrl = supabase.storage.from(BUCKET).getPublicUrl(mainPath).data.publicUrl;
  const detailUrls = detailPaths.map(
    (path) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
  );

  const { error } = await supabase.from(table).insert({
    id,
    name,
    tags,
    challenge,
    solution,
    main_image_url: mainUrl,
    detail_image_urls: detailUrls,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    await supabase.storage.from(BUCKET).remove(uploaded);
    return { ok: false, message: saveError(error.message) };
  }

  revalidatePath("/projects");
  return { ok: true };
}

function imageFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

function imageError(file: File) {
  if (!IMAGE_TYPES.has(file.type)) {
    return "Images must be JPG, PNG, or WebP.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Each image must be 5 MB or smaller.";
  }

  return null;
}

function extension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function saveError(message: string) {
  if (/does not exist|Bucket not found|relation/i.test(message)) {
    return "Could not save the project. Run the showcase SQL in the Supabase SQL Editor first.";
  }

  return "Could not save the project.";
}
