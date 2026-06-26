// Shared stores: projects, chat messages, uploaded files.
// Each session gets its own project_id; data is scoped per project and
// persisted in localStorage so the user can revisit previous sessions.
import { useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

export type Project = {
  id: string;
  name: string;
  createdAt: number;
  lastActiveAt: number;
};

export const API_BASE = "http://localhost:5000";

const LS_PROJECTS = "sehatek.projects";
const LS_CURRENT = "sehatek.currentProjectId";
const LS_MESSAGES = (id: string) => `sehatek.messages.${id}`;
const LS_FILES = (id: string) => `sehatek.files.${id}`;

function isBrowser() {
  return typeof window !== "undefined";
}

function readLS<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

function genId() {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  return `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function defaultProjectName() {
  const d = new Date();
  return `Session ${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

// ---------- Projects state ----------
let _projects: Project[] = [];
let _currentId: string = "";
const projectListeners = new Set<() => void>();

function emitProjects() {
  projectListeners.forEach((l) => l());
}

function ensureInitialized() {
  if (!isBrowser()) return;
  if (_projects.length > 0 || _currentId) return;
  _projects = readLS<Project[]>(LS_PROJECTS, []);
  _currentId = readLS<string>(LS_CURRENT, "");
  if (_projects.length === 0) {
    const p: Project = {
      id: genId(),
      name: defaultProjectName(),
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    };
    _projects = [p];
    _currentId = p.id;
    writeLS(LS_PROJECTS, _projects);
    writeLS(LS_CURRENT, _currentId);
  } else if (!_currentId || !_projects.find((p) => p.id === _currentId)) {
    _currentId = _projects[0].id;
    writeLS(LS_CURRENT, _currentId);
  }
}

export function getCurrentProjectId(): string {
  ensureInitialized();
  return _currentId;
}

export function getProjects(): Project[] {
  ensureInitialized();
  return _projects;
}

export function setCurrentProject(id: string) {
  ensureInitialized();
  if (!_projects.find((p) => p.id === id)) return;
  _currentId = id;
  _projects = _projects.map((p) => (p.id === id ? { ...p, lastActiveAt: Date.now() } : p));
  writeLS(LS_CURRENT, _currentId);
  writeLS(LS_PROJECTS, _projects);
  emitProjects();
  // Refresh scoped stores
  _messages = readLS<ChatMessage[]>(LS_MESSAGES(_currentId), []);
  messageListeners.forEach((l) => l(_messages));
  _files = readLS<string[]>(LS_FILES(_currentId), []);
  fileListeners.forEach((l) => l(_files));
}

export function createProject(name?: string): Project {
  ensureInitialized();
  const p: Project = {
    id: genId(),
    name: name?.trim() || defaultProjectName(),
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };
  _projects = [p, ..._projects];
  writeLS(LS_PROJECTS, _projects);
  setCurrentProject(p.id);
  return p;
}

export function renameProject(id: string, name: string) {
  ensureInitialized();
  _projects = _projects.map((p) => (p.id === id ? { ...p, name: name.trim() || p.name } : p));
  writeLS(LS_PROJECTS, _projects);
  emitProjects();
}

export function deleteProject(id: string) {
  ensureInitialized();
  _projects = _projects.filter((p) => p.id !== id);
  if (isBrowser()) {
    window.localStorage.removeItem(LS_MESSAGES(id));
    window.localStorage.removeItem(LS_FILES(id));
  }
  writeLS(LS_PROJECTS, _projects);
  if (_currentId === id) {
    if (_projects.length === 0) {
      const p = createProject();
      _currentId = p.id;
    } else {
      setCurrentProject(_projects[0].id);
      return;
    }
  }
  emitProjects();
}

export function useProjects() {
  ensureInitialized();
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    projectListeners.add(l);
    return () => { projectListeners.delete(l); };
  }, []);
  return {
    projects: _projects,
    currentId: _currentId,
    current: _projects.find((p) => p.id === _currentId) ?? null,
    setCurrent: setCurrentProject,
    create: createProject,
    rename: renameProject,
    remove: deleteProject,
  };
}

// ---------- Messages (scoped to current project) ----------
let _messages: ChatMessage[] = [];
const messageListeners = new Set<(m: ChatMessage[]) => void>();

function persistMessages() {
  ensureInitialized();
  writeLS(LS_MESSAGES(_currentId), _messages);
}

export function useChatMessages() {
  ensureInitialized();
  const [msgs, setLocal] = useState<ChatMessage[]>(() => {
    _messages = readLS<ChatMessage[]>(LS_MESSAGES(_currentId), _messages);
    return _messages;
  });
  useEffect(() => {
    messageListeners.add(setLocal);
    return () => { messageListeners.delete(setLocal); };
  }, []);
  const setter = (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    _messages = typeof updater === "function" ? (updater as (p: ChatMessage[]) => ChatMessage[])(_messages) : updater;
    persistMessages();
    messageListeners.forEach((l) => l(_messages));
  };
  return [msgs, setter] as const;
}

// ---------- Files (scoped to current project) ----------
let _files: string[] = [];
const fileListeners = new Set<(f: string[]) => void>();

function persistFiles() {
  ensureInitialized();
  writeLS(LS_FILES(_currentId), _files);
}

export function useUploadedFiles() {
  ensureInitialized();
  const [files, setLocal] = useState<string[]>(() => {
    _files = readLS<string[]>(LS_FILES(_currentId), _files);
    return _files;
  });
  useEffect(() => {
    fileListeners.add(setLocal);
    return () => { fileListeners.delete(setLocal); };
  }, []);
  const setter = (updater: string[] | ((prev: string[]) => string[])) => {
    _files = typeof updater === "function" ? (updater as (p: string[]) => string[])(_files) : updater;
    persistFiles();
    fileListeners.forEach((l) => l(_files));
  };
  return [files, setter] as const;
}

// ---------- API URL helpers (project-scoped) ----------
export function apiUrl(endpoint: "upload" | "process" | "generate", projectId?: string) {
  const id = projectId ?? getCurrentProjectId();
  return `${API_BASE}/${endpoint}/${id}`;
}

// Helper to read per-project counts without subscribing
export function getProjectCounts(id: string) {
  return {
    files: readLS<string[]>(LS_FILES(id), []).length,
    messages: readLS<ChatMessage[]>(LS_MESSAGES(id), []).length,
  };
}
