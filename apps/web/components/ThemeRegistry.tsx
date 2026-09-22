"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { ReactNode } from "react";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#A855F7",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#07071A",
      paper: "#0D0D28",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255,255,255,0.72)",
    },
    divider: "rgba(255,255,255,0.12)",
  },
  typography: {
    fontFamily: 'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 999,
          fontWeight: 600,
          letterSpacing: "0.01em",
        },
        containedPrimary: {
          backgroundColor: "#A855F7",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#A855F7",
          },
        },
        outlined: {
          borderColor: "rgba(255,255,255,0.38)",
          color: "#FFFFFF",
          "&:hover": {
            borderColor: "rgba(255,255,255,0.38)",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#07071A",
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
