// types/remedies.ts
export type Remedy = {
  id: string;                // uuid (or number if you used serial)
  name: string;
  description: string;
  image: string | null;
  uses: string[];            // Postgres text[]
  preparation: string | null;
  dosage: string | null;
  warnings: string | null;
};
