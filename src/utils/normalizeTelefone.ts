export function soDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function normalizeTelefone(telefone: string): string {
  // tira o prefixo internacional (00) e o zero antes do DDD
  let digitos = soDigitos(telefone).replace(/^0+/, '');

  // tira o código do país (55) quando o número está completo
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith('55')) {
    digitos = digitos.slice(2);
  }

  // número nacional completo: DDD (2) + 8 ou 9 dígitos
  if (digitos.length === 10 || digitos.length === 11) {
    const ddd = digitos.slice(0, 2);
    let assinante = digitos.slice(2);

    // celular escrito sem o 9: adiciona
    if (assinante.length === 8 && /^[6-9]/.test(assinante)) {
      assinante = `9${assinante}`;
    }

    return `55${ddd}${assinante}`;
  }

  return digitos;
}

export function telefoneValido(telefone: string): boolean {
  const n = normalizeTelefone(telefone);
  return n.startsWith('55') && (n.length === 12 || n.length === 13);
}

export function formatTelefone(telefone: string): string {
  const n = normalizeTelefone(telefone);

  if (n.length === 13 && n.startsWith('55')) {
    return `+55 ${n.slice(2, 4)} ${n.slice(4, 9)}-${n.slice(9)}`;
  }
  if (n.length === 12 && n.startsWith('55')) {
    return `+55 ${n.slice(2, 4)} ${n.slice(4, 8)}-${n.slice(8)}`;
  }
  return telefone;
}

// usada na busca: aceita número completo (com ou sem o 9) ou só um pedaço dele
export function telefoneCorresponde(telefoneDoLead: string, busca: string): boolean {
  const digitosBusca = soDigitos(busca);
  if (!digitosBusca) return false;

  const lead = normalizeTelefone(telefoneDoLead);
  const buscaNormalizada = normalizeTelefone(busca);

  return (
    lead.includes(digitosBusca) ||
    (buscaNormalizada !== '' && lead.includes(buscaNormalizada))
  );
}