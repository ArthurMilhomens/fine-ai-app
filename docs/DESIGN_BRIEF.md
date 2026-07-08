# Brief de Design — fine-ai

Documento de instrução para agente de design criar o protótipo visual do aplicativo **fine-ai**. Este brief descreve identidade visual, componentes, telas, estados e fluxos. As imagens de referência fornecidas pelo stakeholder servem **apenas como guia de estilo** (cores, bordas, sombras, efeitos) — **não são o protótipo final** nem devem ser copiadas pixel a pixel.

---

## 1. Contexto do produto

**fine-ai** é um app de finanças pessoais que consolida a vida financeira do usuário em um único lugar via Open Finance.

### O que o app faz
- Conectar múltiplos bancos (agregação Open Finance)
- Exibir saldos, transações, cartões e investimentos unificados
- Acompanhar patrimônio, gastos e receitas do mês
- Gerenciar conexões bancárias e consentimentos (LGPD)
- Futuro: insights de IA (não prototipar agora — apenas reservar espaço conceitual)

### O que o app NÃO faz (não incluir no protótipo)
- Pagamentos, transferências ou PIX
- Edição/categorização manual de transações
- Insights de IA
- Multi-moeda (sempre BRL)

### Público e tom
- Usuários brasileiros, 25–45 anos, que querem visão consolidada das finanças
- Tom: **confiável, moderno, premium** — não infantil, não corporativo demais
- Idioma da UI: **PT-BR**

---

## 2. Direção visual (referência das imagens)

### 2.1 Estilo geral
- **Dark mode como hero** do produto (protótipo principal em dark; light como variante secundária)
- Estética **premium fintech**: fundo profundo, cards com contraste suave, acentos vibrantes
- **Cantos muito arredondados** em cards, botões e containers (24–32px em cards principais; 16–20px em botões)
- **Sem bordas visíveis** nos cards — profundidade vem de contraste de superfície + sombra suave
- Tipografia sans-serif limpa (Inter, SF Pro ou equivalente)
- Hierarquia tipográfica: valores grandes e bold; labels em cinza médio

### 2.2 Paleta — Dark (primária)

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#000000` | Fundo principal da tela |
| Surface / Card | `#1A1A1A` – `#1C1C1E` | Cards, containers |
| Text Primary | `#FFFFFF` | Títulos, valores principais |
| Text Muted | `#8E8E93` | Labels, metadados, subtítulos |
| Accent Blue | `#007AFF` | Ações primárias, tab ativa, CTA central |
| Success Green | `#34C759` | Entradas, status positivo, investimento |
| Warning Orange | `#FF9500` | Receitas, alertas, status expirado |
| Error Red | `#FF3B30` | Saídas, erros, exclusão |
| Purple | `#AF52DE` | Categoria alimentação/lifestyle |
| Card Gradient Start | `#8B0000` | Gradiente do card de saldo (topo-esquerda) |
| Card Gradient End | `#FF8C00` | Gradiente do card de saldo (baixo-direita) |

### 2.3 Paleta — Light (secundária)

| Token | Hex | Uso |
|-------|-----|-----|
| Background | `#F2F2F7` | Fundo principal |
| Surface / Card | `#FFFFFF` | Cards |
| Text Primary | `#000000` | Títulos e valores |
| Text Muted | `#8E8E93` | Labels |
| Acentos | Mesmos do dark | Verde, azul, laranja, roxo, vermelho |

### 2.4 Efeitos e profundidade
- **Sombra suave** nos cards: baixa opacidade, blur amplo (não sombra dura)
- **Glassmorphism na navbar**: fundo semi-transparente + blur forte (`backdrop-filter` / frosted glass)
- **Glow azul** no botão central da navbar (halo suave `#007AFF` com ~40% opacidade)
- **Gradiente diagonal** no card de saldo principal (vermelho escuro → laranja vibrante)
- Fundo da Home pode usar **imagem/blur sutil** por trás do conteúdo (opcional) para reforçar o glass effect da navbar

### 2.5 Tipografia

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| Display | 32–36px | Bold | Saldo principal, patrimônio |
| Title | 24–28px | Bold/Semibold | Títulos de tela |
| Subtitle | 18–20px | Semibold | Valores secundários |
| Body | 16px | Regular | Texto corrido |
| Label | 14px | Medium | Labels de campos |
| Caption | 12–13px | Regular | Metadados, timestamps |

