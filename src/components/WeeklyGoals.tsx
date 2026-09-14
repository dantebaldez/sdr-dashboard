import { useState, type FormEvent } from 'react';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

interface WeeklyGoalsProps {
  semana: Semana;
  leads: Lead[];
  editavel: boolean;
  onDefinirMetas: (metas: { metaLeads: number; metaReunioes: number; metaPropostas: number }) => void;
}

function calcularPorcentagem(atual: number, meta: number) {
  if (meta <= 0) return 0;
  return Math.min(100, Math.round((atual / meta) * 100));
}

export function WeeklyGoals({ semana, leads, editavel, onDefinirMetas }: WeeklyGoalsProps) {
  const [metaLeads, setMetaLeads] = useState('');
  const [metaReunioes, setMetaReunioes] = useState('');
  const [metaPropostas, setMetaPropostas] = useState('');

  const metasDefinidas = semana.metaLeads !== null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const leadsNum = Number(metaLeads);
    const reunioesNum = Number(metaReunioes);
    const propostasNum = Number(metaPropostas);

    if (!leadsNum || !reunioesNum || !propostasNum || leadsNum <= 0 || reunioesNum <= 0 || propostasNum <= 0) {
      return;
    }

    const confirmou = window.confirm(
      'Depois de salvas, as metas dessa semana não podem mais ser alteradas. Confirmar?'
    );
    if (!confirmou) return;

    onDefinirMetas({ metaLeads: leadsNum, metaReunioes: reunioesNum, metaPropostas: propostasNum });
  }

  if (!metasDefinidas) {
    if (!editavel) {
      return (
        <section className="panel goals-panel">
          <h2>Meta da semana</h2>
          <p className="empty-state">Nenhuma meta foi definida para essa semana.</p>
        </section>
      );
    }

    return (
      <section className="panel goals-panel">
        <h2>Definir meta da semana</h2>
        <p className="page-subtitle">
          Defina de uma vez só — depois de salvar, não dá mais pra mudar nessa semana.
        </p>
        <form className="goals-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="meta-leads">Leads cadastrados</label>
            <input
              id="meta-leads"
              type="number"
              min="1"
              value={metaLeads}
              onChange={(e) => setMetaLeads(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="meta-reunioes">Reuniões agendadas</label>
            <input
              id="meta-reunioes"
              type="number"
              min="1"
              value={metaReunioes}
              onChange={(e) => setMetaReunioes(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="meta-propostas">Propostas enviadas</label>
            <input
              id="meta-propostas"
              type="number"
              min="1"
              value={metaPropostas}
              onChange={(e) => setMetaPropostas(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Salvar metas (não dá pra editar depois)
          </button>
        </form>
      </section>
    );
  }

  const totalLeads = leads.length;
  const totalReunioes = leads.filter((lead) => lead.status === 'Reunião agendada').length;
  const totalPropostas = leads.filter((lead) => lead.status === 'Proposta enviada').length;

  const itens = [
    { label: 'Leads cadastrados', atual: totalLeads, meta: semana.metaLeads! },
    { label: 'Reuniões agendadas', atual: totalReunioes, meta: semana.metaReunioes! },
    { label: 'Propostas enviadas', atual: totalPropostas, meta: semana.metaPropostas! },
  ];

  return (
    <section className="panel goals-panel">
      <h2>Meta da semana</h2>
      <div className="goals-progress">
        {itens.map((item) => (
          <div className="goal-item" key={item.label}>
            <div className="goal-item-header">
              <span>{item.label}</span>
              <span>
                {item.atual} / {item.meta}
              </span>
            </div>
            <div className="goal-bar">
              <div
                className="goal-bar-fill"
                style={{ width: `${calcularPorcentagem(item.atual, item.meta)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}