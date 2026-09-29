"use client";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useState } from "react";

import { cornerRadius } from "@/lib/ui";

export default function ProjectPhotosButton({
  name,
  title,
  urls,
}: {
  name: string;
  title: string;
  urls: string[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const current = urls[index] ?? urls[0];

  function close() {
    setOpen(false);
    setIndex(0);
  }

  if (urls.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        —
      </Typography>
    );
  }

  return (
    <>
      <Button
        variant="text"
        aria-label={`View ${title} for ${name}`}
        onClick={() => setOpen(true)}
        sx={{
          minWidth: 0,
          px: 0.5,
          py: 0.25,
          color: "#7B61FF",
          fontSize: 14,
          fontWeight: 600,
          "&:hover": { bgcolor: "#F4F1FB" },
          "&.Mui-focusVisible": {
            outline: "2px solid #7B61FF",
            outlineOffset: 2,
          },
        }}
      >
        View
      </Button>
      <Dialog
        open={open}
        onClose={close}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxWidth: 560,
              borderRadius: cornerRadius,
              m: 2,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            px: 2.5,
            pt: 2,
            pb: 1.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton
            aria-label="Close"
            onClick={close}
            sx={{
              width: 36,
              height: 36,
              color: "text.primary",
              "&:hover": { bgcolor: "#F4F1FB" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 2.5, pb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 320,
              overflow: "hidden",
              borderRadius: cornerRadius,
              bgcolor: "#F4F1FB",
            }}
          >
            <Box
              component="img"
              src={current}
              alt={
                urls.length === 1
                  ? `${name} ${title.toLowerCase()}`
                  : `${name} ${title.toLowerCase()} ${index + 1}`
              }
              sx={{
                display: "block",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
          {urls.length > 1 ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1.5,
                overflowX: "auto",
              }}
            >
              {urls.map((url, itemIndex) => (
                <Box
                  key={`${url}-${itemIndex}`}
                  component="button"
                  type="button"
                  aria-label={`Image ${itemIndex + 1}`}
                  aria-pressed={itemIndex === index}
                  onClick={() => setIndex(itemIndex)}
                  sx={{
                    flexShrink: 0,
                    width: 88,
                    height: 66,
                    p: 0,
                    overflow: "hidden",
                    borderRadius: cornerRadius,
                    border: "2px solid",
                    borderColor: itemIndex === index ? "#7B61FF" : "transparent",
                    bgcolor: "#F4F1FB",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={url}
                    alt=""
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : null}
        </Box>
      </Dialog>
    </>
  );
}
