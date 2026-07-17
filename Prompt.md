Você vai gerar perguntas para o jogo "Inimigo do Dia" — um app de votação entre amigos com tom de zoeira autoconsciente. A ideia é que o grupo vote em qual amigo melhor (ou pior) se encaixa na descrição da pergunta.

## Formato de saída

CSV com cabeçalho `text,allowed_votes`. Cada linha é uma pergunta entre aspas duplas, seguida de `1` (voto único) ou raramente `2` (voto duplo).

Exemplo:
text,allowed_votes
"Quem é o mais provável de ser cancelado nas redes sociais por um comentário horrível do passado?",1
"Quem trocaria a família por uma chance de fama?",2

## Tom e estilo

- Português brasileiro coloquial e informal.
- Humor negro, ácido, absurdo e caótico — o exagero é a piada.
- A pergunta sempre começa com "Quem..." e descreve uma ação moralmente questionável, eticamente duvidosa ou socialmente desastrosa.
- O humor está no contraste entre a gravidade do crime/desastre e a banalidade da motivação ou do contexto.
- Os cenários são tão absurdos que fica óbvio que é ficção — ninguém vai ler e achar que é um tutorial.

## Público-alvo: adultos

Este NÃO é um jogo infantil ou family-friendly. As perguntas devem ter malícia, cinismo e uma camada de "isso é errado e é por isso que é engraçado". Evite absolutamente:

- Perguntas bobas, ingênuas ou com tom de brincadeira de escola ("Quem comeria a última fatia de pizza?", "Quem esqueceria o aniversário de um amigo?")
- Humor pasteurizado, fofo ou inofensivo — isso não é quiz de sorveteria
- Piadas prontas, trocadilhos infames ou humor de tiozão
- Qualquer coisa que uma criança de 12 anos acharia engraçado

O registro certo é: um grupo de adultos que se conhecem bem, bebendo cerveja, tirando sarro pesado uns dos outros sem levar pro pessoal. As perguntas devem provocar aquela risada de "nossa, que absurdo" seguida de uma votação acalorada.

## Estrutura das perguntas

Sempre nesse molde: "Quem [verbo no futuro do pretérito/condicional] [ação terrível, mesquinha ou moralmente falida] [por/para motivo banal, egoísta ou absurdo]?"

Exemplos reais do banco:

- "Quem sumiria com o dinheiro da vaquinha do grupo?"
- "Quem falaria o segredo mais bem guardado do grupo por um like?"
- "Quem seria capaz de processar os pais por danos morais por terem nascido feio?"
- "Quem daria calote no agiota e se esconderia na casa da sogra?"
- "Quem venderia o rim para comprar um iPhone e depois se arrependeria?"
- "Quem criaria um culto secreto para não pagar o aluguel?"
- "Quem trocaria a senha do Wi-Fi do hospício só para ver a confusão?"

## Temas recorrentes

- Pequenos golpes e falcatruas (golpe do pix, empréstimo no nome dos outros, falsificação)
- Traições entre amigos/família/parceiros
- Oportunismo absurdo (vender algo que não é seu, lucrar com desgraça alheia)
- Incompetência catastrófica (ser o pior médico/advogado/piloto possível)
- Vaidade e fama a qualquer custo
- Religião usada de forma cínica
- Redes sociais e validação online como motivação
- Referências culturais brasileiras (Mercado Livre, rinha de galo, CNH, consignado, agiota, puteiro)
- Cenários de velório, hospital, família, trabalho, grupo de amigos

## Regras

1. **Nunca** repita perguntas já existentes no banco.
2. Gere ~90% com `allowed_votes: 1` e ~10% com `allowed_votes: 2`.
3. As perguntas devem ser variadas — não gere 10 versões do mesmo tema.
4. Humor negro é bem-vindo, mas evite cruzar para algo que pareça apologia real a violência ou discurso de ódio. O tom é "filme do Lars von Trier", não "manifesto".
5. Mantenha o anonimato — as perguntas nunca citam nomes, gêneros específicos (use "o(a) parceiro(a)", "um amigo", etc.) ou grupos protegidos como alvo.
6. Cada pergunta deve ter entre 8 e 25 palavras.
7. Gere exatamente 100 perguntas.
8. Saída somente CSV, sem explicações, sem markdown, sem bloco de código.

Adicionei a seção "Público-alvo: adultos" com uma lista explícita do que evitar (perguntas bobas, humor pasteurizado, piada de tiozão) e uma descrição do registro certo (adultos bebendo cerveja, tirando sarro pesado). Isso deve filtrar bem o tom infantil.
