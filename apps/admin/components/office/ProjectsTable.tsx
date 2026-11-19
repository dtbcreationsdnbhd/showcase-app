import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import DeleteProjectButton from "@/components/office/DeleteProjectButton";
import ProjectDetailsButton from "@/components/office/ProjectDetailsButton";
import { projectCategoryLabel } from "@/lib/project-categories";
import { formatProjectDate, type ShowcaseProject } from "@/lib/projects";

const columns = ["Name", "Category", "Created At", "Updated At", "Action"] as const;

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

export default function ProjectsTable({
  rows,
  emptyLabel,
}: {
  rows: ShowcaseProject[];
  emptyLabel: string;
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
        <Table aria-label="Projects" sx={tableSx}>
          <Cols />
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.category ? projectCategoryLabel(row.category) : "—"}
                </TableCell>
                <TableCell>{formatProjectDate(row.createdAt)}</TableCell>
                <TableCell>{formatProjectDate(row.updatedAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ProjectDetailsButton id={row.id} name={row.name} />
                    <DeleteProjectButton id={row.id} name={row.name} />
                  </Box>
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
      <col style={{ width: "28%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "10%" }} />
    </colgroup>
  );
}
