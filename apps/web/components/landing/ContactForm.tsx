"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { formCopy } from "@/lib/landing-content";
import type { ContactLink, ContactLinkId } from "@/lib/contact-links";
import { CJK_FONT, type Locale } from "@/lib/locale";
import InquirySnackbar, {
  type InquiryNotice,
} from "@/components/InquirySnackbar";
import {
  GOLD_RIM,
  glassPanelSx,
  goldButtonSx,
} from "@/lib/gold-theme";
import { useLocaleLoading } from "@/components/landing/LocaleLoading";
import { submitInquiry } from "@/lib/inquiries";
import type { ShowcaseProject } from "@/lib/projects";
import {
  CONTACT_FORM_HEIGHT_CSS,
  CONTACT_WAVE_MASK_FADE,
  CONTACT_WAVE_MASK_HOLD_PCT,
  figmaPx,
} from "@/lib/landing-layout";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

const CARD_W = figmaPx(560);
const TALK_W = CARD_W;
const CARD_PAD = figmaPx(26);
const INNER_W = CARD_W - CARD_PAD * 2;
const TALK_INNER = TALK_W - CARD_PAD * 2;

const CONNECT_BRAND = {
  whatsapp: {
    background: "linear-gradient(180deg, #7DFFB0 0%, #25D366 58%, #128C7E 100%)",
    glow: "rgba(37, 211, 102, 0.55)",
    rim: "#B8FFD4",
  },
  telegram: {
    background: "linear-gradient(180deg, #8FD8FF 0%, #2AABEE 58%, #1A8CC7 100%)",
    glow: "rgba(42, 171, 238, 0.55)",
    rim: "#C6ECFF",
  },
  facebook: {
    background: "linear-gradient(180deg, #6AABFF 0%, #1877F2 62%, #0C5DC4 100%)",
    glow: "rgba(24, 119, 242, 0.55)",
    rim: "#C5DEFF",
  },
  instagram: {
    background:
      "linear-gradient(135deg, #F9CE34 0%, #F77737 28%, #EE2A7B 58%, #6228D7 100%)",
    glow: "rgba(238, 42, 123, 0.5)",
    rim: "#FFD0E6",
  },
} as const;

function ConnectIcon({ id }: { id: ContactLinkId }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      sx={{ width: figmaPx(16), height: figmaPx(16) }}
    >
      {id === "whatsapp" ? (
        <path d="M22 16.9v2.2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 1.1h2.2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 8.9a16 16 0 0 0 6 6l1.4-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.8 2.2Z" />
      ) : null}
      {id === "telegram" ? (
        <path d="M21 4 3.5 11.2l6.2 2.1L17 8l-5.6 6.4.2 5.1 2.6-4.2L20 18.5 21 4Z" />
      ) : null}
      {id === "facebook" ? (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      ) : null}
      {id === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </>
      ) : null}
    </Box>
  );
}

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        width: figmaPx(42),
        height: figmaPx(42),
        borderRadius: `${figmaPx(12)}px`,
        color: "#FFD866",
        background: "rgba(255, 196, 92, 0.08)",
        boxShadow: `inset 0 0 0 1px ${GOLD_RIM}`,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 24 24"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{ width: figmaPx(22), height: figmaPx(22) }}
      >
        {children}
      </Box>
    </Box>
  );
}

const TALK_ICONS = [
  <>
    <path d="M13 2 4.5 13.5H11L10 22 20 9.5H13.2L13 2Z" />
  </>,
  <>
    <path d="M16 19v-1.2A3.8 3.8 0 0 0 12.2 14H7.8A3.8 3.8 0 0 0 4 17.8V19" />
    <circle cx="10" cy="8" r="3" />
    <path d="M20 19v-1.1A3.2 3.2 0 0 0 17.4 15" />
    <path d="M16.2 5.2a3 3 0 0 1 0 5.6" />
  </>,
  <>
    <rect x="4" y="4.2" width="16" height="3.6" rx="1.2" />
    <rect x="4" y="10.2" width="16" height="3.6" rx="1.2" />
    <rect x="4" y="16.2" width="16" height="3.6" rx="1.2" />
  </>,
];

type FormCopy = ReturnType<typeof formCopy>;
type Face = { fontFamily: string };