**Regra do saldo:** parte inteira grande; centavos menores e com opacidade reduzida (ex.: `$13.984` grande + `,73` menor).

---

## 3. Componentes obrigatórios

### 3.1 Card de saldo (hero)
- Gradiente vermelho → laranja, cantos 24–32px
- Label "Saldo disponível" em branco com opacidade ~80%
- Valor em destaque com hierarquia decimal
- Ícone de olho para ocultar/mostrar saldo
- Opcional: chip de cartão, nome do titular, últimos 4 dígitos mascarados (`•••• 3493`)

### 3.2 Quick actions (4 botões)
- Grid horizontal: **Adicionar**, **Receber**, **Enviar**, **Pagar**
- Botões quadrados com cantos arredondados (~16px)
- Fundo `#1C1C1E` (dark); ícone + label brancos
- Ícones line-art minimalistas

> Nota: estas ações são **visuais no protótipo** — não implementam fluxo de pagamento na v1.

### 3.3 Card de gastos do mês
- Título "Gastos do mês" + valor grande
- Meta/comparativo: "Receitas: R$ X" em caption muted
- **Barra de progresso segmentada** horizontal com 3+ cores (verde, azul, roxo) representando categorias
- Legenda abaixo com quadrados coloridos + nomes (Investimento, Entretenimento, Alimentação)

### 3.4 Gráfico Receitas vs Despesas
- Barras verticais finas por mês
- Laranja = Receitas; cinza semi-transparente = Despesas
- Legenda com dots coloridos
- Dropdown "Este mês" no canto superior direito
- Grid horizontal sutil no eixo Y (0, 20K, 40K, 60K)

### 3.5 Gráfico de despesas semanais (stacked bar)
- Barras verticais empilhadas por dia (Seg–Sáb)
- Segmentos coloridos por categoria (verde, azul, roxo, laranja)
- Topo das barras com cap arredondado
- Filtro pill horizontal: 1H, 24H, 7D, 30D (24H ativo por padrão)
- Tabela/legenda abaixo: linha colorida + categoria + valor

### 3.6 Navbar flutante (CRÍTICO)

**Referência principal:** última imagem enviada (pill flutuante com glass effect).

Especificações:
- **Não encosta** nas bordas laterais nem no fundo da tela
- Margem inferior ~24px; margens laterais ~16px
- Formato **pill/cápsula** com cantos totalmente arredondados
- Fundo: glass effect (blur + overlay semi-transparente)
  - Dark: `rgba(28,28,30,0.72)` + blur
  - Light: `rgba(255,255,255,0.72)` + blur
- Borda hairline sutil (branca 12% opacidade no dark)
- Sombra difusa para efeito flutuante

**5 itens de navegação (4 tabs + 1 central elevado):**

| Posição | Label | Ícone | Estado |
|---------|-------|-------|--------|
| Esquerda 1 | Início | Casa (line) | — |
| Esquerda 2 | Transações | Lista/recibo (line) | — |
| **Centro** | **Conexões** | Link/cadeado (line) | **Botão elevado azul com glow** |
| Direita 1 | Mais | Menu/grid (line) | — |

- Tab ativa: ícone + label brancos (dark) / pretos (light)
- Tab inativa: `#8E8E93`
- Botão central: retângulo arredondado azul `#007AFF`, maior que os demais, com halo/glow

### 3.7 Componentes de lista
- **Item de transação:** descrição, conta, data (muted), valor colorido (verde entrada / vermelho saída)
- **Item de conta:** nome, tipo, instituição, saldo
- **Item de cartão:** nome, bandeira, `•••• •••• •••• 3493` (nunca número completo)
- **Item de conexão:** logo/nome do banco, badge de status colorido, última sync

### 3.8 Badges de status (conexões)

| Status | Cor | Label PT-BR |
|--------|-----|-------------|
| Aguardando consentimento | Laranja `#FF9500` | Aguardando consentimento |
| Conectada | Verde `#34C759` | Conectada |
| Sincronizando | Azul `#007AFF` | Sincronizando |
| Erro | Vermelho `#FF3B30` | Erro |
| Expirada | Laranja `#FF9500` | Expirada |

### 3.9 Estados de UI (prototipar todos)
- **Loading:** skeleton shimmer nos cards (retângulos `#2C2C2E` arredondados)
- **Empty:** ilustração minimal + título + descrição + CTA primário
- **Error:** ícone + mensagem + botão "Tentar novamente"
- **Offline:** banner fino laranja no topo — "Sem conexão — exibindo últimos dados salvos"
- **Pull-to-refresh:** indicador nativo no topo da scroll

