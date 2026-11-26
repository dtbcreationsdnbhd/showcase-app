import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ContactLinksForm from "@/components/office/ContactLinksForm";
import ContentFrame from "@/components/office/ContentFrame";
import { getContactLinks } from "@/lib/contact-links";

export default async function ContactPage() {
  const result = await getContactLinks();

  return (
    <ContentFrame
      header={
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
            Contact
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            These links open from the icons under Connect With Us Directly. Leave a field blank to hide that icon.
          </Typography>
        </Box>
      }
    >
      {result.ok ? null : (
        <Typography variant="body2" color="error" role="alert" sx={{ mb: 2, maxWidth: 560 }}>
          {result.message}
        </Typography>
      )}
      <ContactLinksForm key={result.links.map((link) => link.href).join("|")} links={result.links} />
    </ContentFrame>
  );
}
