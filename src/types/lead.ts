import type { ORIGENS, STATUSES, TIPOS_CONTATO, TIPOS_ATENDIMENTO, MOTIVOS_PERDA } from '../constants/leadOptions';

export type Origem = (typeof ORIGENS)[number];
export type LeadStatus = (typeof STATUSES)[number];
export type TipoContato = (typeof TIPOS_CONTATO)[number];
export type TipoAtendimento = (typeof TIPOS_ATENDIMENTO)[number];
export type MotivoPerdas = (typeof MOTIVOS_PERDA)[number];

export interface Lead {
  id: string;
  telefone: string;
  origem: Origem | null;
  status: LeadStatus;
  tipoContato: TipoContato | null;
  tipoAtendimento: TipoAtendimento | null;
  motivoPerda: MotivoPerdas | null;
  nota: string;
  criadoEm: string;
}