import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";

import CreateProjectButton from "@/components/office/CreateProjectButton";
import ContentFrame from "@/components/office/ContentFrame";
import {
  InquiryPendingProvider,
  InquiryTablePending,
} from "@/components/office/InquiryPending";
import ProjectPagination from "@/components/office/ProjectPagination";
import ProjectSearch from "@/components/office/ProjectSearch";
import ProjectsTable from "@/components/office/ProjectsTable";
import {
  PROJECT_PAGE_SIZE,
  isPageSize,
  listProjects,
  projectPageHref,
} from "@/lib/projects";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    size?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const requestedPage = pageFromParam(params.page);
  const pageSize = pageSizeFromParam(params.size);
  const result = await listProjects({
    query,
    page: requestedPage,
    pageSize,
  });

  if (result.ok && result.page !== requestedPage) {
    redirect(projectPageHref(result.page, query, result.pageSize));
  }

  return (
    <InquiryPendingProvider>
      <ContentFrame
        flush
        header={
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                Showcase Project
              </Typography>
              <CreateProjectButton />
            </Box>
            <ProjectSearch query={query} pageSize={pageSize} />
          </Box>
        }
        footer={
          result.ok ? (
            <ProjectPagination
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
              query={query}
            />
          ) : null
        }
      >
        <InquiryTablePending label="Loading projects">
          {result.ok ? (
            <ProjectsTable
              rows={result.rows}
              start={(result.page - 1) * result.pageSize + 1}
              emptyLabel={query ? "No matching projects." : "No projects yet."}
            />
          ) : (
            <Typography variant="body2" color="error" role="alert" sx={{ px: 4, py: 3 }}>
              {result.message}
            </Typography>
          )}
        </InquiryTablePending>
      </ContentFrame>
    </InquiryPendingProvider>
  );
}

function pageFromParam(value: string | undefined) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return 1;
  return page;
}

function pageSizeFromParam(value: string | undefined) {
  const size = Number(value);
  if (isPageSize(size)) return size;
  return PROJECT_PAGE_SIZE;
}
