# Plano: Conversão de Imagens para WebP

## Objetivo
Converter todos os arquivos `.png` e `.jpg` existentes em `src/assets/images/` e `src/assets/textures/` para o formato `.webp`, mantendo uma performance ideal para web sem perda de qualidade visual.

## Impacto
Como o projeto está em fase de pré-lançamento e não há referências ativas a esses arquivos nos componentes (`src/components`, `src/pages`), a conversão será uma operação de "limpeza e preparação" segura.

## Estratégia de Implementação
1. Utilizar a biblioteca `sharp` (padrão industrial para processamento de imagem em Node.js).
2. Criar um script utilitário (`scripts/convert-images.js`) que processa recursivamente as pastas alvo.
3. Manter os arquivos originais em uma pasta de backup (ou apenas substituir, dado que o projeto é novo e o repositório está sob controle de versão) para garantir segurança. - VAMOS APENAS SUBSTITUIR, POIS O PROJETO AINDA ESTÁ EM FASE DE PLANEJAMENTO E NÃO HÁ REFERÊNCIAS ATIVAS A ESSES ARQUIVOS.  
4. Verificar a integridade dos arquivos convertidos antes de remover os originais.

## Passos da Execução
1. **Configuração**: Instalar `sharp` como dependência de desenvolvimento.
2. **Script**: Criar `scripts/convert-images.js` para iterar, converter e salvar as imagens como `.webp`.
3. **Verificação**: Executar o script, verificar se as novas imagens abrem corretamente.
4. **Finalização**: Remover arquivos `.png` e `.jpg` obsoletos após confirmação de sucesso.

## Verificação
- Comparar o tamanho dos arquivos originais vs. WebP.
- Abrir uma amostra aleatória de imagens WebP convertidas em um visualizador.

---
*Este plano está pronto para execução. Por favor, confirme se deseja prosseguir com a instalação do `sharp` e a criação do script.*
