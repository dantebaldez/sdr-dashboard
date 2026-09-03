import { BarChart } from './BarChart';
import { filterLeadsBySemana } from '../utils/filterLeadsBySemana';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

interface WeeksComparisonProps {
  leads: Lead[];
  semanas: Semana[];
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function WeeksComparison({ leads, semanas }: WeeksComparisonProps) {
  const ordenadas = [...semanas].sort((a, b) => (a.inicio > b.inicio ? 1 : -1));
  const ultimas = ordenadas.slice(-6);

  const dados = ultimas.map((semana) => ({
    label: formatarData(semana.inicio),
    value: filterLeadsBySemana(leads, semana).length,
  }));

  return <BarChart title="Leads por semana (últimas 6)" data={dados} color="#1b4b66" />;
}