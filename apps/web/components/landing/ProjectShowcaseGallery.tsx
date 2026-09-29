"use client";

import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import ProjectCard from "@/components/landing/ProjectCard";
import ProjectDetailPopup from "@/components/landing/ProjectDetailPopup";
import { figmaPx } from "@/lib/landing-layout";
import { projectTagLine, type ShowcaseProject } from "@/lib/projects";

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_GAP = figmaPx(24);

export default function ProjectShowcaseGallery({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const close = useCallback(() => setSelectedId(null), []);
  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const rowWidth =
    CARD_W * projects.length + CARD_GAP * Math.max(projects.length - 1, 0);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          p: 0,
          gap: `${CARD_GAP}px`,
          width: rowWidth,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.name}
            description={projectTagLine(project.tags)}
            imageSrc={project.mainImageUrl}
            cursorLabel="View Project"
            onOpen={() => setSelectedId(project.id)}
          />
        ))}
      </Box>
      {selected ? (
        <ProjectDetailPopup project={selected} onClose={close} />
      ) : null}
    </>
  );
}
