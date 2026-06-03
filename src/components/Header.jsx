export function Header() {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">Controle de Estoque</p>
        <h1>Dashboard de Estoque</h1>
      </div>

<button
  className="mobile-menu-btn"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</button>
      <span className="status">Online</span>
    </header>
  );
}
