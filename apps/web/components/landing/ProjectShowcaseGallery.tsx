"use client";

import Box from "@mui/material/Box";
import { useCallback, useState } from "react";
import ProjectCard from "@/components/landing/ProjectCard";
import ProjectDetailPopup from "@/components/landing/ProjectDetailPopup";
import { figmaPx } from "@/lib/landing-layout";

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_GAP = figmaPx(24);
const ROW_W = CARD_W * 3 + CARD_GAP * 2;

export default function ProjectShowcaseGallery({
  projects,
  imageSrc,
  detailImageSrc,
}: {
  projects: readonly { title: string; description: string }[];
  imageSrc: string | null;
  detailImageSrc: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const close = useCallback(() => setSelected(null), []);

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
          width: ROW_W,
          height: CARD_H,
          flexShrink: 0,
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            description={project.description}
            imageSrc={imageSrc}
            cursorLabel="View Project"
            onOpen={() => setSelected(project.title)}
          />
        ))}
      </Box>
      {selected ? (
        <ProjectDetailPopup
          projectKey={selected}
          onClose={close}
          imageSrc={detailImageSrc}
        />
      ) : null}
    </>
  );
}
