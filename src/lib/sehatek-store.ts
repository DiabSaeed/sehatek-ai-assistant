// Shared chat store so messages persist across route navigations within the session.
import { useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

let _messages: ChatMessage[] = [];
const listeners = new Set<(m: ChatMessage[]) => void>();

export function getMessages() {
  return _messages;
}

export function setMessages(updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) {
  _messages = typeof updater === "function" ? (updater as (p: ChatMessage[]) => ChatMessage[])(_messages) : updater;
  listeners.forEach((l) => l(_messages));
}

export function useChatMessages() {
  const [msgs, setLocal] = useState<ChatMessage[]>(_messages);
  useEffect(() => {
    listeners.add(setLocal);
    return () => {
      listeners.delete(setLocal);
    };
  }, []);
  return [msgs, setMessages] as const;
}

// Shared uploaded-file list
let _files: string[] = [];
const fileListeners = new Set<(f: string[]) => void>();
export function useUploadedFiles() {
  const [files, setLocal] = useState<string[]>(_files);
  useEffect(() => {
    fileListeners.add(setLocal);
    return () => {
      fileListeners.delete(setLocal);
    };
  }, []);
  return [
    files,
    (updater: string[] | ((prev: string[]) => string[])) => {
      _files = typeof updater === "function" ? (updater as (p: string[]) => string[])(_files) : updater;
      fileListeners.forEach((l) => l(_files));
    },
  ] as const;
}

export const API_BASE = "http://localhost:5000";
