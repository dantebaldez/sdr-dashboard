import type { Lead } from '../types/lead';
import type { Semana } from '../types/semana';

export function leadEstaNaSemana(lead: Lead, semana: Semana): boolean {
  const inicio = new Date(semana.inicio);
  const fim = semana.fim ? new Date(semana.fim) : new Date();
  const criadoEm = new Date(lead.criadoEm);
  return criadoEm >= inicio && criadoEm < fim;
}