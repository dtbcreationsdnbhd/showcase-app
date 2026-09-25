"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState, type ReactNode } from "react";
import {
  FORM_BUDGETS,
  FORM_BUDGET_TITLE,
  FORM_CYCLES,
  FORM_CYCLE_TITLE,
  FORM_FIELDS,
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
  MOBILE_ACCENT_GRADIENT,
  MOBILE_CONTENT_WIDTH,
  MOBILE_SECTION_BG,
  mobileAnchorId,
} from "@/lib/landing-layout-mobile";

const barlow = {
  fontFamily:
    'var(--font-barlow-semi-condensed), "Barlow Semi Condensed", sans-serif',
} as const;

/** The 1px border eats into the border box, so the content still lands 15px
 *  in from the card edge and the inner column measures 344. */
const CARD_PAD_X = 14;
const CARD_PAD_Y = 38.3;

const CHIP_H = 47;
const CHIP_GAP = 11.3;
const FIELD_H = 71.3;
const FIELD_GAP = 22.7;

const sectionTitleSx = {
  ...barlow,
  m: 0,
  fontWeight: 600,
  fontSize: 24,
  lineHeight: "normal",
  color: "#FFFFFF",
} as const;

const mutedSx = {
  ...barlow,
  m: 0,
  fontWeight: 500,
  fontSize: 15,
  lineHeight: "160%",
  letterSpacing: "0.02em",
  color: "rgba(255, 255, 255, 0.5)",
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
      aria-pressed={selected}
      sx={{
        ...barlow,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: CHIP_H,
        pl: "24px",
        pr: "24px",
        border: 0,
        borderRadius: "11px",
        background: selected
          ? MOBILE_ACCENT_GRADIENT
          : "rgba(255, 255, 255, 0.1)",
        fontWeight: 500,
        fontSize: 15,
        letterSpacing: "0.02em",
        color: "#FFFFFF",
        textAlign: "left",
        whiteSpace: "nowrap",
        appearance: "none",
        WebkitAppearance: "none",
      }}
    >
      {label}
    </Box>
  );
}

function ChipList({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: `${CHIP_GAP}px`,
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
}

function Divider({ gap }: { gap: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: "100%",
        height: 0,
        mt: `${gap}px`,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    />
  );
}

function Field({
  label,
  required,
  value,
  onChange,
}: {
  label: string;
  required: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const fieldId = `m-contact-${label.replaceAll(" ", "-").toLowerCase()}`;

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pt: "7px",
        px: "16px",
        pb: "10px",
        width: "100%",
        height: FIELD_H,
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "10px",
      }}
    >
      <Box component="label" htmlFor={fieldId} sx={{ display: "flex" }}>
        <Typography
          component="span"
          sx={{
            ...barlow,
            m: 0,
            fontWeight: 500,
            fontSize: 17,
            lineHeight: "normal",
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
              ml: "4px",
              fontWeight: 500,
              fontSize: 17,
              lineHeight: "normal",
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
          flexGrow: 1,
          m: 0,
          p: 0,
          border: 0,
          outline: 0,
          background: "transparent",
          fontWeight: 500,
          fontSize: 17,
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

export default function MobileContactForm() {
  const [services, setServices] = useState<string[]>([FORM_SERVICES[0]]);
  const [budget, setBudget] = useState<string | null>(null);
  const [cycle, setCycle] = useState<string | null>(null);
  const [values, setValues] = useState<string[]>(() =>
    FORM_FIELDS.map(() => ""),
  );
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
      source: "mobile",
      services,
      budget,
      projectCycle: cycle,
      fullName: values[0] ?? "",
      contact: values[1] ?? "",
      lookingToBuild: values[2] ?? "",
      projectDetails: values[3] ?? "",
    });
    setSubmitting(false);
    if (!result.ok) {
      setNotice({ id: Date.now(), message: result.message, tone: "error" });
      return;
    }
    setServices([FORM_SERVICES[0]]);
    setBudget(null);
    setCycle(null);
    setValues(FORM_FIELDS.map(() => ""));
    setNotice({
      id: Date.now(),
      message: "Submitted. We will respond within 12 hours.",
      tone: "success",
    });
  }

  return (
    <Box
      component="section"
      id={mobileAnchorId("contact-form")}
      sx={{
        width: "100%",
        bgcolor: MOBILE_SECTION_BG,
        boxSizing: "border-box",
        pt: "90px",
        pb: "60px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          width: MOBILE_CONTENT_WIDTH,
          px: `${CARD_PAD_X}px`,
          py: `${CARD_PAD_Y}px`,
          background: "rgba(18, 13, 39, 0.5)",
          border: "1px solid rgba(195, 164, 255, 0.05)",
          borderRadius: "28px",
          backdropFilter: "blur(21px)",
          WebkitBackdropFilter: "blur(21px)",
        }}
      >
        {/* Services — the only block the design centres. */}
        <Typography
          component="h2"
          sx={{ ...sectionTitleSx, textAlign: "center" }}
        >
          {FORM_SERVICES_TITLE}
        </Typography>
        <Typography sx={{ ...mutedSx, mt: "6.75px", textAlign: "center" }}>
          {FORM_SERVICES_HINT}
        </Typography>
        <Box sx={{ mt: "21.75px" }}>
          <ChipList>
            {FORM_SERVICES.map((label) => (
              <Chip
                key={label}
                label={label}
                selected={services.includes(label)}
                onClick={() => toggleService(label)}
              />
            ))}
          </ChipList>
        </Box>

        <Divider gap={30.1} />

        <Typography component="h2" sx={{ ...sectionTitleSx, mt: "28.6px" }}>
          {FORM_BUDGET_TITLE}
        </Typography>
        <Box sx={{ mt: "22.9px" }}>
          <ChipList>
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
          </ChipList>
        </Box>

        <Divider gap={28.4} />

        <Typography component="h2" sx={{ ...sectionTitleSx, mt: "23.6px" }}>
          {FORM_CYCLE_TITLE}
        </Typography>
        <Box sx={{ mt: "23.4px" }}>
          <ChipList>
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
          </ChipList>
        </Box>

        <Typography
          component="h2"
          sx={{
            ...barlow,
            m: 0,
            mt: "35.9px",
            fontWeight: 600,
            fontSize: 32,
            lineHeight: "normal",
            letterSpacing: "-0.02em",
            color: "#C3A4FF",
          }}
        >
          {FORM_REACH_TITLE}
        </Typography>
        <Typography sx={{ ...mutedSx, mt: "12.5px" }}>
          {FORM_REACH_INTRO}
        </Typography>

        <Box
          sx={{
            mt: "29.15px",
            display: "flex",
            flexDirection: "column",
            gap: `${FIELD_GAP}px`,
          }}
        >
          {FORM_FIELDS.map((field, index) => (
            <Field
              key={field.label}
              label={field.label}
              required={field.required}
              value={values[index]}
              onChange={(next) =>
                setValues((current) =>
                  current.map((item, i) => (i === index ? next : item)),
                )
              }
            />
          ))}
        </Box>

        <Box
          component="button"
          type="button"
          disabled={submitting}
          onClick={() => {
            void handleSubmit();
          }}
          sx={{
            ...barlow,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: "38.4px",
            width: "100%",
            height: 55,
            border: 0,
            background: MOBILE_ACCENT_GRADIENT,
            boxShadow: "0px 4px 20px rgba(236, 115, 255, 0.5)",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: 16.5,
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
      <InquirySnackbar notice={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}
