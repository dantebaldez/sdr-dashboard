import type { Semana } from '../types/semana';

interface WeekSelectorProps {
	semanas: Semana[];
	semanaSelecionadaId: string;
	onChange: (id: string) => void;
}

function formatarData(dataIso: string) {
	return new Date(dataIso).toLocaleDateString('pt-BR');
}

export function WeekSelector({ semanas, semanaSelecionadaId, onChange }: WeekSelectorProps) {
	const ordenadas = [...semanas].sort((a, b) => (a.inicio < b.inicio ? 1 : -1));

	return (
		<div className="form-field">
			<label htmlFor="semana">Semana</label>
			<select id="semana" value={semanaSelecionadaId} onChange={(e) => onChange(e.target.value)}>
				{ordenadas.map((semana) => (
					<option key={semana.id} value={semana.id}>
						{formatarData(semana.inicio)}
						{semana.fim ? ` – ${formatarData(semana.fim)}` : ' (semana atual)'}
					</option>
				))}
			</select>
		</div>
	);
}