import { createBrowserClient } from "@/lib/supabase/client";

const INQUIRY_TABLES = ["staging_inquiries", "production_inquiries"] as const;

type InquiryTable = (typeof INQUIRY_TABLES)[number];

export type InquirySource = "web" | "mobile";

export type InquiryInput = {
  source: InquirySource;
  services: string[];
  budget: string | null;
  projectCycle: string | null;
  fullName: string;
  contact: string;
  lookingToBuild: string;
  projectDetails: string;
  telegram?: string;
  service?: string;
  brandName?: string;
  region?: string;
};

export type InquiryResult = { ok: true } | { ok: false; message: string };

function inquiryTable(): InquiryTable {
  const name = process.env.NEXT_PUBLIC_INQUIRY_TABLE;
  if (name === "staging_inquiries" || name === "production_inquiries") {
    return name;
  }

  throw new Error(
    "NEXT_PUBLIC_INQUIRY_TABLE must be staging_inquiries or production_inquiries.",
  );
}

export async function submitInquiry(input: InquiryInput): Promise<InquiryResult> {
  const fullName = input.fullName.trim();
  const contact = input.contact.trim();
  const lookingToBuild = input.lookingToBuild.trim();
  const services = input.services.map((item) => item.trim()).filter(Boolean);
  const projectDetails = input.projectDetails.trim();
  const telegram = input.telegram?.trim() ?? "";
  const service = input.service?.trim() ?? "";
  const brandName = input.brandName?.trim() ?? "";
  const region = input.region?.trim() ?? "";

  if (input.source === "web") {
    if (!fullName || !telegram || !service) {
      return { ok: false, message: "Please fill in the required fields." };
    }
  } else if (!fullName || !contact || !lookingToBuild || services.length === 0) {
    return { ok: false, message: "Please fill in the required fields." };
  }

  const table = createBrowserClient().from(inquiryTable());
  const { error } = await (input.source === "web"
    ? table.insert({
        source: "web",
        services,
        budget: null,
        project_cycle: null,
        full_name: fullName,
        contact: null,
        looking_to_build: null,
        project_details: projectDetails || null,
        telegram,
        service,
        brand_name: brandName || null,
        region: region || null,
      })
    : table.insert({
        source: "mobile",
        services,
        budget: input.budget,
        project_cycle: input.projectCycle,
        full_name: fullName,
        contact,
        looking_to_build: lookingToBuild,
        project_details: projectDetails || null,
      }));

  if (error) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
