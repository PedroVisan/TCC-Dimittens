// Seleção dos elementos do DOM
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventNote = document.querySelector(".event-note"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");
  const dateInput = document.querySelector(".date-input");
const gotoBtn = document.querySelector(".goto-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();
let isEditing = false;
let eventToEdit = null;

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let eventsArr = [];

async function initCalendar() {
  activeDay = today.getDate();
  await fetchEvents();
  renderCalendar();
}

async function fetchEvents() {
  try {
    const response = await fetch('/calendario/listar-sessao');
    const data = await response.json();
    console.log("Dados recebidos do servidor:", data); // Verificar no console

    eventsArr = data.map(event => ({
      id: event.id || '', // Certifique-se de que o ID existe
      day: event.day,
      month: event.month,
      year: event.year,
      nota: event.nota,
      horarioInicio: event.horarioInicio,
      horarioFim: event.horarioFim,
    }));

    renderCalendar();
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
  }
}

function renderCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  // Reseta o activeDay se ele não existir no novo mês
  if (!activeDay || activeDay > lastDate) {
    activeDay = 1;
  }

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const hasEvent = eventsArr.some(event =>
      event.day === i && event.month === month + 1 && event.year === year
    );

    if (i === activeDay) { // Define activeDay como o dia inicial selecionado
      getActiveDay(i);
      updateEvents(i);
      days += hasEvent
        ? `<div class="day active event">${i}</div>`
        : `<div class="day active">${i}</div>`;
    } else {
      days += hasEvent
        ? `<div class="day event">${i}</div>`
        : `<div class="day">${i}</div>`;
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners();
}

function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const target = e.target;
      const dayNumber = Number(target.innerHTML);

      if (target.classList.contains("prev-date")) {
        month = month === 0 ? 11 : month - 1;
        year = month === 11 ? year - 1 : year;
        activeDay = dayNumber;
        renderCalendar(); // Re-renderiza o calendário
      } else if (target.classList.contains("next-date")) {
        month = month === 11 ? 0 : month + 1;
        year = month === 0 ? year + 1 : year;
        activeDay = dayNumber;
        renderCalendar(); // Re-renderiza o calendário
      } else {
        // Atualiza activeDay com o número do dia clicado
        activeDay = dayNumber;

        // Chama getActiveDay para atualizar a div today-date e destacar o dia
        getActiveDay(activeDay);
        updateEvents(activeDay);

        // Remove a classe "active" de todos os dias e adiciona ao dia atual
        days.forEach((d) => d.classList.remove("active"));
        target.classList.add("active");
      }
    });
  });
}

addEventBtn.addEventListener("click", () => {
  clearForm();
  isEditing = false; // Modo de adição
  document.querySelector(".add-event-wrapper .title").innerText = "Adicionar Evento";
  document.querySelector(".add-event-btn").innerText = "Adicionar Evento";
  addEventWrapper.classList.add("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

[addEventFrom, addEventTo].forEach((input) => {
  input.addEventListener("input", (e) => {
    let value = input.value.replace(/[^0-9:]/g, "");
    if (value.length === 2 && !value.includes(":")) value += ":";
    input.value = value.slice(0, 5);
  });

  input.addEventListener("blur", () => {
    const [hour, minute] = input.value.split(":").map(Number);
    if (
      isNaN(hour) || isNaN(minute) ||
      hour < 0 || hour > 23 || minute < 0 || minute > 59
    ) {
      alert("Por favor, insira um horário válido no formato HH:mm.");
      input.value = "";
    }
  });
});

function getActiveDay(day) {
  const selectedDay = new Date(year, month, day);
  const dayName = selectedDay.toLocaleDateString("pt-BR", { weekday: "long" });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}
function updateEvents(day) {
  const events = eventsArr.filter(event =>
    event.day === day && event.month === month + 1 && event.year === year
  );

  let eventsHTML = events.map((event) => `
    <div class="event" data-event-id="${event.id}">
      <div class="title">
        <span class="event-title">${event.nota}</span>
        <div class="box-icone-editar">
          <i class="fa-solid fa-pen edit-icon" data-event-id="${event.id}"></i>
          <i class="fa-solid fa-trash delete-icon" data-event-id="${event.id}"></i>
        </div>
      </div>
      <div class="time">
        ${formatTimeWithAMPM(event.horarioInicio.slice(0, 5))} - ${formatTimeWithAMPM(event.horarioFim.slice(0, 5))}
      </div>
    </div>
  `).join("");

  eventsContainer.innerHTML = eventsHTML || `<div class="no-event">Sem Eventos</div>`;

  addEditListeners(); 
  addDeleteListeners(); 
}

function addEditListeners() {
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", handleEditClick);
  });
}

function addDeleteListeners() {
  document.querySelectorAll(".delete-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => handleDeleteClick(e));
  });
}

function formatTimeWithAMPM(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours.toString().padStart(2, '0'); // Mantém o formato 24 horas
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
}


