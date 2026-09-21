"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";
import { figmaPx } from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(276);
const CARD_H = figmaPx(414.75);
const CARD_R = figmaPx(18);
const TITLE_PAD = figmaPx(18);
const TITLE_INNER_W = CARD_W - TITLE_PAD * 2;
const DOT_SIZE = figmaPx(12);
const VIEW_SIZE = figmaPx(88);

export default function ProjectCard({
  title,
  description,
  imageSrc,
  followCursor = false,
}: {
  title: string;
  description: string;
  imageSrc: string | null;
  followCursor?: boolean;
}) {
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const updateCursor = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!followCursor) {
        return;
      }
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      setCursor({
        x: (event.clientX - rect.left) * (el.offsetWidth / rect.width),
        y: (event.clientY - rect.top) * (el.offsetHeight / rect.height),
      });
    },
    [followCursor],
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        flexShrink: 0,
        overflow: "visible",
        zIndex: followCursor && cursor ? 4 : 0,
      }}
    >
      <Box
        onMouseEnter={followCursor ? updateCursor : undefined}
        onMouseMove={followCursor ? updateCursor : undefined}
        onMouseLeave={followCursor ? () => setCursor(null) : undefined}
        sx={{
          position: "relative",
          isolation: "isolate",
          width: "100%",
          height: "100%",
          borderRadius: `${CARD_R}px`,
          overflow: "hidden",
          cursor: followCursor ? "none" : "auto",
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes={`${CARD_W}px`}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "#0C1622",
            }}
          />
        )}

        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 74%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: 0,
            bottom: 0,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: `${TITLE_PAD}px`,
            gap: `${figmaPx(8)}px`,
            width: CARD_W,
            height: figmaPx(88),
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(9)}px`,
              width: TITLE_INNER_W,
            }}
          >
            <Typography
              component="h3"
              sx={{
                ...barlow,
                width: TITLE_INNER_W,
                m: 0,
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: figmaPx(19.5),
                lineHeight: `${figmaPx(23)}px`,
                color: "#FFFFFF",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                ...barlow,
                width: TITLE_INNER_W,
                m: 0,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(12),
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "rgba(255, 255, 255, 0.5)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>

      {followCursor && cursor ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: cursor.x - DOT_SIZE / 2,
              top: cursor.y - DOT_SIZE / 2,
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: "50%",
              bgcolor: "#CC35CC",
            }}
          />
          <Box
            component="button"
            type="button"
            sx={{
              position: "absolute",
              left: cursor.x,
              top: cursor.y,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: VIEW_SIZE,
              height: VIEW_SIZE,
              m: 0,
              p: 0,
              border: 0,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
              appearance: "none",
              cursor: "none",
              pointerEvents: "none",
            }}
          >
            <Typography
              component="span"
              sx={{
                ...barlow,
                m: 0,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(12),
                lineHeight: "130%",
                textAlign: "center",
                color: "#050B13",
                whiteSpace: "nowrap",
              }}
            >
              View Project
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
