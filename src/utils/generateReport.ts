import type { Lead } from '../types/lead';

function contar(leads: Lead[], origem: string, status?: string, tipoContato?: string) {
  return leads.filter(
    (lead) =>
      lead.origem === origem &&
      (!status || lead.status === status) &&
      (!tipoContato || lead.tipoContato === tipoContato)
  ).length;
}

export function generateReport(leads: Lead[]): string {
  const linhas = [
    `➡️ WhatsApp: ${contar(leads, 'WhatsApp')}`,
    `➡️ Forms: ${contar(leads, 'Formulário')}`,
    `➡️ Indicação: ${contar(leads, 'Indicação')}`,
    `➡️ Reunião WhatsApp (Novo): ${contar(leads, 'WhatsApp', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião WhatsApp (Follow-up): ${contar(leads, 'WhatsApp', 'Reunião agendada', 'Follow-up')}`,
    `➡️ Reunião Forms (Novo): ${contar(leads, 'Formulário', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião Forms (Follow-up): ${contar(leads, 'Formulário', 'Reunião agendada', 'Follow-up')}`,
    `➡️ Reunião Indicação (Novo): ${contar(leads, 'Indicação', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião Indicação (Follow-up): ${contar(leads, 'Indicação', 'Reunião agendada', 'Follow-up')}`,
    `➡️ Propostas Forms (Novo): ${contar(leads, 'Formulário', 'Proposta enviada', 'Novo')}`,
    `➡️ Propostas Forms (Follow-up): ${contar(leads, 'Formulário', 'Proposta enviada', 'Follow-up')}`,
    `➡️ Propostas WhatsApp (Novo): ${contar(leads, 'WhatsApp', 'Proposta enviada', 'Novo')}`,
    `➡️ Propostas WhatsApp (Follow-up): ${contar(leads, 'WhatsApp', 'Proposta enviada', 'Follow-up')}`,
    `➡️ Propostas Indicação (Novo): ${contar(leads, 'Indicação', 'Proposta enviada', 'Novo')}`,
    `➡️ Propostas Indicação (Follow-up): ${contar(leads, 'Indicação', 'Proposta enviada', 'Follow-up')}`,
    `➡️ Perdido Form: ${contar(leads, 'Formulário', 'Perdido')}`,
    `➡️ Perdido WhatsApp: ${contar(leads, 'WhatsApp', 'Perdido')}`,
    `➡️ Perdido Indicação: ${contar(leads, 'Indicação', 'Perdido')}`,
  ];

  return linhas.join('\n');
}