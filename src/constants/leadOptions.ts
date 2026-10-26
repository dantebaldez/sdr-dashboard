export const ORIGENS = ['WhatsApp', 'Formulário', 'Indicação'] as const;

export const STATUSES = [
  'Novo',
  'Atendimento marcado',
  'Proposta enviada',
  'Perdido',
] as const;

export const TIPOS_CONTATO = ['Novo', 'Follow-up'] as const;

export const TIPOS_ATENDIMENTO = ['Visita técnica', 'Reunião online'] as const;

export const MOTIVOS_PERDA = [
  'Preço/Achou caro',
  'Condições de pagamento/financiamento',
  'Fechou com concorrente',
  'Sem urgência/deixou pra depois',
  'Sem resposta após proposta',
  'Insegurança sobre a empresa, instalação ou garantia',
  'Projeto inviável ou pouco atrativo',
  'Decisor ausente/desalinhamento familiar',
  'Preencheu número errado',
  'Cliente encerrou a ligação',
  'Não atendeu/sem contato',
  'Sem interesse',
  'Já possui sistema solar',
  'Não é proprietário do imóvel',
  'Fora da área de atendimento',
  'Conta de energia baixa',
  'Lead duplicado ou de teste',
] as const;

export function statusPrecisaTipoContato(_status: string): boolean {
  return true;
}

export function statusPrecisaTipoAtendimento(status: string): boolean {
  return status === 'Atendimento marcado';
}

export function statusPrecisaMotivoPerdas(status: string): boolean {
  return status === 'Perdido';
}

export function ehLeadNovo(tipoContato: string | null): boolean {
  return tipoContato !== 'Follow-up';
}