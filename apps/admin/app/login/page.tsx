import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { signIn } from "@/app/login/actions";
import LoginFields, { SignInButton } from "@/app/login/login-fields";
import AuthNoticeBanner from "@/components/AuthNoticeBanner";
import { noticeFromParam } from "@/lib/notices";
import { cardShadow, cornerRadius } from "@/lib/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const notice = noticeFromParam(params.notice);

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        minHeight: "100dvh",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 3,
        py: 8,
        color: "text.primary",
      }}
    >
      <AuthNoticeBanner notice={notice} />
      <Paper
        component="form"
        action={signIn}
        autoComplete="off"
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: cornerRadius,
          px: 4,
          py: 4,
          boxShadow: cardShadow,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
          Show Case Back Office
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Sign in to continue
        </Typography>

        <LoginFields />

        <SignInButton />
      </Paper>
    </Box>
  );
}
