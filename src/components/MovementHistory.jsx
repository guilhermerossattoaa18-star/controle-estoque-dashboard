import { formatCurrency, formatDate } from "../utils/formatters";

export function MovementHistory({ movements }) {
  return (
    <section className="panel">
      <h2>Histórico de movimentações</h2>

      <div className="history-list">
        {movements.length === 0 ? (
          <p className="empty">Nenhuma movimentação registrada.</p>
        ) : (
          movements.map((movement) => (
            <div className="history-item" key={movement.id}>
              <div>
                <strong>{movement.productName}</strong>
                <span>{formatDate(movement.date)}</span>
              </div>

              <div className="history-values">
                <span className={movement.type === "entrada" ? "in" : "out"}>
                  {movement.type === "entrada" ? "Entrada" : "Saída"}
                </span>
                <strong>
                  {movement.quantity} x {formatCurrency(movement.price)}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
