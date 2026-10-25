export interface Member {
  id: number;
  email: string;
  name: string;
  mainRole: string; // '', 'Trainee' ou 'Membro'
  isModerador: boolean;
  photo: string;
}

export interface Componente {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  quantidade_minima: number;
  localizacao: string | null;
  descricao: string | null;
  created_at: string;
}

export type NovoComponente = Omit<Componente, "id" | "created_at">;

export type DiarioTipo = "falha" | "perda" | "observacao";

export interface DiarioEntry {
  id: number;
  titulo: string;
  texto: string;
  tipo: DiarioTipo;
  componente_id: number | null;
  componente_nome: string | null;
  quantidade_afetada: number;
  autor_nome: string | null;
  autor_email: string | null;
  autor_foto: string | null;
  created_at: string;
}

export type OrcamentoStatus = "pendente" | "aprovado" | "comprado" | "recusado";

export interface Orcamento {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  preco_unitario: number;
  fornecedor: string | null;
  link: string | null;
  status: OrcamentoStatus;
  estocado: boolean;
  solicitante_nome: string | null;
  created_at: string;
}

export type StatusEstoque = "falta" | "baixo" | "ok";
