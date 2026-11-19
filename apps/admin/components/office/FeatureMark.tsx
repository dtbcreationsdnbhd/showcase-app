import Box from "@mui/material/Box";

import type { FeatureIconName } from "@/lib/project-sheet";

export default function FeatureMark({
  name,
  color = "#171717",
}: {
  name: FeatureIconName;
  color?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      sx={{ width: 18, height: 18, display: "block", color }}
    >
      {name === "search" ? (
        <>
          <circle {...common} cx="11" cy="11" r="6.5" />
          <path {...common} d="M16 16.5 20 20.5" />
        </>
      ) : null}
      {name === "gear" ? (
        <path
          {...common}
          d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M12 4.5v1.6M12 17.9V19.5M4.5 12H6.1M17.9 12H19.5M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1"
        />
      ) : null}
      {name === "doc" ? (
        <path {...common} d="M7 3.5h7l4 4V20.5H7V3.5Z M14 3.5V8h4.5 M9.5 12.5h6 M9.5 16h6" />
      ) : null}
      {name === "link" ? (
        <path
          {...common}
          d="M10 13.5a4 4 0 0 0 6 .4l2.2-2.2a4 4 0 0 0-5.6-5.6L11 7.7 M14 10.5a4 4 0 0 0-6-.4L5.8 12.3a4 4 0 0 0 5.6 5.6L13 16.3"
        />
      ) : null}
      {name === "chart" ? (
        <path {...common} d="M4.5 19.5h15 M7 16.5v-4 M12 16.5V8 M17 16.5v-6" />
      ) : null}
      {name === "headset" ? (
        <path
          {...common}
          d="M5 13.5v-1a7 7 0 0 1 14 0v1 M5 13.5h2.2v4.5H6.2A1.2 1.2 0 0 1 5 16.8v-3.3Z M19 13.5h-2.2v4.5h.9a1.2 1.2 0 0 0 1.3-1.2v-3.3Z M14.5 18.2a2.5 2.5 0 0 1-2.5 2.3h-1"
        />
      ) : null}
      {name === "display" ? (
        <>
          <rect {...common} x="3.5" y="4" width="17" height="11.5" rx="1.6" />
          <path {...common} d="M8 20h8M12 15.5V20" />
        </>
      ) : null}
      {name === "image" ? (
        <>
          <rect {...common} x="3.5" y="5" width="17" height="14" rx="1.6" />
          <circle {...common} cx="8.5" cy="9.2" r="1.3" />
          <path {...common} d="M3.5 16.2 8.4 12.2l3.4 3 3.1-2.6 5.6 4.4" />
        </>
      ) : null}
      {name === "users" ? (
        <>
          <circle {...common} cx="12" cy="8" r="2.1" />
          <circle {...common} cx="7" cy="9.2" r="1.6" />
          <circle {...common} cx="17" cy="9.2" r="1.6" />
          <path {...common} d="M8.4 18.4c.4-2.2 1.8-3.5 3.6-3.5s3.2 1.3 3.6 3.5" />
          <path {...common} d="M4.4 18c.4-1.6 1.3-2.6 2.6-2.9" />
          <path {...common} d="M19.6 18c-.4-1.6-1.3-2.6-2.6-2.9" />
        </>
      ) : null}
      {name === "eye" ? (
        <>
          <path {...common} d="M2.5 12S6.4 6.8 12 6.8 21.5 12 21.5 12 17.6 17.2 12 17.2 2.5 12 2.5 12Z" />
          <circle {...common} cx="12" cy="12" r="2.4" />
        </>
      ) : null}
      {name === "clapper" ? (
        <>
          <path {...common} d="M4.5 9.5h15v9.2a1.6 1.6 0 0 1-1.6 1.6H6.1a1.6 1.6 0 0 1-1.6-1.6V9.5Z" />
          <path {...common} d="M4.2 9.5 6.4 4.8h3.2L7.4 9.5M9.2 9.5 11.4 4.8h3.1L12.3 9.5M14.2 9.5 16.4 4.8h2.8L17.2 9.5" />
        </>
      ) : null}
      {name === "megaphone" ? (
        <>
          <path {...common} d="M4.5 9.2h3.2l7.6-3.4v12.4L7.7 14.8H4.5V9.2Z" />
          <path {...common} d="M7.6 14.6v2.6a1.6 1.6 0 0 0 1.6 1.6h.6M16.2 9.2c1.4.7 1.4 4.9 0 5.6" />
        </>
      ) : null}
      {name === "star" ? (
        <path {...common} d="M12 3.8 14.1 9l5.5.4-4.2 3.5 1.3 5.3L12 15.4 7.3 18.2 8.6 12.9 4.4 9.4 9.9 9 12 3.8Z" />
      ) : null}
      {name === "video" ? (
        <>
          <rect {...common} x="3.5" y="6" width="17" height="12" rx="2" />
          <path {...common} d="M10.2 9.4v5.2L15 12l-4.8-2.6Z" />
        </>
      ) : null}
      {name === "share" ? (
        <>
          <circle {...common} cx="7" cy="12" r="2.1" />
          <circle {...common} cx="16.5" cy="7.2" r="2.1" />
          <circle {...common} cx="16.5" cy="16.8" r="2.1" />
          <path {...common} d="M8.9 11.1 14.6 8.2M8.9 12.9l5.7 2.9" />
        </>
      ) : null}
      {name === "music" ? (
        <>
          <path {...common} d="M9 17.2V6.4l9-1.6v10.2" />
          <circle {...common} cx="6.8" cy="17.2" r="2.2" />
          <circle {...common} cx="15.8" cy="15" r="2.2" />
        </>
      ) : null}
      {name === "waveform" ? (
        <path {...common} d="M4 10v4M8 7v10M12 4.5v15M16 8v8M20 10.5v3" />
      ) : null}
      {name === "sliders" ? (
        <>
          <path {...common} d="M5 5.5v13M12 5.5v13M19 5.5v13" />
          <circle {...common} cx="5" cy="10" r="1.7" />
          <circle {...common} cx="12" cy="14.5" r="1.7" />
          <circle {...common} cx="19" cy="8.5" r="1.7" />
        </>
      ) : null}
      {name === "headphones" ? (
        <>
          <path {...common} d="M5 13.2v-1a7 7 0 0 1 14 0v1" />
          <rect {...common} x="3.6" y="13" width="3.6" height="5.4" rx="1.2" />
          <rect {...common} x="16.8" y="13" width="3.6" height="5.4" rx="1.2" />
        </>
      ) : null}
      {name === "layers" ? (
        <>
          <path {...common} d="M12 4.2 20 8.2 12 12.2 4 8.2 12 4.2Z" />
          <path {...common} d="M4 12 12 16l8-4" />
          <path {...common} d="M4 15.6 12 19.6l8-4" />
        </>
      ) : null}
      {name === "pencil" ? (
        <>
          <path {...common} d="M14.2 5.2 18.8 9.8 9.2 19.4 4.2 19.8 4.6 14.8 14.2 5.2Z" />
          <path {...common} d="M12.4 7 17 11.6" />
        </>
      ) : null}
      {name === "sparkle" ? (
        <>
          <path {...common} d="M12 3.5 13.1 8.2 17.8 9.3 13.1 10.4 12 15.1 10.9 10.4 6.2 9.3 10.9 8.2 12 3.5Z" />
          <path {...common} d="M17.6 14.2 18.2 16.2 20.2 16.8 18.2 17.4 17.6 19.4 17 17.4 15 16.8 17 16.2 17.6 14.2Z" />
        </>
      ) : null}
      {name === "camera" ? (
        <>
          <rect {...common} x="3.2" y="7" width="12.2" height="10" rx="1.8" />
          <path {...common} d="M15.4 10.2 20.8 7.6v8.8l-5.4-2.6v-3.6Z" />
        </>
      ) : null}
      {name === "robot" ? (
        <>
          <rect {...common} x="6" y="8" width="12" height="9.5" rx="2" />
          <path {...common} d="M12 8V5.2M9.2 12.2h.1M14.7 12.2h.1M9.4 15.2h5.2" />
          <circle {...common} cx="12" cy="5.2" r="0.8" />
          <path {...common} d="M6 12.2H4.2M19.8 12.2H18" />
        </>
      ) : null}
      {name === "chat" ? (
        <path {...common} d="M5 6.2h14a1.6 1.6 0 0 1 1.6 1.6v7.2a1.6 1.6 0 0 1-1.6 1.6H10l-4.2 3.2v-3.2H5a1.6 1.6 0 0 1-1.6-1.6V7.8A1.6 1.6 0 0 1 5 6.2Z" />
      ) : null}
    </Box>
  );
}
