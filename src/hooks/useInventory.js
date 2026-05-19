import { useEffect, useMemo, useState } from "react";
import { initialMovements, initialProducts } from "../data/initialData";

const PRODUCTS_KEY = "inventory_products";
const MOVEMENTS_KEY = "inventory_movements";

export function useInventory() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [movements, setMovements] = useState(() => {
    const saved = localStorage.getItem(MOVEMENTS_KEY);
    return saved ? JSON.parse(saved) : initialMovements;
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  }, [movements]);

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity), 0);
    const totalValue = products.reduce(
      (sum, p) => sum + Number(p.quantity) * Number(p.price),
      0
    );
    const lowStock = products.filter(
      (p) => Number(p.quantity) <= Number(p.minStock)
    ).length;

    return { totalProducts, totalQuantity, totalValue, lowStock };
  }, [products]);

  function addProduct(data) {
    const product = {
      id: crypto.randomUUID(),
      code: data.code,
      name: data.name,
      unit: data.unit,
      quantity: Number(data.quantity),
      price: Number(data.price),
      minStock: Number(data.minStock),
    };

    setProducts((prev) => [product, ...prev]);
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    setMovements((prev) => prev.filter((movement) => movement.productId !== id));
  }

  function registerMovement(productId, type, quantity) {
    const product = products.find((item) => item.id === productId);

    if (!product) return;

    const amount = Number(quantity);

    if (type === "saida" && Number(product.quantity) < amount) {
      alert("Estoque insuficiente.");
      return;
    }

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity:
                type === "entrada"
                  ? Number(item.quantity) + amount
                  : Number(item.quantity) - amount,
            }
          : item
      )
    );

    const movement = {
      id: crypto.randomUUID(),
      productId,
      productName: product.name,
      type,
      quantity: amount,
      price: Number(product.price),
      date: new Date().toISOString(),
    };

    setMovements((prev) => [movement, ...prev]);
  }

  function updateProduct(updatedProduct) {
  setProducts((prev) =>
    prev.map((product) =>
      product.id === updatedProduct.id
        ? {
            ...product,
            ...updatedProduct,
            quantity: Number(updatedProduct.quantity),
            price: Number(updatedProduct.price),
            minStock: Number(updatedProduct.minStock),
          }
        : product
    )
  );
}
function resetData() {
  setProducts([]);
  setMovements([]);
  localStorage.removeItem(PRODUCTS_KEY);
  localStorage.removeItem(MOVEMENTS_KEY);
}


  return {
    products,
    movements,
    summary,
    addProduct,
    deleteProduct,
    registerMovement,
    updateProduct,
    resetData,
  };
}
