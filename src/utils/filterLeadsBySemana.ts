import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

export function filterLeadsBySemana(leads: Lead[], semana: Semana): Lead[] {
  const inicio = new Date(semana.inicio);
  const fim = semana.fim ? new Date(semana.fim) : new Date();

  return leads
    .filter((lead) => {
      const criadoEm = new Date(lead.criadoEm);
      return criadoEm >= inicio && criadoEm < fim;
    })
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}