import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CreateProjectButton from "@/components/office/CreateProjectButton";
import ContentFrame from "@/components/office/ContentFrame";

export default function ProjectsPage() {
  return (
    <ContentFrame
      header={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
          >
            Showcase Project
          </Typography>
          <CreateProjectButton />
        </Box>
      }
    >
      {null}
    </ContentFrame>
  );
}
