import { useEffect, useState } from 'react';
import { LeadForm } from './components/LeadForm';
import { LeadList } from './components/LeadList';
import { WeekFilter } from './components/WeekFilter';
import { WeekSelector } from './components/WeekSelector';
import { OriginSummary } from './components/OriginSummary';
import { ConversionRate } from './components/ConversionRate';
import { WeeksComparison } from './components/WeeksComparison';
import { ReportView } from './components/ReportView';
import { ChartsSection } from './components/ChartsSection';
import { GlobalSearch } from './components/GlobalSearch';
import { KommoPanel } from './components/KommoPanel';
import { filterLeadsBySemana } from './utils/filterLeadsBySemana';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { nowLocalISO } from './utils/dateTime';
import { exportLeadsAsCsv } from './utils/exportCsv';
import { statusPrecisaTipoContato } from './constants/leadOptions';
import type { Lead, LeadStatus, Origem, TipoContato } from './types/lead';
import type { Semana } from './types/semana';
import type { KommoLeadImportado } from './types/kommo';
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
      prev.map((lead) => {
        if (lead.id !== id) return lead;
        const precisaTipo = statusPrecisaTipoContato(status);
        return { ...lead, status, tipoContato: precisaTipo ? lead.tipoContato : null };
      })
    );
  }

  function handleOrigemChange(id: string, origem: Origem) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, origem } : lead)));
  }

  function handleTipoContatoChange(id: string, tipoContato: TipoContato) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, tipoContato } : lead)));
  }

  function handleTelefoneChange(id: string, novoTelefone: string): { sucesso: boolean; erro?: string } {
    if (!novoTelefone) {
      return { sucesso: false, erro: 'O telefone não pode ficar vazio.' };
    }
    const duplicado = leads.some((lead) => lead.id !== id && lead.telefone === novoTelefone);
    if (duplicado) {
      return { sucesso: false, erro: 'Esse número já está cadastrado em outro lead.' };
    }
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, telefone: novoTelefone } : lead)));
    return { sucesso: true };
  }

  function handleDeleteLead(id: string) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  function handleImportKommoLeads(
    importados: KommoLeadImportado[],
    mapaStatus: Record<string, LeadStatus>
  ) {
    const existentes = new Set(leads.map((lead) => lead.telefone));
    const novos: Lead[] = [];
    let semTelefone = 0;
    let duplicados = 0;

    for (const item of importados) {
      if (!item.telefone) {
        semTelefone += 1;
        continue;
      }
      if (existentes.has(item.telefone)) {
        duplicados += 1;
        continue;
      }
      novos.push({
        id: crypto.randomUUID(),
        telefone: item.telefone,
        origem: null,
        status: mapaStatus[item.statusId] ?? 'Novo',
        tipoContato: null,
        criadoEm: item.criadoEm,
      });
      existentes.add(item.telefone);
    }

    setLeads((prev) => [...prev, ...novos]);
    return { importados: novos.length, duplicados, semTelefone };
  }

  function handleInicioChange(novaData: string) {
    setSemanas((prev) =>
      prev.map((s) => (s.id === semanaAtiva.id ? { ...s, inicio: `${novaData}T00:00:00` } : s))
    );
  }

  function handleEncerrarSemana() {
    const confirmou = window.confirm(
      'Encerrar a semana atual? Os contadores vão zerar e uma nova semana vai começar agora.'
    );
    if (!confirmou) return;

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

      <GlobalSearch leads={leads} />

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

        <button className="btn-secondary" onClick={() => exportLeadsAsCsv(leads)}>
          Exportar CSV
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
        <ConversionRate leads={leadsDaSemana} />
      </section>

      <div className={`main-grid ${visualizandoSemanaAtual ? '' : 'single-column'}`}>
        {visualizandoSemanaAtual && (
          <section className="panel form-panel">
            <h2>Novo lead</h2>
            <LeadForm existingLeads={leads} onAddLead={handleAddLead} />
          </section>
        )}
        <section className="panel table-panel">
          <h2>Leads da semana</h2>
          <LeadList
            leads={leadsDaSemana}
            onStatusChange={visualizandoSemanaAtual ? handleStatusChange : undefined}
            onOrigemChange={visualizandoSemanaAtual ? handleOrigemChange : undefined}
            onTipoContatoChange={visualizandoSemanaAtual ? handleTipoContatoChange : undefined}
            onTelefoneChange={visualizandoSemanaAtual ? handleTelefoneChange : undefined}
            onDeleteLead={visualizandoSemanaAtual ? handleDeleteLead : undefined}
          />
        </section>
      </div>

      <section className="panel">
        <h2>Comparativo entre semanas</h2>
        <WeeksComparison leads={leads} semanas={semanas} />
      </section>

      {visualizandoSemanaAtual && <KommoPanel onImportLeads={handleImportKommoLeads} />}

      {showReport && <ChartsSection leads={leadsDaSemana} />}
    </div>
  );
}

export default App;