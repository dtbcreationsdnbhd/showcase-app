"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PillButton from "@/components/landing/PillButton";
import { COPYRIGHT_LINES } from "@/lib/landing-content";
import { NAV_LINKS } from "@/lib/landing-nav";
import {
  MOBILE_BREAKPOINT,
  MOBILE_DESIGN_WIDTH,
  MOBILE_NAV_HEIGHT,
  MOBILE_STAGE_ZOOM,
  MOBILE_VIEWPORT_HEIGHT_CSS,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";
import {
  mobileSheetMotion,
  useMobileSheet,
} from "@/components/mobile/use-mobile-sheet";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
  fontStyle: "normal",
} as const;

export default function MobileMenu({
  open,
  onClose,
  hrefPrefix = "",
}: {
  open: boolean;
  onClose: () => void;
  hrefPrefix?: string;
}) {
  const { present, shown, reduced, onTransitionEnd } = useMobileSheet(open);
  /** Scroll to restore when the lock lifts. Set when a link moves the pinned page. */
  const destination = useRef<number | null>(null);

  useEffect(() => {
    if (!present) {
      return;
    }
    // `overflow: hidden` on body does not stop touch scrolling on mobile
    // Safari — the document keeps moving under the menu. Pin the page instead.
    const scrollY = window.scrollY;
    const hashAtOpen = window.location.hash;
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const onTouchMove = (event: TouchEvent) => {
      const panel = document.getElementById("mobile-menu-panel");
      if (panel && event.target instanceof Node && panel.contains(event.target)) {
        return;
      }
      event.preventDefault();
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    // Widening past the breakpoint hands over to the desktop tree; without this
    // the menu stays open off-screen and its scroll lock freezes the page.
    const media = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`);
    const onBreakpointChange = () => {
      if (media.matches) {
        onClose();
      }
    };
    media.addEventListener("change", onBreakpointChange);
    onBreakpointChange();
    // Move the pinned page as soon as the hash changes, while the sheet still
    // covers it. Waiting until the lock lifts made the section flash in late.
    const onHashChange = () => {
      const hash = window.location.hash;
      if (!hash || hash === hashAtOpen) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      const pinned = Math.abs(parseFloat(body.style.top) || 0);
      html.style.overflow = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, pinned);
      const next = Math.max(0, target.getBoundingClientRect().top + window.scrollY);
      window.scrollTo(0, next);
      const y = window.scrollY;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${y}px`;
      destination.current = y;
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      const y = destination.current ?? scrollY;
      destination.current = null;
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.left = previous.bodyLeft;
      body.style.right = previous.bodyRight;
      body.style.width = previous.bodyWidth;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = "";
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("touchmove", onTouchMove);
      media.removeEventListener("change", onBreakpointChange);
    };
  }, [present, onClose]);

  if (!present) {
    return null;
  }

  return createPortal(
    <div
      className="mobile-portal-root"
      // The root spans the viewport but only the panel should catch taps —
      // otherwise it swallows the close button sitting above it.
      style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}
    >
        <Box
          sx={{
            position: "relative",
            width: MOBILE_DESIGN_WIDTH,
            height: MOBILE_VIEWPORT_HEIGHT_CSS,
            zoom: MOBILE_STAGE_ZOOM,
          }}
        >
        <Box
          id="mobile-menu-panel"
          component="nav"
          aria-label="Mobile"
          onTransitionEnd={onTransitionEnd}
          sx={{
            position: "absolute",
            top: MOBILE_NAV_HEIGHT,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: "56px",
            pb: "98px",
            boxSizing: "border-box",
            borderRadius: "28px 28px 0 0",
            overflowY: "auto",
            overscrollBehavior: "contain",
            touchAction: "pan-y",
            ...mobileSheetMotion(shown, reduced),
            // Glows are read off the Figma export, not sampled — tune on device.
            background:
              "radial-gradient(120% 55% at 50% 0%, rgba(32, 72, 132, 0.42) 0%, rgba(7, 12, 30, 0) 70%), radial-gradient(70% 38% at 45% 58%, rgba(138, 62, 198, 0.20) 0%, rgba(7, 12, 30, 0) 75%), rgba(7, 12, 30, 0.86)",
            backdropFilter: "blur(48px)",
            WebkitBackdropFilter: "blur(48px)",
          }}
        >
          <Typography
            component="span"
            sx={{
              ...barlow,
              fontWeight: 700,
              fontSize: 24,
              lineHeight: "29px",
              letterSpacing: "0.02em",
              color: "#FFFFFF",
            }}
          >
            LOGO
          </Typography>

          <Box
            sx={{
              mt: "98px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "68px",
            }}
          >
            {NAV_LINKS.map((link) => (
              <Box
                key={link.label}
                component="a"
                href={`${hrefPrefix}#${mobileAnchorId(link.hash.slice(1))}`}
                onClick={onClose}
                sx={{ textDecoration: "none" }}
              >
                <Typography
                  component="span"
                  sx={{
                    ...barlow,
                    fontWeight: 500,
                    fontSize: 18,
                    lineHeight: "22px",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.5)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: "52px" }} onClick={onClose}>
            <PillButton
              width={224}
              href={`${hrefPrefix}#${mobileAnchorId("contact")}`}
              arrowUpRight
            >
              Get in touch with us
            </PillButton>
          </Box>

          {/* Grows to 123px on the design frame; collapses first on short screens. */}
          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "7px",
            }}
          >
            {COPYRIGHT_LINES.map((line) => (
              <Typography
                key={line}
                component="span"
                sx={{
                  ...barlow,
                  fontWeight: 500,
                  fontSize: 15,
                  lineHeight: "20px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                }}
              >
                {line}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </div>,
    document.body,
  );
}