### 3.10 Formulários (auth, settings)
- Inputs com fundo `#1C1C1E`, cantos 16px, placeholder muted
- Botão primário azul full-width, cantos 16px
- Erros em vermelho abaixo do campo
- Login: mensagem genérica "Credenciais inválidas" (não revelar se e-mail existe)

---

## 4. Mapa de telas a prototipar

### 4.1 Fluxo não autenticado
1. **Splash** — logo fine-ai centralizado, fundo preto
2. **Login** — e-mail, senha, CTA "Entrar", link "Criar conta"
3. **Cadastro** — e-mail, senha (min 8), CTA "Cadastrar", link "Já tenho conta"

### 4.2 App autenticado — Tabs (com navbar flutuante)

#### Tab: Início (Dashboard)
- Header: avatar circular (esquerda) + ícones scan e notificação (direita)
- Card de saldo (gradiente hero)
- Quick actions (4 botões)
- 2 cards de stat: Patrimônio total | Total investido
- Card gastos do mês + barra segmentada
- Card gráfico receitas vs despesas
- Atalhos rápidos: Contas, Cartões, Investimentos, Conexões
- Footer: "Atualizado há X min"
- **Empty state:** sem conexões → CTA "Conectar seu primeiro banco"
- **Banner:** conexão expirada → faixa laranja "Conexão expirada — toque para renovar"

#### Tab: Transações
- Título + filtros pill: Todas | Entradas | Saídas
- Lista infinita de transações
- Cada item: descrição, conta, data, valor colorido, status (Pendente/Lançada)

#### Tab: Conexões
- Título + subtítulo "Bancos conectados via Open Finance"
- CTA "Adicionar banco" (desabilitado visualmente se limite 20 atingido)
- Lista de conexões com status, última sync, ações (Atualizar, Renovar, Remover)
- **Empty state:** CTA conectar banco

#### Tab: Mais
- Grid 2×2: Contas, Cartões, Investimentos, Configurações
- Ícones grandes + labels

### 4.3 Telas secundárias (stack/modal)

| Tela | Conteúdo principal |
|------|-------------------|
| Lista de Contas | Agrupável por instituição; tipo (Corrente, Poupança, etc.) |
| Detalhe da Conta | Nome, tipo, saldo, disponível, "Ver transações" |
| Lista de Cartões | Nome, bandeira, mascarado, limite disponível |
| Detalhe do Cartão | Dados mascarados, limites |
| Lista de Investimentos | Nome, categoria, valor, instituição |
| Resumo Investimentos | Total + breakdown por categoria (%) |
| Conectar Banco (modal) | Termo LGPD → lista de bancos → widget Pluggy |
| Detalhe da Conexão | Status, datas, erro, botão sync |
| Configurações | E-mail, seletor de tema (Claro/Escuro/Sistema), Privacidade, Sair |
| Privacidade (hub) | Exportar dados, Consentimentos, Excluir conta |
| Exportar dados | Explicação + CTA exportar |
| Excluir conta | Campo "EXCLUIR" + checkbox confirmação + CTA vermelho |
| Consentimentos | Lista com datas + botão revogar |

### 4.4 Modal LGPD (antes de conectar banco)
- Título: "Termo de consentimento"
- Texto informando:
  - Finalidade: agregação Open Finance (`open_finance_aggregation`)
  - Base legal: consentimento (LGPD Art. 7º, I)
  - Link para Política de Privacidade
- CTA "Aceito e continuar" + "Cancelar"

### 4.5 Widget Pluggy Connect
- Representar como **tela cheia modal** com header "Conectar [Banco]"
- Não desenhar UI interna do widget — usar placeholder: "Widget Pluggy Connect"
- Botão fechar no canto

---

## 5. Fluxos de interação a representar

### 5.1 Conectar banco
```
Mais/Conexões → "Adicionar banco"
  → Modal termo LGPD → Aceitar
  → Lista de instituições (Nubank, Itaú, Bradesco, Inter...)
  → Selecionar banco
  → Widget Pluggy (placeholder)
  → Sucesso → volta ao Dashboard com dados
```

Prototipar também:
- Estado **Sincronizando** (spinner no card da conexão)
- Estado **Erro** (mensagem + "Tentar novamente")
- Estado **Expirada** (CTA "Renovar conexão")

