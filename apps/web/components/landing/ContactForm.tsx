"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import {
  FORM_BUDGETS,
  FORM_BUDGET_TITLE,
  FORM_CYCLES,
  FORM_CYCLE_TITLE,
  FORM_REACH_INTRO,
  FORM_REACH_TITLE,
  FORM_SERVICES,
  FORM_SERVICES_HINT,
  FORM_SERVICES_TITLE,
  FORM_SUBMIT_LABEL,
} from "@/lib/landing-content";
import InquirySnackbar, {
  type InquiryNotice,
} from "@/components/InquirySnackbar";
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

const CARD_W = figmaPx(423);
const CARD_H = figmaPx(587.25);
const CARD_PAD = figmaPx(26);
const INNER_W = CARD_W - CARD_PAD * 2;

const chipBase = {
  ...barlow,
  boxSizing: "border-box",
  display: "inline-flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  py: `${figmaPx(12)}px`,
  px: `${figmaPx(24)}px`,
  height: figmaPx(37.5),
  width: figmaPx(116.25),
  border: 0,
  borderRadius: `${figmaPx(12)}px`,
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: figmaPx(12),
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "#FFFFFF",
  textAlign: "center",
  cursor: "pointer",
  whiteSpace: "nowrap",
  appearance: "none",
  WebkitAppearance: "none",
} as const;

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        ...chipBase,
        background: selected
          ? "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)"
          : "rgba(255, 255, 255, 0.1)",
      }}
    >
      {label}
    </Box>
  );
}

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        p: 0,
        gap: `${figmaPx(10)}px`,
        width: INNER_W,
      }}
    >
      {children}
    </Box>
  );
}

function Divider() {
  return (
    <Box
      sx={{
        width: INNER_W,
        height: 0,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        flexShrink: 0,
      }}
    />
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        ...barlow,
        width: INNER_W,
        height: figmaPx(31),
        m: 0,
        fontStyle: "normal",
        fontWeight: 600,
        fontSize: figmaPx(19.5),
        lineHeight: `${figmaPx(31)}px`,
        color: "#FFFFFF",
      }}
    >
      {children}
    </Typography>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const fieldId = `contact-${label.replaceAll(" ", "-").toLowerCase()}`;

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        py: `${figmaPx(6)}px`,
        px: `${figmaPx(10)}px`,
        gap: `${figmaPx(5)}px`,
        width: INNER_W,
        height: figmaPx(57),
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: `${figmaPx(12)}px`,
      }}
    >
      <Box
        component="label"
        htmlFor={fieldId}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          px: `${figmaPx(6)}px`,
          gap: `${figmaPx(3)}px`,
          width: "100%",
          height: "auto",
          lineHeight: 1,
        }}
      >
        <Typography
          component="span"
          sx={{
            ...barlow,
            m: 0,
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: figmaPx(12),
            lineHeight: "160%",
            letterSpacing: "0.02em",
            color: "#FFFFFF",
          }}
        >
          {label}
        </Typography>
        {required ? (
          <Typography
            component="span"
            aria-hidden
            sx={{
              ...barlow,
              m: 0,
              fontStyle: "normal",
              fontWeight: 500,
              fontSize: figmaPx(12),
              lineHeight: "160%",
              letterSpacing: "0.02em",
              color: "#9747FF",
            }}
          >
            *
          </Typography>
        ) : null}
      </Box>
      <Box
        component="input"
        id={fieldId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          ...barlow,
          boxSizing: "border-box",
          width: "100%",
          m: 0,
          px: `${figmaPx(6)}px`,
          border: 0,
          outline: 0,
          background: "transparent",
          fontStyle: "normal",
          fontWeight: 500,
          fontSize: figmaPx(12),
          lineHeight: "160%",
          letterSpacing: "0.02em",
          color: "#FFFFFF",
          caretColor: "#FFFFFF",
          appearance: "none",
          "&:focus": { outline: 0 },
        }}
      />
    </Box>
  );
}

function FormCard({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: `${CARD_PAD}px`,
        gap: `${figmaPx(26)}px`,
        width: CARD_W,
        height: CARD_H,
        overflow: "hidden",
        flexShrink: 0,
        background: "rgba(18, 13, 39, 0.5)",
        border: "1px solid rgba(195, 164, 255, 0.05)",
        borderRadius: `${figmaPx(30)}px`,
        backdropFilter: "blur(21px)",
        WebkitBackdropFilter: "blur(21px)",
      }}
    >
      {children}
    </Box>
  );
}

