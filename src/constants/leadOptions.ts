export const ORIGENS = ['WhatsApp', 'Formulário', 'Indicação'] as const;

export const STATUSES = ['Novo', 'Reunião agendada', 'Proposta enviada', 'Perdido'] as const;

export const TIPOS_CONTATO = ['Novo', 'Follow-up'] as const;

const STATUSES_COM_TIPO_CONTATO = new Set(['Reunião agendada', 'Proposta enviada', 'Perdido']);

export function statusPrecisaTipoContato(status: string): boolean {
  return STATUSES_COM_TIPO_CONTATO.has(status);
}

export function statusPrecisaNoShow(status: string): boolean {
  return status === 'Reunião agendada';
}

export function ehLeadNovo(tipoContato: string | null): boolean {
  return tipoContato !== 'Follow-up';
}