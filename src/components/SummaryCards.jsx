import { formatCurrency } from "../utils/formatters";

export function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      <div className="card">
        <span>Produtos</span>
        <strong>{summary.totalProducts}</strong>
      </div>

      <div className="card">
        <span>Quantidade total</span>
        <strong>{summary.totalQuantity}</strong>
      </div>

      <div className="card">
        <span>Valor em estoque</span>
        <strong>{formatCurrency(summary.totalValue)}</strong>
      </div>

      <div className="card danger">
        <span>Baixo estoque</span>
        <strong>{summary.lowStock}</strong>
      </div>
    </section>
  );
}
