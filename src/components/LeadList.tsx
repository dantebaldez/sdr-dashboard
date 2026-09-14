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
  onNotaChange?: (id: string, nota: string) => void;
  isLeadEditavel?: (lead: Lead) => boolean;
}

function IconeLapis() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeNota() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 10h6M9 14h6M9 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LeadList({
  leads,
  onStatusChange,
  onOrigemChange,
  onTipoContatoChange,
  onTelefoneChange,
  onDeleteLead,
  onNotaChange,
  isLeadEditavel,
}: LeadListProps) {
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [valorEdicao, setValorEdicao] = useState('');
  const [erroEdicao, setErroEdicao] = useState('');
  const [notaEditandoId, setNotaEditandoId] = useState<string | null>(null);
  const [valorNota, setValorNota] = useState('');

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

  function iniciarEdicaoNota(lead: Lead) {
    setNotaEditandoId(lead.id);
    setValorNota(lead.nota ?? '');
  }

  function cancelarEdicaoNota() {
    setNotaEditandoId(null);
  }

  function salvarNota(id: string) {
    onNotaChange?.(id, valorNota.trim());
    setNotaEditandoId(null);
  }

  const temAlgumaColunaAcoes = Boolean(onDeleteLead || onTelefoneChange || onNotaChange);

  return (
    <div className="lead-table-wrapper">
      <div className="lead-table" role="table">
        <div className="lead-table-header" role="row">
          <span role="columnheader">Telefone</span>
          <span role="columnheader">Origem</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Tipo</span>
          {temAlgumaColunaAcoes && <span role="columnheader" aria-label="Ações" />}
        </div>

        <div role="rowgroup">
          {leads.map((lead) => {
            const precisaTipo = statusPrecisaTipoContato(lead.status);
            const estaEditando = editandoId === lead.id;
            const editavel = isLeadEditavel ? isLeadEditavel(lead) : true;
            const temColunaAcoes = temAlgumaColunaAcoes && editavel;
            const temNota = Boolean(lead.nota);
            const editandoNota = notaEditandoId === lead.id;

            return (
              <div key={lead.id}>
                <div className="lead-row" role="row">
                  <div role="cell" className="lead-cell-phone">
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
                  </div>

                  <div role="cell">
                    {onOrigemChange && editavel ? (
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
                  </div>

                  <div role="cell">
                    {onStatusChange && editavel ? (
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
                  </div>

                  <div role="cell">
                    {precisaTipo ? (
                      onTipoContatoChange && editavel ? (
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
                  </div>

                  {temAlgumaColunaAcoes && (
                    <div role="cell" className="row-actions">
                      {onNotaChange && !estaEditando && (
                        <button
                          type="button"
                          className={`icon-btn ${temNota ? 'icon-btn-active' : ''}`}
                          onClick={() => (editandoNota ? cancelarEdicaoNota() : iniciarEdicaoNota(lead))}
                          aria-label={`Nota do lead ${lead.telefone}`}
                          title={temNota ? 'Ver/editar nota' : 'Adicionar nota'}
                        >
                          <IconeNota />
                        </button>
                      )}

                      {temColunaAcoes && !editandoNota && (
                        estaEditando ? (
                          <>
                            <button type="button" className="btn-secondary btn-compact" onClick={() => salvarEdicao(lead.id)}>
                              Salvar
                            </button>
                            <button type="button" className="btn-secondary btn-compact" onClick={cancelarEdicao}>
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            {onTelefoneChange && (
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => iniciarEdicao(lead)}
                                aria-label={`Editar lead ${lead.telefone}`}
                                title="Editar"
                              >
                                <IconeLapis />
                              </button>
                            )}
                            {onDeleteLead && (
                              <button
                                type="button"
                                className="icon-btn icon-btn-delete"
                                onClick={() => handleExcluir(lead)}
                                aria-label={`Excluir lead ${lead.telefone}`}
                                title="Excluir"
                              >
                                <IconeLixeira />
                              </button>
                            )}
                          </>
                        )
                      )}
                    </div>
                  )}
                </div>

                {editandoNota && (
									<div className="lead-note-editor">
										<label htmlFor={`nota-${lead.id}`}>Nota</label>
										<div className="lead-note-editor-row">
											<input
												id={`nota-${lead.id}`}
												type="text"
												value={valorNota}
												onChange={(e) => setValorNota(e.target.value)}
												placeholder="Ex: prefere contato à tarde"
												autoFocus
											/>
											<div className="lead-note-editor-actions">
												<button type="button" className="btn-secondary btn-compact" onClick={cancelarEdicaoNota}>
													Cancelar
												</button>
												<button type="button" className="btn-primary btn-compact" onClick={() => salvarNota(lead.id)}>
													Salvar
												</button>
											</div>
										</div>
									</div>
								)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}