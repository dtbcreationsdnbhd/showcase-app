import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { formatInquiryDate, type Inquiry } from "@/lib/inquiries";

const columns = [
  "No",
  "Name",
  "Service",
  "Brand",
  "Region",
  "Detail",
  "Submitted",
] as const;

const tableSx = {
  width: "100%",
  tableLayout: "fixed",
};

const headerCellSx = {
  fontWeight: 700,
  color: "#171717",
  borderBottomColor: "#E4E0EE",
};

const scrollGutterSx = {
  overflowY: "auto",
  scrollbarGutter: "stable",
};

const splitSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 1,
  minWidth: 0,
};

export default function InquiriesTable({
  rows,
  emptyLabel,
  start,
}: {
  rows: Inquiry[];
  emptyLabel: string;
  start: number;
}) {
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 4, py: 3 }}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        pl: 4,
        pr: 1,
        pt: 3,
      }}
    >
      <Box sx={scrollGutterSx}>
        <Table aria-hidden sx={tableSx}>
          <Cols />
          <TableHead>
            <TableRow>
              {columns.map((label) => (
                <TableCell key={label} sx={headerCellSx}>
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </Box>
      <Box sx={{ minHeight: 0, flex: 1, ...scrollGutterSx }}>
        <Table aria-label="Inquiries" sx={tableSx}>
          <Cols />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{start + index}</TableCell>
                <TableCell>
                  <SplitValue text={row.full_name} chip={telegramOf(row)} tone="telegram" />
                </TableCell>
                <TableCell>{serviceOf(row)}</TableCell>
                <TableCell>{textOrDash(row.brand_name)}</TableCell>
                <TableCell>{textOrDash(row.region)}</TableCell>
                <TableCell sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {textOrDash(row.project_details)}
                </TableCell>
                <TableCell>
                  <SplitValue
                    text={formatInquiryDate(row.created_at)}
                    chip={row.source === "mobile" ? "Mobile" : "Web"}
                    tone="source"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

function Cols() {
  return (
    <colgroup>
      <col style={{ width: "4%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "16%" }} />
    </colgroup>
  );
}

function SplitValue({
  text,
  chip,
  tone,
}: {
  text: string;
  chip: string | null;
  tone: "telegram" | "source";
}) {
  return (
    <Box sx={splitSx}>
      <Box sx={{ minWidth: 0 }}>{text}</Box>
      {chip ? <ValueChip label={chip} tone={tone} /> : "—"}
    </Box>
  );
}

function ValueChip({ label, tone }: { label: string; tone: "telegram" | "source" }) {
  const colors =
    tone === "telegram"
      ? { bgcolor: "#F4F1FB", color: "#5B4B8A" }
      : { bgcolor: "#E7F6EF", color: "#1F7A4D" };

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        flexShrink: 0,
        maxWidth: "50%",
        overflow: "hidden",
        px: 1,
        py: 0.25,
        borderRadius: "999px",
        bgcolor: colors.bgcolor,
        color: colors.color,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "20px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </Box>
  );
}

function textOrDash(value: string | null) {
  const text = value?.trim();
  return text || "—";
}

function telegramOf(row: Inquiry) {
  const value = row.telegram?.trim() || row.contact?.trim();
  if (!value) return null;
  return value.includes("@") ? value : `@${value}`;
}

function serviceOf(row: Inquiry) {
  const typed = row.service?.trim();
  if (typed) return typed;
  if (row.services?.length) return row.services.join(", ");
  return textOrDash(row.looking_to_build);
}
