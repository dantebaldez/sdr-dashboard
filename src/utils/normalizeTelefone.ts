export function normalizeTelefone(telefone: string): string {
  const apenasDigitos = telefone.replace(/\D/g, '');
  
  // Se tem 13 dígitos (+55 + 11 dígitos), remove o +55
  if (apenasDigitos.startsWith('55') && apenasDigitos.length === 13) {
    return apenasDigitos.slice(2);
  }
  
  // Se tem 10 dígitos, adiciona um 9 após o DDD (padrão de celular)
  if (apenasDigitos.length === 10) {
    return apenasDigitos.slice(0, 2) + '9' + apenasDigitos.slice(2);
  }
  
  return apenasDigitos;
}