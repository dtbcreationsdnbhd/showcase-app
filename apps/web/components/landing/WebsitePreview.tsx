"use client";

import ProjectDetailPopup from "@/components/landing/ProjectDetailPopup";
import type { ShowcaseProject } from "@/lib/projects";

export default function WebsitePreview({ project }: { project: ShowcaseProject }) {
  return <ProjectDetailPopup project={project} onClose={() => {}} closable={false} />;
}
