import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

const ITEMS_PER_PAGE = 5;

export function ProductTable({
  products,
  onDeleteProduct,
  onRegisterMovement,
  onUpdateProduct,
}) {
  const [movement, setMovement] = useState({
    productId: "",
    type: "entrada",
    quantity: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    unit: "",
    quantity: "",
    price: "",
    minStock: "",
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.code.toLowerCase().includes(search.toLowerCase());

        const lowStock =
          Number(product.quantity) <= Number(product.minStock);

        return showLowStock ? matchesSearch && lowStock : matchesSearch;
      })
      .sort((a, b) => {
        const aValue =
          sortConfig.key === "total"
            ? Number(a.quantity) * Number(a.price)
            : a[sortConfig.key];

        const bValue =
          sortConfig.key === "total"
            ? Number(b.quantity) * Number(b.price)
            : b[sortConfig.key];

        if (typeof aValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
  }, [products, search, showLowStock, sortConfig]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  function changeSort(key) {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  function handleMovement(event) {
    event.preventDefault();

    if (!movement.productId || !movement.quantity) {
      alert("Selecione produto e quantidade.");
      return;
    }

    onRegisterMovement(movement.productId, movement.type, movement.quantity);

    setMovement({
      productId: "",
      type: "entrada",
      quantity: "",
    });
  }

  function startEdit(product) {
    setEditingId(product.id);

    setEditForm({
      code: product.code,
      name: product.name,
      unit: product.unit,
      quantity: product.quantity,
      price: product.price,
      minStock: product.minStock,
    });
  }

  function saveEdit(id) {
    onUpdateProduct({
      id,
      ...editForm,
    });

    setEditingId(null);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Produtos</h2>

        <form className="movement-form" onSubmit={handleMovement}>
          <select
            value={movement.productId}
            onChange={(e) =>
              setMovement((prev) => ({
                ...prev,
                productId: e.target.value,
              }))
            }
          >
            <option value="">Produto</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <select
            value={movement.type}
            onChange={(e) =>
              setMovement((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>

          <input
            type="number"
            placeholder="Qtd"
            value={movement.quantity}
            onChange={(e) =>
              setMovement((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />

          <button type="submit">Lançar</button>
        </form>
      </div>

      <div className="table-tools">
        <input
          placeholder="Buscar por nome ou código..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button
          onClick={() => {
            setShowLowStock((prev) => !prev);
            setPage(1);
          }}
          className={showLowStock ? "danger" : ""}
        >
          {showLowStock ? "Mostrando baixo estoque" : "Filtrar baixo estoque"}
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => changeSort("code")}>Código</th>
              <th onClick={() => changeSort("name")}>Produto</th>
              <th>Unidade</th>
              <th onClick={() => changeSort("quantity")}>Qtd</th>
              <th onClick={() => changeSort("price")}>Valor</th>
              <th onClick={() => changeSort("total")}>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((product) => {
              const isLow =
                Number(product.quantity) <= Number(product.minStock);

              const editing = editingId === product.id;

              return (
                <tr key={product.id}>
                  <td>
                    {editing ? (
                      <input
                        value={editForm.code}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      product.code
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      product.name
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        value={editForm.unit}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      product.unit
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            quantity: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>

                  <td>
                    {editing ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      formatCurrency(product.price)
                    )}
                  </td>

                  <td>
                    {formatCurrency(product.quantity * product.price)}
                  </td>

                  <td>
                    <span className={isLow ? "badge danger" : "badge success"}>
                      {isLow ? "Baixo" : "OK"}
                    </span>
                  </td>

                  <td className="actions">
                    {editing ? (
                      <button onClick={() => saveEdit(product.id)}>
                        Salvar
                      </button>
                    ) : (
                      <button onClick={() => startEdit(product)}>
                        Editar
                      </button>
                    )}

                    <button
                      className="ghost"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </button>
      </div>
    </section>
  );
}
