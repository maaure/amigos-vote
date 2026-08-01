# Design System — Tribunal do Dia

> Instruções para agentes de IA (e humanos) entenderem e continuarem a identidade visual do projeto **sem descaracterizá-la**.

## 1. Conceito

Todo dia é um **julgamento**. A pergunta do dia é a **acusação**, os amigos são **réus/suspeitos**, o mais votado é o **Culpado do Dia**, o histórico é o **arquivo de vereditos**.

A estética é de **tabloide + cartaz de procurado**: tipografia condensada pesada, carimbo de tinta vermelha, textura de papel/jornal, molduras dramáticas de tinta, avatares em preto-e-branco (grayscale). Nada de cantos arredondados, gradientes suaves, glows ou glassmorphism — isso é proibido aqui.

O contraste é a graça: superfície de papel envelhecido, mas a cópia é de tribunal mesmo ("Acuse o suspeito", "Proclamar veredito", "Júri em sessão").

## 2. Arquivos-fonte da verdade

| O que | Onde |
|---|---|
| Tokens de cor, tipografia, utilitários, keyframes | `src/app/(pages)/globals.css` |
| Fontes carregadas | `src/app/(pages)/layout.tsx` (Anton, Hanken Grotesk, Space Mono) |
| Componentes visuais | `src/components/visual/` (Kicker, Stamp, Marquee) |
| Shell de página | `src/components/layout/PageShell.tsx` |
| Tokens utilitários compartilhados | `src/lib/utils.ts` (`cn`, `getInitials`) |

**Regra: nunca hardcode cor, fonte ou raio em componente. Sempre via tokens/utilitários do globals.css.**

## 3. Tokens de cor

### Light (tabloide diurno)

| Token | Hex | Uso |
|---|---|---|
| `--background` | `#e8dec6` | jornal envelhecido (fundo da página) |
| `--paper` | `#f5eeda` | a folha / superfície de card |
| `--foreground` | `#1c1714` | tinta preta quente (texto) |
| `--primary` | `#1c1714` | botão principal = tinta |
| `--highlight` | `#bf2a26` | vermelho de carimbo (ACUSAÇÃO, Culpado) |
| `--gold` | `#a9760f` | troféu / vencedor |
| `--rule` | `#1c1714` | filete de tinta pesado (bordas fortes) |
| `--muted-foreground` | `#7a6d4d` | texto secundário |
| `--border` | `#cdbf9b` | riso leve |
| `--radius` | `0.125rem` | cantos quase retos = cartaz |

### Dark (noir / tribunal noturno)

| Token | Hex |
|---|---|
| `--background` | `#14110d` |
| `--paper` | `#1e1812` |
| `--foreground` | `#efe6cc` |
| `--primary` | `#efe6cc` (creme sobre tinta) |
| `--highlight` | `#ef4650` |
| `--gold` | `#e6b54a` |
| `--rule` | `#efe6cc` |

Todos os tokens são mapeados em `@theme inline` → classes `bg-background`, `bg-paper`, `text-highlight`, `border-rule`, `bg-gold`, etc. **Use `paper` para superfícies de card, `background` para o fundo da página — são diferentes de propósito.**

## 4. Tipografia — três papéis

| Papel | Fonte | Classe/token | Uso |
|---|---|---|---|
| **Display (masthead)** | Anton (condensada, só weight 400) | `masthead` + `font-display` | Títulos, perguntas, números grandes, palavras-pôster |
| **Corpo** | Hanken Grotesk | `--font-sans` (padrão do body) | Texto corrente, labels de form |
| **Mono (dados/etiqueta)** | Space Mono | `font-mono` | Datas, códigos, kickers, contadores, legendas |

### A classe `masthead` (definida em globals.css)

```css
.masthead {
  font-family: var(--font-display);
  text-transform: uppercase;
  line-height: 0.86;      /* apertadíssima */
  letter-spacing: -0.01em;
}
```

**Qualquer título grande em tela deve usar `masthead`** (com tamanho via `text-*`). Nunca `font-bold` + fonte sans para títulos grandes — quebra a identidade.

