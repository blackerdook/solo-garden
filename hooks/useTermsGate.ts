import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';

const SCOPE = 'remedies';
const DEVICE_KEY = 'device_id_v1';

function makeUuid() {
  // lightweight UUID v4 (good enough for device_id)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getSubjectId() {
  // Try Supabase auth user first
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;
  if (userId) return userId;

  // Else device-scoped ID persisted locally
  let devId = await AsyncStorage.getItem(DEVICE_KEY);
  if (!devId) {
    devId = makeUuid();
    await AsyncStorage.setItem(DEVICE_KEY, devId);
  }
  return devId;
}

type TermsRow = {
  scope: string;
  version: number;
  content: string;
};

export function useTermsGate(scope: string = SCOPE) {
  const [loading, setLoading] = useState(true);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [terms, setTerms] = useState<TermsRow | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const latestVersion = terms?.version ?? null;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sid = await getSubjectId();
      setSubjectId(sid);

      // 1) Latest active terms for scope
      const { data: trows, error: terr } = await supabase
        .from('terms')
        .select('scope,version,content')
        .eq('scope', scope)
        .eq('is_active', true)
        .order('version', { ascending: false })
        .limit(1);

      if (terr) throw terr;
      const t = (trows ?? [])[0] ?? null;
      setTerms(t ?? null);

      if (!t) {
        // No active terms => treat as accepted (i.e., don’t block)
        setAccepted(true);
        setLoading(false);
        return;
      }

      // 2) Check if this subject already accepted this version
      const { data: urows, error: uerr } = await supabase
        .from('user_terms')
        .select('id')
        .eq('subject_id', sid)
        .eq('scope', scope)
        .eq('version', t.version)
        .limit(1);

      if (uerr) throw uerr;
      setAccepted((urows ?? []).length > 0);
    } catch (e: any) {
      setError(e.message ?? 'Failed to check terms.');
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const accept = useCallback(async () => {
    if (!subjectId || !terms) return;
    const { error: ierr } = await supabase
      .from('user_terms')
      .insert({ subject_id: subjectId, scope, version: terms.version });
    if (ierr) throw ierr;
    setAccepted(true);
  }, [subjectId, terms, scope]);

  const needsAcceptance = useMemo(
    () => !!terms && !accepted,
    [terms, accepted]
  );

  return {
    loading,
    error,
    needsAcceptance,
    terms,
    latestVersion,
    accept,
    refresh,
  };
}
