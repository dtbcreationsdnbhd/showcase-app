import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

import { signOut } from "@/app/login/actions";
import { cardShadow, cornerRadius } from "@/lib/ui";

const iconButtonSx = {
  width: 36,
  height: 36,
  color: "#2A2A2A",
  "&:hover": { bgcolor: "#F4F1FB" },
  "&.Mui-focusVisible": {
    outline: "2px solid #7B61FF",
    outlineOffset: 2,
  },
};

export default function TopBar() {
  return (
    <Stack
      component="header"
      direction="row"
      sx={{
        height: 64,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0.5,
        borderRadius: cornerRadius,
        bgcolor: "background.paper",
        px: 2,
        boxShadow: cardShadow,
      }}
    >
      <IconButton aria-label="Settings" sx={iconButtonSx}>
        <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <IconButton aria-label="Notifications" sx={iconButtonSx}>
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
      </IconButton>
      <form action={signOut}>
        <IconButton type="submit" aria-label="Sign out" sx={iconButtonSx}>
          <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </form>
    </Stack>
  );
}
