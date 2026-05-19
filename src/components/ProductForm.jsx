import { useState } from "react";

const initialForm = {
  code: "",
  name: "",
  unit: "un",
  quantity: "",
  price: "",
  minStock: "",
};

export function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.code || !form.name || !form.quantity || !form.price) {
      alert("Preencha código, nome, quantidade e valor.");
      return;
    }

    onAddProduct({
      ...form,
      minStock: form.minStock || 0,
    });

    setForm(initialForm);
  }

  return (
    <section className="panel">
      <h2>Cadastrar produto</h2>

      <form className="form-grid" onSubmit={handleSubmit}>
        <input name="code" placeholder="Código" value={form.code} onChange={handleChange} />
        <input name="name" placeholder="Nome do produto" value={form.name} onChange={handleChange} />

        <select name="unit" value={form.unit} onChange={handleChange}>
          <option value="un">Unidade</option>
          <option value="kg">Kg</option>
          <option value="cx">Caixa</option>
          <option value="lt">Litro</option>
          <option value="m">Metro</option>
        </select>

        <input name="quantity" type="number" placeholder="Quantidade" value={form.quantity} onChange={handleChange} />
        <input name="price" type="number" placeholder="Valor unitário" value={form.price} onChange={handleChange} />
        <input name="minStock" type="number" placeholder="Estoque mínimo" value={form.minStock} onChange={handleChange} />

        <button type="submit">Adicionar produto</button>
      </form>
    </section>
  );
}