function TalkPanel({
  copy,
  face,
  locale,
  links,
}: {
  copy: FormCopy;
  face: Face;
  locale: Locale;
  links: readonly ContactLink[];
}) {
  const visibleLinks = links.filter((link) => link.href.trim());
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        flex: 1,
        width: TALK_INNER,
        gap: `${figmaPx(28)}px`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: `${figmaPx(14)}px` }}>
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: figmaPx(96),
            height: figmaPx(96),
          }}
        >
          <Image
            src="/landing/talk-chat.png"
            alt=""
            fill
            sizes="160px"
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${figmaPx(6)}px`,
            pt: `${figmaPx(8)}px`,
            minWidth: 0,
          }}
        >
          <Typography
            component="h2"
            sx={{
              ...face,
              m: 0,
              fontWeight: 700,
              fontSize: figmaPx(26),
              lineHeight: `${figmaPx(32)}px`,
              color: "#FFC46B",
            }}
          >
            {copy.talkTitle}
          </Typography>
          <Typography
            sx={{
              ...face,
              m: 0,
              fontWeight: 500,
              fontSize: locale === "zh" ? figmaPx(12) : figmaPx(14),
              lineHeight: "150%",
              color: "rgba(255, 214, 150, 0.88)",
            }}
          >
            {copy.talkIntro}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: `${figmaPx(16)}px`,
          pl: `${figmaPx(28)}px`,
        }}
      >
        {copy.points.map((point, index) => (
          <Box
            key={point.title}
            sx={{ display: "flex", alignItems: "center", gap: `${figmaPx(12)}px` }}
          >
            <IconFrame>{TALK_ICONS[index]}</IconFrame>
            <Box>
              <Typography
                sx={{
                  ...face,
                  m: 0,
                  fontWeight: 600,
                  fontSize: figmaPx(16),
                  lineHeight: `${figmaPx(22)}px`,
                  color: "#FFFFFF",
                }}
              >
                {point.title}
              </Typography>
              <Typography
                sx={{
                  ...face,
                  m: 0,
                  mt: `${figmaPx(2)}px`,
                  fontWeight: 500,
                  fontSize: locale === "zh" ? figmaPx(11) : figmaPx(13),
                  lineHeight: "150%",
                  color: "rgba(255, 255, 255, 0.72)",
                }}
              >
                {point.body}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {visibleLinks.length > 0 ? (
      <Box
        sx={{
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          pt: `${figmaPx(18)}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: `${figmaPx(14)}px`,
        }}
      >
        <Typography
          sx={{
            ...face,
            m: 0,
            fontWeight: 600,
            fontSize: figmaPx(16),
            lineHeight: `${figmaPx(22)}px`,
            color: "#FFC46B",
          }}
        >
          {copy.connect}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: `${figmaPx(10)}px`,
          }}
        >
          {visibleLinks.map((link) => (
            <Box
              key={link.id}
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
              className="hover-grow-sm"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: figmaPx(34),
                height: figmaPx(34),
                p: 0,
                borderRadius: "9999px",
                textDecoration: "none",
                color: "#FFFFFF",
                background: CONNECT_BRAND[link.id].background,
                boxShadow: [
                  "inset 0 1.5px 0 rgba(255, 255, 255, 0.7)",
                  "inset 0 -3px 6px rgba(0, 0, 0, 0.22)",
                  `0 0 0 1.5px ${CONNECT_BRAND[link.id].rim}`,
                  `0 6px 18px ${CONNECT_BRAND[link.id].glow}`,
                ].join(", "),
              }}
            >
              <ConnectIcon id={link.id} />
            </Box>
          ))}
        </Box>
      </Box>
      ) : null}
    </Box>
  );
}

const fieldLabelSx = {
  ...barlow,
  m: 0,
  fontWeight: 600,
  fontSize: figmaPx(14),
  lineHeight: `${figmaPx(18)}px`,
  color: "#FFFFFF",
} as const;

const fieldControlSx = {
  ...barlow,
  boxSizing: "border-box" as const,
  width: "100%",
  m: 0,
  height: figmaPx(38),
  px: `${figmaPx(14)}px`,
  border: 0,
  outline: 0,
  borderRadius: "9999px",
  background: "rgba(255, 255, 255, 0.04)",
  boxShadow: "inset 0 0 0 1px rgba(255, 214, 128, 0.28)",
  fontWeight: 500,
  fontSize: figmaPx(14),
  lineHeight: `${figmaPx(18)}px`,
  color: "#FFFFFF",
  caretColor: "#FFFFFF",
  "&::placeholder": { color: "rgba(255, 255, 255, 0.38)" },
  "&:focus": { outline: 0, boxShadow: "inset 0 0 0 1px rgba(255, 196, 107, 0.7)" },
};

