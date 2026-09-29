import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import InquiryDetailsButton from "@/components/office/InquiryDetailsButton";
import { formatInquiryDate, type Inquiry } from "@/lib/inquiries";

const columns = [
  "No",
  "Source",
  "Name",
  "Contact",
  "Services",
  "Budget",
  "Project cycle",
  "Action",
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
                <TableCell sx={{ textTransform: "capitalize" }}>{row.source}</TableCell>
                <TableCell>{row.full_name}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell>{serviceList(row.services) || "—"}</TableCell>
                <TableCell>{row.budget || "—"}</TableCell>
                <TableCell>{row.project_cycle || "—"}</TableCell>
                <TableCell>
                  <InquiryDetailsButton
                    name={row.full_name}
                    submitted={formatInquiryDate(row.created_at)}
                    lookingToBuild={row.looking_to_build}
                    details={row.project_details}
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
      <col style={{ width: "7%" }} />
      <col style={{ width: "9%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "6%" }} />
    </colgroup>
  );
}

function serviceList(services: string[] | null) {
  if (!services?.length) return null;
  return services.join(", ");
}
