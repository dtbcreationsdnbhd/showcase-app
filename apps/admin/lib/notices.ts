import type { AuthNotice } from "@/components/NoticeSnackbar";

export function noticeFromParam(value: string | undefined): AuthNotice | null {
  if (value === "invalid") {
    return {
      id: "invalid",
      message: "Invalid username or password",
      tone: "error",
    };
  }

  if (value === "signed-in") {
    return {
      id: "signed-in",
      message: "Signed in",
      tone: "success",
    };
  }

  if (value === "signed-out") {
    return {
      id: "signed-out",
      message: "Signed out",
      tone: "success",
    };
  }

  return null;
}
