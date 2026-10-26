import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ORIGENS } from '../constants/leadOptions';
import {
  formatTelefone,
  normalizeTelefone,
  soDigitos,
  telefoneValido,
} from '../utils/normalizeTelefone';
import type { Lead } from '../types/lead';

interface LeadFormProps {
  existingLeads: Lead[]; // leads da semana atual
  onAddLead: (lead: Lead) => void;
}

export function LeadForm({ existingLeads, onAddLead }: LeadFormProps) {
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<(typeof ORIGENS)[number]>(ORIGENS[0]);
  const [followUp, setFollowUp] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const telefoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    telefoneRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSucesso(false);

    if (!telefoneValido(telefone)) {
      setErro('Digite o DDD e o número. Ex: 61 99999-9999');
      return;
    }

    const telefoneNormalizado = normalizeTelefone(telefone);

    const jaExiste = existingLeads.some(
      (lead) => normalizeTelefone(lead.telefone) === telefoneNormalizado
    );

    if (jaExiste) {
      setErro(`O número ${formatTelefone(telefoneNormalizado)} já foi cadastrado nesta semana.`);
      return;
    }

    onAddLead({
      id: crypto.randomUUID(),
      telefone: telefoneNormalizado,
      origem,
      status: 'Novo',
      tipoContato: followUp ? 'Follow-up' : 'Novo',
      tipoAtendimento: null,
      motivoPerda: null,
      nota: '',
      criadoEm: new Date().toISOString(),
    });

    setTelefone('');
    setOrigem(ORIGENS[0]);
    setFollowUp(false);
    setErro('');
    setSucesso(true);
    telefoneRef.current?.focus();
    setTimeout(() => setSucesso(false), 2000);
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="telefone">Telefone (só números, com DDD)</label>
        <input
          id="telefone"
          ref={telefoneRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={telefone}
          onChange={(e) => {
            setTelefone(soDigitos(e.target.value));
            if (erro) setErro('');
          }}
          placeholder="Ex: 61999999999"
          className={erro ? 'input-erro' : undefined}
        />
        {telefoneValido(telefone) && (
          <p className="field-hint">{formatTelefone(telefone)}</p>
        )}
        {erro && <p className="field-error">⚠ {erro}</p>}
        {sucesso && <p className="field-success">✓ Lead adicionado!</p>}
      </div>

      <div className="form-field">
        <label htmlFor="origem">Origem</label>
        <select
          id="origem"
          value={origem}
          onChange={(e) => setOrigem(e.target.value as (typeof ORIGENS)[number])}
        >
          {ORIGENS.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={followUp}
          onChange={(e) => setFollowUp(e.target.checked)}
        />
        É follow-up
      </label>

      <button type="submit" className="btn-primary">
        Adicionar lead
      </button>
    </form>
  );
}