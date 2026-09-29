"use client";

import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import ProjectCard from "@/components/landing/ProjectCard";
import ProjectDetailPopup from "@/components/landing/ProjectDetailPopup";
import { SHOWCASE_COLUMNS, figmaPx } from "@/lib/landing-layout";
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
  const columns = Math.min(SHOWCASE_COLUMNS, projects.length);
  const rows = Math.ceil(projects.length / SHOWCASE_COLUMNS);
  const rowWidth = CARD_W * columns + CARD_GAP * Math.max(columns - 1, 0);
  const gridHeight = rows * CARD_H + CARD_GAP * Math.max(rows - 1, 0);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start",
          p: 0,
          gap: `${CARD_GAP}px`,
          width: rowWidth,
          height: gridHeight,
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
