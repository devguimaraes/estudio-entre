import BorderGlow from "@/components/ui/BorderGlow";

export default function VisitacaoCard() {
  return (
    <BorderGlow
      backgroundColor="#3d1020"
      glowColor="236 104 56"
      borderRadius={16}
      glowRadius={60}
      glowIntensity={1.2}
      coneSpread={30}
      animateLoop
      colors={["#ec6838", "#f0ede8", "#3d1020"]}
      className="max-w-2xl mx-auto"
    >
      <div className="p-10 md:p-16 text-center">
        <h3 className="font-display font-bold text-lg md:text-xl text-cream mb-4 uppercase tracking-widest">
          Visitação Estúdio Entre
        </h3>
        <div className="w-12 h-[2px] bg-orange mx-auto mb-8" />
        <p className="font-display text-2xl md:text-3xl text-cream/90 leading-relaxed">
          Quarta a Sábado <br />
          <span className="text-orange font-bold">10h às 17h30</span>
        </p>
        <p className="mt-8 text-sm md:text-base text-cream/60 font-medium max-w-md mx-auto">
          Conheça de perto o hub cultural que está transformando o coração do Méier.
        </p>
      </div>
    </BorderGlow>
  );
}
