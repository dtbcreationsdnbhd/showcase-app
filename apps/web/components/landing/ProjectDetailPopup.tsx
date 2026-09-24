"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LANDING_DESIGN_WIDTH, figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const labelSx = {
  ...barlow,
  m: 0,
  width: "100%",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(12),
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "rgba(255, 255, 255, 0.5)",
} as const;

const bodySx = {
  ...barlow,
  m: 0,
  width: "100%",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(12),
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "#FFFFFF",
} as const;

export type ProjectDetail = {
  name: string;
  tags: string[];
  challenge: string;
  solution: string;
};

const SHARED_CHALLENGE =
  "Getting users to register is only half the battle. Without constant engagement, they forget your brand, and you lose repeat business.";
const SHARED_SOLUTION =
  "Teleflies automates user engagement. With targeted mass broadcasting and real-time alerts, it brings dormant users back to your platform.";

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  Teleflies: {
    name: "Teleflies: Telegram Automation Ecosystem",
    tags: ["SaaS Platform", "Telegram Bot", "Automation"],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
  TrackSpend: {
    name: "TrackSpend",
    tags: ["Custom Dashboard", "AdTech & Marketing", "Data..."],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
  "Ad Spend Markup Generator": {
    name: "Ad Spend Markup Generator",
    tags: ["Desktop Utility", "White-Label Reporting", "Agen..."],
    challenge: SHARED_CHALLENGE,
    solution: SHARED_SOLUTION,
  },
};

function ProjectPhoto({
  src,
  width,
  height,
  alt,
}: {
  src: string | null;
  width: number;
  height: number;
  alt: string;
}) {
  if (!src) {
    return <ImagePlaceholder width={width} height={height} />;
  }

  return (
    <Box
      sx={{
        position: "relative",
        boxSizing: "border-box",
        width,
        height,
        overflow: "hidden",
        bgcolor: "#050B13",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: `${figmaPx(12)}px`,
        flexShrink: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${width}px`}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </Box>
  );
}

function ImagePlaceholder({
  width,
  height,
  filled = true,
}: {
  width: number;
  height: number;
  filled?: boolean;
}) {
  const icon = Math.min(width, height) * 0.42;
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        width,
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: filled ? "#050B13" : "transparent",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: `${figmaPx(12)}px`,
        flexShrink: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 48 48"
        aria-hidden
        sx={{
          width: icon,
          height: icon,
          display: "block",
          color: "rgba(255, 255, 255, 0.18)",
        }}
      >
        <rect
          x="5"
          y="8"
          width="38"
          height="32"
          rx="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <circle cx="17" cy="19" r="4" fill="currentColor" />
        <path
          d="M8 36.4 18.2 24.8l7.2 7.4 6.4-6.8L40 36.4Z"
          fill="currentColor"
        />
      </Box>
    </Box>
  );
}

export default function ProjectDetailPopup({
  projectKey,
  onClose,
  imageSrc,
}: {
  projectKey: string;
  onClose: () => void;
  imageSrc: string | null;
}) {
  const detail = PROJECT_DETAILS[projectKey];
  const [thumb, setThumb] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setThumb(0);
  }, [projectKey]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!detail || !mounted) {
    return null;
  }

  const cardW = figmaPx(34 + 387 + 56 + 358.5 + 34);
  const closeSize = figmaPx(36);

  return createPortal(
    <Box
      role="presentation"
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(5, 11, 19, 0.45)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: cardW,
          flexShrink: 0,
          transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
        }}
      >
        <Box
          component="button"
          type="button"
          aria-label="Close"
          onClick={onClose}
          sx={{
            position: "absolute",
            left: "100%",
            top: -closeSize,
            width: closeSize,
            height: closeSize,
            p: 0,
            m: 0,
            border: 0,
            bgcolor: "transparent",
            cursor: "pointer",
            appearance: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 16 16"
            aria-hidden
            sx={{ width: figmaPx(18), height: figmaPx(18), display: "block" }}
          >
            <path
              d="M3 3 13 13M13 3 3 13"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </Box>
        </Box>

        <Box
          role="dialog"
          aria-modal
          aria-labelledby="project-detail-title"
          onClick={(event) => event.stopPropagation()}
          sx={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            py: `${figmaPx(46)}px`,
            px: 0,
            width: cardW,
            bgcolor: "rgba(65, 65, 65, 0.26)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: `${figmaPx(36)}px`,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              px: `${figmaPx(34)}px`,
              gap: `${figmaPx(56)}px`,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(24)}px`,
                width: figmaPx(387),
                flexShrink: 0,
              }}
            >
            <ProjectPhoto
              src={imageSrc}
              width={figmaPx(387)}
              height={figmaPx(290.25)}
              alt={detail.name}
            />
            <Box
              sx={{
                width: "100%",
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                p: 0,
                gap: `${figmaPx(12)}px`,
                width: figmaPx(387),
                height: figmaPx(67.5),
              }}
            >
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  component="button"
                  type="button"
                  aria-label={`Image ${index + 1}`}
                  onClick={() => setThumb(index)}
                  sx={{
                    p: 0,
                    m: 0,
                    border: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    appearance: "none",
                    lineHeight: 0,
                    opacity: thumb === index ? 1 : 0.85,
                    borderRadius: `${figmaPx(12)}px`,
                  }}
                >
                  <ProjectPhoto
                    src={imageSrc}
                    width={figmaPx(90)}
                    height={figmaPx(67.5)}
                    alt=""
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(30)}px`,
              width: figmaPx(358.5),
              height: figmaPx(351.75),
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Project Name</Typography>
              <Typography
                id="project-detail-title"
                component="h2"
                sx={{
                  ...barlow,
                  m: 0,
                  width: "100%",
                  fontStyle: "normal",
                  fontWeight: 600,
                  fontSize: figmaPx(19.5),
                  lineHeight: `${figmaPx(31)}px`,
                  backgroundImage:
                    "linear-gradient(96.02deg, #FA9DFF 2.09%, #977EFF 97.91%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {detail.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Tags</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  p: 0,
                  gap: `${figmaPx(7)}px`,
                  flexWrap: "wrap",
                  width: "100%",
                }}
              >
                {detail.tags.map((tag) => {
                  const wraps = /\.\.\.$/.test(tag);
                  const label = tag.replace(/\.\.\.$/, "");
                  return (
                    <Fragment key={tag}>
                      {wraps ? (
                        <Box
                          aria-hidden
                          sx={{ flexBasis: "100%", height: 0 }}
                        />
                      ) : null}
                      <Box
                        sx={{
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          py: `${figmaPx(5)}px`,
                          px: `${figmaPx(10)}px`,
                          bgcolor: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          borderRadius: `${figmaPx(12)}px`,
                          maxWidth: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            ...barlow,
                            m: 0,
                            fontStyle: "normal",
                            fontWeight: 500,
                            fontSize: figmaPx(12),
                            lineHeight: "160%",
                            letterSpacing: "0.02em",
                            color: "#FFFFFF",
                            whiteSpace: "normal",
                          }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    </Fragment>
                  );
                })}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Challenge</Typography>
              <Typography sx={bodySx}>{detail.challenge}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(6)}px`,
                width: "100%",
              }}
            >
              <Typography sx={labelSx}>Solution</Typography>
              <Typography sx={bodySx}>{detail.solution}</Typography>
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>,
    document.body,
  );
}
