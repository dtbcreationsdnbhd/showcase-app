import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography variant="h4" component="h1">
          showcase-app
        </Typography>
        <Typography color="text.secondary">
          Next.js + MUI scaffold. Connect Supabase via{" "}
          <code>apps/web/.env</code>.
        </Typography>
        <Button variant="contained" color="primary">
          Get started
        </Button>
      </Stack>
    </Container>
  );
}
