"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useId, useRef, useState, useTransition, type DragEvent, type FormEvent, type ReactNode } from "react";

import { createShowcaseProject, updateShowcaseProject } from "@/app/(office)/projects/actions";
import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";
import FeatureMark from "@/components/office/FeatureMark";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import {
  FEATURE_ICON_LABELS,
  FEATURE_ICONS,
  type FeatureIconName,
  type ProjectFeature,
} from "@/lib/project-sheet";
import {
  MAX_DETAIL_MEDIA,
  MAX_UPLOAD_TOTAL_BYTES,
  PROJECT_MEDIA_ACCEPT,
  isProjectVideoType,
  isVideoUrl,
  mediaFileError,
  totalUploadBytes,
} from "@/lib/project-media";
import type { ShowcaseProject } from "@/lib/projects";
import { cornerRadius } from "@/lib/ui";

const MAIN_MEDIA_HINT =
  "Recommended 1200 × 1800 px, portrait 2:3. The card crops the photo to fill the frame, so keep the subject toward the top.";
const DETAIL_MEDIA_HINT =
  "Up to 4. Recommended 1800 × 1200 px, landscape 3:2. The popup shows these under the main image.";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: cornerRadius,
    bgcolor: "#fff",
  },
};

const zhFieldSx = {
  ...fieldSx,
  "& .MuiInputBase-input": {
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  },
};

type ProjectFormDialogProps = {
  open: boolean;
  session: number;
  onClose: () => void;
} & (
  | { mode: "create"; project?: undefined }
  | { mode: "edit"; project: ShowcaseProject }
);

