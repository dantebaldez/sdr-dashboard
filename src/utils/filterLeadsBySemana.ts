import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

export function filterLeadsBySemana(leads: Lead[], semana: Semana): Lead[] {
  const inicio = new Date(semana.inicio);
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date(semana.fim ? new Date(semana.fim) : new Date());
  fim.setHours(23, 59, 59, 999);

  return leads
    .filter((lead) => {
      const criadoEm = new Date(lead.criadoEm);
      return criadoEm >= inicio && criadoEm <= fim;
    })
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}