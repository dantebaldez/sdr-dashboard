import type { Lead } from '../types/lead';

interface ConversionRateProps {
  leads: Lead[];
}

export function ConversionRate({ leads }: ConversionRateProps) {
  if (leads.length === 0) return null;

  const avancaram = leads.filter(
    (lead) => lead.status === 'Reunião agendada' || lead.status === 'Proposta enviada'
  ).length;

  const taxa = Math.round((avancaram / leads.length) * 100);

  return (
    <p className="conversion-rate">
      <strong>{taxa}%</strong> dos leads dessa semana viraram reunião ou proposta ({avancaram} de{' '}
      {leads.length})
    </p>
  );
}