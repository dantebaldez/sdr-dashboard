import { useEffect, useState } from 'react';
import { LeadForm } from './components/LeadForm';
import { LeadList } from './components/LeadList';
import { WeekFilter } from './components/WeekFilter';
import { WeekSelector } from './components/WeekSelector';
import { OriginSummary } from './components/OriginSummary';
import { ReportView } from './components/ReportView';
import { ChartsSection } from './components/ChartsSection';
import { filterLeadsBySemana } from './utils/filterLeadsBySemana';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { nowLocalISO } from './utils/dateTime';
import type { Lead, LeadStatus } from './types/lead';
import type { Semana } from './types/semana';
import './App.css';

const LEADS_KEY = 'sdr-dashboard:leads';
const SEMANAS_KEY = 'sdr-dashboard:semanas';

function criarSemanaInicial(): Semana {
	return { id: crypto.randomUUID(), inicio: nowLocalISO(), fim: null };
}

function App() {
	const [leads, setLeads] = useState<Lead[]>(() => loadFromStorage(LEADS_KEY, []));
	const [semanas, setSemanas] = useState<Semana[]>(() => {
		const salvas = loadFromStorage<Semana[]>(SEMANAS_KEY, []);
		return salvas.length > 0 ? salvas : [criarSemanaInicial()];
	});

	const semanaAtiva = semanas.find((s) => s.fim === null) ?? semanas[semanas.length - 1];

	const [semanaSelecionadaId, setSemanaSelecionadaId] = useState<string>(semanaAtiva.id);

	useEffect(() => {
		saveToStorage(LEADS_KEY, leads);
	}, [leads]);

	useEffect(() => {
		saveToStorage(SEMANAS_KEY, semanas);
	}, [semanas]);

	const semanaSelecionada = semanas.find((s) => s.id === semanaSelecionadaId) ?? semanaAtiva;
	const visualizandoSemanaAtual = semanaSelecionada.id === semanaAtiva.id;
	const leadsDaSemana = filterLeadsBySemana(leads, semanaSelecionada);

	function handleAddLead(lead: Lead) {
		setLeads((prev) => [...prev, lead]);
	}

	function handleStatusChange(id: string, status: LeadStatus) {
		setLeads((prev) =>
			prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
		);
	}

	function handleInicioChange(novaData: string) {
		setSemanas((prev) =>
			prev.map((s) => (s.id === semanaAtiva.id ? { ...s, inicio: `${novaData}T00:00:00` } : s))
		);
	}

	function handleEncerrarSemana() {
		const agora = nowLocalISO();
		const novaSemana: Semana = { id: crypto.randomUUID(), inicio: agora, fim: null };

		setSemanas((prev) => [
			...prev.map((s) => (s.id === semanaAtiva.id ? { ...s, fim: agora } : s)),
			novaSemana,
		]);
		setSemanaSelecionadaId(novaSemana.id);
	}

	const [showReport, setShowReport] = useState(false);

	return (
		<div className="page">
			<header className="page-header">
				<h1>SDR Dashboard</h1>
				<p className="page-subtitle">Acompanhamento semanal de leads</p>
			</header>

			<section className="filter-bar">
				<WeekSelector
					semanas={semanas}
					semanaSelecionadaId={semanaSelecionada.id}
					onChange={setSemanaSelecionadaId}
				/>

				{visualizandoSemanaAtual && (
					<WeekFilter startDate={semanaAtiva.inicio.slice(0, 10)} onChange={handleInicioChange} />
				)}

				{visualizandoSemanaAtual && (
					<button className="btn-secondary" onClick={handleEncerrarSemana}>
						Encerrar semana
					</button>
				)}

				<button className="btn-secondary" onClick={() => setShowReport(true)}>
					Gerar relatório
				</button>
			</section>

			{!visualizandoSemanaAtual && (
				<p className="empty-state">
					Visualizando uma semana encerrada — somente consulta, sem edição.
				</p>
			)}

			{showReport && (
				<ReportView leads={leadsDaSemana} onClose={() => setShowReport(false)} />
			)}

			<section className="stats-row">
				<OriginSummary leads={leadsDaSemana} />
			</section>

			<div className={`main-grid ${visualizandoSemanaAtual ? '' : 'single-column'}`}>
				{visualizandoSemanaAtual && (
					<section className="panel form-panel">
						<h2>Novo lead</h2>
						<LeadForm onAddLead={handleAddLead} />
					</section>
				)}
				<section className="panel table-panel">
					<h2>Leads da semana</h2>
					<LeadList
						leads={leadsDaSemana}
						onStatusChange={visualizandoSemanaAtual ? handleStatusChange : undefined}
					/>
				</section>
			</div>

			{showReport && <ChartsSection leads={leadsDaSemana} />}
		</div>
	);
}

export default App;