import AgendaFullFilter from "@/components/islands/agenda/AgendaFullFilter";
import AgendaPreviewGrid from "@/components/islands/agenda/AgendaPreviewGrid";
import type { EventoNormalizado } from "@/types/evento";

export interface AgendaIslandProps {
  mode: "preview" | "full";
  eventos: EventoNormalizado[];
}

/** Island unificada da Agenda — home (preview) e /agenda (full). */
export default function AgendaIsland({ mode, eventos }: AgendaIslandProps) {
  if (mode === "preview") {
    return <AgendaPreviewGrid eventos={eventos} />;
  }

  return <AgendaFullFilter eventos={eventos} />;
}