Padrão de escala usada nas telas: hero `text-[18vw] sm:text-[12rem]`, seção `text-4xl/5xl`, título de card `text-2xl/3xl`.

## 5. Vocabulário visual (utilitários em globals.css)

| Utilitário | O que faz | Onde usar |
|---|---|---|
| `.poster-frame` | moldura dupla de tinta + sombra dura `6px 6px 0` | cards principais, poster do procurado, QuestionArea |
| `.paper-grain` | textura de grão de papel (SVG noise) | superfícies de papel: cards, seções de jornal |
| `.halftone` / `.halftone-highlight` | pontilhismo de quadrinho (rule ou highlight) | overlay decorativo em cards (`opacity-10`), poster |
| `.stamp` | carimbo de tinta com ruído (borda 3px, textura) | selos: "Procurado", "Culpado", "Veredito lacrado", "Acusado" |

> ⚠️ **Gotcha do `.stamp`:** a classe declara `position: relative` (obrigatório pro `::after` de ruído) e **vence** a classe `absolute` do Tailwind. Para posicionar um selo sobre outro elemento, embrulhe-o em `<span className="absolute ...">` — nunca adicione `absolute` direto na `.stamp`.
| `.rule-thick` | filete triplo de tabloide | divisórias decorativas pesadas |
| `.tape` | fita de papel dourada translúcida | (disponível, usado em cartazes) |
| `.reveal` | animação de entrada `reveal-up` (opacity + translateY 14px) | encadeamento de entradas com `style={{ animationDelay: "60ms" }}` |

### Sombra dura padrão (substitui shadow normal)

```tsx
shadow-[4px_4px_0_0_var(--rule)]   // hover: -translate-y-1 amplia o efeito de carimbo
```

### Fundo do body (globals.css)

O `body` já tem gradientes radiais sutis de `highlight`/`gold` + textura de ruído via `background-image` no CSS base. **Não adicione mais texturas de fundo em páginas** — apenas `bg-background` simples e deixe o body trabalhar.

## 6. Componentes visuais (`src/components/visual/`)

### Kicker
Rótulo de seção: `font-mono`, 0.7rem, uppercase, tracking-widest, `text-highlight`. Uso: "Acusação do dia", "Júri em sessão", "Processos arquivados".

### Stamp
Carimbo de tinta com tons `highlight` | `gold` | `ink`, rotação opcional (default `-7deg`), animação `stamp-slam` ao montar. Uso: estados dramáticos — "Procurado", "Culpado", "Veredito lacrado", "Acusado" (no FriendCard selecionado).

### Marquee
Fita rolante com bordas `rule` e texto `background` sobre fundo `rule`. Uso: tira de acusações na landing. Itens = strings; duplica o array internamente (loop contínuo). Pausa no hover.

### PageShell (`src/components/layout/PageShell.tsx`)
Envelope padrão de página: larguras `prose` (max-w-md) | `default` (max-w-4xl) | `wide` (max-w-6xl), opção `centered`. **Toda página privada usa PageShell — não reinvente o padding.**

## 7. Movimento

| Animação | Trigger | Uso |
|---|---|---|
| `stamp-slam` | `animate-stamp` (automático no `<Stamp/>`) | carimbos: rotaciona + blur → fixa |
| `reveal-up` | classe `.reveal` | entradas de seção (delay via inline style) |
| `marquee` | `animate-marquee` (28s linear) | fita da landing |
| `tick` | `animate-tick` | (disponível para contagem/estado) |

`prefers-reduced-motion` já é respeitado globalmente no globals.css.

## 8. Linguagem e cópia — o universo do tribunal

Toda cópia de interface pertence ao universo:

