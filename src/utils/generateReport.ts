import { ehLeadNovo } from '../constants/leadOptions';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

function contar(leads: Lead[], origem: string, status?: string, tipoContato?: string) {
  return leads.filter(
    (lead) =>
      lead.origem === origem &&
      (!status || lead.status === status) &&
      (!tipoContato || lead.tipoContato === tipoContato)
  ).length;
}

function contarNovosPorOrigem(leads: Lead[], origem: string) {
  return leads.filter((lead) => lead.origem === origem && ehLeadNovo(lead.tipoContato)).length;
}

function contarNoShow(leads: Lead[], origem: string) {
  return leads.filter(
    (lead) => lead.origem === origem && lead.status === 'Reunião agendada' && lead.noShow
  ).length;
}

export function generateReport(leads: Lead[], semana: Semana): string {
  const linhas = [
    `➡️ WhatsApp: ${contarNovosPorOrigem(leads, 'WhatsApp')}`,
    `➡️ Forms: ${contarNovosPorOrigem(leads, 'Formulário')}`,
    `➡️ Indicação: ${contarNovosPorOrigem(leads, 'Indicação')}`,
    `➡️ Reunião WhatsApp (Novo): ${contar(leads, 'WhatsApp', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião WhatsApp (Follow-up): ${contar(leads, 'WhatsApp', 'Reunião agendada', 'Follow-up')}`,
    `➡️ Reunião Forms (Novo): ${contar(leads, 'Formulário', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião Forms (Follow-up): ${contar(leads, 'Formulário', 'Reunião agendada', 'Follow-up')}`,
    `➡️ Reunião Indicação (Novo): ${contar(leads, 'Indicação', 'Reunião agendada', 'Novo')}`,
    `➡️ Reunião Indicação (Follow-up): ${contar(leads, 'Indicação', 'Reunião agendada', 'Follow-up')}`,
    `➡️ No Show WhatsApp: ${contarNoShow(leads, 'WhatsApp')}`,
    `➡️ No Show Forms: ${contarNoShow(leads, 'Formulário')}`,
    `➡️ No Show Indicação: ${contarNoShow(leads, 'Indicação')}`,
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

  if (semana.metaLeads !== null && semana.metaReunioes !== null && semana.metaPropostas !== null) {
    const totalLeads = leads.length;
    const totalReunioes = leads.filter((lead) => lead.status === 'Reunião agendada').length;
    const totalPropostas = leads.filter((lead) => lead.status === 'Proposta enviada').length;

    linhas.push(
      '',
      `➡️ Meta de leads: ${totalLeads}/${semana.metaLeads}`,
      `➡️ Meta de reuniões: ${totalReunioes}/${semana.metaReunioes}`,
      `➡️ Meta de propostas: ${totalPropostas}/${semana.metaPropostas}`
    );
  }

  return linhas.join('\n');
}