import { useState } from "react";
import { supabase } from "../lib/supabase";

export function Auth({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else onAuth();
  }

  async function register() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Conta criada. Agora faça login.");
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <h1>Controle de Estoque</h1>
        <p>Entre para acessar seus dados na nuvem.</p>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
        <button type="button" className="ghost" onClick={register}>
          Criar conta
        </button>
      </form>
    </main>
  );
}
