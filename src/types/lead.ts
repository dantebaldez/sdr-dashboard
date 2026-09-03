import type { ORIGENS, STATUSES, TIPOS_CONTATO } from '../constants/leadOptions';

export type Origem = (typeof ORIGENS)[number];
export type LeadStatus = (typeof STATUSES)[number];
export type TipoContato = (typeof TIPOS_CONTATO)[number];

export interface Lead {
  id: string;
  telefone: string;
  origem: Origem | null;
  status: LeadStatus;
  tipoContato: TipoContato | null;
  criadoEm: string;
}