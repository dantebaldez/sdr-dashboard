import type { Lead } from '../types/lead';

function escapeCsv(valor: string): string {
  if (valor.includes(';') || valor.includes('"') || valor.includes('\n')) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

export function exportLeadsAsCsv(leads: Lead[]) {
  const cabecalho = ['Telefone', 'Origem', 'Status', 'Tipo de contato', 'Cadastrado em'];
  const linhas = leads.map((lead) => [
    lead.telefone,
    lead.origem ?? '',
    lead.status,
    lead.tipoContato ?? '',
    new Date(lead.criadoEm).toLocaleString('pt-BR'),
  ]);

  const conteudo = [cabecalho, ...linhas].map((linha) => linha.map(escapeCsv).join(';')).join('\n');

  const blob = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sdr-dashboard-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}