function FieldLabel({
  htmlFor,
  children,
  required,
  face,
  fontSize = fieldLabelSx.fontSize,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  face: Face;
  fontSize?: number;
}) {
  const labelSx = { ...fieldLabelSx, ...face, fontSize };
  return (
    <Box
      component="label"
      htmlFor={htmlFor}
      sx={{ display: "flex", alignItems: "center", gap: `${figmaPx(4)}px` }}
    >
      <Typography component="span" sx={labelSx}>
        {children}
      </Typography>
      {required ? (
        <Typography component="span" aria-hidden sx={{ ...labelSx, color: "#FFD27A" }}>
          *
        </Typography>
      ) : null}
    </Box>
  );
}

function FormCard({
  children,
  width = CARD_W,
  overflow = "hidden",
}: {
  children: ReactNode;
  width?: number;
  overflow?: "hidden" | "visible";
}) {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        p: `${CARD_PAD}px`,
        width,
        height: "auto",
        overflow,
        flexShrink: 0,
        ...glassPanelSx,
        borderRadius: `${figmaPx(30)}px`,
      }}
    >
      {children}
    </Box>
  );
}

function ServiceCheck({ on }: { on: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        flexShrink: 0,
        width: figmaPx(16),
        height: figmaPx(16),
        borderRadius: `${figmaPx(4)}px`,
        boxSizing: "border-box",
        border: on ? "none" : "1.5px solid rgba(255, 214, 128, 0.55)",
        background: on ? "#FFD866" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {on ? (
        <Box
          component="svg"
          viewBox="0 0 12 12"
          sx={{ width: figmaPx(10), height: figmaPx(10), display: "block" }}
        >
          <path
            d="M2.2 6.2 4.8 8.8 9.8 3.2"
            fill="none"
            stroke="#3A1808"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Box>
      ) : null}
    </Box>
  );
}

