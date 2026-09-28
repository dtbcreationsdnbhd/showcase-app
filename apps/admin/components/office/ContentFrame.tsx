export default function ContentFrame({
  header,
  children,
  footer,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(80,60,140,0.06)]">
      {header ? (
        <div className="shrink-0 border-b border-[#F0EDF7] px-6 pt-6 pb-4">
          {header}
        </div>
      ) : null}
      <div
        className={`min-h-0 flex-1 overflow-auto px-6 pb-6 ${header ? "pt-4" : "pt-2"}`}
      >
        {children}
      </div>
      {footer}
    </section>
  );
}
