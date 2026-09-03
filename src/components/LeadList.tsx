import { useState } from 'react';
import { ORIGENS, STATUSES, TIPOS_CONTATO, statusPrecisaTipoContato } from '../constants/leadOptions';
import type { Lead, LeadStatus, Origem, TipoContato } from '../types/lead';

interface LeadListProps {
  leads: Lead[];
  onStatusChange?: (id: string, status: LeadStatus) => void;
  onOrigemChange?: (id: string, origem: Origem) => void;
  onTipoContatoChange?: (id: string, tipoContato: TipoContato) => void;
  onTelefoneChange?: (id: string, telefone: string) => { sucesso: boolean; erro?: string };
  onDeleteLead?: (id: string) => void;
}

export function LeadList({
  leads,
  onStatusChange,
  onOrigemChange,
  onTipoContatoChange,
  onTelefoneChange,
  onDeleteLead,
}: LeadListProps) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [valorEdicao, setValorEdicao] = useState('');
  const [erroEdicao, setErroEdicao] = useState('');

  if (leads.length === 0) {
    return <p className="empty-state">Nenhum lead cadastrado ainda.</p>;
  }

  function handleExcluir(lead: Lead) {
    if (!onDeleteLead) return;
    const confirmou = window.confirm(`Excluir o lead ${lead.telefone}? Essa ação não pode ser desfeita.`);
    if (confirmou) onDeleteLead(lead.id);
  }

  function iniciarEdicao(lead: Lead) {
    setEditandoId(lead.id);
    setValorEdicao(lead.telefone);
    setErroEdicao('');
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setErroEdicao('');
  }

  function salvarEdicao(id: string) {
    if (!onTelefoneChange) return;
    const resultado = onTelefoneChange(id, valorEdicao.trim());
    if (!resultado.sucesso) {
      setErroEdicao(resultado.erro ?? 'Não foi possível salvar.');
      return;
    }
    setEditandoId(null);
    setErroEdicao('');
  }

  const temColunaAcoes = Boolean(onDeleteLead || onTelefoneChange);

  return (
    <table>
      <thead>
        <tr>
          <th>Telefone</th>
          <th>Origem</th>
          <th>Status</th>
          <th>Tipo</th>
          {temColunaAcoes && <th></th>}
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => {
          const precisaTipo = statusPrecisaTipoContato(lead.status);
          const estaEditando = editandoId === lead.id;

          return (
            <tr key={lead.id}>
              <td>
                {estaEditando ? (
                  <div className="edit-telefone">
                    <input
                      type="tel"
                      value={valorEdicao}
                      onChange={(e) => setValorEdicao(e.target.value)}
                      aria-label={`Editar telefone de ${lead.telefone}`}
                      autoFocus
                    />
                    {erroEdicao && <p className="field-error">{erroEdicao}</p>}
                  </div>
                ) : (
                  lead.telefone
                )}
              </td>
              <td>
                {onOrigemChange ? (
                  <select
                    value={lead.origem ?? ''}
                    onChange={(e) => onOrigemChange(lead.id, e.target.value as Origem)}
                    aria-label={`Origem do lead ${lead.telefone}`}
                    className={lead.origem ? undefined : 'select-pendente'}
                  >
                    <option value="" disabled>
                      Selecionar origem
                    </option>
                    {ORIGENS.map((origem) => (
                      <option key={origem} value={origem}>
                        {origem}
                      </option>
                    ))}
                  </select>
                ) : (
                  lead.origem ?? '—'
                )}
              </td>
              <td>
                {onStatusChange ? (
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                    aria-label={`Status do lead ${lead.telefone}`}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  lead.status
                )}
              </td>
              <td>
                {precisaTipo ? (
                  onTipoContatoChange ? (
                    <select
                      value={lead.tipoContato ?? ''}
                      onChange={(e) => onTipoContatoChange(lead.id, e.target.value as TipoContato)}
                      aria-label={`Tipo de contato do lead ${lead.telefone}`}
                      className={lead.tipoContato ? undefined : 'select-pendente'}
                    >
                      <option value="" disabled>
                        Selecionar
                      </option>
                      {TIPOS_CONTATO.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  ) : (
                    lead.tipoContato ?? '—'
                  )
                ) : (
                  '—'
                )}
              </td>
              {temColunaAcoes && (
                <td className="row-actions">
                  {onTelefoneChange &&
                    (estaEditando ? (
                      <>
                        <button type="button" className="btn-secondary" onClick={() => salvarEdicao(lead.id)}>
                          Salvar
                        </button>
                        <button type="button" className="btn-secondary" onClick={cancelarEdicao}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <button type="button" className="btn-secondary" onClick={() => iniciarEdicao(lead)}>
                        Editar
                      </button>
                    ))}
                  {onDeleteLead && !estaEditando && (
                    <button
                      type="button"
                      className="btn-delete"
                      onClick={() => handleExcluir(lead)}
                      aria-label={`Excluir lead ${lead.telefone}`}
                    >
                      Excluir
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}