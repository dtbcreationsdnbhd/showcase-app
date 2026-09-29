"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { cornerRadius } from "@/lib/ui";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: cornerRadius,
    bgcolor: "#fff",
  },
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px #fff inset",
    WebkitTextFillColor: "#171717",
  },
};

export default function LoginFields() {
  const [ready, setReady] = useState(false);

  return (
    <Stack spacing={2} sx={{ mt: 3 }}>
      <TextField
        id="username"
        name="username"
        label="Username"
        variant="outlined"
        size="small"
        fullWidth
        autoComplete="off"
        sx={fieldSx}
        slotProps={{
          htmlInput: {
            required: true,
            readOnly: !ready,
            onFocus: () => setReady(true),
          },
        }}
      />
      <TextField
        id="password"
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        size="small"
        fullWidth
        autoComplete="off"
        sx={fieldSx}
        slotProps={{
          htmlInput: {
            required: true,
            readOnly: !ready,
            onFocus: () => setReady(true),
          },
        }}
      />
    </Stack>
  );
}
