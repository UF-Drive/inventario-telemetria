import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Componente, DiarioEntry, Orcamento } from "../types";
import { statusEstoque } from "../utils/estoque";
import { useTabela, type Tabela } from "./useTabela";

interface DataCtx {
  componentes: Tabela<Componente>;
  diario: Tabela<DiarioEntry>;
  orcamentos: Tabela<Orcamento>;
  alertas: Componente[]; // itens em falta ou com estoque baixo
}

const Ctx = createContext<DataCtx | null>(null);

/** Carrega os dados uma única vez e compartilha entre todas as abas. */
export function DataProvider({ children }: { children: ReactNode }) {
  const componentes = useTabela<Componente>("componentes", "nome", true);
  const diario = useTabela<DiarioEntry>("diario", "created_at", false);
  const orcamentos = useTabela<Orcamento>("orcamentos", "created_at", false);

  const alertas = useMemo(
    () => componentes.itens.filter((c) => statusEstoque(c) !== "ok"),
    [componentes.itens],
  );

  return <Ctx.Provider value={{ componentes, diario, orcamentos, alertas }}>{children}</Ctx.Provider>;
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData precisa estar dentro de <DataProvider>");
  return ctx;
}
