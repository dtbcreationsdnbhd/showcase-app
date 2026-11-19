import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { ReactNode } from "react";

import ContentFrame from "@/components/office/ContentFrame";
import EditProjectButton from "@/components/office/EditProjectButton";
import FeatureMark from "@/components/office/FeatureMark";
import { projectCategoryLabel } from "@/lib/project-categories";
import { isVideoUrl } from "@/lib/project-media";
import { FEATURE_ICON_LABELS } from "@/lib/project-sheet";
import { formatProjectDate, getProject, type ShowcaseProject } from "@/lib/projects";

const WEB_ORIGIN = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProject(id);
  const project = result.ok ? result.project : null;

  return (
    <ContentFrame
      header={
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0 }}>
            <Link
              href="/projects"
              aria-label="Back to projects"
              style={{ color: "inherit", textDecoration: "none", flexShrink: 0 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "8px",
                  color: "#171717",
                  "&:hover": { bgcolor: "#F4F1FB" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </Box>
            </Link>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {project?.name ?? "Project"}
                </Typography>
                {project ? (
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: 26,
                      px: 1.25,
                      borderRadius: "999px",
                      bgcolor: "#F4F1FB",
                      color: "#6A52F0",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {project.category ? projectCategoryLabel(project.category) : "No category"}
                  </Box>
                ) : null}
              </Box>
              {project ? (
                <Typography
                  sx={{
                    mt: 0.75,
                    maxWidth: 640,
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: project.subtitle ? "text.secondary" : "text.disabled",
                  }}
                >
                  {project.subtitle || "No subtitle"}
                </Typography>
              ) : null}
            </Box>
          </Box>
          {project ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Created {formatProjectDate(project.createdAt)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                  Updated {formatProjectDate(project.updatedAt)}
                </Typography>
              </Box>
              <EditProjectButton project={project} />
            </Box>
          ) : null}
        </Box>
      }
    >
      {project ? (
        <ProjectSheet project={project} />
      ) : (
        <Typography variant="body2" color="error" role="alert">
          {result.ok ? "" : result.message}
        </Typography>
      )}
    </ContentFrame>
  );
}

function ProjectSheet({ project }: { project: ShowcaseProject }) {
  const photos = [
    ...(project.mainImageUrl ? [{ url: project.mainImageUrl, label: "Main" }] : []),
    ...project.detailImageUrls.map((url, index) => ({ url, label: String(index + 1) })),
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Eyebrow>Photos</Eyebrow>
        {photos.length === 0 ? (
          <Muted>No photos yet</Muted>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {photos.map((photo) => (
              <PhotoCard key={`${photo.label}-${photo.url}`} url={photo.url} label={photo.label} />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Panel>
          <Eyebrow>Key features</Eyebrow>
          {project.features.length === 0 ? (
            <Muted>No key features yet</Muted>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.25,
              }}
            >
              {project.features.map((feature, index) => (
                <Box
                  key={`${feature.icon}-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    minWidth: 0,
                    px: 1.25,
                    py: 1,
                    borderRadius: "8px",
                    bgcolor: "#F7F5FC",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      borderRadius: "8px",
                      bgcolor: "#fff",
                    }}
                  >
                    <FeatureMark name={feature.icon} color="#6A52F0" />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                      {feature.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {FEATURE_ICON_LABELS[feature.icon]}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Panel>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Panel>
            <Eyebrow>Why you need it</Eyebrow>
            <Body>{project.whyIt}</Body>
          </Panel>
          <Panel>
            <Eyebrow>How we help</Eyebrow>
            <Body>{project.howWeHelp}</Body>
          </Panel>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Panel>
            <Eyebrow>Button text</Eyebrow>
            <Body>{project.ctaText}</Body>
          </Panel>
          <Panel>
            <Eyebrow>Line under the button</Eyebrow>
            <Body>{project.footerText}</Body>
          </Panel>
        </Box>
      </Box>

      <Box>
        <Eyebrow>Preview</Eyebrow>
        <Box
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            borderRadius: "8px",
            border: "1px solid #E6E1F2",
            bgcolor: "#2A0818",
          }}
        >
          <Box
            component="iframe"
            title={`${project.name} on the website`}
            src={`${WEB_ORIGIN}/preview/${project.id}`}
            sx={{ display: "block", width: "100%", height: "100%", border: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function PhotoCard({ url, label }: { url: string; label: string }) {
  const frame = {
    width: 148,
    height: 244,
    objectFit: "cover" as const,
    objectPosition: "center top",
    borderRadius: "8px",
    bgcolor: "#111",
    display: "block",
  };

  return (
    <Box sx={{ position: "relative", width: 148, flexShrink: 0 }}>
      {isVideoUrl(url) ? (
        <Box component="video" src={url} controls sx={frame} />
      ) : (
        <Box component="img" src={url} alt="" sx={frame} />
      )}
      <Box
        sx={{
          position: "absolute",
          top: 8,
          left: 8,
          px: 0.75,
          height: 22,
          display: "inline-flex",
          alignItems: "center",
          borderRadius: "999px",
          bgcolor: "rgba(23, 23, 23, 0.72)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Box>
    </Box>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        border: "1px solid #E6E1F2",
        borderRadius: "8px",
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <Typography
      component="h2"
      sx={{
        m: 0,
        mb: 1.5,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#7B61FF",
      }}
    >
      {children}
    </Typography>
  );
}

function Body({ children }: { children: string }) {
  if (!children) return <Muted>—</Muted>;
  return (
    <Typography sx={{ fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
      {children}
    </Typography>
  );
}

function Muted({ children }: { children: string }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {children}
    </Typography>
  );
}

