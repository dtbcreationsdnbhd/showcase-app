import InquiryDetailsButton from "@/components/office/InquiryDetailsButton";
import { formatInquiryDate, type Inquiry } from "@/lib/inquiries";

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
    return <p className="text-sm text-[#6B6578]">{emptyLabel}</p>;
  }

  return (
    <table className="w-full min-w-[960px] border-separate border-spacing-0 text-left text-sm">
      <caption className="sr-only">Inquiries</caption>
      <thead>
        <tr className="text-sm font-semibold text-[#171717]">
          <th scope="col" className={headerCell}>
            No
          </th>
          <th scope="col" className={headerCell}>
            Source
          </th>
          <th scope="col" className={headerCell}>
            Name
          </th>
          <th scope="col" className={headerCell}>
            Contact
          </th>
          <th scope="col" className={headerCell}>
            Services
          </th>
          <th scope="col" className={headerCell}>
            Budget
          </th>
          <th scope="col" className={headerCell}>
            Project cycle
          </th>
          <th scope="col" className={headerCell}>
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id} className="h-12">
            <td className={bodyCell + " whitespace-nowrap text-[#6B6578]"}>
              {start + index}
            </td>
            <td className={bodyCell + " capitalize"}>{row.source}</td>
            <td className={bodyCell + " font-medium"}>{row.full_name}</td>
            <td className={bodyCell}>{row.contact}</td>
            <td className={bodyCell + " max-w-[180px]"}>
              <Clamped text={serviceList(row.services)} />
            </td>
            <td className={bodyCell}>{row.budget || "—"}</td>
            <td className={bodyCell}>{row.project_cycle || "—"}</td>
            <td className={bodyCell}>
              <InquiryDetailsButton
                name={row.full_name}
                submitted={formatInquiryDate(row.created_at)}
                lookingToBuild={row.looking_to_build}
                details={row.project_details}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const headerCell =
  "sticky top-0 z-10 border-b border-[#F0EDF7] bg-white px-3 py-3 font-semibold";

const bodyCell =
  "h-12 overflow-hidden border-b border-[#F7F5FB] px-3 align-middle";

function serviceList(services: string[] | null) {
  if (!services?.length) return null;
  return services.join(", ");
}

function Clamped({ text }: { text: string | null }) {
  if (!text) return "—";

  return (
    <span className="line-clamp-1" title={text}>
      {text}
    </span>
  );
}
