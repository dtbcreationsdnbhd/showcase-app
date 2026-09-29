import Box from "@mui/material/Box";

import Sidebar from "@/components/office/Sidebar";
import TopBar from "@/components/office/TopBar";

export default function OfficeShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        gap: 2,
        bgcolor: "background.default",
        p: 2,
        color: "text.primary",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          minWidth: 0,
          flex: 1,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TopBar />
        {children}
      </Box>
    </Box>
  );
}
