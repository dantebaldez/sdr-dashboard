import { useEffect, useRef, useState } from 'react';
import { LeadList } from './LeadList';
import { leadEstaNaSemana } from '../utils/leadEstaNaSemana';
import type { Lead, LeadStatus, Origem, TipoContato } from '../types/lead';
import type { Semana } from '../types/semana';
import { normalizeTelefone } from '../utils/normalizeTelefone';

interface GlobalSearchProps {
  leads: Lead[];
  semanaAtiva: Semana;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onOrigemChange: (id: string, origem: Origem) => void;
  onTipoContatoChange: (id: string, tipoContato: TipoContato) => void;
  onNoShowChange: (id: string, noShow: boolean) => void;
  onTelefoneChange: (id: string, telefone: string) => { sucesso: boolean; erro?: string } | Promise<{ sucesso: boolean; erro?: string }>;
  onDeleteLead: (id: string) => void;
  onNotaChange: (id: string, nota: string) => void;
}

function elementoEhCampoDeTexto(elemento: Element | null): boolean {
  if (!elemento) return false;
  const tag = elemento.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}

export function GlobalSearch({
  leads,
  semanaAtiva,
  onStatusChange,
  onOrigemChange,
  onTipoContatoChange,
  onNoShowChange,
  onTelefoneChange,
  onDeleteLead,
  onNotaChange,
}: GlobalSearchProps) {
  const [termo, setTermo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const termoLimpo = termo.trim();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== '/') return;
      if (elementoEhCampoDeTexto(document.activeElement)) return;
      event.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resultados = termoLimpo
  ? leads.filter((lead) =>
      normalizeTelefone(lead.telefone ?? '').includes(normalizeTelefone(termoLimpo))
    )
  : [];

  return (
    <section className="global-search">
      <div className="search-field">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Buscar lead por telefone (atalho: /)"
          aria-label="Buscar lead por telefone"
        />
      </div>

      {termoLimpo &&
        (resultados.length === 0 ? (
          <p className="empty-state">Nenhum lead encontrado com esse telefone.</p>
        ) : (
          <LeadList
            leads={resultados}
            onStatusChange={onStatusChange}
            onOrigemChange={onOrigemChange}
            onTipoContatoChange={onTipoContatoChange}
            onNoShowChange={onNoShowChange}
            onTelefoneChange={onTelefoneChange}
            onDeleteLead={onDeleteLead}
            onNotaChange={onNotaChange}
            isLeadEditavel={(lead) => leadEstaNaSemana(lead, semanaAtiva)}
          />
        ))}
    </section>
  );
}