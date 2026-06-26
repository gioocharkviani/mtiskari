"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "ka";
type ContentMap = Record<string, { en: string; ka: string }>;

interface ContentCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
  content: ContentMap;
  loading: boolean;
}

const ContentContext = createContext<ContentCtx>({
  lang: "en",
  setLang: () => {},
  t: (_, fb) => fb || "",
  content: {},
  loading: true,
});

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/v1";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "ka" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    fetch(`${API}/content`)
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") setContent(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: string, fallback = "") => {
    const entry = content[key];
    if (!entry) return fallback || key;
    return entry[lang] || entry.en || fallback || key;
  };

  return (
    <ContentContext.Provider value={{ lang, setLang, t, content, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);
