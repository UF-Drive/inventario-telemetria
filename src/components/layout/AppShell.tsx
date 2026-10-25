import { useState } from "react";
import type { TabId } from "../../config/tabs";
import { useData } from "../../hooks/useData";
import AlertasPage from "../../pages/AlertasPage";
import DiarioPage from "../../pages/DiarioPage";
import EquipePage from "../../pages/EquipePage";
import ImportExportPage from "../../pages/ImportExportPage";
import InventarioPage from "../../pages/InventarioPage";
import OrcamentoPage from "../../pages/OrcamentoPage";
import ResumoPage from "../../pages/ResumoPage";
import Header from "./Header";
import Sidebar from "./Sidebar";

const CHAVE_ABA = "inventario_aba";

function abaInicial(): TabId {
  try {
    return (localStorage.getItem(CHAVE_ABA) as TabId) || "Resumo";
  } catch {
    return "Resumo";
  }
}

export default function AppShell() {
  const { alertas } = useData();
  const [aba, setAba] = useState<TabId>(abaInicial);
  const [menuAberto, setMenuAberto] = useState(false);

  const trocarAba = (nova: TabId) => {
    setAba(nova);
    try {
      localStorage.setItem(CHAVE_ABA, nova);
    } catch {
      /* ignora */
    }
  };

  const pagina = () => {
    switch (aba) {
      case "Inventário":
        return <InventarioPage />;
      case "Alertas":
        return <AlertasPage />;
      case "Diário de Bordo":
        return <DiarioPage />;
      case "Orçamento":
        return <OrcamentoPage />;
      case "Importar/Exportar":
        return <ImportExportPage />;
      case "Equipe":
        return <EquipePage />;
      default:
        return <ResumoPage onIrPara={trocarAba} />;
    }
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden font-sans transition-colors duration-300">
      <Sidebar
        aberta={menuAberto}
        setAberta={setMenuAberto}
        abaAtiva={aba}
        onTrocar={trocarAba}
        qtdAlertas={alertas.length}
      />
      <main className="flex h-[100dvh] min-w-0 flex-1 flex-col overflow-hidden">
        <Header onAbrirMenu={() => setMenuAberto(true)} />
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-2 md:p-6">{pagina()}</div>
      </main>
    </div>
  );
}
