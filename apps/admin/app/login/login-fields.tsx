"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useFormStatus } from "react-dom";

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
  const { pending } = useFormStatus();
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
        disabled={pending}
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
        disabled={pending}
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

export function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth
      disabled={pending}
      sx={{ mt: 3, height: 40 }}
    >
      {pending ? <CircularProgress size={18} color="inherit" /> : "Sign in"}
    </Button>
  );
}
