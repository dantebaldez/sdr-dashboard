export interface KommoConfig {
	subdomain: string;
	token: string;
}

export interface KommoEstagio {
	id: string;
	nome: string;
}

export interface KommoLeadImportado {
	telefone: string | null;
	statusId: string;
	criadoEm: string;
}

declare global {
	interface Window {
		kommoAPI: {
			getPipelines: (config: KommoConfig) => Promise<KommoEstagio[]>;
			importLeads: (config: KommoConfig) => Promise<KommoLeadImportado[]>;
		};
	}
}