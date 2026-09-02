import { ORIGENS, STATUSES } from '../constants/leadOptions';
import type { Lead } from '../types/lead';
import { BarChart } from './BarChart';

interface ChartsSectionProps {
	leads: Lead[];
}

export function ChartsSection({ leads }: ChartsSectionProps) {
	const dadosPorOrigem = ORIGENS.map((origem) => ({
		label: origem,
		value: leads.filter((lead) => lead.origem === origem).length,
	}));

	const dadosPorStatus = STATUSES.map((status) => ({
		label: status,
		value: leads.filter((lead) => lead.status === status).length,
	}));

	return (
		<section className="charts-row">
			<BarChart title="Leads por origem" data={dadosPorOrigem} color="#e0973a" />
			<BarChart title="Leads por status" data={dadosPorStatus} color="#1b4b66" />
		</section>
	);
}