import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useContent = (sectionId: string, initialData: any) => {
  const [content, setContent] = useState(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', sectionId), (doc) => {
      if (doc.exists()) {
        setContent(doc.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, [sectionId]);

  return { content, loading };
};
