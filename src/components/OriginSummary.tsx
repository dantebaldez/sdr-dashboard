import { ORIGENS, STATUSES } from '../constants/leadOptions';
import type { Lead } from '../types/lead';

interface OriginSummaryProps {
	leads: Lead[];
}

export function OriginSummary({ leads }: OriginSummaryProps) {
	if (leads.length === 0) {
		return <p className="empty-state">Nenhum lead nessa semana.</p>;
	}

	const origensPresentes = ORIGENS.filter((origem) =>
		leads.some((lead) => lead.origem === origem)
	);

	function countFor(origem: string, status: string) {
		return leads.filter((lead) => lead.origem === origem && lead.status === status).length;
	}

	return (
		<table className="matrix-table">
			<thead>
				<tr>
					<th>Origem</th>
					{STATUSES.map((status) => (
						<th key={status}>{status}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{origensPresentes.map((origem) => (
					<tr key={origem}>
						<td>{origem}</td>
						{STATUSES.map((status) => (
							<td key={status}>{countFor(origem, status)}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}