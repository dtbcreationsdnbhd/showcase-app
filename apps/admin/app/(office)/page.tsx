import AuthNoticeBanner from "@/components/AuthNoticeBanner";
import ContentFrame from "@/components/office/ContentFrame";
import { noticeFromParam } from "@/lib/notices";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  const notice = noticeFromParam(params.notice);

  return (
    <ContentFrame>
      <AuthNoticeBanner notice={notice} />
    </ContentFrame>
  );
}
