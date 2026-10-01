import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import EditProjectButton from "@/components/office/EditProjectButton";
import DeleteProjectButton from "@/components/office/DeleteProjectButton";
import ProjectDetailsButton from "@/components/office/ProjectDetailsButton";
import ProjectPhotosButton from "@/components/office/ProjectPhotosButton";
import { formatProjectDate, type ShowcaseProject } from "@/lib/projects";

const columns = [
  "No",
  "Name",
  "Tags",
  "Main image",
  "Detail image",
  "Created At",
  "Updated At",
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

export default function ProjectsTable({
  rows,
  emptyLabel,
  start,
}: {
  rows: ShowcaseProject[];
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
        <Table aria-label="Projects" sx={tableSx}>
          <Cols />
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{start + index}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {row.tags.length === 0 ? (
                    "—"
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {row.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" sx={chipSx} />
                      ))}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <ProjectPhotosButton
                    name={row.name}
                    title="Main image"
                    urls={row.mainImageUrl ? [row.mainImageUrl] : []}
                  />
                </TableCell>
                <TableCell>
                  <ProjectPhotosButton
                    name={row.name}
                    title="Detail image"
                    urls={row.detailImageUrls}
                  />
                </TableCell>
                <TableCell>{formatProjectDate(row.createdAt)}</TableCell>
                <TableCell>{formatProjectDate(row.updatedAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <EditProjectButton project={row} />
                    <ProjectDetailsButton
                      name={row.name}
                      challenge={row.challenge}
                      solution={row.solution}
                    />
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

const chipSx = {
  height: 24,
  bgcolor: "#F4F1FB",
  color: "#171717",
  fontSize: 12,
  fontWeight: 500,
  "& .MuiChip-label": { px: 1 },
};

function Cols() {
  return (
    <colgroup>
      <col style={{ width: "5%" }} />
      <col style={{ width: "16%" }} />
      <col style={{ width: "19%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "14%" }} />
      <col style={{ width: "10%" }} />
    </colgroup>
  );
}
