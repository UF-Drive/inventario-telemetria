import { MapPin, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import type { Componente } from "../../types";
import { ESTILO_STATUS, statusEstoque } from "../../utils/estoque";
import StatusBadge from "../ui/StatusBadge";

interface Props {
  item: Componente;
  podeEditar: boolean;
  podeExcluir: boolean;
  onAjustar: (delta: number) => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function ComponenteCard({ item, podeEditar, podeExcluir, onAjustar, onEditar, onExcluir }: Props) {
  const status = statusEstoque(item);
  const estilo = ESTILO_STATUS[status];
  const referencia = Math.max(item.quantidade_minima * 2, 1);
  const largura = Math.min(100, (item.quantidade / referencia) * 100);

  return (
    <div
      className={`card flex flex-col p-4 transition-all hover:shadow-lg ${
        status !== "ok" ? "border-red-500/40 dark:border-red-500/40" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold md:text-base" title={item.nome}>
            {item.nome}
          </h3>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-orange-500">{item.tipo}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="my-2 flex items-center justify-between">
        {podeEditar ? (
          <button
            onClick={() => onAjustar(-1)}
            disabled={item.quantidade <= 0}
            className="rounded-lg border border-gray-300 p-1.5 transition-all hover:bg-gray-100 active:scale-90 disabled:opacity-30 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Retirar 1"
          >
            <Minus size={16} />
          </button>
        ) : (
          <span />
        )}

        <div className="text-center">
          <span className={`text-3xl font-black tabular-nums ${estilo.text}`}>{item.quantidade}</span>
          <p className="text-[10px] font-bold uppercase text-gray-500">mín. {item.quantidade_minima}</p>
        </div>

        {podeEditar ? (
          <button
            onClick={() => onAjustar(1)}
            className="rounded-lg border border-gray-300 p-1.5 transition-all hover:bg-gray-100 active:scale-90 dark:border-gray-600 dark:hover:bg-gray-700"
            title="Adicionar 1"
          >
            <Plus size={16} />
          </button>
        ) : (
          <span />
        )}
      </div>

      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div className={`h-1.5 rounded-full transition-all ${estilo.bar}`} style={{ width: `${largura}%` }} />
      </div>

      {item.localizacao && (
        <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <MapPin size={12} className="mr-1 shrink-0" />
          <span className="truncate">{item.localizacao}</span>
        </p>
      )}
      {item.descricao && (
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400" title={item.descricao}>
          {item.descricao}
        </p>
      )}

      {(podeEditar || podeExcluir) && (
        <div className="mt-auto flex justify-end gap-1 pt-3">
          {podeEditar && (
            <button
              onClick={onEditar}
              className="rounded-lg p-2 text-blue-500 transition-all hover:bg-blue-500/10"
              title="Editar"
            >
              <Pencil size={16} />
            </button>
          )}
          {podeExcluir && (
            <button
              onClick={onExcluir}
              className="rounded-lg p-2 text-red-500 transition-all hover:bg-red-500/10"
              title="Apagar"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
