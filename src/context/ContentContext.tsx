import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteContent } from '../types/content';
import { loadContent, saveContent, defaultContent } from '../utils/contentStore';

const FIRESTORE_DOC = doc(db, 'content', 'siteContent');

interface ContentContextValue {
  content: SiteContent;
  updateContent: (updated: SiteContent) => void;
  isDirty: boolean;
  isSaving: boolean;
  save: () => Promise<void>;
  reset: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(loadContent);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // On mount, try to load content from Firestore and override localStorage cache
  useEffect(() => {
    getDoc(FIRESTORE_DOC)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteContent & { _updatedAt?: unknown };
          // Strip Firestore meta fields before using
          const { _updatedAt, ...siteData } = data as any;
          const merged: SiteContent = { ...defaultContent, ...siteData };
          setContent(merged);
          saveContent(merged); // refresh localStorage cache
        }
      })
      .catch((err) => {
        // Firestore unavailable (offline / permissions) — use localStorage cache silently
        console.warn('[ContentContext] Could not load from Firestore, using local cache:', err.message);
      });
  }, []);

  function updateContent(updated: SiteContent) {
    setContent(updated);
    setIsDirty(true);
  }

  async function save() {
    setIsSaving(true);
    try {
      // Always write localStorage first (instant, no failure)
      saveContent(content);

      // Then write to Firestore
      await setDoc(FIRESTORE_DOC, {
        ...content,
        _updatedAt: serverTimestamp(),
      });

      setIsDirty(false);
    } catch (err: any) {
      console.error('[ContentContext] Firestore save failed:', err.message);
      // Don't throw — local save already happened, surface error to admin page
      throw err;
    } finally {
      setIsSaving(false);
    }
  }

  function reset() {
    // handled in admin dashboard
  }

  return (
    <ContentContext.Provider value={{ content, updateContent, isDirty, isSaving, save, reset }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
