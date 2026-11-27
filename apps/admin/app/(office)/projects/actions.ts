"use server";

import { revalidatePath } from "next/cache";

import { MAX_DETAIL_MEDIA, mediaFileError } from "@/lib/project-media";
import { isProjectCategory, projectTable } from "@/lib/projects";
import {
  MAX_PROJECT_FEATURES,
  isFeatureIcon,
  type ProjectFeature,
} from "@/lib/project-sheet";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "project-images";

type ActionResult = { ok: true } | { ok: false; message: string };

const PROJECT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function createShowcaseProject(
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const sheet = readSheet(formData);
  const mainImage = imageFile(formData.get("mainImage"));
  const detailImages = formData
    .getAll("detailImages")
    .map(imageFile)
    .filter((file): file is File => file !== null);

  if (!isProjectCategory(categoryRaw)) {
    return { ok: false, message: "Pick a category." };
  }
  const category = categoryRaw;

  if (!name) {
    return { ok: false, message: "Fill in every field." };
  }

  if (!sheet.ok) return sheet;

  if (!mainImage) {
    return {
      ok: false,
      message: "Upload a main media file.",
    };
  }

  if (detailImages.length > MAX_DETAIL_MEDIA) {
    return {
      ok: false,
      message: `Detail media is limited to ${MAX_DETAIL_MEDIA} files.`,
    };
  }

  const mediaProblem = [mainImage, ...detailImages]
    .map(mediaError)
    .find((message) => message !== null);
  if (mediaProblem) {
    return { ok: false, message: mediaProblem };
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

  const row = {
    id,
    name,
    category,
    tags: [],
    subtitle: sheet.subtitle,
    features: sheet.features,
    why_it: sheet.whyIt,
    how_we_help: sheet.howWeHelp,
    cta_text: sheet.ctaText,
    footer_text: sheet.footerText,
    challenge: "",
    solution: "",
    main_image_url: mainUrl,
    detail_image_urls: detailUrls,
    updated_at: new Date().toISOString(),
  };
  const saved = await writeProject(supabase, table, "insert", row, sheet);

  if (!saved.ok) {
    await supabase.storage.from(BUCKET).remove(uploaded);
    return saved;
  }

  revalidatePath("/projects");
  return { ok: true };
}

export async function updateShowcaseProject(
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "").trim();
  const sheet = readSheet(formData);
  const mainImage = imageFile(formData.get("mainImage"));
  const detailImages = formData
    .getAll("detailImages")
    .map(imageFile)
    .filter((file): file is File => file !== null);
  const keptMain = String(formData.get("keptMainImage") ?? "").trim();
  const keptDetailInputs = formData
    .getAll("keptDetailImages")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return { ok: false, message: "Could not save the project." };
  }

  if (!isProjectCategory(categoryRaw)) {
    return { ok: false, message: "Pick a category." };
  }
  const category = categoryRaw;

  if (!name) {
    return { ok: false, message: "Fill in every field." };
  }

  if (!sheet.ok) return sheet;

  const mediaProblem = [mainImage, ...detailImages]
    .filter((file): file is File => file !== null)
    .map(mediaError)
    .find((message) => message !== null);
  if (mediaProblem) {
    return { ok: false, message: mediaProblem };
  }

  if (!mainImage && !keptMain) {
    return {
      ok: false,
      message: "Upload a main media file.",
    };
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
    return { ok: false, message: "Sign in to update a project." };
  }

  const { data: existing, error: readError } = await supabase
    .from(table)
    .select("id, main_image_url, detail_image_urls")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    return { ok: false, message: saveError(readError.message) };
  }

  if (!existing) {
    return { ok: false, message: "Could not save the project." };
  }

  const currentMain =
    typeof existing.main_image_url === "string" ? existing.main_image_url : "";
  const currentDetails: string[] = Array.isArray(existing.detail_image_urls)
    ? existing.detail_image_urls.filter(
        (item: unknown): item is string => typeof item === "string",
      )
    : [];
  if (keptMain && keptMain !== currentMain) {
    return { ok: false, message: "Could not save the project." };
  }

  if (keptDetailInputs.some((url) => !currentDetails.includes(url))) {
    return { ok: false, message: "Could not save the project." };
  }

  const keptDetailUrls = currentDetails.filter((url) =>
    keptDetailInputs.includes(url),
  );
  if (keptDetailUrls.length + detailImages.length > MAX_DETAIL_MEDIA) {
    return {
      ok: false,
      message: `Detail media is limited to ${MAX_DETAIL_MEDIA} files.`,
    };
  }
  if (!mainImage && !keptMain) {
    return {
      ok: false,
      message: "Upload a main media file.",
    };
  }

  const uploaded: string[] = [];
  let mainUrl = keptMain;

  if (mainImage) {
    const mainPath = `${id}/main-${crypto.randomUUID()}.${extension(mainImage)}`;
    const mainUpload = await supabase.storage.from(BUCKET).upload(mainPath, mainImage, {
      contentType: mainImage.type,
      upsert: false,
    });

    if (mainUpload.error) {
      return { ok: false, message: saveError(mainUpload.error.message) };
    }

    uploaded.push(mainPath);
    mainUrl = supabase.storage.from(BUCKET).getPublicUrl(mainPath).data.publicUrl;
  }

  const detailPaths = detailImages.map(
    (file) => `${id}/detail-${crypto.randomUUID()}.${extension(file)}`,
  );

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

  const uploadedDetailUrls = detailPaths.map(
    (path) => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
  );
  const detailUrls = [...keptDetailUrls, ...uploadedDetailUrls];

  const saved = await writeProject(
    supabase,
    table,
    "update",
    {
      name,
      category,
      subtitle: sheet.subtitle,
      features: sheet.features,
      why_it: sheet.whyIt,
      how_we_help: sheet.howWeHelp,
      cta_text: sheet.ctaText,
      footer_text: sheet.footerText,
      main_image_url: mainUrl,
      detail_image_urls: detailUrls,
    },
    sheet,
    id,
  );

  if (!saved.ok) {
    await supabase.storage.from(BUCKET).remove(uploaded);
    return saved;
  }

  const dropped = [
    ...(mainUrl === currentMain || !currentMain ? [] : [currentMain]),
    ...currentDetails.filter((url) => !detailUrls.includes(url)),
  ];
  const droppedPaths = dropped
    .map(storagePath)
    .filter((path): path is string => path !== null && path.startsWith(`${id}/`) && !path.includes(".."));

  if (droppedPaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(droppedPaths);
  }

  revalidatePath("/projects");
  return { ok: true };
}

