export const TIPOS_COMPONENTE = [
  "Microcontrolador",
  "Sensor",
  "Módulo",
  "Bateria",
  "Conversor / Regulador",
  "Resistor",
  "Capacitor",
  "Semicondutor",
  "Cabo / Conector",
  "Display",
  "Ferramenta",
  "Outro",
];

export const CARGOS = ["Trainee", "Membro"] as const;

export const STATUS_ORCAMENTO = ["pendente", "aprovado", "comprado", "recusado"] as const;

export const TIPOS_DIARIO = [
  { id: "falha", label: "Falha" },
  { id: "perda", label: "Perda" },
  { id: "observacao", label: "Observação" },
] as const;
