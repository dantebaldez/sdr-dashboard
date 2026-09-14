import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ORIGENS } from '../constants/leadOptions';
import type { Lead } from '../types/lead';
import { normalizeTelefone } from '../utils/normalizeTelefone';

interface LeadFormProps {
  existingLeads: Lead[];
  onAddLead: (lead: Lead) => void;
}

export function LeadForm({ existingLeads, onAddLead }: LeadFormProps) {
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<(typeof ORIGENS)[number]>(ORIGENS[0]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const telefoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    telefoneRef.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSucesso(false);
    const telefoneLimpo = telefone.trim();

    if (!telefoneLimpo) {
      setErro('Digite um telefone antes de adicionar.');
      return;
    }

    const jaExiste = existingLeads.some(
  		(lead) => normalizeTelefone(lead.telefone) === normalizeTelefone(telefoneLimpo)
);

    onAddLead({
      id: crypto.randomUUID(),
      telefone: telefoneLimpo,
      origem,
      status: 'Novo',
      tipoContato: null,
      noShow: false,
      nota: '',
      criadoEm: new Date().toISOString(),
    });

    setTelefone('');
    setOrigem(ORIGENS[0]);
    setErro('');
    setSucesso(true);
    telefoneRef.current?.focus();
    setTimeout(() => setSucesso(false), 2000);
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="telefone">Telefone</label>
        <input
          id="telefone"
          ref={telefoneRef}
          type="tel"
          value={telefone}
          onChange={(e) => {
            setTelefone(e.target.value);
            if (erro) setErro('');
          }}
          placeholder="Ex: (11) 91234-5678"
          className={erro ? 'input-erro' : undefined}
        />
        {erro && <p className="field-error">⚠ {erro}</p>}
        {sucesso && <p className="field-success">✓ Lead adicionado!</p>}
      </div>

      <div className="form-field">
        <label htmlFor="origem">Origem</label>
        <select id="origem" value={origem} onChange={(e) => setOrigem(e.target.value as (typeof ORIGENS)[number])}>
          {ORIGENS.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary">
        Adicionar lead
      </button>
    </form>
  );
}