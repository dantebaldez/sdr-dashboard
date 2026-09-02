import { useState, type FormEvent } from 'react';
import { ORIGENS } from '../constants/leadOptions';
import type { Lead } from '../types/lead';

interface LeadFormProps {
	onAddLead: (lead: Lead) => void;
}

export function LeadForm({ onAddLead }: LeadFormProps) {
	const [nome, setNome] = useState('');
	const [origem, setOrigem] = useState<(typeof ORIGENS)[number]>(ORIGENS[0]);

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		if (!nome.trim()) return;

		onAddLead({
			id: crypto.randomUUID(),
			nome: nome.trim(),
			origem,
			status: 'Novo',
			criadoEm: new Date().toISOString(),
		});

		setNome('');
		setOrigem(ORIGENS[0]);
	}

	return (
		<form className="lead-form" onSubmit={handleSubmit}>
			<div className="form-field">
				<label htmlFor="nome">Número de Telefone do Lead</label>
				<input
					id="nome"
					type="text"
					value={nome}
					onChange={(e) => setNome(e.target.value)}
					placeholder="Telefone"
					required
				/>
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