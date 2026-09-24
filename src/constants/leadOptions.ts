export const ORIGENS = ['WhatsApp', 'Formulário', 'Indicação'] as const;

export const STATUSES = [
  'Lead gerado',
  'Lead qualificado',
  'Agendamento marcado',
  'Comparecimento/diagnóstico',
  'Visita realizada',
  'Proposta em negociação',
  'Venda fechada',
  'Perdido',
] as const;

export const TIPOS_CONTATO = ['Novo', 'Follow-up'] as const;

export const MODALIDADES = ['Presencial', 'Online'] as const;

export const MOTIVOS_PERDA = [
  'Preço/Achou caro',
  'Condições de pagamento/financiamento',
  'Fechou com concorrente',
  'Sem urgência/deixou pra depois',
  'Sem resposta após proposta',
  'Insegurança sobre a empresa, instalação ou garantia',
  'Projeto inviável ou pouco atrativo',
  'Decisor ausente/desalinhamento familiar',
] as const;

// Tipo aparece em todos os status
export function statusPrecisaTipoContato(_status: string): boolean {
  return true;
}

// No Show só em Agendamento marcado
export function statusPrecisaNoShow(status: string): boolean {
  return status === 'Agendamento marcado';
}

// Modalidade (Presencial/Online) em Agendamento marcado e Visita realizada
export function statusPrecisaModalidade(status: string): boolean {
  return status === 'Agendamento marcado' || status === 'Visita realizada';
}

// Motivo de perda só em Perdido
export function statusPrecisaMotivoPerdas(status: string): boolean {
  return status === 'Perdido';
}

export function ehLeadNovo(tipoContato: string | null): boolean {
  return tipoContato !== 'Follow-up';
}