export async function deleteShowcaseProject(id: string): Promise<ActionResult> {
  if (!PROJECT_ID.test(id)) {
    return { ok: false, message: "Could not delete the project." };
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
    return { ok: false, message: "Sign in to delete a project." };
  }

  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select("id");

  if (error || !data?.length) {
    return {
      ok: false,
      message: error ? deleteError(error.message) : "Could not delete the project.",
    };
  }

  const listed = await supabase.storage.from(BUCKET).list(id);
  if (!listed.error && listed.data?.length) {
    await supabase.storage.from(BUCKET).remove(
      listed.data.map((file) => `${id}/${file.name}`),
    );
  }

  revalidatePath("/projects");
  return { ok: true };
}

type ProjectSheet = {
  subtitle: string;
  features: ProjectFeature[];
  whyIt: string;
  howWeHelp: string;
  ctaText: string;
  footerText: string;
  landingUrl: string;
  nameZh: string;
  subtitleZh: string;
  whyItZh: string;
  howWeHelpZh: string;
  ctaTextZh: string;
  footerTextZh: string;
};

function zhColumns(sheet: ProjectSheet) {
  return {
    name_zh: sheet.nameZh,
    subtitle_zh: sheet.subtitleZh,
    why_it_zh: sheet.whyItZh,
    how_we_help_zh: sheet.howWeHelpZh,
    cta_text_zh: sheet.ctaTextZh,
    footer_text_zh: sheet.footerTextZh,
  };
}

function landingColumns(sheet: ProjectSheet) {
  return {
    landing_url: sheet.landingUrl,
  };
}

const ZH_COLUMNS_MISSING =
  "Chinese fields need the new project columns. Run apps/web/supabase/schema.sql in the Supabase SQL Editor, then save again.";

const LANDING_COLUMNS_MISSING =
  "Landing page fields need the new project columns. Run apps/web/supabase/schema.sql in the Supabase SQL Editor, then save again.";

function sheetHasZhColumns(sheet: ProjectSheet) {
  return Object.values(zhColumns(sheet)).some((value) => value.length > 0);
}

function missingZhColumn(message: string) {
  return message.includes("name_zh") || message.includes("schema cache");
}

function missingLandingColumn(message: string) {
  return message.includes("landing_url");
}

function sheetHasLanding(sheet: ProjectSheet) {
  return Object.values(landingColumns(sheet)).some((value) => value.length > 0);
}

type OfficeClient = Awaited<ReturnType<typeof createClient>>;

