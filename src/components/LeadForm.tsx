import { useState, type FormEvent } from 'react';
import { ORIGENS } from '../constants/leadOptions';
import type { Lead } from '../types/lead';

interface LeadFormProps {
	existingLeads: Lead[];
	onAddLead: (lead: Lead) => void;
}

export function LeadForm({ existingLeads, onAddLead }: LeadFormProps) {
	const [telefone, setTelefone] = useState('');
	const [origem, setOrigem] = useState<(typeof ORIGENS)[number]>(ORIGENS[0]);
	const [erro, setErro] = useState('');

	function handleSubmit(event: FormEvent) {
		event.preventDefault();
		const telefoneLimpo = telefone.trim();
		if (!telefoneLimpo) return;

		const jaExiste = existingLeads.some((lead) => lead.telefone === telefoneLimpo);
		if (jaExiste) {
			setErro('Esse número já foi cadastrado.');
			return;
		}

		onAddLead({
			id: crypto.randomUUID(),
			telefone: telefoneLimpo,
			origem,
			status: 'Novo',
			tipoContato: null,
			criadoEm: new Date().toISOString(),
		});

		setTelefone('');
		setOrigem(ORIGENS[0]);
		setErro('');
	}

	return (
		<form className="lead-form" onSubmit={handleSubmit}>
			<div className="form-field">
				<label htmlFor="telefone">Telefone</label>
				<input
					id="telefone"
					type="tel"
					value={telefone}
					onChange={(e) => {
						setTelefone(e.target.value);
						if (erro) setErro('');
					}}
					placeholder="Ex: (11) 91234-5678"
					required
				/>
				{erro && <p className="field-error">{erro}</p>}
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