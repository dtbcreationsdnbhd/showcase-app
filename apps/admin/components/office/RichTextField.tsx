"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";

import { toEditorHtml } from "@/lib/rich-text";
import { cornerRadius } from "@/lib/ui";

export default function RichTextField({
  name,
  label,
  required = false,
  disabled = false,
  defaultValue = "",
}: {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}) {
  const initialHtml = toEditorHtml(defaultValue);
  const [html, setHtml] = useState(initialHtml);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
    ],
    content: initialHtml,
    editable: !disabled,
    onUpdate: ({ editor: next }) => {
      setHtml(next.isEmpty ? "" : next.getHTML());
    },
    editorProps: {
      attributes: {
        class: "project-rich-text-editor",
        "aria-label": label,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  const empty = !html.trim();

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        component="label"
        variant="body2"
        sx={{
          display: "block",
          mb: 0.75,
          fontWeight: 500,
          color: "rgba(0, 0, 0, 0.6)",
        }}
      >
        {label}
        {required ? " *" : ""}
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "rgba(0, 0, 0, 0.23)",
          borderRadius: cornerRadius,
          overflow: "hidden",
          bgcolor: disabled ? "action.disabledBackground" : "#fff",
          "&:hover": disabled
            ? undefined
            : { borderColor: "rgba(0, 0, 0, 0.87)" },
          "&:focus-within": {
            borderColor: "primary.main",
            borderWidth: 2,
            m: "-1px",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            px: 0.5,
            py: 0.25,
            borderBottom: "1px solid #E6E1F2",
            bgcolor: "#F8F6FC",
          }}
        >
          <ToolbarButton
            label="Bold"
            active={editor?.isActive("bold")}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={editor?.isActive("italic")}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={editor?.isActive("underline")}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            label="Bullet list"
            active={editor?.isActive("bulletList")}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon fontSize="small" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={editor?.isActive("orderedList")}
            disabled={disabled || !editor}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon fontSize="small" />
          </ToolbarButton>
        </Stack>
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            minHeight: 96,
            "& .project-rich-text-editor": {
              outline: "none",
              minHeight: 72,
              fontFamily: "inherit",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "rgba(0, 0, 0, 0.87)",
            },
            "& .project-rich-text-editor p": { m: 0, mb: 1 },
            "& .project-rich-text-editor p:last-child": { mb: 0 },
            "& .project-rich-text-editor ul, & .project-rich-text-editor ol": {
              m: 0,
              pl: 2.5,
              mb: 1,
            },
            "& .project-rich-text-editor li": { mb: 0.25 },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
      <input
        type="hidden"
        name={name}
        value={empty ? "" : html}
        required={required}
      />
    </Box>
  );
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      type="button"
      size="small"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderRadius: 1,
        color: active ? "primary.main" : "text.secondary",
        bgcolor: active ? "rgba(103, 80, 164, 0.12)" : "transparent",
      }}
    >
      {children}
    </IconButton>
  );
}
