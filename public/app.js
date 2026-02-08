const pipelinesRoot = document.getElementById('pipelines');
const toast = document.getElementById('toast');
const companyForm = document.getElementById('company-form');
const contactForm = document.getElementById('contact-form');
const companyList = document.getElementById('company-list');
const contactList = document.getElementById('contact-list');
const contactCompanySelect = document.getElementById('contact-company');
const toggleArchived = document.getElementById('toggle-archived');

const metricActive = document.getElementById('metric-active');
const metricArchived = document.getElementById('metric-archived');
const metricRegistrations = document.getElementById('metric-registrations');

const createId = () => Math.random().toString(36).slice(2, 10);

const defaultData = () => ({
  companies: [
    { id: createId(), name: 'Agência Nuvem', segment: 'Marketing' },
    { id: createId(), name: 'Grupo Atlântico', segment: 'Logística' }
  ],
  contacts: [
    { id: createId(), name: 'Camila Souza', email: 'camila@agencianuvem.com', companyId: null },
    { id: createId(), name: 'Rafael Lima', email: 'rafael@atlantico.com', companyId: null }
  ],
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
            },
            {
              id: createId(),
              title: 'Studio Orion',
              description: 'Solicitou proposta inicial.',
              tag: 'Urgente',
              dueDate: '',
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
            },
            {
              id: createId(),
              title: 'Varejo Central',
              description: 'Solicita ajuste de escopo.',
              tag: 'Revisão',
              dueDate: '',
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
            },
            {
              id: createId(),
              title: 'Rede Prisma',
              description: 'Configurar integrações.',
              tag: 'Integração',
              dueDate: '',
              alerted: false,
              companyId: null,
              contactId: null,
              archived: false
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
              alerted: false,
              archived: false,
              companyId: null,
              contactId: null
            }
          ]
        }
      ]
    }
  ]
});

let state = defaultData();
let draggedCard = null;
let showArchived = false;

const loadData = async () => {
  const response = await fetch('/api/state');
  if (!response.ok) return defaultData();
  const data = await response.json();
  if (!data || !data.pipelines) return defaultData();
  return data;
};

const saveData = async () => {
  await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state)
  });
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
};

const findColumn = (pipelineId, columnId) =>
  state.pipelines
    .find((pipeline) => pipeline.id === pipelineId)
    ?.columns.find((column) => column.id === columnId);

const findCompany = (companyId) => state.companies.find((company) => company.id === companyId);
const findContact = (contactId) => state.contacts.find((contact) => contact.id === contactId);

const updateMetrics = () => {
  const cards = state.pipelines.flatMap((pipeline) => pipeline.columns.flatMap((column) => column.cards));
  const active = cards.filter((card) => !card.archived);
  const archived = cards.filter((card) => card.archived);

  metricActive.textContent = active.length.toString();
  metricArchived.textContent = archived.length.toString();
  metricRegistrations.textContent = `${state.companies.length + state.contacts.length}`;
};

const renderCompanies = () => {
  companyList.innerHTML = '';
  contactCompanySelect.innerHTML = '<option value="">Selecione a empresa</option>';

  state.companies.forEach((company) => {
    const item = document.createElement('li');
    item.className = 'registry__item';
    item.innerHTML = `
      <div class="registry__meta">
        <strong>${company.name}</strong>
        <span>${company.segment || 'Sem segmento'}</span>
      </div>
      <button class="ghost small" data-action="delete-company" data-id="${company.id}">Excluir</button>
    `;
    companyList.appendChild(item);

    const option = document.createElement('option');
    option.value = company.id;
    option.textContent = company.name;
    contactCompanySelect.appendChild(option);
  });
};

const renderContacts = () => {
  contactList.innerHTML = '';
  state.contacts.forEach((contact) => {
    const company = findCompany(contact.companyId);
    const item = document.createElement('li');
    item.className = 'registry__item';
    item.innerHTML = `
      <div class="registry__meta">
        <strong>${contact.name}</strong>
        <span>${contact.email}</span>
        <span>${company ? company.name : 'Sem empresa'}</span>
      </div>
      <button class="ghost small" data-action="delete-contact" data-id="${contact.id}">Excluir</button>
    `;
    contactList.appendChild(item);
  });
};

