import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

export function PricingCalculator() {
  const [form, setForm] = useState({
    cost: "",
    fixedCost: "",
    tax: "",
    cardFee: "",
    boletoFee: "",
    profit: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const result = useMemo(() => {
    const cost = Number(form.cost || 0);

    const totalPercent =
      Number(form.fixedCost || 0) +
      Number(form.tax || 0) +
      Number(form.cardFee || 0) +
      Number(form.boletoFee || 0) +
      Number(form.profit || 0);

    const divisor = 1 - totalPercent / 100;

    const finalPrice = divisor <= 0 ? 0 : cost / divisor;
    const profitValue = finalPrice * (Number(form.profit || 0) / 100);

    return {
      totalPercent,
      finalPrice,
      profitValue,
    };
  }, [form]);

  return (
    <section className="panel">
      <h2>Calculadora de precificação</h2>

      <div className="form-grid calculator-grid">
        <input
          name="cost"
          type="number"
          placeholder="Preço de custo"
          value={form.cost}
          onChange={handleChange}
        />

        <input
          name="fixedCost"
          type="number"
          placeholder="% custos fixos e variáveis"
          value={form.fixedCost}
          onChange={handleChange}
        />

        <input
          name="tax"
          type="number"
          placeholder="% imposto simples"
          value={form.tax}
          onChange={handleChange}
        />

        <input
          name="cardFee"
          type="number"
          placeholder="% taxa juros cartão"
          value={form.cardFee}
          onChange={handleChange}
        />

        <input
          name="boletoFee"
          type="number"
          placeholder="% taxa juros boleto"
          value={form.boletoFee}
          onChange={handleChange}
        />

        <input
          name="profit"
          type="number"
          placeholder="% lucro desejado"
          value={form.profit}
          onChange={handleChange}
        />
      </div>

      <div className="pricing-results">
        <div>
          <span>Total de percentuais</span>
          <strong>{result.totalPercent.toFixed(2)}%</strong>
        </div>

        <div>
          <span>Preço final de venda</span>
          <strong>{formatCurrency(result.finalPrice)}</strong>
        </div>

        <div>
          <span>Lucro estimado</span>
          <strong>{formatCurrency(result.profitValue)}</strong>
        </div>
      </div>
    </section>
  );
}
