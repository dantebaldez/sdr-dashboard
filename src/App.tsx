import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import { Login } from './components/Login';
import { LeadForm } from './components/LeadForm';
import { LeadList } from './components/LeadList';
import { WeekFilter } from './components/WeekFilter';
import { WeekSelector } from './components/WeekSelector';
import { OriginSummary } from './components/OriginSummary';
import { ConversionRate } from './components/ConversionRate';
import { WeeksComparison } from './components/WeeksComparison';
import { WeeklyGoals } from './components/WeeklyGoals';
import { ReportView } from './components/ReportView';
import { ChartsSection } from './components/ChartsSection';
import { GlobalSearch } from './components/GlobalSearch';
import { KommoPanel } from './components/KommoPanel';
import { useSupabaseData } from './hooks/useSupabaseData';
import { filterLeadsBySemana } from './utils/filterLeadsBySemana';
import { nowLocalISO } from './utils/dateTime';
import { exportLeadsAsCsv } from './utils/exportCsv';
import { normalizeTelefone } from './utils/normalizeTelefone';
import { statusPrecisaTipoContato } from './constants/leadOptions';
import type { Lead, LeadStatus, Origem, TipoContato } from './types/lead';
import type { Semana } from './types/semana';
import type { KommoLeadImportado } from './types/kommo';
import './App.css';

const TEMA_KEY = 'sdr-dashboard:tema';

function criarSemanaInicial(): Semana {
  return {
    id: crypto.randomUUID(),
    inicio: nowLocalISO(),
    fim: null,
    metaLeads: null,
    metaReunioes: null,
    metaPropostas: null,
  };
}

