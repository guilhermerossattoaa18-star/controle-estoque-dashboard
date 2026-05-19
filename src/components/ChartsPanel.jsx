import { formatCurrency } from "../utils/formatters";

export function ChartsPanel({ products, movements }) {
  const topProducts = [...products]
    .sort((a, b) => b.quantity * b.price - a.quantity * a.price)
    .slice(0, 5);

  const lowStockProducts = [...products]
    .filter((p) => Number(p.quantity) <= Number(p.minStock))
    .slice(0, 5);

  const entradas = movements.filter((m) => m.type === "entrada").length;
  const saidas = movements.filter((m) => m.type === "saida").length;
  const totalMovements = entradas + saidas || 1;

  return (
    <section className="charts-grid">
      <div className="panel">
        <h2>Valor por produto</h2>

        <div className="bar-list">
          {topProducts.map((product) => {
            const value = product.quantity * product.price;
            const max = Math.max(...topProducts.map((p) => p.quantity * p.price), 1);
            const percent = (value / max) * 100;

            return (
              <div className="bar-item" key={product.id}>
                <div className="bar-info">
                  <span>{product.name}</span>
                  <strong>{formatCurrency(value)}</strong>
                </div>

                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel">
        <h2>Movimentações</h2>

        <div className="donut-wrap">
          <div
            className="donut"
            style={{
              background: `conic-gradient(#22c55e 0 ${(entradas / totalMovements) * 100}%, #ef4444 0 100%)`,
            }}
          />

          <div className="legend">
            <span><b className="dot in-dot" /> Entradas: {entradas}</span>
            <span><b className="dot out-dot" /> Saídas: {saidas}</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Produtos críticos</h2>

        <div className="critical-list">
          {lowStockProducts.length === 0 ? (
            <p className="empty">Nenhum produto em baixo estoque.</p>
          ) : (
            lowStockProducts.map((product) => (
              <div className="critical-item" key={product.id}>
                <strong>{product.name}</strong>
                <span>
                  {product.quantity} {product.unit} / mínimo {product.minStock}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
