# Spec: Redesign da Galeria "Nosso Espaço" - Estúdio Entre

## 1. Objetivo
Transformar a galeria "Nosso Espaço" (componente `Galeria.astro`) de um formato de "blobs" orgânicos para um estilo de "mural de fotos de papel rasgado". O objetivo é preservar a integridade visual das fotos de arquitetura e ambiente, eliminando cortes agressivos nos cantos, enquanto se mantém a estética artesanal e "handmade" do projeto.

## 2. Requisitos Visuais
- **Preservação do Conteúdo:** As imagens devem ser apresentadas de forma predominantemente retangular para evitar perda de detalhes arquitetônicos.
- **Efeito Papel Rasgado:** Cada imagem será envolvida por uma moldura branca com bordas irregulares (`clip-path` poligonal), simulando papel rasgado.
- **Profundidade e Textura:** Uso de `drop-shadow` suave e texturas de papel sutis para criar volume e realismo.
- **Imperfeição Orgânica:** Aplicação de rotações aleatórias leves (ex: -2deg a 2deg) em cada item da galeria para quebrar a simetria perfeita.
- **Cores Originais:** Remoção definitiva de filtros de escala de cinza (grayscale); as fotos devem ser exibidas em suas cores vibrantes originais.

## 3. Arquitetura Técnica

### 3.1 Novos Componentes / UI
- **`TornPaperFrame.astro`**: Componente wrapper que encapsula a lógica de moldura branca + clip-path irregular + sombra.
  - **Props:** `variant` (1 a 4 para diferentes tipos de rasgo), `rotation` (ângulo opcional).
  - **CSS:** Utilização de `clip-path: polygon(...)` para as bordas e `filter: drop-shadow(...)` para a profundidade.

### 3.2 Atualização no Componente `Galeria.astro`
- Substituição do `BlobMask` pelo novo `TornPaperFrame`.
- Ajuste das dimensões base: `450px` de largura (desktop) e `600px` de altura fixa para garantir aspecto vertical consistente.
- Manutenção do sistema de marquee (carrossel infinito) com velocidade ajustada para 21 imagens.

### 3.3 Ativos (Imagens)
- Utilização das 21 imagens WebP otimizadas e com orientação EXIF corrigida na pasta `/images/espaco/`.

## 4. Plano de Verificação
- **Responsividade:** Validar se a altura fixa de 400px (mobile) e 600px (desktop) não causa cortes indesejados em diferentes resoluções.
- **Carregamento:** Verificar se o lazy loading está funcionando corretamente para as 21 imagens.
- **Performance:** Monitorar o impacto das múltiplas sombras (`drop-shadow`) na performance do marquee (especialmente em mobile).
- **Fidelidade Visual:** Comparar o resultado final com as fotos originais para garantir que nenhum detalhe importante foi omitido pelas novas bordas.

## 5. Próximos Passos
- Implementar o componente `TornPaperFrame`.
- Refatorar `Galeria.astro`.
- Validar visualmente via browser automation.
