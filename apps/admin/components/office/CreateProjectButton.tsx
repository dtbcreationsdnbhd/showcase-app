"use client";

import AddIcon from "@mui/icons-material/Add";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useId, useRef, useState, useTransition, type DragEvent, type FormEvent } from "react";

import { createShowcaseProject } from "@/app/(office)/projects/actions";
import NoticeSnackbar, { type AuthNotice } from "@/components/NoticeSnackbar";
import { cornerRadius } from "@/lib/ui";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: cornerRadius,
    bgcolor: "#fff",
  },
};

export default function CreateProjectButton() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const [pending, startTransition] = useTransition();
  const [formKey, setFormKey] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  function close() {
    if (pending) return;
    setOpen(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const pendingTag = tagInput.trim();
    const nextTags =
      pendingTag && !tags.includes(pendingTag) ? [...tags, pendingTag] : tags;
    const data = new FormData(form);
    data.set("tags", nextTags.join(","));

    startTransition(async () => {
      const result = await createShowcaseProject(data);
      if (!result.ok) {
        setNotice({
          id: crypto.randomUUID(),
          message: result.message,
          tone: "error",
        });
        return;
      }

      setTags([]);
      setTagInput("");
      setFormKey((key) => key + 1);
      setOpen(false);
      setNotice({
        id: crypto.randomUUID(),
        message: "Project created",
        tone: "success",
      });
    });
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ minWidth: 112, px: 3 }}
      >
        Create
      </Button>
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
            Create
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add a project to the showcase.
          </Typography>
        </Box>
        <Box
          key={formKey}
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
                sx={fieldSx}
              />
              <TagField
                tags={tags}
                inputValue={tagInput}
                disabled={pending}
                onTagsChange={setTags}
                onInputChange={setTagInput}
              />
            </Box>
            <TextField
              name="challenge"
              label="Challenge"
              required
              fullWidth
              size="small"
              multiline
              minRows={3}
              disabled={pending}
              sx={fieldSx}
            />
            <TextField
              name="solution"
              label="Solution"
              required
              fullWidth
              size="small"
              multiline
              minRows={3}
              disabled={pending}
              sx={fieldSx}
            />
            <ImageField name="mainImage" label="Main image" disabled={pending} />
            <ImageField
              name="detailImages"
              label="Detail images"
              disabled={pending}
              multiple
            />
          </DialogContent>
          <DialogActions sx={{ flexShrink: 0, px: 3, pb: 2.5 }}>
            <Button type="button" onClick={close} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={pending}>
              {pending ? <CircularProgress size={18} color="inherit" /> : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </>
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

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

function ImageField({
  name,
  label,
  disabled,
  multiple = false,
}: {
  name: string;
  label: string;
  disabled: boolean;
  multiple?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<File[]>([]);
  const previewsRef = useRef<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      for (const url of previewsRef.current) URL.revokeObjectURL(url);
    };
  }, []);

  function applyFiles(next: File[]) {
    filesRef.current = next;
    const transfer = new DataTransfer();
    for (const file of next) transfer.items.add(file);
    if (inputRef.current) inputRef.current.files = transfer.files;

    for (const url of previewsRef.current) URL.revokeObjectURL(url);
    const urls = next.map((file) => URL.createObjectURL(file));
    previewsRef.current = urls;
    setPreviews(urls);
  }

  function addFiles(incoming: File[]) {
    const images = incoming.filter((file) => ACCEPT.includes(file.type));
    if (images.length === 0) return;
    applyFiles(multiple ? [...filesRef.current, ...images] : images.slice(0, 1));
  }

  function removeAt(index: number) {
    applyFiles(filesRef.current.filter((_, item) => item !== index));
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.75, fontWeight: 600 }}>
        {label}
      </Typography>
      <Box
        component="label"
        htmlFor={disabled ? undefined : inputId}
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
          minHeight: previews.length > 0 ? 0 : 148,
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
          accept={ACCEPT.join(",")}
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
        {previews.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: multiple
                ? "repeat(auto-fill, minmax(140px, 1fr))"
                : "1fr",
              gap: 1,
            }}
          >
            {previews.map((src, index) => (
              <Box
                key={src}
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
                <Box
                  component="button"
                  type="button"
                  aria-label="Remove image"
                  disabled={disabled}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    removeAt(index);
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
            ))}
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 1 }}>
            <ImageDropIcon />
          </Box>
        )}
        <Typography variant="body2" sx={{ color: "#1F2937", fontWeight: 500, textAlign: "center" }}>
          {multiple ? "Drop your images here, or " : "Drop your image here, or "}
          <Box
            component="span"
            sx={{ color: "primary.main", textDecoration: "underline" }}
          >
            browse
          </Box>
        </Typography>
        <Typography variant="caption" sx={{ color: "#9AA3B2", textAlign: "center" }}>
          {multiple ? "Select more than one. Supports: JPG, PNG, WebP" : "Supports: JPG, PNG, WebP"}
        </Typography>
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