function ServicePicker({
  projects,
  selectedIds,
  onChange,
  placeholder,
  face,
  controlSx,
}: {
  projects: readonly ShowcaseProject[];
  selectedIds: readonly string[];
  onChange: (ids: string[]) => void;
  placeholder: string;
  face: Face;
  controlSx: object;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = projects.filter((project) => selectedIds.includes(project.id));
  const label = selected.map((project) => project.name).join(", ");

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <Box ref={rootRef} sx={{ position: "relative", zIndex: open ? 30 : 1 }}>
      <Box
        component="button"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        sx={{
          ...controlSx,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: `${figmaPx(8)}px`,
          cursor: "pointer",
          textAlign: "left",
          color: label ? "#FFFFFF" : "rgba(255, 255, 255, 0.38)",
        }}
      >
        <Box
          component="span"
          sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {label || placeholder}
        </Box>
        <Box
          component="svg"
          viewBox="0 0 12 12"
          aria-hidden
          sx={{
            flexShrink: 0,
            width: figmaPx(12),
            height: figmaPx(12),
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
          }}
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            fill="none"
            stroke="#FFD866"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Box>
      </Box>
      {open ? (
        <Box
          role="listbox"
          aria-multiselectable="true"
          sx={{
            position: "absolute",
            top: `calc(100% + ${figmaPx(6)}px)`,
            left: 0,
            right: 0,
            zIndex: 30,
            m: 0,
            p: `${figmaPx(6)}px`,
            maxHeight: figmaPx(228),
            overflowY: "auto",
            borderRadius: `${figmaPx(16)}px`,
            backgroundColor: "#16040C",
            border: "1px solid rgba(255, 214, 128, 0.4)",
            boxShadow: "0 18px 40px rgba(12, 0, 6, 0.55)",
          }}
        >
          {projects.map((project) => {
            const on = selectedIds.includes(project.id);
            return (
              <Box
                key={project.id}
                component="button"
                type="button"
                role="option"
                aria-selected={on}
                onClick={() =>
                  onChange(
                    on
                      ? selectedIds.filter((id) => id !== project.id)
                      : [...selectedIds, project.id],
                  )
                }
                sx={{
                  ...face,
                  display: "flex",
                  alignItems: "center",
                  gap: `${figmaPx(10)}px`,
                  width: "100%",
                  m: 0,
                  px: `${figmaPx(12)}px`,
                  py: `${figmaPx(8)}px`,
                  border: 0,
                  borderRadius: `${figmaPx(10)}px`,
                  background: on ? "rgba(255, 196, 92, 0.14)" : "transparent",
                  color: on ? "#FFD866" : "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  fontSize: "inherit",
                  lineHeight: `${figmaPx(18)}px`,
                  textAlign: "left",
                  cursor: "pointer",
                  "&:hover": {
                    background: "rgba(255, 196, 92, 0.16)",
                    color: "#FFD866",
                  },
                }}
              >
                <ServiceCheck on={on} />
                {project.name}
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Box>
  );
}

export default function ContactForm({
  waveSrc,
  projects,
  connectLinks,
}: {
  waveSrc: string | null;
  projects: readonly ShowcaseProject[];
  connectLinks: readonly ContactLink[];
}) {
  const pathname = usePathname();
  const locale: Locale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
  const copy = formCopy(locale);
  const face: Face = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
  const controlSx = {
    ...fieldControlSx,
    ...face,
    fontSize: locale === "zh" ? figmaPx(12) : fieldControlSx.fontSize,
  };
  const labelFontSize = locale === "zh" ? figmaPx(12) : fieldLabelSx.fontSize;
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [company, setCompany] = useState("");
  const [market, setMarket] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const { begin: beginLoading, end: endLoading } = useLocaleLoading();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<InquiryNotice | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    const selectedServices = projects
      .filter((project) => serviceIds.includes(project.id))
      .map((project) => project.name);
    if (!fullName.trim() || !contact.trim() || selectedServices.length === 0) {
      setNotice({
        id: Date.now(),
        message: copy.required,
        tone: "error",
      });
      return;
    }
    setSubmitting(true);
    beginLoading();
    let result: Awaited<ReturnType<typeof submitInquiry>>;
    try {
      result = await submitInquiry({
        source: "web",
        services: selectedServices,
        budget: null,
        projectCycle: null,
        fullName,
        contact: "",
        lookingToBuild: "",
        projectDetails,
        telegram: contact,
        service: selectedServices.join(", "),
        brandName: company,
        region: market,
      });
    } finally {
      setSubmitting(false);
      endLoading();
    }
    if (!result.ok) {
      setNotice({ id: Date.now(), message: result.message, tone: "error" });
      return;
    }
    setFullName("");
    setContact("");
    setServiceIds([]);
    setCompany("");
    setMarket("");
    setProjectDetails("");
    setNotice({
      id: Date.now(),
      message: copy.submitted,
      tone: "success",
    });
  }

  return (
    <Box
      component="section"
      id="contact"
      sx={{
        position: "relative",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 0,
        width: "100%",
        height: CONTACT_FORM_HEIGHT_CSS,
        bgcolor: "transparent",
        overflow: "hidden",
      }}
    >
      {waveSrc ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            WebkitMaskImage: `linear-gradient(180deg, transparent 0%, transparent ${CONTACT_WAVE_MASK_HOLD_PCT}%, #000 calc(${CONTACT_WAVE_MASK_HOLD_PCT}% + ${CONTACT_WAVE_MASK_FADE}px), #000 100%)`,
            maskImage: `linear-gradient(180deg, transparent 0%, transparent ${CONTACT_WAVE_MASK_HOLD_PCT}%, #000 calc(${CONTACT_WAVE_MASK_HOLD_PCT}% + ${CONTACT_WAVE_MASK_FADE}px), #000 100%)`,
          }}
        >
          <Image
            src={waveSrc}
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center bottom" }}
          />
        </Box>
      ) : null}

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "stretch",
          p: 0,
          gap: `${figmaPx(24)}px`,
          width: "100%",
        }}
      >
        <FormCard width={TALK_W}>
          <TalkPanel copy={copy} face={face} locale={locale} links={connectLinks} />
        </FormCard>

        <FormCard overflow="visible">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              flex: 1,
              width: INNER_W,
              minHeight: 0,
              gap: `${figmaPx(5)}px`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: `${figmaPx(8)}px` }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  component="h2"
                  sx={{
                    ...face,
                    m: 0,
                    fontWeight: 700,
                    fontSize: figmaPx(22),
                    lineHeight: `${figmaPx(28)}px`,
                    color: "#FFC46B",
                  }}
                >
                  {copy.convoTitle}
                </Typography>
                <Typography
                  sx={{
                    ...face,
                    m: 0,
                    mt: `${figmaPx(2)}px`,
                    fontWeight: 500,
                    fontSize: locale === "zh" ? figmaPx(11) : figmaPx(13),
                    lineHeight: "145%",
                    color: "rgba(255, 255, 255, 0.55)",
                  }}
                >
                  {copy.convoIntro}
                </Typography>
              </Box>
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: figmaPx(34),
                  height: figmaPx(34),
                }}
              >
                <Image src="/landing/talk-chat.png" alt="" fill sizes="48px" style={{ objectFit: "contain" }} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: `${figmaPx(12)}px` }}>
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-name" required face={face} fontSize={labelFontSize}>
                  {copy.name}
                </FieldLabel>
                <Box
                  component="input"
                  id="contact-name"
                  value={fullName}
                  placeholder={copy.namePlaceholder}
                  onChange={(event) => setFullName(event.target.value)}
                  sx={controlSx}
                />
              </Box>

              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-telegram" required face={face} fontSize={labelFontSize}>
                  {copy.contact}
                </FieldLabel>
                <Box
                  component="input"
                  id="contact-telegram"
                  value={contact}
                  placeholder={copy.contactPlaceholder}
                  onChange={(event) => setContact(event.target.value)}
                  sx={controlSx}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(4)}px` }}>
              <FieldLabel required face={face} fontSize={labelFontSize}>
                {copy.service}
              </FieldLabel>
              <ServicePicker
                projects={projects}
                selectedIds={serviceIds}
                onChange={setServiceIds}
                placeholder={copy.servicePlaceholder}
                face={face}
                controlSx={controlSx}
              />
            </Box>

            <Typography sx={{ ...fieldLabelSx, ...face, fontSize: labelFontSize, color: "#FFC46B", mt: `${figmaPx(2)}px` }}>
              {copy.extra}{" "}
              <Box component="span" sx={{ color: "rgba(255, 196, 107, 0.72)", fontWeight: 500 }}>
                {copy.optional}
              </Box>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: `${figmaPx(12)}px` }}>
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-company" face={face} fontSize={labelFontSize}>{copy.company}</FieldLabel>
                <Box
                  component="input"
                  id="contact-company"
                  value={company}
                  placeholder={copy.companyPlaceholder}
                  onChange={(event) => setCompany(event.target.value)}
                  sx={controlSx}
                />
              </Box>
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-market" face={face} fontSize={labelFontSize}>{copy.market}</FieldLabel>
                <Box
                  component="input"
                  id="contact-market"
                  value={market}
                  placeholder={copy.marketPlaceholder}
                  onChange={(event) => setMarket(event.target.value)}
                  sx={controlSx}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(4)}px` }}>
              <FieldLabel htmlFor="contact-needs" face={face} fontSize={labelFontSize}>{copy.needs}</FieldLabel>
              <Box
                component="textarea"
                id="contact-needs"
                value={projectDetails}
                placeholder={copy.needsPlaceholder}
                onChange={(event) => setProjectDetails(event.target.value)}
                sx={{
                  ...controlSx,
                  height: figmaPx(52),
                  py: `${figmaPx(8)}px`,
                  borderRadius: `${figmaPx(14)}px`,
                  resize: "none",
                }}
              />
            </Box>

            <Box
              component="button"
              type="button"
              className="hover-grow-sm"
              disabled={submitting}
              onClick={() => {
                void handleSubmit();
              }}
              sx={{
                ...face,
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: `${figmaPx(8)}px`,
                width: "100%",
                height: figmaPx(36),
                border: 0,
                ...goldButtonSx,
                borderRadius: "9999px",
                fontWeight: 700,
                fontSize: figmaPx(15),
                lineHeight: `${figmaPx(20)}px`,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? copy.submitting : `${copy.submit} →`}
            </Box>
          </Box>
        </FormCard>
      </Box>
      <InquirySnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}
