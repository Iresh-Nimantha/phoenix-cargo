import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SiteContent } from '../types/content';
import { loadContent, saveContent } from '../utils/contentStore';

interface ContentContextValue {
  content: SiteContent;
  updateContent: (updated: SiteContent) => void;
  isDirty: boolean;
  save: () => void;
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [isDirty, setIsDirty] = useState(false);

  function updateContent(updated: SiteContent) {
    setContent(updated);
    setIsDirty(true);
  }

  function save() {
    saveContent(content);
    setIsDirty(false);
  }

  function reset() {
    // handled in admin dashboard or custom reset
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, isDirty, save, reset }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
