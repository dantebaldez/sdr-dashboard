import { ORIGENS, STATUSES } from '../constants/leadOptions';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';
import { BarChart } from './BarChart';

interface ChartsSectionProps {
  leads: Lead[];
  semana: Semana;
}

export function ChartsSection({ leads, semana }: ChartsSectionProps) {
  const dadosPorOrigem = ORIGENS.map((origem) => ({
    label: origem,
    value: leads.filter((lead) => lead.origem === origem).length,
  }));

  const dadosPorStatus = STATUSES.map((status) => ({
    label: status,
    value: leads.filter((lead) => lead.status === status).length,
  }));

  const metasDefinidas =
    semana.metaLeads !== null && semana.metaReunioes !== null && semana.metaPropostas !== null;

  const dadosMetas = metasDefinidas
    ? [
        { label: 'Leads (meta)', value: semana.metaLeads! },
        { label: 'Leads (real)', value: leads.length },
        { label: 'Reuniões (meta)', value: semana.metaReunioes! },
        { label: 'Reuniões (real)', value: leads.filter((l) => l.status === 'Reunião agendada').length },
        { label: 'Propostas (meta)', value: semana.metaPropostas! },
        { label: 'Propostas (real)', value: leads.filter((l) => l.status === 'Proposta enviada').length },
      ]
    : [];

  return (
    <section className="charts-row">
      <BarChart title="Leads por origem" data={dadosPorOrigem} color="#e0973a" />
      <BarChart title="Leads por status" data={dadosPorStatus} color="#1b4b66" />
      {metasDefinidas && <BarChart title="Metas vs. realizado" data={dadosMetas} color="#e0973a" />}
    </section>
  );
}