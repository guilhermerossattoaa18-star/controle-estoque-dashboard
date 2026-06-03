export function Sidebar({ theme, onToggleTheme, onResetData, onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="brand">
          <div className="brand-icon">CE</div>
          <div>
            <strong>Controle Estoque</strong>
            <span>Dashboard</span>
          </div>
        </div>

<aside className={`sidebar ${menuOpen ? "open" : ""}`}></aside>

        <nav className="nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#produtos">Produtos</a>
          <a href="#movimentacoes">Movimentações</a>
          <a href="#relatorios">Relatórios</a>
        </nav>
      </div>

      <div className="sidebar-actions">
        <button onClick={onToggleTheme}>
          {theme === "dark" ? "Tema claro" : "Tema escuro"}
        </button>

        <button className="ghost" onClick={onResetData}>
          Limpar dados
        </button>
        <button className="ghost" onClick={onLogout}>
  Sair
</button>
      </div>
    </aside>
  );
}
