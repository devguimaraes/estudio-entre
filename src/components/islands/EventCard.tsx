import { useState } from "react";
import type { EventoCard } from "@/types/evento";
import { CATEGORIAS } from "@/utils/categorias";
import styles from "./EventCard.module.css";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface EventCardProps {
  evento: EventoCard;
  destaque?: boolean;
}

export default function EventCard({ evento, destaque = false }: EventCardProps) {
  const cat = CATEGORIAS[evento.categoria];
  const imagens = evento.imagens ?? [];
  const [currentImg, setCurrentImg] = useState(0);
  const hasMultiple = imagens.length > 1;

  return (
    <div
      data-event-card
      className={`${styles.card} ${destaque ? styles["card--destaque"] : ""}`}
    >
      <div className={styles.flipper}>
        {/* Frente */}
        <div className={styles.front}>
          <div className={styles.imageWrapper}>
            {imagens.length > 0 && (
              <img
                className={styles.image}
                src={`${imagens[currentImg]}?w=960&h=768&fit=crop&auto=format`}
                alt={evento.titulo}
                loading="lazy"
                width={960}
                height={768}
              />
            )}
            <span
              className={styles.badge}
              style={{ backgroundColor: cat.color }}
            >
              {cat.label}
            </span>
            {hasMultiple && (
              <div className={styles.dots}>
                {imagens.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    className={`${styles.dot} ${i === currentImg ? styles["dot--active"] : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImg(i);
                    }}
                    aria-label={`Imagem ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>{evento.titulo}</h3>
            <p className={styles.date}>{formatDate(evento.dataHora)}</p>
            {evento.local && <p className={styles.local}>{evento.local}</p>}
          </div>
        </div>

        {/* Verso */}
        <div className={styles.back}>
          {evento.descricao && (
            <p className={styles.description}>{evento.descricao}</p>
          )}
          {evento.valor && <p className={styles.price}>{evento.valor}</p>}
          {evento.linkCompra && (
            <a
              href={evento.linkCompra}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              Inscreva-se
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
