import { useState } from 'react';
import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';
import { generateReport } from '../utils/generateReport';

interface ReportViewProps {
  leads: Lead[];
  semana: Semana;
  onClose: () => void;
}

export function ReportView({ leads, semana, onClose }: ReportViewProps) {
  const [copiado, setCopiado] = useState(false);
  const relatorio = generateReport(leads, semana);

  async function handleCopy() {
    await navigator.clipboard.writeText(relatorio);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="report-panel">
      <div className="report-header">
        <h2>Relatório semanal</h2>
        <button className="btn-secondary" onClick={onClose}>
          Fechar
        </button>
      </div>
      <pre className="report-text">{relatorio}</pre>
      <button className="btn-primary" onClick={handleCopy}>
        {copiado ? 'Copiado!' : 'Copiar para área de transferência'}
      </button>
    </div>
  );
}