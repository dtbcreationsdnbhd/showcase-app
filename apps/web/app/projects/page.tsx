import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "@/components/landing/Navbar";
import ProjectShowcaseGallery from "@/components/landing/ProjectShowcaseGallery";
import MobileProjectsPage from "@/components/mobile/MobileProjectsPage";
import { goldTextSx } from "@/lib/gold-theme";
import { getLandingLogoSrc } from "@/lib/landing-assets";
import { showcaseTitle } from "@/lib/landing-content";
import { CJK_FONT } from "@/lib/locale";
import {
  LANDING_DESIGN_WIDTH,
  PROJECTS_PAGE_COLUMNS,
  figmaPx,
  projectsGridHeight,
} from "@/lib/landing-layout";
import {
  DESKTOP_ONLY,
  FORCE_DESKTOP_STAGE,
  MOBILE_ONLY,
} from "@/lib/landing-layout-mobile";
import { getLocale } from "@/lib/get-locale";
import { listProjects, localizeProjects } from "@/lib/projects";

const NAV_HEIGHT = 102;
const PAD_TOP = figmaPx(12);
const TITLE_HEIGHT = figmaPx(64);
const TITLE_GAP = figmaPx(28);
const PAD_BOTTOM = figmaPx(100);

export default async function ProjectsPage() {
  const locale = await getLocale();
  const catalog = await listProjects();
  const projects = localizeProjects(catalog, locale);
  const title = showcaseTitle(locale);
  const logoSrc = getLandingLogoSrc();
  const stageHeight =
    NAV_HEIGHT +
    PAD_TOP +
    TITLE_HEIGHT +
    TITLE_GAP +
    projectsGridHeight(projects.length, PROJECTS_PAGE_COLUMNS) +
    PAD_BOTTOM;

  return (
    <Box component="main">
      <Box
        className="landing-frame"
        style={{
          minHeight: "100vh",
          // The stage is scaled with transform, so it can't size the frame itself.
          height: `max(100vh, calc(100vw * ${stageHeight} / ${LANDING_DESIGN_WIDTH}))`,
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.58), rgba(0, 0, 0, 0.58)), url("/landing/contact-form-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
        sx={FORCE_DESKTOP_STAGE ? undefined : { [MOBILE_ONLY]: { display: "none" } }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 80,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              width: LANDING_DESIGN_WIDTH,
              transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
              transformOrigin: "top left",
              pointerEvents: "auto",
            }}
          >
            <Navbar logoSrc={logoSrc} projects={catalog} />
          </Box>
        </Box>

        <Box
          className="landing-stage"
          style={{
            transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
            transformOrigin: "top left",
          }}
        >
          <Box
            sx={{
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: `${TITLE_GAP}px`,
              pt: `${NAV_HEIGHT + PAD_TOP}px`,
              pb: `${PAD_BOTTOM}px`,
            }}
          >
            <Typography
              component="h1"
              className="solutions-title-3d"
              sx={{
                fontFamily:
                  locale === "zh"
                    ? CJK_FONT
                    : 'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
                m: 0,
                fontWeight: 600,
                fontSize: figmaPx(48),
                lineHeight: `${TITLE_HEIGHT}px`,
                letterSpacing: "-0.02em",
                backgroundImage: goldTextSx.backgroundImage,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>

            {projects.length > 0 ? (
              <ProjectShowcaseGallery
                projects={projects}
                columns={PROJECTS_PAGE_COLUMNS}
              />
            ) : null}
          </Box>
        </Box>
      </Box>

      {FORCE_DESKTOP_STAGE ? null : (
        <Box sx={{ [DESKTOP_ONLY]: { display: "none" } }}>
          <MobileProjectsPage projects={projects} logoSrc={logoSrc} />
        </Box>
      )}
    </Box>
  );
}
