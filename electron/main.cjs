const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: path.join(__dirname, '..', 'build', 'icon.png'),
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.cjs'),
		},
	});

	win.setMenuBarVisibility(false);
	win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// --- Integração com o Kommo CRM ---

async function kommoFetch(subdomain, token, caminho) {
	const url = `https://${subdomain}.kommo.com${caminho}`;
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Kommo respondeu ${response.status} ao chamar ${caminho}`);
	}
	if (response.status === 204) return null;
	return response.json();
}

ipcMain.handle('kommo:get-pipelines', async (_event, { subdomain, token }) => {
	const data = await kommoFetch(subdomain, token, '/api/v4/leads/pipelines');
	const pipelines = data?._embedded?.pipelines ?? [];

	const estagios = [];
	for (const pipeline of pipelines) {
		const statuses = pipeline._embedded?.statuses ?? [];
		for (const status of statuses) {
			estagios.push({
				id: String(status.id),
				nome: `${pipeline.name} — ${status.name}`,
			});
		}
	}
	return estagios;
});

ipcMain.handle('kommo:import-leads', async (_event, { subdomain, token }) => {
	const leadsEncontrados = [];
	let page = 1;
	const MAX_PAGINAS = 20; // limite de segurança (até 5000 leads)

	while (page <= MAX_PAGINAS) {
		const data = await kommoFetch(
			subdomain,
			token,
			`/api/v4/leads?with=contacts&page=${page}&limit=250`
		);

		const pageLeads = data?._embedded?.leads ?? [];
		if (pageLeads.length === 0) break;

		leadsEncontrados.push(...pageLeads);

		if (!data?._links?.next) break;
		page += 1;
	}

	const idsContatos = [
		...new Set(
			leadsEncontrados
				.flatMap((lead) => lead._embedded?.contacts ?? [])
				.map((contato) => contato.id)
		),
	];

	const telefonesPorContato = {};
	for (let i = 0; i < idsContatos.length; i += 250) {
		const lote = idsContatos.slice(i, i + 250);
		const query = lote.map((id) => `id[]=${id}`).join('&');
		const data = await kommoFetch(subdomain, token, `/api/v4/contacts?${query}&limit=250`);
		const contatos = data?._embedded?.contacts ?? [];

		for (const contato of contatos) {
			const campoTelefone = (contato.custom_fields_values ?? []).find(
				(campo) => campo.field_code === 'PHONE'
			);
			const telefone = campoTelefone?.values?.[0]?.value;
			if (telefone) {
				telefonesPorContato[contato.id] = telefone;
			}
		}
	}

	return leadsEncontrados.map((lead) => {
		const contatoId = lead._embedded?.contacts?.[0]?.id;
		return {
			telefone: contatoId ? telefonesPorContato[contatoId] ?? null : null,
			statusId: String(lead.status_id),
			criadoEm: new Date(lead.created_at * 1000).toISOString(),
		};
	});
});