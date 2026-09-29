import type { Lead } from '../types/lead';

interface ConversionRateProps {
  leads: Lead[];
}

export function ConversionRate({ leads }: ConversionRateProps) {
  if (leads.length === 0) return null;

  const agendados = leads.filter((lead) => lead.status === 'Atendimento marcado').length;
  const propostas =leads.filter((lead) => lead.status === 'Proposta enviada').length;

  const taxaAgendamento = Math.round((agendados / leads.length) * 100);
  // const taxaFechamento = agendados > 0 ? Math.round((fechados / agendados) * 100) : 0;

  return (
    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
      <p className="conversion-rate">
        <strong>{taxaAgendamento}%</strong> dos leads viraram agendamento ({agendados} de {leads.length})
      </p>
      <p className="conversion-rate">
        <strong>{propostas}</strong> em negociação
      </p>
      <p className="conversion-rate">
        {/* <strong>{taxaFechamento}%</strong> de fechamento sobre agendamentos ({fechados} de {agendados}) */}
      </p>
    </div>
  );
}