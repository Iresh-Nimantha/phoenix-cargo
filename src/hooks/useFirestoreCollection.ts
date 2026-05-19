import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  type WhereFilterOp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UseFirestoreOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  filterField?: string;
  filterOp?: WhereFilterOp;
  filterValue?: any;
  limitCount?: number;
}

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  options: UseFirestoreOptions = {}
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const constraints: any[] = [];

    if (options.filterField && options.filterOp && options.filterValue !== undefined) {
      constraints.push(where(options.filterField, options.filterOp, options.filterValue));
    }
    if (options.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || 'desc'));
    }
    if (options.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(collection(db, collectionName), ...constraints);

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (T & { id: string })[];
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Firestore error (${collectionName}):`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [collectionName, options.orderByField, options.orderDirection, options.filterField, options.filterOp, options.filterValue, options.limitCount]);

  return { data, loading, error };
}
