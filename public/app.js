const pipelinesRoot = document.getElementById('pipelines');
const toast = document.getElementById('toast');

const STORAGE_KEY = 'crm-pipelines-state';

const createId = () => Math.random().toString(36).slice(2, 10);

const defaultData = () => ({
  pipelines: [
    {
      id: createId(),
      title: 'Pipeline: Pré-venda',
      description: 'Leads chegando do marketing',
      columns: [
        {
          id: createId(),
          title: 'Novos',
          cards: [
            {
              id: createId(),
              title: 'Agência Nuvem',
              description: 'Primeiro contato via landing.',
              tag: 'Inbound',
              dueDate: '',
              alerted: false
            },
            {
              id: createId(),
              title: 'Studio Orion',
              description: 'Solicitou proposta inicial.',
              tag: 'Urgente',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Qualificação',
          cards: [
            {
              id: createId(),
              title: 'Fazenda Horizonte',
              description: 'Responder questionário de fit.',
              tag: 'Análise',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Contato feito',
          cards: [
            {
              id: createId(),
              title: 'Startup Lumina',
              description: 'Follow-up agendado para sexta.',
              tag: 'Follow-up',
              dueDate: '',
              alerted: false
            }
          ]
        }
      ]
    },
    {
      id: createId(),
      title: 'Pipeline: Negociação',
      description: 'Oportunidades com proposta ativa',
      columns: [
        {
          id: createId(),
          title: 'Proposta enviada',
          cards: [
            {
              id: createId(),
              title: 'Grupo Atlântico',
              description: 'Plano premium com 20 usuários.',
              tag: 'R$ 18k',
              dueDate: '',
              alerted: false
            },
            {
              id: createId(),
              title: 'Varejo Central',
              description: 'Solicita ajuste de escopo.',
              tag: 'Revisão',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Reunião',
          cards: [
            {
              id: createId(),
              title: 'Conecta+',
              description: 'Demonstração com time técnico.',
              tag: 'Demo',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Negociação',
          cards: [
            {
              id: createId(),
              title: 'Hotel Solis',
              description: 'Negociar prazo de implantação.',
              tag: 'Alta prioridade',
              dueDate: '',
              alerted: false
            }
          ]
        }
      ]
    },
    {
      id: createId(),
      title: 'Pipeline: Pós-venda',
      description: 'Onboarding e retenção',
      columns: [
        {
          id: createId(),
          title: 'Onboarding',
          cards: [
            {
              id: createId(),
              title: 'Clínica Vida',
              description: 'Kickoff com equipe na terça.',
              tag: 'Onboarding',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Ativação',
          cards: [
            {
              id: createId(),
              title: 'Logística Alfa',
              description: 'Treinamento finalizado.',
              tag: 'Ativo',
              dueDate: '',
              alerted: false
            },
            {
              id: createId(),
              title: 'Rede Prisma',
              description: 'Configurar integrações.',
              tag: 'Integração',
              dueDate: '',
              alerted: false
            }
          ]
        },
        {
          id: createId(),
          title: 'Sucesso do cliente',
          cards: [
            {
              id: createId(),
              title: 'Fábrica Delta',
              description: 'Revisão de QBR agendada.',
              tag: 'QBR',
              dueDate: '',
              alerted: false
            }
          ]
        }
      ]
    }
  ]
});

const loadData = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = defaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    const seed = defaultData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
};

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
};

let state = loadData();
let draggedCard = null;

const findColumn = (pipelineId, columnId) =>
  state.pipelines
    .find((pipeline) => pipeline.id === pipelineId)
    ?.columns.find((column) => column.id === columnId);

const render = () => {
  pipelinesRoot.innerHTML = '';

  state.pipelines.forEach((pipeline) => {
    const section = document.createElement('section');
    section.className = 'pipeline';
    section.dataset.pipelineId = pipeline.id;

    section.innerHTML = `
      <header>
        <div>
          <h2>${pipeline.title}</h2>
          <p>${pipeline.description}</p>
        </div>
        <div class="pipeline__actions">
          <button class="ghost small" data-action="add-column">+ Etapa</button>
        </div>
      </header>
    `;

    const board = document.createElement('div');
    board.className = 'board';

    pipeline.columns.forEach((column) => {
      const columnEl = document.createElement('div');
      columnEl.className = 'column';
      columnEl.dataset.columnId = column.id;

      columnEl.innerHTML = `
        <div class="column__header">
          <h3 class="column__title">${column.title}</h3>
          <div class="column__actions">
            <button class="ghost small" data-action="rename-column">Renomear</button>
            <button class="ghost small" data-action="delete-column">Excluir</button>
          </div>
        </div>
      `;

      column.cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.draggable = true;
        cardEl.dataset.cardId = card.id;
        if (card.dueDate && new Date(card.dueDate) < new Date()) {
          cardEl.classList.add('overdue');
        }

        cardEl.innerHTML = `
          <div>
            <h4>${card.title}</h4>
            <p>${card.description}</p>
          </div>
          <div class="card__meta">
            <span class="card__badge">${card.tag}</span>
            <label class="card__due">
              Limite:
              <input type="date" data-action="due-date" value="${card.dueDate || ''}" />
            </label>
          </div>
        `;

        columnEl.appendChild(cardEl);
      });

      const footer = document.createElement('div');
      footer.className = 'column__footer';
      footer.innerHTML = `
        <button class="ghost small" data-action="add-card">+ Card</button>
      `;
      columnEl.appendChild(footer);
      board.appendChild(columnEl);
    });

    section.appendChild(board);
    pipelinesRoot.appendChild(section);
  });
};

const addColumn = (pipelineId) => {
  const pipeline = state.pipelines.find((item) => item.id === pipelineId);
  if (!pipeline) return;
  const title = window.prompt('Nome da nova etapa?');
  if (!title) return;
  pipeline.columns.push({ id: createId(), title, cards: [] });
  saveData();
  render();
};

const renameColumn = (pipelineId, columnId) => {
  const column = findColumn(pipelineId, columnId);
  if (!column) return;
  const title = window.prompt('Novo nome da etapa:', column.title);
  if (!title) return;
  column.title = title;
  saveData();
  render();
};

const deleteColumn = (pipelineId, columnId) => {
  const pipeline = state.pipelines.find((item) => item.id === pipelineId);
  if (!pipeline) return;
  if (!window.confirm('Tem certeza que deseja excluir esta etapa?')) return;
  pipeline.columns = pipeline.columns.filter((column) => column.id !== columnId);
  saveData();
  render();
};

const addCard = (pipelineId, columnId) => {
  const column = findColumn(pipelineId, columnId);
  if (!column) return;
  const title = window.prompt('Nome do card?');
  if (!title) return;
  const description = window.prompt('Descrição curta do card?') || '';
  const tag = window.prompt('Etiqueta (opcional)?') || 'Novo';
  column.cards.push({
    id: createId(),
    title,
    description,
    tag,
    dueDate: '',
    alerted: false
  });
  saveData();
  render();
};

const updateDueDate = (pipelineId, columnId, cardId, value) => {
  const column = findColumn(pipelineId, columnId);
  const card = column?.cards.find((item) => item.id === cardId);
  if (!card) return;
  card.dueDate = value;
  card.alerted = false;
  saveData();
  render();
};

const moveCard = (fromPipelineId, fromColumnId, toPipelineId, toColumnId, cardId) => {
  const fromColumn = findColumn(fromPipelineId, fromColumnId);
  const toColumn = findColumn(toPipelineId, toColumnId);
  if (!fromColumn || !toColumn) return;
  const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) return;
  const [card] = fromColumn.cards.splice(cardIndex, 1);
  toColumn.cards.push(card);
  saveData();
  render();
};

const checkDueDates = () => {
  const now = new Date();
  state.pipelines.forEach((pipeline) => {
    pipeline.columns.forEach((column) => {
      column.cards.forEach((card) => {
        if (!card.dueDate) return;
        const due = new Date(card.dueDate);
        if (due < now && !card.alerted) {
          card.alerted = true;
          showToast(`Prazo vencido: ${card.title}`);
        }
      });
    });
  });
  saveData();
  render();
};

pipelinesRoot.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (!action) return;
  const pipelineId = event.target.closest('.pipeline')?.dataset.pipelineId;
  const columnId = event.target.closest('.column')?.dataset.columnId;

  if (action === 'add-column') addColumn(pipelineId);
  if (action === 'rename-column') renameColumn(pipelineId, columnId);
  if (action === 'delete-column') deleteColumn(pipelineId, columnId);
  if (action === 'add-card') addCard(pipelineId, columnId);
});

pipelinesRoot.addEventListener('change', (event) => {
  if (event.target.dataset.action !== 'due-date') return;
  const pipelineId = event.target.closest('.pipeline')?.dataset.pipelineId;
  const columnId = event.target.closest('.column')?.dataset.columnId;
  const cardId = event.target.closest('.card')?.dataset.cardId;
  updateDueDate(pipelineId, columnId, cardId, event.target.value);
});

pipelinesRoot.addEventListener('dragstart', (event) => {
  const card = event.target.closest('.card');
  if (!card) return;
  const pipelineId = card.closest('.pipeline')?.dataset.pipelineId;
  const columnId = card.closest('.column')?.dataset.columnId;
  draggedCard = { cardId: card.dataset.cardId, pipelineId, columnId };
  card.classList.add('dragging');
});

pipelinesRoot.addEventListener('dragend', (event) => {
  const card = event.target.closest('.card');
  if (!card) return;
  card.classList.remove('dragging');
  draggedCard = null;
});

pipelinesRoot.addEventListener('dragover', (event) => {
  event.preventDefault();
  const column = event.target.closest('.column');
  if (!column) return;
  column.classList.add('drop-target');
});

pipelinesRoot.addEventListener('dragleave', (event) => {
  const column = event.target.closest('.column');
  if (!column) return;
  column.classList.remove('drop-target');
});

pipelinesRoot.addEventListener('drop', (event) => {
  event.preventDefault();
  const column = event.target.closest('.column');
  if (!column || !draggedCard) return;
  const pipelineId = column.closest('.pipeline')?.dataset.pipelineId;
  column.classList.remove('drop-target');
  moveCard(draggedCard.pipelineId, draggedCard.columnId, pipelineId, column.dataset.columnId, draggedCard.cardId);
});

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  button.animate(
    [
      { transform: 'scale(1)', boxShadow: 'none' },
      { transform: 'scale(0.97)', boxShadow: '0 6px 20px rgba(15, 23, 42, 0.12)' },
      { transform: 'scale(1)', boxShadow: 'none' }
    ],
    {
      duration: 240,
      easing: 'ease-out'
    }
  );
});

render();
checkDueDates();
setInterval(checkDueDates, 60000);