function handleDeleteClick(e) {
  const eventId = e.target.dataset.eventId;
  console.log("Ícone de exclusão clicado para o ID:", eventId);

  if (confirm("Tem certeza de que deseja excluir este evento?")) {
    deleteEvent(eventId);
  }
}

  // Aplica novos listeners nos ícones clonados.
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => handleEditClick(e));
  });


  function handleEditClick(e) {
    const eventId = e.target.dataset.eventId;
    const event = eventsArr.find(event => String(event.id) === String(eventId));
    if (event) {
      editEvent(event); 
    } else {
      console.error("Evento não encontrado:", eventId);
    }
  }
    

const editIcons = eventsContainer.querySelectorAll(".fa-pen");
editIcons.forEach(icon => {
  icon.addEventListener("click", (e) => {
    const eventId = e.target.dataset.eventId;
    console.log("Ícone de edição clicado:", eventId);
    editEvent(eventId);
  });
});

function editEvent(event) {
  clearForm(); 
  isEditing = true; 
  eventToEdit = { ...event }; 

  addEventNote.value = event.nota || "";
  addEventFrom.value = event.horarioInicio ? event.horarioInicio.slice(0, 5) : "";
  addEventTo.value = event.horarioFim ? event.horarioFim.slice(0, 5) : "";

  document.querySelector(".add-event-wrapper .title").innerText = "Editar Evento";
  document.querySelector(".add-event-btn").innerText = "Editar Evento";

  addEventWrapper.classList.add("active"); 
}

addEventSubmit.addEventListener("click", async (e) => {
  e.preventDefault();

  // Verifique se todos os campos obrigatórios estão preenchidos
  if (!addEventNote.value || !addEventFrom.value || !addEventTo.value) {
    alert("Preencha todos os campos!");
    return;
  }

  const updatedEvent = {
    id: isEditing ? eventToEdit.id : eventsArr.length + 1, // Usa o ID do evento existente se estiver editando
    day: activeDay,
    month: month + 1,
    year: year,
    nota: addEventNote.value,
    horarioInicio: `${addEventFrom.value}:00`,
    horarioFim: `${addEventTo.value}:00`,
  };

  // Define o método e URL com base em isEditing
  const method = isEditing ? "PUT" : "POST";
  const url = isEditing
    ? `/calendario/editar/${updatedEvent.id}` // URL de atualização com ID do evento
    : "/calendario/salvar"; // URL de criação

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });

    const data = await response.json();
    if (data.success) {
      alert(isEditing ? "Evento atualizado!" : "Evento criado!");
      if (isEditing) {
        // Atualiza o evento no array de eventos
        const index = eventsArr.findIndex(e => e.id === updatedEvent.id);
        eventsArr[index] = updatedEvent;
      } else {
        eventsArr.push(updatedEvent);
      }
      updateEvents(activeDay);
      clearForm();
      addEventWrapper.classList.remove("active");
    }
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
  }
});

async function deleteEvent(eventId) {
  try {
    const response = await fetch(`/calendario/excluir/${eventId}`, {
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o evento.");
    }

    const data = await response.json();
    if (data.success) {
      alert("Evento excluído com sucesso!");
      eventsArr = eventsArr.filter(event => event.id !== Number(eventId));
      updateEvents(activeDay);
    } else {
      alert(data.message || "Erro ao excluir o evento.");
    }
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    alert("Ocorreu um erro ao excluir o evento.");
  }
}


function clearForm() {
  addEventNote.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  eventToEdit = null; // Remove o evento em edição
  isEditing = false;  // Reseta o estado de edição
}


prev.addEventListener("click", () => {
  month = month === 0 ? 11 : month - 1;
  year = month === 11 ? year - 1 : year;
  renderCalendar();
});

next.addEventListener("click", () => {
  month = month === 11 ? 0 : month + 1;
  year = month === 0 ? year + 1 : year;
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  const today = new Date();
  activeDay = today.getDate();
  month = today.getMonth();
  year = today.getFullYear();
  
  renderCalendar();
});


addEventBtn.addEventListener("click", () => {
  clearForm(); // Limpa o formulário antes de abrir para adicionar
  isEditing = false; // Garante que estamos no modo de adicionar
  addEventWrapper.classList.add("active"); // Exibe o formulário
});

addEventCloseBtn.addEventListener("click", () => {
  clearForm(); // Limpa tudo ao fechar.
  addEventWrapper.classList.remove("active");
});

// Listener para o botão de busca (vai para data específica)
gotoBtn.addEventListener("click", () => {
  const dateValue = dateInput.value.trim();

  // Verifica se a entrada está no formato "mm/yyyy"
  if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateValue)) {
    const [inputMonth, inputYear] = dateValue.split("/").map(Number);

    // Atualiza o mês e o ano
    month = inputMonth - 1; // Ajuste para índice do mês (0 a 11)
    year = inputYear;

    // Renderiza o calendário com a nova data
    renderCalendar();
  } else {
    alert("Por favor, insira a data no formato mm/yyyy.");
  }
});

dateInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
  
  // Limita o input a no máximo 6 caracteres
  if (value.length > 6) value = value.slice(0, 6);

  // Formata automaticamente para mm/yyyy
  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }
  
  e.target.value = value;
});


initCalendar();
