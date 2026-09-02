import type { Lead } from '../types/lead';

function countBy(leads: Lead[], origem: string, status?: string) {
	return leads.filter(
		(lead) => lead.origem === origem && (!status || lead.status === status)
	).length;
}

export function generateReport(leads: Lead[]): string {
	const linhas = [
		`➡️ WhatsApp: ${countBy(leads, 'WhatsApp')}`,
		`➡️ Forms: ${countBy(leads, 'Formulário')}`,
		`➡️ Indicação: ${countBy(leads, 'Indicação')}`,
		`➡️ Reunião WhatsApp: ${countBy(leads, 'WhatsApp', 'Reunião agendada')}`,
		`➡️ Reunião Forms: ${countBy(leads, 'Formulário', 'Reunião agendada')}`,
		`➡️ Reunião Indicação: ${countBy(leads, 'Indicação', 'Reunião agendada')}`,
		`➡️ Propostas Forms: ${countBy(leads, 'Formulário', 'Proposta enviada')}`,
		`➡️ Propostas WhatsApp: ${countBy(leads, 'WhatsApp', 'Proposta enviada')}`,
		`➡️ Propostas Indicação: ${countBy(leads, 'Indicação', 'Proposta enviada')}`,
		`➡️ Perdido Form: ${countBy(leads, 'Formulário', 'Perdido')}`,
		`➡️ Perdido WhatsApp: ${countBy(leads, 'WhatsApp', 'Perdido')}`,
		`➡️ Perdido Indicação: ${countBy(leads, 'Indicação', 'Perdido')}`,
	];

	return linhas.join('\n');
}