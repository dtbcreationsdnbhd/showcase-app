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

  if (!fullName || !contact || !lookingToBuild || services.length === 0) {
    return { ok: false, message: "Please fill in the required fields." };
  }

  const { error } = await createBrowserClient()
    .from(inquiryTable())
    .insert({
      source: input.source,
      services,
      budget: input.budget,
      project_cycle: input.projectCycle,
      full_name: fullName,
      contact,
      looking_to_build: lookingToBuild,
      project_details: projectDetails || null,
    });

  if (error) {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
