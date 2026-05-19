import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export function useInventory() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  async function getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }

  async function loadProducts() {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .order("id", { ascending: false });

    setProducts(
      (data || []).map((p) => ({
        id: p.id,
        code: p.codigo,
        name: p.nome,
        unit: p.unidade,
        quantity: Number(p.quantidade),
        price: Number(p.valor_unitario),
        minStock: Number(p.estoque_minimo),
      }))
    );
  }

  async function loadMovements() {
    const { data } = await supabase
      .from("movimentacoes")
      .select(`
        id,
        produto_id,
        tipo,
        quantidade,
        valor_unitario,
        created_at,
        produtos ( nome )
      `)
      .order("id", { ascending: false });

    setMovements(
      (data || []).map((m) => ({
        id: m.id,
        productId: m.produto_id,
        productName: m.produtos?.nome || "Produto removido",
        type: m.tipo,
        quantity: Number(m.quantidade),
        price: Number(m.valor_unitario),
        date: m.created_at,
      }))
    );
  }

  useEffect(() => {
    loadProducts();
    loadMovements();
  }, []);

  const summary = useMemo(() => {
    return {
      totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
      totalValue: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
      lowStock: products.filter((p) => p.quantity <= p.minStock).length,
    };
  }, [products]);

  async function addProduct(product) {
    const user = await getUser();

    await supabase.from("produtos").insert([
      {
        user_id: user.id,
        codigo: product.code,
        nome: product.name,
        unidade: product.unit,
        quantidade: Number(product.quantity),
        valor_unitario: Number(product.price),
        estoque_minimo: Number(product.minStock || 0),
      },
    ]);

    await loadProducts();
  }

  async function deleteProduct(id) {
    await supabase.from("produtos").delete().eq("id", id);
    await loadProducts();
    await loadMovements();
  }

  async function updateProduct(product) {
    await supabase
      .from("produtos")
      .update({
        codigo: product.code,
        nome: product.name,
        unidade: product.unit,
        quantidade: Number(product.quantity),
        valor_unitario: Number(product.price),
        estoque_minimo: Number(product.minStock || 0),
      })
      .eq("id", product.id);

    await loadProducts();
  }

  async function registerMovement(productId, type, quantity) {
    const user = await getUser();
    const product = products.find((item) => String(item.id) === String(productId));

    if (!product) return;

    const amount = Number(quantity);

    if (type === "saida" && product.quantity < amount) {
      alert("Estoque insuficiente.");
      return;
    }

    const newQuantity =
      type === "entrada"
        ? product.quantity + amount
        : product.quantity - amount;

    await supabase
      .from("produtos")
      .update({ quantidade: newQuantity })
      .eq("id", product.id);

    await supabase.from("movimentacoes").insert([
      {
        user_id: user.id,
        produto_id: product.id,
        tipo: type,
        quantidade: amount,
        valor_unitario: product.price,
      },
    ]);

    await loadProducts();
    await loadMovements();
  }

  async function resetData() {
    await supabase.from("movimentacoes").delete().neq("id", 0);
    await supabase.from("produtos").delete().neq("id", 0);

    await loadProducts();
    await loadMovements();
  }

  return {
    products,
    movements,
    summary,
    addProduct,
    deleteProduct,
    updateProduct,
    registerMovement,
    resetData,
  };
}