const render = () => {
  pipelinesRoot.innerHTML = '';

  renderCompanies();
  renderContacts();
  updateMetrics();

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

      column.cards
        .filter((card) => (showArchived ? true : !card.archived))
        .forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        if (card.archived) {
          cardEl.classList.add('archived');
        }
        cardEl.draggable = true;
        cardEl.dataset.cardId = card.id;
        if (card.dueDate && new Date(card.dueDate) < new Date()) {
          cardEl.classList.add('overdue');
        }

        const company = findCompany(card.companyId);
        const contact = findContact(card.contactId);

        cardEl.innerHTML = `
          <div>
            <h4>${card.title}</h4>
            <p>${card.description}</p>
            <p><strong>Empresa:</strong> ${company ? company.name : 'Sem empresa'}</p>
            <p><strong>Contato:</strong> ${contact ? contact.name : 'Sem contato'}</p>
          </div>
          <div class="card__meta">
            <span class="card__badge">${card.tag}</span>
            <label class="card__due">
              Limite:
              <input type="date" data-action="due-date" value="${card.dueDate || ''}" />
            </label>
            <div class="card__actions">
              <button class="ghost small" data-action="archive-card">
                ${card.archived ? 'Reativar' : 'Arquivar'}
              </button>
              <button class="ghost small" data-action="delete-card">Excluir</button>
            </div>
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
  saveData().then(render);
};

const renameColumn = (pipelineId, columnId) => {
  const column = findColumn(pipelineId, columnId);
  if (!column) return;
  const title = window.prompt('Novo nome da etapa:', column.title);
  if (!title) return;
  column.title = title;
  saveData().then(render);
};

const deleteColumn = (pipelineId, columnId) => {
  const pipeline = state.pipelines.find((item) => item.id === pipelineId);
  if (!pipeline) return;
  if (!window.confirm('Tem certeza que deseja excluir esta etapa?')) return;
  pipeline.columns = pipeline.columns.filter((column) => column.id !== columnId);
  saveData().then(render);
};

const addCard = (pipelineId, columnId) => {
  const column = findColumn(pipelineId, columnId);
  if (!column) return;
  const title = window.prompt('Nome do card?');
  if (!title) return;
  const description = window.prompt('Descrição curta do card?') || '';
  const tag = window.prompt('Etiqueta (opcional)?') || 'Novo';
  const companyName = window.prompt('Nome da empresa (opcional)?') || '';
  const contactName = window.prompt('Nome do contato (opcional)?') || '';
  let companyId = null;
  let contactId = null;

  if (companyName) {
    const existingCompany = state.companies.find(
      (company) => company.name.toLowerCase() === companyName.toLowerCase()
    );
    if (existingCompany) {
      companyId = existingCompany.id;
    } else {
      companyId = createId();
      state.companies.push({ id: companyId, name: companyName, segment: '' });
    }
  }

  if (contactName) {
    const existingContact = state.contacts.find(
      (contact) => contact.name.toLowerCase() === contactName.toLowerCase()
    );
    if (existingContact) {
      contactId = existingContact.id;
    } else {
      contactId = createId();
      state.contacts.push({
        id: contactId,
        name: contactName,
        email: '',
        companyId
      });
    }
  }
  column.cards.push({
    id: createId(),
    title,
    description,
    tag,
    dueDate: '',
    alerted: false,
    archived: false,
    companyId,
    contactId
  });
  saveData().then(render);
};

const updateDueDate = (pipelineId, columnId, cardId, value) => {
  const column = findColumn(pipelineId, columnId);
  const card = column?.cards.find((item) => item.id === cardId);
  if (!card) return;
  card.dueDate = value;
  card.alerted = false;
  saveData().then(render);
};

const toggleArchiveCard = (pipelineId, columnId, cardId) => {
  const column = findColumn(pipelineId, columnId);
  const card = column?.cards.find((item) => item.id === cardId);
  if (!card) return;
  card.archived = !card.archived;
  saveData().then(render);
};

const deleteCard = (pipelineId, columnId, cardId) => {
  const column = findColumn(pipelineId, columnId);
  if (!column) return;
  if (!window.confirm('Excluir este card permanentemente?')) return;
  column.cards = column.cards.filter((card) => card.id !== cardId);
  saveData().then(render);
};

const moveCard = (fromPipelineId, fromColumnId, toPipelineId, toColumnId, cardId) => {
  const fromColumn = findColumn(fromPipelineId, fromColumnId);
  const toColumn = findColumn(toPipelineId, toColumnId);
  if (!fromColumn || !toColumn) return;
  const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) return;
  const [card] = fromColumn.cards.splice(cardIndex, 1);
  toColumn.cards.push(card);
  saveData().then(render);
};

const checkDueDates = () => {
  const now = new Date();
  state.pipelines.forEach((pipeline) => {
    pipeline.columns.forEach((column) => {
      column.cards.forEach((card) => {
        if (!card.dueDate || card.archived) return;
        const due = new Date(card.dueDate);
        if (due < now && !card.alerted) {
          card.alerted = true;
          showToast(`Prazo vencido: ${card.title}`);
        }
      });
    });
  });
  saveData().then(render);
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
  if (action === 'archive-card') {
    const cardId = event.target.closest('.card')?.dataset.cardId;
    toggleArchiveCard(pipelineId, columnId, cardId);
  }
  if (action === 'delete-card') {
    const cardId = event.target.closest('.card')?.dataset.cardId;
    deleteCard(pipelineId, columnId, cardId);
  }
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
  if (!card.classList.contains('archived')) {
    card.classList.add('dragging');
  } else {
    draggedCard = null;
  }
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

companyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(companyForm);
  const name = formData.get('name')?.toString().trim();
  if (!name) return;
  const segment = formData.get('segment')?.toString().trim() || '';
  state.companies.push({ id: createId(), name, segment });
  companyForm.reset();
  saveData().then(render);
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const companyId = formData.get('company')?.toString() || null;
  if (!name || !email) return;
  state.contacts.push({ id: createId(), name, email, companyId: companyId || null });
  contactForm.reset();
  saveData().then(render);
});

document.addEventListener('click', (event) => {
  const action = event.target.dataset.action;
  if (action === 'delete-company') {
    const companyId = event.target.dataset.id;
    if (!window.confirm('Excluir empresa?')) return;
    state.companies = state.companies.filter((company) => company.id !== companyId);
    state.contacts = state.contacts.map((contact) =>
      contact.companyId === companyId ? { ...contact, companyId: null } : contact
    );
    state.pipelines.forEach((pipeline) => {
      pipeline.columns.forEach((column) => {
        column.cards.forEach((card) => {
          if (card.companyId === companyId) card.companyId = null;
        });
      });
    });
    saveData().then(render);
  }
  if (action === 'delete-contact') {
    const contactId = event.target.dataset.id;
    if (!window.confirm('Excluir contato?')) return;
    state.contacts = state.contacts.filter((contact) => contact.id !== contactId);
    state.pipelines.forEach((pipeline) => {
      pipeline.columns.forEach((column) => {
        column.cards.forEach((card) => {
          if (card.contactId === contactId) card.contactId = null;
        });
      });
    });
    saveData().then(render);
  }
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

toggleArchived.addEventListener('change', (event) => {
  showArchived = event.target.checked;
  render();
});

const hydrate = async () => {
  state = await loadData();
  state.companies = state.companies || [];
  state.contacts = state.contacts || [];
  state.pipelines = state.pipelines || [];
  await saveData();
  render();
  checkDueDates();
  setInterval(checkDueDates, 60000);
};

hydrate();
