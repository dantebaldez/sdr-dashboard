import type { ORIGENS, STATUSES } from '../constants/leadOptions';

export type Origem = (typeof ORIGENS)[number];
export type LeadStatus = (typeof STATUSES)[number];

export interface Lead {
	id: string;
	nome: string;
	origem: Origem;
	status: LeadStatus;
	criadoEm: string;
}