// data/remedies.ts
import { supabase } from "../supabase";
import type { Remedy } from "../types/remedies";

const COLUMNS =
  "id,name,description,image,uses,preparation,dosage,warnings";

export async function getRemedies(): Promise<Remedy[]> {
  const { data, error } = await supabase
    .from("remedies")
    .select(COLUMNS)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Remedy[];
}

export async function searchRemedies(q: string): Promise<Remedy[]> {
  const like = `%${q}%`;
  const { data, error } = await supabase
    .from("remedies")
    .select(COLUMNS)
    // Search name + description. (Array search on `uses` can be added later with FTS)
    .or(`name.ilike.${like},description.ilike.${like}`)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Remedy[];
}