function loadTema(): 'claro' | 'escuro' {
  try {
    return (localStorage.getItem(TEMA_KEY) as 'claro' | 'escuro') ?? 'claro';
  } catch {
    return 'claro';
  }
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
	const [verificandoAuth, setVerificandoAuth] = useState(true);
	const [tema, setTema] = useState<'claro' | 'escuro'>(loadTema);
	

  const {
    leads,
    semanas,
    carregando,
    salvarLead,
    atualizarLead,
    deletarLead,
    salvarSemana,
    atualizarSemana,
  } = useSupabaseData();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setVerificandoAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = tema === 'escuro' ? 'dark' : '';
    localStorage.setItem(TEMA_KEY, tema);
  }, [tema]);

  const semanasOrdenadas = [...semanas].sort((a, b) => a.inicio > b.inicio ? 1 : -1);
  const semanaAtiva = semanasOrdenadas.find((s) => s.fim === null) ?? semanasOrdenadas[semanasOrdenadas.length - 1];
  const [semanaSelecionadaId, setSemanaSelecionadaId] = useState<string>('');

  useEffect(() => {
    if (semanaAtiva && !semanaSelecionadaId) {
      setSemanaSelecionadaId(semanaAtiva.id);
    }
  }, [semanaAtiva, semanaSelecionadaId]);

  useEffect(() => {
    if (!carregando && semanas.length === 0) {
      const novaSemana = criarSemanaInicial();
      salvarSemana(novaSemana);
      setSemanaSelecionadaId(novaSemana.id);
    }
  }, [carregando, semanas.length, salvarSemana]);

  if (verificandoAuth) return null;
  if (!session) return <Login />;

  if (carregando || !semanaAtiva || !semanaSelecionadaId) {
    return (
      <div className="page">
        <p className="empty-state">Carregando...</p>
      </div>
    );
  }

  const semanaSelecionada = semanas.find((s) => s.id === semanaSelecionadaId) ?? semanaAtiva;
  const visualizandoSemanaAtual = semanaSelecionada.id === semanaAtiva.id;
  const leadsDaSemana = filterLeadsBySemana(leads, semanaSelecionada);

  async function handleAddLead(lead: Lead) {
    await salvarLead(lead);
    setSemanaSelecionadaId(semanaAtiva.id);
  }

  async function handleStatusChange(id: string, status: LeadStatus) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const precisaTipo = statusPrecisaTipoContato(status);
    const atualizado = { ...lead, status, tipoContato: precisaTipo ? lead.tipoContato : null };
    await atualizarLead(atualizado);
  }

  async function handleOrigemChange(id: string, origem: Origem) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    await atualizarLead({ ...lead, origem });
  }

  async function handleTipoContatoChange(id: string, tipoContato: TipoContato) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    await atualizarLead({ ...lead, tipoContato });
  }

  async function handleNoShowChange(id: string, noShow: boolean) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    await atualizarLead({ ...lead, noShow });
  }

  async function handleTelefoneChange(id: string, novoTelefone: string): Promise<{ sucesso: boolean; erro?: string }> {
    if (!novoTelefone) return { sucesso: false, erro: 'O telefone não pode ficar vazio.' };
    const duplicado = leads.some(
      (lead) => lead.id !== id && normalizeTelefone(lead.telefone) === normalizeTelefone(novoTelefone)
    );
    if (duplicado) return { sucesso: false, erro: 'Esse número já está cadastrado em outro lead.' };
    const lead = leads.find((l) => l.id === id);
    if (!lead) return { sucesso: false };
    await atualizarLead({ ...lead, telefone: novoTelefone });
    return { sucesso: true };
  }

  async function handleDeleteLead(id: string) {
    await deletarLead(id);
  }

  async function handleNotaChange(id: string, nota: string) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    await atualizarLead({ ...lead, nota });
  }

  async function handleDefinirMetas(metas: { metaLeads: number; metaReunioes: number; metaPropostas: number }) {
    if (semanaAtiva.metaLeads !== null) return;
    const atualizada = { ...semanaAtiva, ...metas };
    await atualizarSemana(atualizada);
  }

  async function handleImportKommoLeads(
    importados: KommoLeadImportado[],
    mapaStatus: Record<string, LeadStatus>
  ) {
    const existentes = new Set(leads.map((lead) => normalizeTelefone(lead.telefone)));
    const novos: Lead[] = [];
    let semTelefone = 0;
    let duplicados = 0;

    for (const item of importados) {
      if (!item.telefone) { semTelefone += 1; continue; }
      if (existentes.has(normalizeTelefone(item.telefone))) { duplicados += 1; continue; }
      novos.push({
        id: crypto.randomUUID(),
        telefone: item.telefone,
        origem: null,
        status: mapaStatus[item.statusId] ?? 'Novo',
        tipoContato: null,
        noShow: false,
        nota: '',
        criadoEm: item.criadoEm,
      });
      existentes.add(normalizeTelefone(item.telefone));
    }

    for (const lead of novos) await salvarLead(lead);
    return { importados: novos.length, duplicados, semTelefone };
  }

  async function handleInicioChange(novaData: string) {
    await atualizarSemana({ ...semanaAtiva, inicio: `${novaData}T00:00:00` });
  }

  async function handleEncerrarSemana() {
    const confirmou = window.confirm(
      'Encerrar a semana atual? Os contadores vão zerar e uma nova semana vai começar agora.'
    );
    if (!confirmou) return;

    const agora = nowLocalISO();
    await atualizarSemana({ ...semanaAtiva, fim: agora });

    const novaSemana: Semana = {
      id: crypto.randomUUID(),
      inicio: agora,
      fim: null,
      metaLeads: null,
      metaReunioes: null,
      metaPropostas: null,
    };
    await salvarSemana(novaSemana);
    setSemanaSelecionadaId(novaSemana.id);
  }

  const [showReport, setShowReport] = useState(false);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-top">
          <div>
            <h1>SDR Dashboard - Primária Energia</h1>
            <p className="page-subtitle">Acompanhamento semanal de leads</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn-secondary"
              onClick={() => setTema((t) => (t === 'claro' ? 'escuro' : 'claro'))}
            >
              {tema === 'claro' ? '🌙 Modo escuro' : '☀️ Modo claro'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => supabase.auth.signOut()}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <GlobalSearch
        leads={leads}
        semanaAtiva={semanaAtiva}
        onStatusChange={handleStatusChange}
        onOrigemChange={handleOrigemChange}
        onTipoContatoChange={handleTipoContatoChange}
        onNoShowChange={handleNoShowChange}
        onTelefoneChange={handleTelefoneChange}
        onDeleteLead={handleDeleteLead}
        onNotaChange={handleNotaChange}
      />

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
        <ReportView leads={leadsDaSemana} semana={semanaSelecionada} onClose={() => setShowReport(false)} />
      )}

      <div className="dashboard-layout">
        <div className="dashboard-main">
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
                onNoShowChange={visualizandoSemanaAtual ? handleNoShowChange : undefined}
                onTelefoneChange={visualizandoSemanaAtual ? handleTelefoneChange : undefined}
                onDeleteLead={visualizandoSemanaAtual ? handleDeleteLead : undefined}
                onNotaChange={handleNotaChange}
              />
            </section>
          </div>

          <WeeklyGoals
            semana={semanaSelecionada}
            leads={leadsDaSemana}
            editavel={visualizandoSemanaAtual}
            onDefinirMetas={handleDefinirMetas}
          />

          <section className="stats-row">
            <OriginSummary leads={leadsDaSemana} />
            <ConversionRate leads={leadsDaSemana} />
          </section>

          <section className="panel">
            <h2>Comparativo entre semanas</h2>
            <WeeksComparison leads={leads} semanas={semanas} />
          </section>

          {visualizandoSemanaAtual && <KommoPanel onImportLeads={handleImportKommoLeads} />}
        </div>
      </div>

      {showReport && <ChartsSection leads={leadsDaSemana} semana={semanaSelecionada} />}
    </div>
  );
}

export default App;