import { ORIGENS } from '../constants/leadOptions';
import type { Lead } from '../types/lead';

interface OriginSummaryProps {
  leads: Lead[];
}

function contar(leads: Lead[], origem: string, status: string, tipoContato?: string) {
  return leads.filter(
    (lead) =>
      lead.origem === origem &&
      lead.status === status &&
      (!tipoContato || lead.tipoContato === tipoContato)
  ).length;
}

export function OriginSummary({ leads }: OriginSummaryProps) {
  if (leads.length === 0) {
    return <p className="empty-state">Nenhum lead nessa semana.</p>;
  }

  const origensPresentes = ORIGENS.filter((origem) => leads.some((lead) => lead.origem === origem));

  return (
    <table className="matrix-table">
      <thead>
        <tr>
          <th>Origem</th>
          <th>Novo</th>
          <th>Reunião (novo)</th>
          <th>Reunião (follow-up)</th>
          <th>Proposta (novo)</th>
          <th>Proposta (follow-up)</th>
          <th>Perdido</th>
        </tr>
      </thead>
      <tbody>
        {origensPresentes.map((origem) => (
          <tr key={origem}>
            <td>{origem}</td>
            <td>{contar(leads, origem, 'Novo')}</td>
            <td>{contar(leads, origem, 'Reunião agendada', 'Novo')}</td>
            <td>{contar(leads, origem, 'Reunião agendada', 'Follow-up')}</td>
            <td>{contar(leads, origem, 'Proposta enviada', 'Novo')}</td>
            <td>{contar(leads, origem, 'Proposta enviada', 'Follow-up')}</td>
            <td>{contar(leads, origem, 'Perdido')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}