import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SummaryCards } from "./components/SummaryCards";
import { ProductForm } from "./components/ProductForm";
import { ProductTable } from "./components/ProductTable";
import { MovementHistory } from "./components/MovementHistory";
import { ChartsPanel } from "./components/ChartsPanel";
import { ExportActions } from "./components/ExportActions";
import { ToastContainer } from "./components/ToastContainer";
import { ConfirmModal } from "./components/ConfirmModal";
import { useInventory } from "./hooks/useInventory";
import { useToast } from "./hooks/useToast";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("inventory_theme") || "dark";
  });

const [resetModalOpen, setResetModalOpen] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);


  const { toasts, showToast } = useToast();

  const {
    products,
    movements,
    summary,
    addProduct,
    deleteProduct,
    registerMovement,
    updateProduct,
    resetData,
  } = useInventory();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("inventory_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    showToast("Tema atualizado.");
  }

  function handleResetData() {
    resetData();
    setResetModalOpen(false);
    showToast("Dados apagados com sucesso.");
  }

  function handleAddProduct(data) {
    addProduct(data);
    showToast("Produto cadastrado com sucesso.");
  }

  function handleDeleteProduct(id) {
  setProductToDelete(id);
  }

  function confirmDeleteProduct() { 
  deleteProduct(productToDelete);
  setProductToDelete(null);
  showToast("Produto excluído.");
  }


  function handleUpdateProduct(product) {
    updateProduct(product);
    showToast("Produto atualizado.");
  }

  function handleRegisterMovement(productId, type, quantity) {
    registerMovement(productId, type, quantity);
    showToast("Movimentação registrada.");
  }

  return (
    <div className="shell">
      <Sidebar
        theme={theme}
        onToggleTheme={toggleTheme}
        onResetData={() => setResetModalOpen(true)}
      />

      <main className="app">
        <Header />

        <section id="dashboard" className="page-section">
          <SummaryCards summary={summary} />
        </section>

        <section id="relatorios" className="page-section">
          <ExportActions
            products={products}
            movements={movements}
          />

          <ChartsPanel
            products={products}
            movements={movements}
          />
        </section>

        <section className="content-grid page-section">
          <ProductForm onAddProduct={handleAddProduct} />

          <section id="movimentacoes">
            <MovementHistory movements={movements} />
          </section>
        </section>

        <section id="produtos" className="page-section">
          <ProductTable
            products={products}
            onDeleteProduct={handleDeleteProduct}
            onRegisterMovement={handleRegisterMovement}
            onUpdateProduct={handleUpdateProduct}
          />
        </section>
      </main>

      <ToastContainer toasts={toasts} />

      <ConfirmModal
        open={resetModalOpen}
        title="Limpar todos os dados?"
        message="Essa ação apagará produtos e movimentações salvos neste navegador."
        onConfirm={handleResetData}
        onCancel={() => setResetModalOpen(false)}
      />
      <ConfirmModal
  open={!!productToDelete}
  title="Excluir produto?"
  message="Essa ação também removerá as movimentações desse produto."
  onConfirm={confirmDeleteProduct}
  onCancel={() => setProductToDelete(null)}
/>
    </div>
  );
}

