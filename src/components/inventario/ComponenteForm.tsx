import { useState } from "react";
import type { Componente, NovoComponente } from "../../types";
import { TIPOS_COMPONENTE } from "../../utils/constants";
import Modal from "../ui/Modal";

interface Props {
  inicial?: Componente | null;
  tiposExtras: string[];
  onSalvar: (dados: NovoComponente) => Promise<boolean>;
  onFechar: () => void;
}

export default function ComponenteForm({ inicial, tiposExtras, onSalvar, onFechar }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [tipo, setTipo] = useState(inicial?.tipo ?? TIPOS_COMPONENTE[0]);
  const [quantidade, setQuantidade] = useState(String(inicial?.quantidade ?? 0));
  const [minima, setMinima] = useState(String(inicial?.quantidade_minima ?? 0));
  const [localizacao, setLocalizacao] = useState(inicial?.localizacao ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [salvando, setSalvando] = useState(false);

  const todosTipos = Array.from(new Set([...TIPOS_COMPONENTE, ...tiposExtras]));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    const ok = await onSalvar({
      nome: nome.trim(),
      tipo: tipo.trim() || "Outro",
      quantidade: Math.max(0, parseInt(quantidade) || 0),
      quantidade_minima: Math.max(0, parseInt(minima) || 0),
      localizacao: localizacao.trim() || null,
      descricao: descricao.trim() || null,
    });
    setSalvando(false);
    if (ok) onFechar();
  };

  return (
    <Modal titulo={inicial ? "Editar componente" : "Novo componente"} onFechar={onFechar}>
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label className="label">Nome *</label>
          <input
            className="input"
            required
            autoFocus
            placeholder="Ex: ESP32 DevKit V1"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Tipo (escolha ou digite um novo)</label>
          <input className="input" list="lista-tipos" value={tipo} onChange={(e) => setTipo(e.target.value)} />
          <datalist id="lista-tipos">
            {todosTipos.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Quantidade</label>
            <input
              className="input"
              type="number"
              min={0}
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Mínimo (alerta)</label>
            <input
              className="input"
              type="number"
              min={0}
              value={minima}
              onChange={(e) => setMinima(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Localização</label>
          <input
            className="input"
            placeholder="Ex: Armário 2 · Gaveta B"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Descrição / observações</label>
          <textarea
            className="input resize-none"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onFechar} className="btn-ghost flex-1">
            Cancelar
          </button>
          <button type="submit" disabled={salvando} className="btn-primary flex-1">
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
