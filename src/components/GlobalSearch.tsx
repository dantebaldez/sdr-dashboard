import { useState } from 'react';
import type { Lead } from '../types/lead';

interface GlobalSearchProps {
	leads: Lead[];
}

function formatarData(iso: string) {
	return new Date(iso).toLocaleDateString('pt-BR');
}

export function GlobalSearch({ leads }: GlobalSearchProps) {
	const [termo, setTermo] = useState('');
	const termoLimpo = termo.trim();

	const resultados = termoLimpo
		? leads.filter((lead) => lead.telefone.includes(termoLimpo))
		: [];

	return (
		<section className="global-search">
			<div className="search-field">
				<svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
					<line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
				</svg>
				<input
					type="search"
					value={termo}
					onChange={(e) => setTermo(e.target.value)}
					placeholder="Buscar lead por telefone"
					aria-label="Buscar lead por telefone"
				/>
			</div>

			{termoLimpo &&
				(resultados.length === 0 ? (
					<p className="empty-state">Nenhum lead encontrado com esse telefone.</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>Telefone</th>
								<th>Origem</th>
								<th>Status</th>
								<th>Cadastrado em</th>
							</tr>
						</thead>
						<tbody>
							{resultados.map((lead) => (
								<tr key={lead.id}>
									<td>{lead.telefone}</td>
									<td>{lead.origem}</td>
									<td>{lead.status}</td>
									<td>{formatarData(lead.criadoEm)}</td>
								</tr>
							))}
						</tbody>
					</table>
				))}
		</section>
	);
}