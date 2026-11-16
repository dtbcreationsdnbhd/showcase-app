"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useId, useRef, useState, useTransition, type DragEvent, type FormEvent } from "react";

import { createShowcaseProject, updateShowcaseProject } from "@/app/(office)/projects/actions";
import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";
import RichTextField from "@/components/office/RichTextField";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import {
  MAX_UPLOAD_TOTAL_BYTES,
  PROJECT_MEDIA_ACCEPT,
  isProjectVideoType,
  isVideoUrl,
  mediaFileError,
  totalUploadBytes,
} from "@/lib/project-media";
import type { ShowcaseProject } from "@/lib/projects";
import { cornerRadius } from "@/lib/ui";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: cornerRadius,
    bgcolor: "#fff",
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
        maxWidth="sm"
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
  const [tags, setTags] = useState(project?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const submitLabel = mode === "edit" ? "Save" : "Create";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pendingTag = tagInput.trim();
    const nextTags =
      pendingTag && !tags.includes(pendingTag) ? [...tags, pendingTag] : tags;
    const data = new FormData(event.currentTarget);
    data.set("tags", nextTags.join(","));
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
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
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
          <TagField
            tags={tags}
            inputValue={tagInput}
            disabled={pending}
            onTagsChange={setTags}
            onInputChange={setTagInput}
          />
        </Box>
        <RichTextField
          name="challenge"
          label="Challenge"
          required
          disabled={pending}
          defaultValue={project?.challenge ?? ""}
        />
        <RichTextField
          name="solution"
          label="Solution"
          required
          disabled={pending}
          defaultValue={project?.solution ?? ""}
        />
        <ImageField
          name="mainImage"
          keptName="keptMainImage"
          label="Main media (required)"
          disabled={pending}
          existingUrls={project?.mainImageUrl ? [project.mainImageUrl] : []}
        />
        <ImageField
          name="detailImages"
          keptName="keptDetailImages"
          label="Detail media (optional)"
          disabled={pending}
          multiple
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

function TagField({
  tags,
  inputValue,
  disabled,
  onTagsChange,
  onInputChange,
}: {
  tags: string[];
  inputValue: string;
  disabled: boolean;
  onTagsChange: (tags: string[]) => void;
  onInputChange: (value: string) => void;
}) {
  function commit(raw: string) {
    const parts = raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...tags];
    for (const part of parts) {
      if (!next.includes(part)) next.push(part);
    }
    onTagsChange(next);
    onInputChange("");
  }

  return (
    <Autocomplete
      multiple
      freeSolo
      options={[] as string[]}
      value={tags}
      inputValue={inputValue}
      disabled={disabled}
      size="small"
      onInputChange={(_, value, reason) => {
        if (reason === "reset") return;
        onInputChange(value);
      }}
      onChange={(_, value) => {
        const next = value
          .flatMap((item) => String(item).split(","))
          .map((tag) => tag.trim())
          .filter(Boolean);
        onTagsChange([...new Set(next)]);
        onInputChange("");
      }}
      onBlur={() => commit(inputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          name="tags"
          label="Tags"
          required={tags.length === 0}
          sx={fieldSx}
        />
      )}
    />
  );
}

type MediaPreview = { url: string; isVideo: boolean };

function ImageField({
  name,
  keptName,
  label,
  disabled,
  multiple = false,
  existingUrls = [],
}: {
  name: string;
  keptName: string;
  label: string;
  disabled: boolean;
  multiple?: boolean;
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
    if (!multiple) setKept([]);
    applyFiles(multiple ? [...filesRef.current, ...media] : media.slice(0, 1));
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
      <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
        {label}
      </Typography>
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
            ? "Select more than one. JPG/PNG/WebP ≤5MB · MP4/WebM ≤50MB · all new files ≤100MB total"
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
