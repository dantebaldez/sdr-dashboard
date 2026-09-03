import { useState } from 'react';
import { STATUSES } from '../constants/leadOptions';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import type { LeadStatus } from '../types/lead';
import type { KommoConfig, KommoEstagio, KommoLeadImportado } from '../types/kommo';

const CONFIG_KEY = 'sdr-dashboard:kommo-config';
const MAPA_KEY = 'sdr-dashboard:kommo-status-map';

interface KommoPanelProps {
	onImportLeads: (
		importados: KommoLeadImportado[],
		mapaStatus: Record<string, LeadStatus>
	) => { importados: number; duplicados: number; semTelefone: number };
}

export function KommoPanel({ onImportLeads }: KommoPanelProps) {
	const [aberto, setAberto] = useState(false);
	const [config, setConfig] = useState<KommoConfig>(() =>
		loadFromStorage(CONFIG_KEY, { subdomain: '', token: '' })
	);
	const [mapaStatus, setMapaStatus] = useState<Record<string, LeadStatus>>(() =>
		loadFromStorage(MAPA_KEY, {})
	);
	const [estagios, setEstagios] = useState<KommoEstagio[]>([]);
	const [carregando, setCarregando] = useState(false);
	const [mensagem, setMensagem] = useState('');

	function salvarConfig(novaConfig: KommoConfig) {
		setConfig(novaConfig);
		saveToStorage(CONFIG_KEY, novaConfig);
	}

	function salvarMapa(novoMapa: Record<string, LeadStatus>) {
		setMapaStatus(novoMapa);
		saveToStorage(MAPA_KEY, novoMapa);
	}

	async function handleCarregarEstagios() {
		if (!config.subdomain || !config.token) {
			setMensagem('Preencha o subdomínio e o token antes de carregar os estágios.');
			return;
		}
		setCarregando(true);
		setMensagem('');
		try {
			const lista = await window.kommoAPI.getPipelines(config);
			setEstagios(lista);
		} catch {
			setMensagem('Não foi possível carregar os estágios. Confira o subdomínio e o token.');
		} finally {
			setCarregando(false);
		}
	}

	async function handleImportar() {
		if (!config.subdomain || !config.token) {
			setMensagem('Preencha o subdomínio e o token antes de importar.');
			return;
		}
		setCarregando(true);
		setMensagem('');
		try {
			const importados = await window.kommoAPI.importLeads(config);
			const resultado = onImportLeads(importados, mapaStatus);
			setMensagem(
				`${resultado.importados} lead(s) importado(s). ${resultado.duplicados} já existiam. ${resultado.semTelefone} sem telefone (ignorados).`
			);
		} catch {
			setMensagem('Não foi possível importar. Confira o subdomínio e o token.');
		} finally {
			setCarregando(false);
		}
	}

	return (
		<section className="panel kommo-panel">
			<div className="chart-header">
				<h2>Integração com o Kommo CRM</h2>
				<button className="btn-secondary" onClick={() => setAberto((v) => !v)}>
					{aberto ? 'Fechar configuração' : 'Configurar'}
				</button>
			</div>

			{aberto && (
				<div className="kommo-config">
					<div className="form-field">
						<label htmlFor="kommo-subdomain">Subdomínio do Kommo</label>
						<input
							id="kommo-subdomain"
							type="text"
							value={config.subdomain}
							onChange={(e) => salvarConfig({ ...config, subdomain: e.target.value })}
							placeholder="ex: suaempresa"
						/>
					</div>

					<div className="form-field">
						<label htmlFor="kommo-token">Token de longa duração</label>
						<input
							id="kommo-token"
							type="password"
							value={config.token}
							onChange={(e) => salvarConfig({ ...config, token: e.target.value })}
							placeholder="Cole o token gerado no Kommo"
						/>
					</div>

					<button className="btn-secondary" onClick={handleCarregarEstagios} disabled={carregando}>
						Carregar estágios do pipeline
					</button>

					{estagios.length > 0 && (
						<div className="kommo-mapa">
							<p className="page-subtitle">
								Diga qual status do dashboard cada estágio do Kommo representa:
							</p>
							{estagios.map((estagio) => (
								<div className="form-field" key={estagio.id}>
									<label htmlFor={`estagio-${estagio.id}`}>{estagio.nome}</label>
									<select
										id={`estagio-${estagio.id}`}
										value={mapaStatus[estagio.id] ?? ''}
										onChange={(e) =>
											salvarMapa({ ...mapaStatus, [estagio.id]: e.target.value as LeadStatus })
										}
									>
										<option value="" disabled>
											Selecionar status
										</option>
										{STATUSES.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</div>
							))}
						</div>
					)}
				</div>
			)}

			<button className="btn-primary" onClick={handleImportar} disabled={carregando}>
				{carregando ? 'Importando...' : 'Importar do Kommo'}
			</button>

			{mensagem && <p className="empty-state">{mensagem}</p>}
		</section>
	);
}