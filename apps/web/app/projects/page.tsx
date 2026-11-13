import { notFound } from "next/navigation";

// The standalone projects page is retired: the landing showcase now slides
// through every project and opens the detail popup in place. Kept below so it
// can be restored; a page.tsx needs a default export, hence the 404 stub.
export default function ProjectsPage() {
  notFound();
}

// import Box from "@mui/material/Box";
// import Navbar from "@/components/landing/Navbar";
// import ProjectShowcase from "@/components/landing/ProjectShowcase";
// import MobileProjectsPage from "@/components/mobile/MobileProjectsPage";
// import { getLandingLogoSrc } from "@/lib/landing-assets";
// import {
//   LANDING_DESIGN_WIDTH,
//   PROJECTS_PAGE_NAV_HEIGHT,
//   showcaseSectionHeight,
// } from "@/lib/landing-layout";
// import { DESKTOP_ONLY, MOBILE_ONLY } from "@/lib/landing-layout-mobile";
// import { listProjects } from "@/lib/projects";
//
// export default async function ProjectsPage() {
//   const projects = await listProjects();
//   const logoSrc = getLandingLogoSrc();
//
//   return (
//     <Box component="main">
//       <Box
//         className="landing-frame"
//         style={{
//           minHeight: "100vh",
//           height:
//             projects.length === 0
//               ? "100vh"
//               : `max(100vh, calc(100vw * ${PROJECTS_PAGE_NAV_HEIGHT + showcaseSectionHeight(projects.length)} / ${LANDING_DESIGN_WIDTH}))`,
//           backgroundColor: "#22060F",
//         }}
//         sx={{
//           [MOBILE_ONLY]: { display: "none" },
//         }}
//       >
//         <Box
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             zIndex: 80,
//             pointerEvents: "none",
//           }}
//         >
//           <Box
//             sx={{
//               width: LANDING_DESIGN_WIDTH,
//               transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
//               transformOrigin: "top left",
//               pointerEvents: "auto",
//             }}
//           >
//             <Navbar logoSrc={logoSrc} hrefPrefix="/" />
//           </Box>
//         </Box>
//
//         <Box
//           className="landing-stage"
//           style={{
//             transform: `scale(calc(100vw / ${LANDING_DESIGN_WIDTH}px))`,
//             transformOrigin: "top left",
//           }}
//         >
//           <Box
//             sx={{
//               pt: `${PROJECTS_PAGE_NAV_HEIGHT}px`,
//               bgcolor: "#22060F",
//             }}
//           >
//             <ProjectShowcase
//               projects={projects}
//               arrowHref="/#projects"
//               followCursor
//               arrowUpRight
//             />
//           </Box>
//         </Box>
//       </Box>
//
//       <Box sx={{ [DESKTOP_ONLY]: { display: "none" } }}>
//         <MobileProjectsPage projects={projects} logoSrc={logoSrc} />
//       </Box>
//     </Box>
//   );
// }
