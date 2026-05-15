# Design Spec: Carrossel Vertical 3D - Seção Sobre

**Data:** 2026-05-04  
**Status:** Aprovado  
**Tópico:** Substituição das imagens estáticas da seção "Sobre" por um carrossel 3D imersivo.

---

## 1. Objetivo
Criar uma experiência visual de alto impacto para a narrativa das fundadoras, utilizando um carrossel vertical com profundidade 3D que gira automaticamente, permitindo que a história do Estúdio Entre seja contada de forma fluida e dinâmica.

## 2. Abordagem Técnica
Utilizaremos **GSAP (GreenSock Animation Platform)** para orquestrar o movimento de rotação e **CSS 3D Transforms** (`preserve-3d`, `perspective`) para o posicionamento espacial dos cards.

### Arquitetura do Componente
- **Container Pai (`.sobre__carousel-container`):** Define a perspectiva 3D (`perspective: 1200px`).
- **Roda do Carrossel (`.sobre__carousel-wheel`):** O elemento que será rotacionado pelo GSAP no eixo X.
- **Itens (`.sobre__carousel-item`):** 5 cards contendo as imagens das fundadoras e detalhes, distribuídos radialmente em um cilindro virtual.
- **Máscaras de Borda Irregular:** Em vez de formas geométricas puras, cada imagem terá um recorte de "papel rasgado" via `clip-path` poligonal irregular, harmonizando com a estética de colagem da Hero Section.

## 3. Comportamento e Interação
- **Autoplay Contínuo:** O carrossel girará infinitamente em uma velocidade lenta e constante.
- **Pause on Hover:** Quando o mouse estiver sobre o carrossel, a rotação deve parar suavemente (usando GSAP `timeScale`).
- **Responsividade:**
    - **Desktop/Tablet:** Carrossel 3D completo.
    - **Mobile:** O carrossel será desativado, exibindo as imagens em um layout de grid editorial ou stack simples para preservar a performance e legibilidade.

## 4. Assets (Imagens)
O carrossel utilizará as seguintes imagens já mapeadas:
1. `fundadora-thayna.jpg`
2. `fundadora-valdete.jpg`
3. `fundadoras-encontro.jpg`
4. `fundadora-detalhe.jpg`
5. `detalhe-afeto.jpg`

## 5. Especificações de Animação
- **GSAP:** Rotação infinita via `gsap.to(wheel, { rotationX: "-=360", duration: 30, repeat: -1, ease: "none" })`.
- **Efeito de Foco:** O card que estiver na frente (Z-index/Z-translation positivo) pode ter um brilho ou escala levemente maior.

## 6. Critérios de Sucesso
- Movimento suave sem "jumps" no loop.
- Pausa imediata e elegante ao passar o mouse.
- Manutenção da legibilidade do texto "Sobre" que permanece à esquerda.
- Performance de 60fps em dispositivos desktop.
