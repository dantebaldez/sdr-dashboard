import { STATUSES } from '../constants/leadOptions';
import type { Lead, LeadStatus } from '../types/lead';

interface LeadListProps {
	leads: Lead[];
	onStatusChange?: (id: string, status: LeadStatus) => void;
}

export function LeadList({ leads, onStatusChange }: LeadListProps) {
	if (leads.length === 0) {
		return <p className="empty-state">Nenhum lead cadastrado ainda.</p>;
	}

	return (
		<table>
			<thead>
				<tr>
					<th>Nome</th>
					<th>Origem</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{leads.map((lead) => (
					<tr key={lead.id}>
						<td>{lead.nome}</td>
						<td>{lead.origem}</td>
						<td>
							{onStatusChange ? (
								<select
									value={lead.status}
									onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
									aria-label={`Status de ${lead.nome}`}
								>
									{STATUSES.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							) : (
								lead.status
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}