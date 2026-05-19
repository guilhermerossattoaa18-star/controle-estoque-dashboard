import { exportToCsv } from "../utils/exportCsv";

export function ExportActions({ products, movements }) {
  function exportProducts() {
    const rows = products.map((product) => ({
      codigo: product.code,
      nome: product.name,
      unidade: product.unit,
      quantidade: product.quantity,
      valor_unitario: product.price,
      valor_total: product.quantity * product.price,
      estoque_minimo: product.minStock,
    }));

    exportToCsv("produtos.csv", rows);
  }

  function exportMovements() {
    const rows = movements.map((movement) => ({
      produto: movement.productName,
      tipo: movement.type,
      quantidade: movement.quantity,
      valor_unitario: movement.price,
      valor_total: movement.quantity * movement.price,
      data: new Date(movement.date).toLocaleString("pt-BR"),
    }));

    exportToCsv("movimentacoes.csv", rows);
  }

  return (
    <section className="export-actions">
      <button onClick={exportProducts}>Exportar produtos</button>
      <button onClick={exportMovements}>Exportar histórico</button>
    </section>
  );
}