### 5.2 Navegação principal
- Navbar flutuante **sempre visível** nas 4 tabs
- Conteúdo scrollável passa **por trás** da navbar (demonstrar glass effect)
- Padding inferior nas telas para não sobrepor conteúdo

### 5.3 Tema
- Prototipar **versão dark completa** (prioridade)
- Incluir **1 frame light** do Dashboard para referência
- Settings: seletor visual Claro | Escuro | Sistema

---

## 6. Dados de exemplo (para protótipo)

Usar valores realistas em BRL:

| Campo | Valor exemplo |
|-------|---------------|
| Saldo disponível | R$ 13.984,73 |
| Patrimônio total | R$ 245.680,42 |
| Gastos do mês | R$ 8.420,50 |
| Receitas do mês | R$ 12.500,00 |
| Total investido | R$ 198.500,00 |
| Cartões | 3 |
| Titular do cartão | ALFIKRI DJATI (ou nome genérico BR) |
| Cartão mascarado | •••• •••• •••• 3493 |

Transações exemplo:
- Salário +R$ 8.500,00 (verde)
- Supermercado Extra −R$ 342,50 (vermelho)
- Netflix −R$ 55,90 (vermelho)

---

## 7. Restrições e exclusões

### Não incluir no protótipo
- Número completo de cartão
- Campos de senha/PIN bancário
- Fluxos de PIX, transferência, pagamento funcional
- Tela de insights de IA
- Seletor de moeda (sempre BRL)
- Integração visual real com API Pluggy (apenas placeholder)

### Acessibilidade (considerar no design)
- Contraste mínimo WCAG AA para texto em ambos os temas
- Áreas de toque mínimo 44×44pt
- Não depender apenas de cor para status (usar label textual)

---

## 8. Entregáveis esperados do agente de design

1. **Design system page**: cores, tipografia, radius, sombras, ícones
2. **Component library**: cards, badges, inputs, botões, navbar, gráficos, empty/error states
3. **Fluxo completo dark mode** (todas as telas da seção 4)
4. **1 frame light mode** (Dashboard)
5. **Protótipo navegável** com:
   - Auth → Dashboard
   - Navegação entre 4 tabs
   - Fluxo conectar banco (com modal LGPD)
   - Settings → Privacidade → Exportar/Excluir/Consentimentos
6. **Variantes de estado**: loading, empty, error, offline, conexão expirada

### Formato sugerido
- Figma (preferencial) com auto-layout e variáveis/tokens
- Nomear frames: `[Fluxo]/[Tela]/[Estado]` (ex.: `App/Dashboard/Loaded`)
- Componentes como variants (ex.: Badge/Status/Connected)

---

## 9. Referência visual resumida (das imagens do stakeholder)

| Imagem | O que extrair |
|--------|---------------|
| Dashboard dark (3 telas) | Layout geral, cards, gráficos, header, quick actions |
| Card de saldo | Gradiente vermelho-laranja, hierarquia do valor, chip |
| Quick actions | 4 botões escuros com ícones line |
| Gráficos | Barras empilhadas, segmented progress, income vs outcome |
| Navbar glass (última imagem) | Pill flutuante, blur, botão central azul com glow, ícones line |

**Importante:** O protótipo deve ser **fine-ai**, não uma cópia das imagens. Usar as referências para estilo, não para conteúdo literal (nomes, layouts exatos de terceiros).

---

## 10. Checklist de validação

- [ ] Dark mode como versão principal
- [ ] Navbar flutuante com glass effect em todas as tabs
- [ ] Botão central "Conexões" destacado com glow azul
- [ ] Card de saldo com gradiente e toggle de visibilidade
- [ ] Gráficos com paleta de categorias (verde, azul, roxo, laranja)
- [ ] Todos os status de conexão com badge colorido
- [ ] Modal LGPD antes de conectar banco
- [ ] Empty states com CTA
- [ ] Cartões sempre mascarados (últimos 4 dígitos)
- [ ] Light mode de referência incluído
- [ ] Seletor de tema nas Configurações
- [ ] Nenhum fluxo de pagamento/PIX
- [ ] Valores em BRL com formatação pt-BR

---

*Documento gerado para orientar prototipação. Implementação técnica de referência: repositório `fine-ai-app` branch `cursor/fine-ai-app-afb3`.*
