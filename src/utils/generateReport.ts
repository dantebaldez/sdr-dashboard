import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

function contar(leads: Lead[], filtro: Partial<Record<keyof Lead, unknown>>) {
  return leads.filter((lead) =>
    Object.entries(filtro).every(([k, v]) => lead[k as keyof Lead] === v)
  ).length;
}

function contarStatus(leads: Lead[], status: string) {
  return leads.filter((l) => l.status === status).length;
}

export function generateReport(leads: Lead[], semana: Semana): string {
  const linhas = [
    `*Indicadores - Energia Solar*`,
    ``,
    `Leads gerados: ${leads.length}`,
    `Leads qualificados: ${contarStatus(leads, 'Lead qualificado')}`,
    ``,
    `Agendamentos marcados: ${contarStatus(leads, 'Agendamento marcado')}`,
    `  ↳ Presencial: ${contar(leads, { status: 'Agendamento marcado', modalidade: 'Presencial' })}`,
    `  ↳ Online: ${contar(leads, { status: 'Agendamento marcado', modalidade: 'Online' })}`,
    `  ↳ No Show: ${contar(leads, { status: 'Agendamento marcado', noShow: true })}`,
    ``,
    `Comparecimentos/diagnósticos: ${contarStatus(leads, 'Comparecimento/diagnóstico')}`,
    ``,
    `Visitas realizadas: ${contarStatus(leads, 'Visita realizada')}`,
    `  ↳ Presencial: ${contar(leads, { status: 'Visita realizada', modalidade: 'Presencial' })}`,
    `  ↳ Online: ${contar(leads, { status: 'Visita realizada', modalidade: 'Online' })}`,
    ``,
    `Propostas em negociação/follow-up: ${contarStatus(leads, 'Proposta em negociação')}`,
    ``,
    `Vendas fechadas: ${contarStatus(leads, 'Venda fechada')}`,
    ``,
    `Perdidos/não avançaram: ${contarStatus(leads, 'Perdido')}`,
  ];

  const perdidos = leads.filter((l) => l.status === 'Perdido' && l.motivoPerda);
  if (perdidos.length > 0) {
    const contagem: Record<string, number> = {};
    perdidos.forEach((l) => {
      if (l.motivoPerda) contagem[l.motivoPerda] = (contagem[l.motivoPerda] ?? 0) + 1;
    });
    linhas.push(`  Motivos:`);
    Object.entries(contagem).forEach(([motivo, n]) => {
      linhas.push(`  ↳ ${motivo}: ${n}`);
    });
  }

  if (semana.metaLeads !== null && semana.metaReunioes !== null && semana.metaPropostas !== null) {
    linhas.push(
      ``,
      `Metas:`,
      `  ↳ Leads: ${leads.length}/${semana.metaLeads}`,
      `  ↳ Agendamentos: ${contarStatus(leads, 'Agendamento marcado')}/${semana.metaReunioes}`,
      `  ↳ Propostas: ${contarStatus(leads, 'Proposta em negociação')}/${semana.metaPropostas}`
    );
  }

  return linhas.join('\n');
}