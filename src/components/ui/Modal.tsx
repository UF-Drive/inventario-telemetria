import { useEffect, type ReactNode } from "react";

interface Props {
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  largura?: string; // ex: "max-w-lg"
}

export default function Modal({ titulo, onFechar, children, largura = "max-w-lg" }: Props) {
  useEffect(() => {
    const aoApertar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoApertar);
    return () => window.removeEventListener("keydown", aoApertar);
  }, [onFechar]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex animate-fade-in items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={onFechar}
    >
      <div
        className={`card max-h-[90vh] w-full ${largura} overflow-y-auto p-6 shadow-2xl md:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-xl font-bold">{titulo}</h3>
        {children}
      </div>
    </div>
  );
}
