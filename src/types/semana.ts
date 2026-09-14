export interface Semana {
  id: string;
  inicio: string;
  fim: string | null;
  metaLeads: number | null;
  metaReunioes: number | null;
  metaPropostas: number | null;
}