import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import { cardShadow, cornerRadius } from "@/lib/ui";

export default function ContentFrame({
  header,
  children,
  footer,
  flush = false,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  flush?: boolean;
}) {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: cornerRadius,
        boxShadow: cardShadow,
      }}
    >
      {header ? (
        <Box
          sx={{
            flexShrink: 0,
            px: 4,
            pt: 4,
            pb: 3,
          }}
        >
          {header}
        </Box>
      ) : null}
      <Box
        sx={{
          minHeight: 0,
          flex: 1,
          display: flush ? "flex" : "block",
          flexDirection: "column",
          overflow: flush ? "hidden" : "auto",
          px: flush ? 0 : 3,
          pb: flush ? 0 : 3,
          pt: flush ? 0 : header ? 2 : 1,
        }}
      >
        {children}
      </Box>
      {footer}
    </Paper>
  );
}