async function writeProject(
  supabase: OfficeClient,
  table: ReturnType<typeof projectTable>,
  mode: "insert" | "update",
  row: Record<string, unknown>,
  sheet: ProjectSheet,
  id?: string,
): Promise<ActionResult> {
  const withZh = { ...row, ...zhColumns(sheet), ...landingColumns(sheet) };
  let wrote =
    mode === "insert"
      ? await supabase.from(table).insert(withZh)
      : await supabase.from(table).update(withZh).eq("id", id ?? "").select("id");

  if (!wrote.error && (mode === "insert" || (wrote.data?.length ?? 0) > 0)) {
    return { ok: true };
  }

  if (wrote.error && missingLandingColumn(wrote.error.message)) {
    if (sheetHasLanding(sheet)) {
      return { ok: false, message: LANDING_COLUMNS_MISSING };
    }
    const withoutLanding = { ...row, ...zhColumns(sheet) };
    wrote =
      mode === "insert"
        ? await supabase.from(table).insert(withoutLanding)
        : await supabase.from(table).update(withoutLanding).eq("id", id ?? "").select("id");
    if (!wrote.error && (mode === "insert" || (wrote.data?.length ?? 0) > 0)) {
      return { ok: true };
    }
  }

  if (wrote.error && missingZhColumn(wrote.error.message)) {
    if (sheetHasZhColumns(sheet)) return { ok: false, message: ZH_COLUMNS_MISSING };
    const plain =
      mode === "insert"
        ? await supabase.from(table).insert(row)
        : await supabase.from(table).update(row).eq("id", id ?? "").select("id");
    if (!plain.error && (mode === "insert" || (plain.data?.length ?? 0) > 0)) {
      return { ok: true };
    }
    return {
      ok: false,
      message: plain.error
        ? saveError(plain.error.message)
        : "Could not save the project. Run the showcase SQL in the Supabase SQL Editor first.",
    };
  }

  if (wrote.error) return { ok: false, message: saveError(wrote.error.message) };
  return {
    ok: false,
    message: "Could not save the project. Run the showcase SQL in the Supabase SQL Editor first.",
  };
}

function readSheet(formData: FormData):
  | ({ ok: true } & ProjectSheet)
  | { ok: false; message: string } {
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const whyIt = String(formData.get("whyIt") ?? "").trim();
  const howWeHelp = String(formData.get("howWeHelp") ?? "").trim();
  const ctaText = String(formData.get("ctaText") ?? "").trim();
  const footerText = String(formData.get("footerText") ?? "").trim();
  const nameZh = String(formData.get("nameZh") ?? "").trim();
  const subtitleZh = String(formData.get("subtitleZh") ?? "").trim();
  const whyItZh = String(formData.get("whyItZh") ?? "").trim();
  const howWeHelpZh = String(formData.get("howWeHelpZh") ?? "").trim();
  const ctaTextZh = String(formData.get("ctaTextZh") ?? "").trim();
  const footerTextZh = String(formData.get("footerTextZh") ?? "").trim();
  const landingUrl = String(formData.get("landingUrl") ?? "").trim();

  if (landingUrl && !landingPageUrl(landingUrl)) {
    return {
      ok: false,
      message: "Landing page link must start with http:// or https://.",
    };
  }

  if (!subtitle || !whyIt || !howWeHelp || !ctaText || !footerText) {
    return { ok: false, message: "Fill in every field." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("features") ?? ""));
  } catch {
    return { ok: false, message: "Add between 1 and 6 key features." };
  }

  if (
    !Array.isArray(parsed) ||
    parsed.length === 0 ||
    parsed.length > MAX_PROJECT_FEATURES
  ) {
    return { ok: false, message: "Add between 1 and 6 key features." };
  }

  const features: ProjectFeature[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") {
      return { ok: false, message: "Each key feature needs a name and an icon." };
    }
    const label = String((item as { label?: unknown }).label ?? "").trim();
    const labelZh = String((item as { labelZh?: unknown }).labelZh ?? "").trim();
    const icon = (item as { icon?: unknown }).icon;
    if (!label || !isFeatureIcon(icon)) {
      return { ok: false, message: "Each key feature needs a name and an icon." };
    }
    features.push(labelZh ? { label, labelZh, icon } : { label, icon });
  }

  return {
    ok: true,
    subtitle,
    features,
    whyIt,
    howWeHelp,
    ctaText,
    footerText,
    landingUrl,
    nameZh,
    subtitleZh,
    whyItZh,
    howWeHelpZh,
    ctaTextZh,
    footerTextZh,
  };
}

function landingPageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function imageFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  return value;
}

function mediaError(file: File) {
  return mediaFileError(file);
}

function extension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/webm") return "webm";
  return "jpg";
}

function storagePath(url: string) {
  const markers = [
    `/storage/v1/object/public/${BUCKET}/`,
    `/object/public/${BUCKET}/`,
  ];

  for (const marker of markers) {
    const index = url.indexOf(marker);
    if (index === -1) continue;
    return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
  }

  return null;
}

function saveError(message: string) {
  if (/does not exist|Bucket not found|relation|row-level security|permission denied/i.test(message)) {
    return "Could not save the project. Run the showcase SQL in the Supabase SQL Editor first.";
  }

  return "Could not save the project.";
}

function deleteError(message: string) {
  if (/does not exist|permission denied|row-level security/i.test(message)) {
    return "Could not delete the project. Run the showcase SQL in the Supabase SQL Editor first.";
  }

  return "Could not delete the project.";
}