export default function ProjectFormDialog(props: ProjectFormDialogProps) {
  const { open, session, mode, onClose } = props;
  const project = mode === "edit" ? props.project : undefined;
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const [pending, startTransition] = useTransition();

  function close() {
    if (pending) return;
    onClose();
  }

  function onSave(data: FormData) {
    startTransition(async () => {
      try {
        const result =
          mode === "edit"
            ? await updateShowcaseProject(data)
            : await createShowcaseProject(data);
        if (!result.ok) {
          setNotice({
            id: crypto.randomUUID(),
            message: result.message,
            tone: "error",
          });
          return;
        }

        onClose();
        setNotice({
          id: crypto.randomUUID(),
          message: mode === "edit" ? "Project updated" : "Project created",
          tone: "success",
        });
      } catch (error) {
        const text = error instanceof Error ? error.message : "";
        setNotice({
          id: crypto.randomUUID(),
          message: /Unexpected end of form/i.test(text)
            ? "Upload too large. Keep all new media under 100 MB total (each video ≤50 MB)."
            : "Could not save the project.",
          tone: "error",
        });
      }
    });
  }

  const title = mode === "edit" ? "Edit" : "Create";
  const subtitle =
    mode === "edit" ? "Update this showcase project." : "Add a project to the showcase.";

  return (
    <>
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="lg"
        slotProps={{
          paper: {
            sx: {
              borderRadius: cornerRadius,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ flexShrink: 0, px: 3, pt: 3, pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        {open ? (
          <ProjectFormFields
            key={session}
            mode={mode}
            project={project}
            pending={pending}
            onSave={onSave}
            onCancel={close}
            onNotice={setNotice}
          />
        ) : null}
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function ProjectFormFields({
  mode,
  project,
  pending,
  onSave,
  onCancel,
  onNotice,
}: {
  mode: "create" | "edit";
  project?: ShowcaseProject;
  pending: boolean;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  onNotice: (notice: AuthNotice) => void;
}) {
  const [features, setFeatures] = useState<ProjectFeature[]>(
    project?.features.length
      ? project.features
      : [{ label: "", icon: "search" }],
  );
  const submitLabel = mode === "edit" ? "Save" : "Create";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set(
      "features",
      JSON.stringify(
        features.map((feature) => ({
          label: feature.label.trim(),
          icon: feature.icon,
          labelZh: feature.labelZh?.trim() ?? "",
        })),
      ),
    );
    if (project) data.set("id", project.id);

    const files = [...data.getAll("mainImage"), ...data.getAll("detailImages")].filter(
      (value): value is File => value instanceof File && value.size > 0,
    );
    for (const file of files) {
      const problem = mediaFileError(file);
      if (problem) {
        onNotice({ id: crypto.randomUUID(), message: problem, tone: "error" });
        return;
      }
    }
    if (totalUploadBytes(files) > MAX_UPLOAD_TOTAL_BYTES) {
      onNotice({
        id: crypto.randomUUID(),
        message:
          "All new media together must be 100 MB or smaller (each video ≤50 MB).",
        tone: "error",
      });
      return;
    }

    const detailCount =
      data.getAll("keptDetailImages").filter((value) => String(value).trim()).length +
      data
        .getAll("detailImages")
        .filter((value) => value instanceof File && value.size > 0).length;
    if (detailCount > MAX_DETAIL_MEDIA) {
      onNotice({
        id: crypto.randomUUID(),
        message: `Detail media is limited to ${MAX_DETAIL_MEDIA} files.`,
        tone: "error",
      });
      return;
    }

    onSave(data);
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: "flex",
        minHeight: 0,
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          minHeight: 0,
          flex: "1 1 auto",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        <LanguagePair
          english={
            <TextField
              name="name"
              label="Project name"
              required
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.name ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="nameZh"
              label="项目名"
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.nameZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <LanguagePair
          english={
            <TextField
              name="subtitle"
              label="Subtitle"
              required
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.subtitle ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="subtitleZh"
              label="副标题"
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.subtitleZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
          Subtitle is the line under the project name in the popup.
        </Typography>
        <TextField
          name="category"
          label="Category"
          select
          required
          fullWidth
          size="small"
          disabled={pending}
          defaultValue={project?.category ?? ""}
          sx={fieldSx}
        >
          <MenuItem value="" disabled>
            Select a category
          </MenuItem>
          {PROJECT_CATEGORIES.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <FeatureFields
          features={features}
          disabled={pending}
          onChange={setFeatures}
        />
        <LanguagePair
          english={
            <TextField
              name="whyIt"
              label="Why You Need It"
              required
              fullWidth
              multiline
              minRows={4}
              disabled={pending}
              defaultValue={project?.whyIt ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="whyItZh"
              label="为什么需要"
              fullWidth
              multiline
              minRows={4}
              disabled={pending}
              defaultValue={project?.whyItZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <LanguagePair
          english={
            <TextField
              name="howWeHelp"
              label="How We Help"
              required
              fullWidth
              multiline
              minRows={4}
              disabled={pending}
              defaultValue={project?.howWeHelp ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="howWeHelpZh"
              label="我们如何协助"
              fullWidth
              multiline
              minRows={4}
              disabled={pending}
              defaultValue={project?.howWeHelpZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <LanguagePair
          english={
            <TextField
              name="ctaText"
              label="Button text"
              required
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.ctaText ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="ctaTextZh"
              label="按钮文字"
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.ctaTextZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
          The gold button opens the button link. Leave that link empty and it opens Telegram.
        </Typography>
        <TextField
          name="buttonUrl"
          label="Button link (optional)"
          placeholder="https://"
          fullWidth
          size="small"
          disabled={pending}
          defaultValue={project?.buttonUrl ?? ""}
          sx={fieldSx}
        />
        <LanguagePair
          english={
            <TextField
              name="footerText"
              label="Line under the button"
              required
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.footerText ?? ""}
              sx={fieldSx}
            />
          }
          chinese={
            <TextField
              name="footerTextZh"
              label="按钮下方文字"
              fullWidth
              size="small"
              disabled={pending}
              defaultValue={project?.footerTextZh ?? ""}
              sx={zhFieldSx}
            />
          }
        />
        <TextField
          name="landingUrl"
          label="Landing page link (optional)"
          placeholder="https://"
          fullWidth
          size="small"
          disabled={pending}
          defaultValue={project?.landingUrl ?? ""}
          sx={fieldSx}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: -1 }}>
          Optional. Shown under How We Help as Visit Site. The text is this link.
        </Typography>
        <ImageField
          name="mainImage"
          keptName="keptMainImage"
          label="Main media (required)"
          hint={MAIN_MEDIA_HINT}
          disabled={pending}
          existingUrls={project?.mainImageUrl ? [project.mainImageUrl] : []}
        />
        <ImageField
          name="detailImages"
          keptName="keptDetailImages"
          label="Detail media (optional)"
          hint={DETAIL_MEDIA_HINT}
          disabled={pending}
          multiple
          maxCount={MAX_DETAIL_MEDIA}
          onLimit={(message) =>
            onNotice({ id: crypto.randomUUID(), message, tone: "error" })
          }
          existingUrls={project?.detailImageUrls ?? []}
        />
      </DialogContent>
      <DialogActions sx={{ flexShrink: 0, px: 3, pb: 2.5 }}>
        <Button type="button" onClick={onCancel} disabled={pending}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={pending}>
          {pending ? <CircularProgress size={18} color="inherit" /> : submitLabel}
        </Button>
      </DialogActions>
    </Box>
  );
}

function LanguagePair({
  english,
  chinese,
}: {
  english: ReactNode;
  chinese: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 2,
        alignItems: "start",
      }}
    >
      {english}
      {chinese}
    </Box>
  );
}

function FeatureFields({
  features,
  disabled,
  onChange,
}: {
  features: ProjectFeature[];
  disabled: boolean;
  onChange: (features: ProjectFeature[]) => void;
}) {
  function update(index: number, next: ProjectFeature) {
    onChange(features.map((feature, item) => (item === index ? next : feature)));
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        Key features
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Up to 6. Chinese name is optional.
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 1.25 }}>
        {features.map((feature, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 168px auto" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              label={`Feature ${index + 1}`}
              required
              fullWidth
              size="small"
              disabled={disabled}
              value={feature.label}
              onChange={(event) =>
                update(index, { ...feature, label: event.target.value })
              }
              sx={fieldSx}
            />
            <TextField
              label="中文"
              fullWidth
              size="small"
              disabled={disabled}
              value={feature.labelZh ?? ""}
              onChange={(event) =>
                update(index, { ...feature, labelZh: event.target.value })
              }
              sx={zhFieldSx}
            />
            <TextField
              select
              label="Icon"
              required
              fullWidth
              size="small"
              disabled={disabled}
              value={feature.icon}
              onChange={(event) =>
                update(index, {
                  ...feature,
                  icon: event.target.value as FeatureIconName,
                })
              }
              sx={fieldSx}
            >
              {FEATURE_ICONS.map((icon) => (
                <MenuItem key={icon} value={icon}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FeatureMark name={icon} />
                    {FEATURE_ICON_LABELS[icon]}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="button"
              disabled={disabled || features.length === 1}
              onClick={() => onChange(features.filter((_, item) => item !== index))}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
      <Button
        type="button"
        disabled={disabled || features.length >= 6}
        onClick={() => onChange([...features, { label: "", labelZh: "", icon: "search" }])}
        sx={{ mt: 1 }}
      >
        Add feature
      </Button>
    </Box>
  );
}

type MediaPreview = { url: string; isVideo: boolean };

function ImageField({
  name,
  keptName,
  label,
  hint,
  disabled,
  multiple = false,
  maxCount,
  onLimit,
  existingUrls = [],
}: {
  name: string;
  keptName: string;
  label: string;
  hint?: string;
  disabled: boolean;
  multiple?: boolean;
  maxCount?: number;
  onLimit?: (message: string) => void;
  existingUrls?: string[];
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<File[]>([]);
  const previewsRef = useRef<MediaPreview[]>([]);
  const [kept, setKept] = useState(existingUrls);
  const [previews, setPreviews] = useState<MediaPreview[]>([]);
  const [dragging, setDragging] = useState(false);
  const hasMedia = kept.length > 0 || previews.length > 0;

  useEffect(() => {
    return () => {
      for (const item of previewsRef.current) URL.revokeObjectURL(item.url);
    };
  }, []);

  function applyFiles(next: File[]) {
    filesRef.current = next;
    const transfer = new DataTransfer();
    for (const file of next) transfer.items.add(file);
    if (inputRef.current) inputRef.current.files = transfer.files;

    for (const item of previewsRef.current) URL.revokeObjectURL(item.url);
    const nextPreviews = next.map((file) => ({
      url: URL.createObjectURL(file),
      isVideo: isProjectVideoType(file.type),
    }));
    previewsRef.current = nextPreviews;
    setPreviews(nextPreviews);
  }

  function addFiles(incoming: File[]) {
    const media: File[] = [];
    for (const file of incoming) {
      if (mediaFileError(file)) continue;
      media.push(file);
    }
    if (media.length === 0) return;
    if (!multiple) {
      setKept([]);
      applyFiles(media.slice(0, 1));
      return;
    }
    const room =
      maxCount == null
        ? media.length
        : maxCount - kept.length - filesRef.current.length;
    if (room <= 0) {
      onLimit?.(`Detail media is limited to ${maxCount} files.`);
      return;
    }
    const accepted = media.slice(0, room);
    if (accepted.length < media.length) {
      onLimit?.(`Detail media is limited to ${maxCount} files.`);
    }
    applyFiles([...filesRef.current, ...accepted]);
  }

  function removeFileAt(index: number) {
    applyFiles(filesRef.current.filter((_, item) => item !== index));
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <Box>
      {kept.map((url) => (
        <input key={url} type="hidden" name={keptName} value={url} readOnly />
      ))}
      <Typography variant="body2" sx={{ mb: hint ? 0.25 : 0.75, fontWeight: 600 }}>
        {label}
      </Typography>
      {hint ? (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
          {hint}
        </Typography>
      ) : null}
      <Box
        component="label"
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.5,
          minHeight: hasMedia ? 0 : 148,
          px: 2,
          py: 2,
          borderRadius: cornerRadius,
          border: "1.5px dashed",
          borderColor: dragging ? "primary.main" : "#C4B6FF",
          bgcolor: dragging ? "#E6E0FF" : "#F4F1FB",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Box
          component="input"
          id={inputId}
          ref={inputRef}
          name={name}
          type="file"
          accept={PROJECT_MEDIA_ACCEPT.join(",")}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => {
            const picked = Array.from(event.target.files ?? []);
            event.target.value = "";
            addFiles(picked);
          }}
          sx={{
            position: "absolute",
            width: 1,
            height: 1,
            p: 0,
            m: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}
        />
        {hasMedia ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: multiple
                ? "repeat(auto-fill, minmax(140px, 1fr))"
                : "1fr",
              gap: 1,
            }}
          >
            {kept.map((src) => (
              <Preview
                key={src}
                src={src}
                isVideo={isVideoUrl(src)}
                multiple={multiple}
                disabled={disabled}
                onRemove={() => setKept((urls) => urls.filter((url) => url !== src))}
              />
            ))}
            {previews.map((item, index) => (
              <Preview
                key={item.url}
                src={item.url}
                isVideo={item.isVideo}
                multiple={multiple}
                disabled={disabled}
                onRemove={() => removeFileAt(index)}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 1 }}>
            <ImageDropIcon />
          </Box>
        )}
        <Typography variant="body2" sx={{ color: "#1F2937", fontWeight: 500, textAlign: "center" }}>
          {multiple ? "Drop your files here, or " : "Drop your file here, or "}
          <Box
            component="span"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            browse
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: "#9AA3B2", textAlign: "center" }}>
          {multiple
            ? `${maxCount ? `Up to ${maxCount}. ` : ""}JPG/PNG/WebP ≤5MB · MP4/WebM ≤50MB · all new files ≤100MB total`
            : "JPG/PNG/WebP ≤5MB · MP4/WebM ≤50MB · all new files ≤100MB total"}
        </Typography>
      </Box>
    </Box>
  );
}

function Preview({
  src,
  isVideo,
  multiple,
  disabled,
  onRemove,
}: {
  src: string;
  isVideo: boolean;
  multiple: boolean;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: multiple ? 160 : 140,
        borderRadius: cornerRadius,
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      {isVideo ? (
        <Box
          component="video"
          src={src}
          muted
          playsInline
          preload="metadata"
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      ) : (
        <Box
          component="img"
          src={src}
          alt=""
          sx={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      )}
      <Box
        component="button"
        type="button"
        aria-label="Remove media"
        disabled={disabled}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onRemove();
        }}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 24,
          height: 24,
          p: 0,
          border: 0,
          borderRadius: "50%",
          bgcolor: "rgba(23, 23, 23, 0.72)",
          color: "#fff",
          cursor: "pointer",
          lineHeight: "24px",
        }}
      >
        ×
      </Box>
    </Box>
  );
}

function ImageDropIcon() {
  return (
    <Box
      component="svg"
      viewBox="0 0 48 40"
      aria-hidden
      sx={{ width: 48, height: 40, mb: 0.5 }}
    >
      <rect x="8" y="10" width="28" height="22" rx="4" fill="#E4DEFF" />
      <rect x="14" y="6" width="28" height="22" rx="4" fill="#7B61FF" />
      <circle cx="22" cy="13" r="2.2" fill="#FFF" />
      <path d="M16 24.5 22.2 17.8l4.4 4.6 3.2-3.2L36 24.5v1.2H16v-1.2Z" fill="#FFF" />
    </Box>
  );
}
