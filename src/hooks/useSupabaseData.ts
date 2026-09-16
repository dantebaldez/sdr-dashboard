import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

function leadParaDB(lead: Lead) {
  return {
    id: lead.id,
    telefone: lead.telefone,
    origem: lead.origem,
    status: lead.status,
    tipo_contato: lead.tipoContato,
    no_show: lead.noShow,
    nota: lead.nota,
    criado_em: lead.criadoEm,
  };
}

function leadDoDB(row: Record<string, unknown>): Lead {
  return {
    id: row.id as string,
    telefone: row.telefone as string,
    origem: (row.origem ?? null) as Lead['origem'],
    status: row.status as Lead['status'],
    tipoContato: (row.tipo_contato ?? null) as Lead['tipoContato'],
    noShow: (row.no_show ?? false) as boolean,
    nota: (row.nota ?? '') as string,
    criadoEm: row.criado_em as string,
  };
}

function semanaParaDB(semana: Semana) {
  return {
    id: semana.id,
    inicio: semana.inicio,
    fim: semana.fim,
    meta_leads: semana.metaLeads,
    meta_reunioes: semana.metaReunioes,
    meta_propostas: semana.metaPropostas,
  };
}

function semanaDoDB(row: Record<string, unknown>): Semana {
  return {
    id: row.id as string,
    inicio: row.inicio as string,
    fim: (row.fim ?? null) as string | null,
    metaLeads: (row.meta_leads ?? null) as number | null,
    metaReunioes: (row.meta_reunioes ?? null) as number | null,
    metaPropostas: (row.meta_propostas ?? null) as number | null,
  };
}

export function useSupabaseData() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const [{ data: leadsData }, { data: semanasData }] = await Promise.all([
        supabase.from('leads').select('*').order('criado_em', { ascending: false }),
        supabase.from('semanas').select('*').order('inicio', { ascending: true }),
      ]);

      if (leadsData) setLeads(leadsData.map(leadDoDB));
      if (semanasData) setSemanas(semanasData.map(semanaDoDB));
      setCarregando(false);
    }

    carregar();
  }, []);

  const salvarLead = useCallback(async (lead: Lead) => {
    await supabase.from('leads').upsert(leadParaDB(lead));
    setLeads((prev) => {
      const existe = prev.find((l) => l.id === lead.id);
      if (existe) return prev.map((l) => (l.id === lead.id ? lead : l));
      return [lead, ...prev];
    });
  }, []);

  const atualizarLead = useCallback(async (lead: Lead) => {
    await supabase.from('leads').update(leadParaDB(lead)).eq('id', lead.id);
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
  }, []);

  const deletarLead = useCallback(async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const salvarSemana = useCallback(async (semana: Semana) => {
    await supabase.from('semanas').upsert(semanaParaDB(semana));
    setSemanas((prev) => {
      const existe = prev.find((s) => s.id === semana.id);
      if (existe) return prev.map((s) => (s.id === semana.id ? semana : s));
      return [...prev, semana];
    });
  }, []);

  const atualizarSemana = useCallback(async (semana: Semana) => {
    await supabase.from('semanas').update(semanaParaDB(semana)).eq('id', semana.id);
    setSemanas((prev) => prev.map((s) => (s.id === semana.id ? semana : s)));
  }, []);

  return {
    leads,
    semanas,
    carregando,
    salvarLead,
    atualizarLead,
    deletarLead,
    salvarSemana,
    atualizarSemana,
  };
}