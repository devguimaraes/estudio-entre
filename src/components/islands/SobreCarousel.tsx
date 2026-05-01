import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

const imagens = [
  { src: "/images/brand/apresentacao-estudio-entre.jpg", alt: "Espaço do Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-2.jpg", alt: "Thayná no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-3.jpg", alt: "Encontros no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-4.jpg", alt: "Valdete no Estúdio Entre" },
  { src: "/images/brand/apresentacao-estudio-entre-5.jpg", alt: "Detalhes do Estúdio Entre" },
];

export default function SobreCarousel() {
  const [api, setApi] = useState<ReturnType<typeof useRef<null>>>(null);
  const [current, setCurrent] = useState(0);
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="sobre__carousel relative">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
        }}
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {imagens.map((img, i) => (
            <CarouselItem
              key={img.src}
              className="pl-3 md:pl-4 basis-[70%] sm:basis-[55%] md:basis-[40%] lg:basis-[32%]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="block mt-3 text-[10px] uppercase tracking-widest text-[rgba(61,16,32,0.35)]">
                {String(i + 1).padStart(2, "0")} / {String(imagens.length).padStart(2, "0")}
              </span>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          className="bg-[#3d1020] text-[#f0ede8] border-none hover:bg-[#3d1020]/90"
          aria-label="Imagem anterior"
        />
        <CarouselNext
          className="bg-[#3d1020] text-[#f0ede8] border-none hover:bg-[#3d1020]/90"
          aria-label="Próxima imagem"
        />
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={`dot-${i}`}
            type="button"
            onClick={() => api?.scrollTo(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i === current ? "#3d1020" : "rgba(61,16,32,0.2)",
              transform: i === current ? "scale(1.3)" : "scale(1)",
            }}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
