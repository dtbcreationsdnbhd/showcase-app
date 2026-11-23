import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import WebsitePreview from "@/components/landing/WebsitePreview";
import { getLocale } from "@/lib/get-locale";
import { listProjects, localizeProjects } from "@/lib/projects";

export default async function ProjectPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = localizeProjects(await listProjects(), await getLocale());
  const project = projects.find((item) => item.id === id) ?? null;

  if (!project) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#fff" }}>
        <Typography>Project not found.</Typography>
      </Box>
    );
  }

  return <WebsitePreview project={project} />;
}