export default function ContactForm({ waveSrc }: { waveSrc: string | null }) {
  const [services, setServices] = useState<string[]>([FORM_SERVICES[0]]);
  const [budget, setBudget] = useState<string | null>(null);
  const [cycle, setCycle] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [lookingToBuild, setLookingToBuild] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<InquiryNotice | null>(null);

  function toggleService(label: string) {
    setServices((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const result = await submitInquiry({
      source: "web",
      services,
      budget,
      projectCycle: cycle,
      fullName,
      contact,
      lookingToBuild,
      projectDetails,
    });
    setSubmitting(false);
    if (!result.ok) {
      setNotice({ id: Date.now(), message: result.message, tone: "error" });
      return;
    }
    setServices([FORM_SERVICES[0]]);
    setBudget(null);
    setCycle(null);
    setFullName("");
    setContact("");
    setLookingToBuild("");
    setProjectDetails("");
    setNotice({
      id: Date.now(),
      message: "Submitted. We will respond within 12 hours.",
      tone: "success",
    });
  }

  return (
    <Box
      component="section"
      id="contact-form"
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
        bgcolor: "#050B13",
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
          alignItems: "flex-start",
          p: 0,
          gap: `${figmaPx(24)}px`,
          width: "100%",
        }}
      >
        <FormCard>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(20)}px`,
              width: INNER_W,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(16)}px`,
                width: INNER_W,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  p: 0,
                  width: INNER_W,
                }}
              >
                <SectionTitle>{FORM_SERVICES_TITLE}</SectionTitle>
                <Typography
                  sx={{
                    ...barlow,
                    m: 0,
                    fontStyle: "normal",
                    fontWeight: 500,
                    fontSize: figmaPx(12),
                    lineHeight: "160%",
                    letterSpacing: "0.02em",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {FORM_SERVICES_HINT}
                </Typography>
              </Box>
              <ChipRow>
                {FORM_SERVICES.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    selected={services.includes(label)}
                    onClick={() => toggleService(label)}
                  />
                ))}
              </ChipRow>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(15)}px`,
                width: INNER_W,
              }}
            >
              <SectionTitle>{FORM_BUDGET_TITLE}</SectionTitle>
              <ChipRow>
                {FORM_BUDGETS.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    selected={budget === label}
                    onClick={() =>
                      setBudget((current) => (current === label ? null : label))
                    }
                  />
                ))}
              </ChipRow>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(15)}px`,
                width: INNER_W,
              }}
            >
              <SectionTitle>{FORM_CYCLE_TITLE}</SectionTitle>
              <ChipRow>
                {FORM_CYCLES.map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    selected={cycle === label}
                    onClick={() =>
                      setCycle((current) => (current === label ? null : label))
                    }
                  />
                ))}
              </ChipRow>
            </Box>
          </Box>
        </FormCard>

        <FormCard>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              width: INNER_W,
            }}
          >
            <Typography
              component="h2"
              sx={{
                ...barlow,
                width: INNER_W,
                height: figmaPx(41),
                m: 0,
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: figmaPx(25.5),
                lineHeight: `${figmaPx(41)}px`,
                letterSpacing: "-0.02em",
                color: "#C3A4FF",
              }}
            >
              {FORM_REACH_TITLE}
            </Typography>
            <Typography
              sx={{
                ...barlow,
                width: INNER_W,
                m: 0,
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: figmaPx(12),
                lineHeight: "160%",
                letterSpacing: "0.02em",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {FORM_REACH_INTRO}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 0,
              gap: `${figmaPx(35)}px`,
              width: INNER_W,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: 0,
                gap: `${figmaPx(16)}px`,
                width: INNER_W,
              }}
            >
              <Field
                label="Full Name"
                required
                value={fullName}
                onChange={setFullName}
              />
              <Field
                label="Email or Telegram"
                required
                value={contact}
                onChange={setContact}
              />
              <Field
                label="What are you looking to build?"
                required
                value={lookingToBuild}
                onChange={setLookingToBuild}
              />
              <Field
                label="Tell us more about your project"
                value={projectDetails}
                onChange={setProjectDetails}
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
                ...barlow,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                py: `${figmaPx(16)}px`,
                pl: `${figmaPx(20)}px`,
                pr: `${figmaPx(6)}px`,
                width: INNER_W,
                height: figmaPx(40.5),
                border: 0,
                background: "linear-gradient(90deg, #CC35CC 0%, #563DFE 100%)",
                boxShadow: "0px 4px 20px rgba(236, 115, 255, 0.5)",
                borderRadius: "9999px",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: figmaPx(13.5),
                lineHeight: `${figmaPx(22)}px`,
                color: "#FFFFFF",
                cursor: submitting ? "default" : "pointer",
                opacity: submitting ? 0.7 : 1,
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              {submitting ? "Submitting..." : FORM_SUBMIT_LABEL}
            </Box>
          </Box>
        </FormCard>
      </Box>
      <InquirySnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}
