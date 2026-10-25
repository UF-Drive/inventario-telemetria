import { useMemo, useState } from "react";
import { Package, Plus, Search } from "lucide-react";
import ComponenteCard from "../components/inventario/ComponenteCard";
import ComponenteForm from "../components/inventario/ComponenteForm";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { Componente, NovoComponente, StatusEstoque } from "../types";
import { TIPOS_COMPONENTE } from "../utils/constants";
import { statusEstoque } from "../utils/estoque";

export default function InventarioPage() {
  const { componentes } = useData();
  const { podeEditar, podeExcluir } = useAuth();
  const { toast } = useToast();

  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [statusFiltro, setStatusFiltro] = useState<"todos" | StatusEstoque>("todos");
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Componente | null>(null);

  // Tipos: os padrões + qualquer tipo novo que apareceu (cadastro manual ou importação)
  const tiposExtras = useMemo(
    () => Array.from(new Set(componentes.itens.map((c) => c.tipo))).filter((t) => !TIPOS_COMPONENTE.includes(t)),
    [componentes.itens],
  );
  const tiposPresentes = useMemo(
    () => Array.from(new Set(componentes.itens.map((c) => c.tipo))).sort((a, b) => a.localeCompare(b)),
    [componentes.itens],
  );

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return componentes.itens.filter((c) => {
      if (tipoFiltro !== "Todos" && c.tipo !== tipoFiltro) return false;
      if (statusFiltro !== "todos" && statusEstoque(c) !== statusFiltro) return false;
      if (!termo) return true;
      return [c.nome, c.tipo, c.localizacao, c.descricao].some((v) => v?.toLowerCase().includes(termo));
    });
  }, [componentes.itens, busca, tipoFiltro, statusFiltro]);

  const salvar = async (dados: NovoComponente) => {
    const ok = editando ? await componentes.atualizar(editando.id, dados) : await componentes.criar(dados);
    if (ok) toast(editando ? "Componente atualizado!" : "Componente cadastrado!");
    return ok;
  };

  const excluir = async (c: Componente) => {
    if (!window.confirm(`Apagar "${c.nome}" do inventário?`)) return;
    if (await componentes.remover(c.id)) toast("Componente apagado.", "aviso");
  };

  const contagemPorTipo = (tipo: string) => componentes.itens.filter((c) => c.tipo === tipo).length;

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl min-h-0 animate-fade-in flex-col">
      <PageHeader
        icone={Package}
        cor="orange"
        titulo="Inventário"
        subtitulo="Componentes eletrônicos disponíveis no galpão."
        acao={
          podeEditar && (
            <button
              onClick={() => {
                setEditando(null);
                setFormAberto(true);
              }}
              className="btn-primary"
            >
              <Plus size={18} /> Novo componente
            </button>
          )
        }
      />

      {/* Filtros */}
      <div className="mb-4 flex shrink-0 flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-10"
              placeholder="Buscar por nome, localização, descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <select
            className="input sm:w-52"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as typeof statusFiltro)}
          >
            <option value="todos">Todos os status</option>
            <option value="ok">OK</option>
            <option value="baixo">Estoque baixo</option>
            <option value="falta">Em falta</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {["Todos", ...tiposPresentes].map((t) => (
            <button
              key={t}
              onClick={() => setTipoFiltro(t)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-all ${
                tipoFiltro === t
                  ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {t}
              {t !== "Todos" && <span className="ml-1.5 opacity-70">{contagemPorTipo(t)}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="min-h-0 flex-1 overflow-y-auto pb-4 pr-1">
        {componentes.loading ? (
          <Spinner />
        ) : filtrados.length === 0 ? (
          <EmptyState
            icone={Package}
            texto={componentes.itens.length === 0 ? "Nenhum componente cadastrado ainda." : "Nada encontrado com esses filtros."}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtrados.map((c) => (
              <ComponenteCard
                key={c.id}
                item={c}
                podeEditar={podeEditar}
                podeExcluir={podeExcluir}
                onAjustar={(delta) => void componentes.atualizar(c.id, { quantidade: Math.max(0, c.quantidade + delta) })}
                onEditar={() => {
                  setEditando(c);
                  setFormAberto(true);
                }}
                onExcluir={() => void excluir(c)}
              />
            ))}
          </div>
        )}
      </div>

      {formAberto && (
        <ComponenteForm
          inicial={editando}
          tiposExtras={tiposExtras}
          onSalvar={salvar}
          onFechar={() => setFormAberto(false)}
        />
      )}
    </div>
  );
}
