"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function InquiryDetailsButton({
  name,
  lookingToBuild,
  details,
}: {
  name: string;
  lookingToBuild: string;
  details: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label={`View details for ${name}`}
        onClick={() => setOpen(true)}
        sx={{
          width: 32,
          height: 32,
          color: "#2A2A2A",
          "&:hover": { bgcolor: "#F4F1FB" },
          "&.Mui-focusVisible": {
            outline: "2px solid #7B61FF",
            outlineOffset: 2,
          },
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          backdrop: { sx: { bgcolor: "rgba(23,23,23,0.2)" } },
          paper: {
            sx: {
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: 448,
              boxShadow: "-12px 0 32px rgba(80,60,140,0.12)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 3,
            pt: 2.5,
          }}
        >
          <IconButton
            aria-label="Close"
            onClick={() => setOpen(false)}
            sx={{ width: 40, height: 40, color: "text.primary", "&:hover": { bgcolor: "#F4F1FB" } }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            minHeight: 0,
            flex: 1,
            flexDirection: "column",
            gap: 2,
            px: 3,
            py: 3,
          }}
        >
          <DetailSection
            title="What are you looking to build?"
            body={lookingToBuild}
          />
          <DetailSection title="Tell us more about your project" body={details} />
        </Box>
      </Drawer>
    </>
  );
}

function DetailSection({ title, body }: { title: string; body: string | null }) {
  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        borderRadius: "8px",
        border: "1px solid #E6E1F2",
        p: 2,
      }}
    >
      <Typography variant="body2" sx={{ flexShrink: 0, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 1.5, minHeight: 0, flex: 1, overflow: "auto", lineHeight: "24px", whiteSpace: "pre-wrap" }}
      >
        {body || "—"}
      </Typography>
    </Box>
  );
}
