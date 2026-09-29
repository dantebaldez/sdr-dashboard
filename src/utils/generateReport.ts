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

function contarAtendimentoPorTipo(leads: Lead[], tipoAtendimento: string) {
  return leads.filter(
    (lead) => lead.status === 'Atendimento marcado' && lead.tipoAtendimento === tipoAtendimento
  ).length;
}

function contarMotivoPorPerda(leads: Lead[], motivo: string) {
  return leads.filter(
    (lead) => lead.status === 'Perdido' && lead.motivoPerda === motivo
  ).length;
}

export function generateReport(leads: Lead[], semana: Semana): string {
  const perdidos = leads.filter((l) => l.status === 'Perdido');
  const motivosPresentes = [...new Set(perdidos.map((l) => l.motivoPerda).filter(Boolean))];

  const linhas = [
    `➡️ WhatsApp: ${contarNovosPorOrigem(leads, 'WhatsApp')}`,
    `➡️ Forms: ${contarNovosPorOrigem(leads, 'Formulário')}`,
    `➡️ Indicação: ${contarNovosPorOrigem(leads, 'Indicação')}`,
    ``,
    `➡️ Atendimentos marcados (Novo): ${contar(leads, 'WhatsApp', 'Atendimento marcado', 'Novo') + contar(leads, 'Formulário', 'Atendimento marcado', 'Novo') + contar(leads, 'Indicação', 'Atendimento marcado', 'Novo')}`,
    `➡️ Atendimentos marcados (Follow-up): ${contar(leads, 'WhatsApp', 'Atendimento marcado', 'Follow-up') + contar(leads, 'Formulário', 'Atendimento marcado', 'Follow-up') + contar(leads, 'Indicação', 'Atendimento marcado', 'Follow-up')}`,
    `  ↳ Visita técnica: ${contarAtendimentoPorTipo(leads, 'Visita técnica')}`,
    `  ↳ Reunião online: ${contarAtendimentoPorTipo(leads, 'Reunião online')}`,
    ``,
    `➡️ Propostas enviadas (Novo): ${contar(leads, 'WhatsApp', 'Proposta enviada', 'Novo') + contar(leads, 'Formulário', 'Proposta enviada', 'Novo') + contar(leads, 'Indicação', 'Proposta enviada', 'Novo')}`,
    `➡️ Propostas enviadas (Follow-up): ${contar(leads, 'WhatsApp', 'Proposta enviada', 'Follow-up') + contar(leads, 'Formulário', 'Proposta enviada', 'Follow-up') + contar(leads, 'Indicação', 'Proposta enviada', 'Follow-up')}`,
    ``,
    `➡️ Perdidos (Novo): ${contar(leads, 'WhatsApp', 'Perdido', 'Novo') + contar(leads, 'Formulário', 'Perdido', 'Novo') + contar(leads, 'Indicação', 'Perdido', 'Novo')}`,
    `➡️ Perdidos (Follow-up): ${contar(leads, 'WhatsApp', 'Perdido', 'Follow-up') + contar(leads, 'Formulário', 'Perdido', 'Follow-up') + contar(leads, 'Indicação', 'Perdido', 'Follow-up')}`,
  ];

  if (motivosPresentes.length > 0) {
    linhas.push(`  ↳ Motivos de perda:`);
    motivosPresentes.forEach((motivo) => {
      if (motivo) linhas.push(`    • ${motivo}: ${contarMotivoPorPerda(leads, motivo)}`);
    });
  }

  if (semana.metaLeads !== null && semana.metaReunioes !== null && semana.metaPropostas !== null) {
    const totalAtendimentos = leads.filter((l) => l.status === 'Atendimento marcado').length;
    const totalPropostas = leads.filter((l) => l.status === 'Proposta enviada').length;
    linhas.push(
      ``,
      `➡️ Meta de leads: ${leads.length}/${semana.metaLeads}`,
      `➡️ Meta de atendimentos: ${totalAtendimentos}/${semana.metaReunioes}`,
      `➡️ Meta de propostas: ${totalPropostas}/${semana.metaPropostas}`
    );
  }

  return linhas.join('\n');
}