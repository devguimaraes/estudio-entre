export function formatPreco(valor: number | null): string {
  return valor === null ? "—" : `R$${valor}`;
}
