export function normalizeTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}