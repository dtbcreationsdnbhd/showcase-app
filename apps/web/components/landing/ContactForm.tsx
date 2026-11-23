"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { FORM_TELEGRAM_URL, formCopy } from "@/lib/landing-content";
import { CJK_FONT, type Locale } from "@/lib/locale";
import InquirySnackbar, {
  type InquiryNotice,
} from "@/components/InquirySnackbar";
import {
  GOLD_RIM,
  glassPanelSx,
  goldButtonSx,
} from "@/lib/gold-theme";
import { submitInquiry } from "@/lib/inquiries";
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

function TalkPanel({ copy, face }: { copy: FormCopy; face: Face }) {
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
              fontSize: figmaPx(14),
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
                  fontSize: figmaPx(13),
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
          component="a"
          href={FORM_TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover-grow-sm"
          sx={{
            ...face,
            ...goldButtonSx,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: `${figmaPx(8)}px`,
            minWidth: figmaPx(168),
            height: figmaPx(34),
            px: `${figmaPx(18)}px`,
            borderRadius: "9999px",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: figmaPx(14),
            lineHeight: `${figmaPx(20)}px`,
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 24 24"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{ width: figmaPx(14), height: figmaPx(14) }}
          >
            <path d="M21 4 3.5 11.2l6.2 2.1L17 8l-5.6 6.4.2 5.1 2.6-4.2L20 18.5 21 4Z" />
          </Box>
          {copy.telegram}
        </Box>
      </Box>
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
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
  face: Face;
}) {
  const labelSx = { ...fieldLabelSx, ...face };
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
}: {
  children: ReactNode;
  width?: number;
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
        overflow: "hidden",
        flexShrink: 0,
        ...glassPanelSx,
        borderRadius: `${figmaPx(30)}px`,
      }}
    >
      {children}
    </Box>
  );
}

export default function ContactForm({ waveSrc }: { waveSrc: string | null }) {
  const pathname = usePathname();
  const locale: Locale = pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
  const copy = formCopy(locale);
  const face: Face = locale === "zh" ? { fontFamily: CJK_FONT } : barlow;
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [company, setCompany] = useState("");
  const [market, setMarket] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<InquiryNotice | null>(null);

  async function handleSubmit() {
    if (submitting) return;
    if (!fullName.trim() || !contact.trim() || !service.trim()) {
      setNotice({
        id: Date.now(),
        message: copy.required,
        tone: "error",
      });
      return;
    }
    setSubmitting(true);
    const result = await submitInquiry({
      source: "web",
      services: [],
      budget: null,
      projectCycle: null,
      fullName,
      contact: "",
      lookingToBuild: "",
      projectDetails,
      telegram: contact,
      service,
      brandName: company,
      region: market,
    });
    setSubmitting(false);
    if (!result.ok) {
      setNotice({ id: Date.now(), message: result.message, tone: "error" });
      return;
    }
    setFullName("");
    setContact("");
    setService("");
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
          <TalkPanel copy={copy} face={face} />
        </FormCard>

        <FormCard>
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
                    fontSize: figmaPx(13),
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
                <FieldLabel htmlFor="contact-name" required face={face}>
                  {copy.name}
                </FieldLabel>
                <Box
                  component="input"
                  id="contact-name"
                  value={fullName}
                  placeholder={copy.namePlaceholder}
                  onChange={(event) => setFullName(event.target.value)}
                  sx={{ ...fieldControlSx, ...face }}
                />
              </Box>

              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-telegram" required face={face}>
                  {copy.contact}
                </FieldLabel>
                <Box
                  component="input"
                  id="contact-telegram"
                  value={contact}
                  placeholder={copy.contactPlaceholder}
                  onChange={(event) => setContact(event.target.value)}
                  sx={{ ...fieldControlSx, ...face }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(4)}px` }}>
              <FieldLabel htmlFor="contact-service" required face={face}>
                {copy.service}
              </FieldLabel>
              <Box
                component="input"
                id="contact-service"
                value={service}
                placeholder={copy.servicePlaceholder}
                onChange={(event) => setService(event.target.value)}
                sx={{ ...fieldControlSx, ...face }}
              />
            </Box>

            <Typography sx={{ ...fieldLabelSx, ...face, color: "#FFC46B", mt: `${figmaPx(2)}px` }}>
              {copy.extra}{" "}
              <Box component="span" sx={{ color: "rgba(255, 196, 107, 0.72)", fontWeight: 500 }}>
                {copy.optional}
              </Box>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: `${figmaPx(12)}px` }}>
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-company" face={face}>{copy.company}</FieldLabel>
                <Box
                  component="input"
                  id="contact-company"
                  value={company}
                  placeholder={copy.companyPlaceholder}
                  onChange={(event) => setCompany(event.target.value)}
                  sx={{ ...fieldControlSx, ...face }}
                />
              </Box>
              <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: `${figmaPx(4)}px`, minWidth: 0 }}>
                <FieldLabel htmlFor="contact-market" face={face}>{copy.market}</FieldLabel>
                <Box
                  component="input"
                  id="contact-market"
                  value={market}
                  placeholder={copy.marketPlaceholder}
                  onChange={(event) => setMarket(event.target.value)}
                  sx={{ ...fieldControlSx, ...face }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: `${figmaPx(4)}px` }}>
              <FieldLabel htmlFor="contact-needs" face={face}>{copy.needs}</FieldLabel>
              <Box
                component="textarea"
                id="contact-needs"
                value={projectDetails}
                placeholder={copy.needsPlaceholder}
                onChange={(event) => setProjectDetails(event.target.value)}
                sx={{
                  ...fieldControlSx,
                  ...face,
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