| Contexto | NUNCA escreva | SEMPRE escreva |
|---|---|---|
| Grupo | "Criar grupo" / "Meus grupos" | "Abrir tribunal" / "Meus tribunais" |
| Pergunta do dia | "Pergunta do dia" | "Acusação do dia" |
| Votar | "Enviar resposta" / "Selecionar amigo" | "Proclamar veredito" / "Acuse o suspeito" / "Acuse 3 suspeitos" |
| Amigo/membro | "amigos" | "réus" / "suspeitos" |
| Mais votado | "1º lugar" | "Culpado" |
| Histórico | "Histórico de perguntas" | "Arquivo de vereditos" / "Histórico de vereditos" |
| Já votou | "Você já votou!" | "Veredito lacrado" / "Você cumpriu seu dever de jurado" |
| Resultados | "Resultados da votação" | "Veredito do júri" |
| Vazio | "Não houve votos" | "Ninguém votou nesse dia :(" |
| Carregando | "Carregando..." | "Reunindo os votos..." |

O tom é **zoeira autoconsciente de tribunal**: solene na forma, absurdo no conteúdo. Erros não pedem desculpa: dizem o que aconteceu no tom do universo.

## 9. Regras de ouro (não-negociáveis)

1. **Cantos:** raio máximo `0.125rem` (ou `rounded-none`). Nunca `rounded-lg/xl/full` em superfícies de cartaz. (Exceção: avatares em círculo não são usados — avatares são `rounded-none` com borda `rule`.)
2. **Sombra:** dura (`4px_4px_0_0`), nunca blur suave, nunca `shadow-lg/xl/2xl` default do Tailwind.
3. **Avatares:** `grayscale` por padrão, `grayscale-0` em hover/seleção — linguagem de cartaz de procurado.
4. **Bordas:** pesadas (`border-2 border-rule`) para estrutura; `border` + `--border` apenas para risos leves.
5. **Títulos grandes:** sempre `masthead` (Anton, uppercase, leading 0.86). 
6. **Textos de etiqueta/dados:** sempre `font-mono`, uppercase, `tracking-widest`, tamanhos `text-[0.7rem]`–`text-xs`.
7. **Cores:** somente tokens do globals.css. Nada de `text-sky-500`, `bg-purple-600` etc.
8. **Seleção (FriendCard):** `border-highlight bg-highlight/10 shadow-[4px_4px_0_0_var(--highlight)]` + selo "Acusado" + animação stamp. Não mude para cor primária.
9. **Vencedor nos resultados:** linha com `border-highlight bg-highlight/5` + selo "Culpado" + troféu `text-gold`. Barra de progresso `bg-highlight` (vencedor) / `bg-rule` (demais).
10. **Botão principal de ação:** `variant="submit"` (carimbo vermelho). CTA secundário: `variant="outline"`. Nunca gradientes, nunca `rounded-full`.

## 10. Checklist ao criar/alterar uma tela

- [ ] Usa `PageShell` (width: prose/default/wide) em vez de divs avulsos
- [ ] Títulos usam `masthead` + `font-display`
- [ ] Etiquetas/datas/códigos usam `font-mono` uppercase tracking-widest
- [ ] Superfícies usam `bg-paper` + `paper-grain` + `poster-frame` quando são o elemento focal
- [ ] Sombras são duras `shadow-[4px_4px_0_0_var(--rule)]`
- [ ] Cópia fala tribunal (ver tabela §8)
- [ ] Cores só via tokens (nunca cores utilitárias arbitrárias)
- [ ] Entradas de seção usam `.reveal` com delays crescentes (60ms, 140ms...)
- [ ] `prefers-reduced-motion` preservado (não adicionar animação obrigatória)
- [ ] Mobile ok (grids `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, hero com `vw`)

## 11. Anti-padrões (o que faria o design voltar ao genérico)

- ❌ Cantos arredondados médios (0.5rem+), botões pill
- ❌ Azul/slate corporativo (sky, indigo, slate) em qualquer token
- ❌ Shadows com blur (`shadow-lg`), glows, glassmorphism
- ❌ Gradientes coloridos em botões/fundos de card
- ❌ Avatares redondos com ring azul
- ❌ Títulos em Geist/Hanken com `font-bold`
- ❌ Ícones coloridos avulsos (`text-purple-600`, `text-pink-700`)
- ❌ Cópia neutra de SaaS ("Crie grupos privados e divirta-se")
- ❌ Emojis decorativos em cards (o universo é carimbo/tinta, não emoji)
