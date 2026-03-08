// Seleção dos elementos do DOM
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  dateInput = document.querySelector(".date-input"),
  gotoBtn = document.querySelector(".goto-btn"),
  markAvailableBtn = document.querySelector(".mark-available-btn"),
  cancelSelectionBtn = document.querySelector(".cancel-selection-btn");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();
let availableDays = [];
let selectingDays = false;
let selectedDays = [];
let mode = 'add';
let removingDays = false;
let isListenersInitialized = false;


const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];



// Função para inicializar o calendário
function initCalendar() {
  activeDay = today.getDate();
  renderCalendar();
  getActiveDay(activeDay);
  loadAvailableDays();
}


// Renderiza o calendário e aplica a visualização dos dias disponíveis e selecionados
function renderCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  if (activeDay > lastDate) activeDay = lastDate;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  // Preenche dias
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  for (let i = 1; i <= lastDate; i++) {
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(i));
    const isActive = i === activeDay && year === today.getFullYear() && month === today.getMonth();
    days += `<div class="day ${isActive ? 'active' : ''} ${isAvailable ? 'available' : ''}">${i}</div>`;
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addListeners(); // Adiciona eventos nos dias
}

// Carregar dias disponíveis ao iniciar
async function loadAvailableDays() {
  try {
    const response = await fetch('/dashboardpsicologo/dias-disponiveis');
    const data = await response.json();

    if (data.success) {
      availableDays = data.diasDisponiveis;
      renderCalendar(); // Atualiza o calendário com os dias disponíveis
    }
  } catch (error) {
    console.error("Erro ao carregar dias disponíveis:", error);
  }
}

function handleMarkButtonClick() {
  if (window.isMarkingAvailable) return; // Evita duplicação
  window.isMarkingAvailable = true;

  const activeDayElement = document.querySelector(".day.active");

  if (activeDayElement && !activeDayElement.classList.contains("available")) {
    const activeMonth = month + 1;

    fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: [activeDay], month: activeMonth })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Dia marcado como disponível com sucesso!");
          loadAvailableDays(); // Atualiza dias disponíveis
        } else {
          throw new Error(data.message || "Erro ao salvar o dia como disponível.");
        }
      })
      .catch(error => console.error("Erro ao salvar o dia disponível:", error))
      .finally(() => {
        window.isMarkingAvailable = false; // Libera o estado
      });
  } else {
    alert("O dia já está disponível ou não foi selecionado.");
    window.isMarkingAvailable = false; // Libera o estado em erro
  }
}

function handleCancelButtonClick() {
  if (window.isRemovingAvailable) return; // Evita duplicação
  window.isRemovingAvailable = true;

  const activeDayElement = document.querySelector(".day.active");

  if (activeDayElement && activeDayElement.classList.contains("available")) {
    const activeMonth = month + 1;

    fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: [activeDay], month: activeMonth })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Dia removido com sucesso!");
          loadAvailableDays(); // Atualiza dias disponíveis
        } else {
          throw new Error(data.message || "Erro ao remover o dia disponível.");
        }
      })
      .catch(error => console.error("Erro ao remover o dia disponível:", error))
      .finally(() => {
        window.isRemovingAvailable = false; // Libera o estado
      });
  } else {
    alert("O dia atual não está disponível para remoção.");
    window.isRemovingAvailable = false; // Libera o estado em erro
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM carregado com sucesso!');
  initCalendar();
  loadAvailableDays();
  initListeners(); // Configura os listeners uma vez
});


function initListeners() {
  if (isListenersInitialized) return;

  markAvailableBtn.addEventListener("click", handleMarkButtonClick);
  cancelSelectionBtn.addEventListener("click", handleCancelButtonClick);

  isListenersInitialized = true;
}



// Atualiza o estado do botão com base no modo de seleção
function updateMarkAvailableButton() {
  if (selectingDays) {
    markAvailableBtn.textContent = mode === 'add' ? "Confirmar Marcação" : "Confirmar Remoção";
  } else {
    markAvailableBtn.textContent = "Marcar Disponível";
  }
}

function toggleDaySelection(dayElement, dayNumber) {
  if (!selectingDays) return;

  if (mode === 'add') {
    const isAlreadySaved = availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber));
    if (isAlreadySaved) {
      alert("Este dia já está disponível.");
      return;
    }

    if (!selectedDays.includes(dayNumber)) {
      selectedDays.push(dayNumber);
      dayElement.classList.add("selected"); // Destaca em verde
    } else {
      selectedDays = selectedDays.filter(day => day !== dayNumber);
      dayElement.classList.remove("selected");
    }
  } else if (mode === 'remove') {
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber));
    if (!isAvailable) {
      alert("Somente dias disponíveis podem ser removidos.");
      return;
    }

    if (!selectedDays.includes(dayNumber)) {
      selectedDays.push(dayNumber);
      dayElement.classList.add("remove"); // Destaca em vermelho
    } else {
      selectedDays = selectedDays.filter(day => day !== dayNumber);
      dayElement.classList.remove("remove");
    }
  }
}

function highlightActiveDay() {
  const activeDayElement = document.querySelector(".day.active");

  if (activeDayElement) {
    activeDayElement.classList.add("selected");
    console.log("Dia ativo destacado visualmente.");
  }
}

// Alterna entre modos de seleção para marcar e remover dias
markAvailableBtn.addEventListener("click", () => {
  const activeDayElement = document.querySelector(".day.active");

  if (activeDayElement && !activeDayElement.classList.contains("available")) {
    const activeMonth = month + 1;

    fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: [activeDay], month: activeMonth })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Dia marcado como disponível com sucesso!");
          loadAvailableDays();
        } else {
          throw new Error(data.message || "Erro ao salvar o dia como disponível.");
        }
      })
      .catch(error => console.error("Erro ao salvar o dia disponível:", error));
  } else {
    alert("O dia já está disponível ou não foi selecionado.");
  }

  renderCalendar(); // Atualiza o calendário
});


async function confirmCancelSelection() {
  // Adiciona o dia atual à seleção se ainda não estiver
  if (!selectedDays.includes(activeDay)) {
    selectedDays.push(activeDay);
  }

  if (selectedDays.length === 0) {
    alert("Selecione pelo menos um dia antes de confirmar.");
    return;
  }

  const activeMonth = month + 1;

  try {
    const response = await fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: selectedDays, month: activeMonth })
    });

    const data = await response.json();
    if (data.success) {
      alert("Dias removidos com sucesso!");
      resetSelection();
      loadAvailableDays();
    } else {
      throw new Error(data.message || "Erro ao remover dias disponíveis.");
    }
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
  }
}

async function saveAvailableDays(days, month) {
  try {
    console.log("Enviando dias para salvar:", days, month);
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    console.log("Resposta do backend ao salvar:", data);
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao salvar dias disponíveis:", error);
  }
}

async function removeAvailableDays(days, month) {
  try {
    console.log("Enviando dias para remover:", days, month);
    const response = await fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, month })
    });
    const data = await response.json();
    console.log("Resposta do backend ao remover:", data);
    if (!data.success) throw new Error(data.message);
  } catch (error) {
    console.error("Erro ao remover dias disponíveis:", error);
  }
}

// addListeners - Garantindo que o activeDay é atualizado ao clicar
function addListeners() {
  const days = document.querySelectorAll(".day");

  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      const target = e.target;
      const dayNumber = Number(target.innerHTML);

      if (target.classList.contains("prev-date") || target.classList.contains("next-date")) {
        alert("Selecione apenas dias do mês atual.");
        return;
      }

      // Define o dia ativo e destaca visualmente
      activeDay = dayNumber;
      days.forEach((d) => d.classList.remove("active"));
      target.classList.add("active");
      getActiveDay(activeDay);
    });
  });
}


async function confirmDaySelection() {
  if (selectedDays.length === 0) {
    alert("Selecione pelo menos um dia antes de confirmar.");
    return;
  }

  const activeMonth = month + 1;

  try {
    const response = await fetch('/dashboardpsicologo/marcar-disponivel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: selectedDays, month: activeMonth })
    });
    const data = await response.json();
    if (data.success) {
      alert("Dias marcados como disponíveis com sucesso!");
      resetSelection();
      loadAvailableDays(); // Atualiza o calendário com os dias disponíveis
    } else {
      throw new Error(data.message || "Erro ao salvar dias disponíveis.");
    }
  } catch (error) {
    console.error("Erro ao salvar dias disponíveis:", error);
  }
}

function getActiveDay(day) {
  const selectedDay = new Date(year, month, day);
  const dayName = selectedDay.toLocaleDateString("pt-BR", { weekday: "long" });
  eventDay.innerHTML = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  eventDate.innerHTML = `${day} ${months[month]} ${year}`;
}

todayBtn.addEventListener("click", () => {
  const today = new Date();
  activeDay = today.getDate();
  month = today.getMonth();
  year = today.getFullYear();
  renderCalendar();
});

gotoBtn.addEventListener("click", () => {
  const dateValue = dateInput.value.trim();

  if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(dateValue)) {
    const [inputMonth, inputYear] = dateValue.split("/").map(Number);

    month = inputMonth - 1;
    year = inputYear;

    renderCalendar();
  } else {
    alert("Por favor, insira a data no formato mm/yyyy.");
  }
});

dateInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 6) value = value.slice(0, 6);
  if (value.length >= 3) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }
  e.target.value = value;
});

prev.addEventListener("click", () => {
  if (selectingDays) {
    alert("Conclua a seleção deste mês antes de mudar para outro mês.");
    return;
  }
  month = month === 0 ? 11 : month - 1;
  year = month === 11 ? year - 1 : year;
  renderCalendar();
});

next.addEventListener("click", () => {
  if (selectingDays) {
    alert("Conclua a seleção deste mês antes de mudar para outro mês.");
    return;
  }
  month = month === 11 ? 0 : month + 1;
  year = month === 0 ? year + 1 : year;
  renderCalendar();
});

cancelSelectionBtn.addEventListener("click", () => {
  const activeDayElement = document.querySelector(".day.active");

  if (activeDayElement && activeDayElement.classList.contains("available")) {
    const activeMonth = month + 1;

    fetch('/dashboardpsicologo/remover-disponiveis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days: [activeDay], month: activeMonth })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert("Dia removido com sucesso!");
          loadAvailableDays(); // Atualiza os dias disponíveis
        } else {
          throw new Error(data.message || "Erro ao remover o dia disponível.");
        }
      })
      .catch(error => console.error("Erro ao remover o dia disponível:", error));
  } else {
    alert("O dia atual não está disponível para remoção.");
  }

  renderCalendar(); // Atualiza o calendário
});


function enableDaySelection(mode) {
  const days = document.querySelectorAll(".day");
  days.forEach((dayElement) => {
    const dayNumber = Number(dayElement.innerHTML);
    const isAvailable = availableDays.some(d => d.mes === month + 1 && d.dias.includes(dayNumber));

    dayElement.addEventListener("click", () => {
      if (mode === "mark") {
        if (!dayElement.classList.contains("prev-date") && !dayElement.classList.contains("next-date")) {
          toggleDaySelection(dayElement, dayNumber);
        } else {
          alert("Selecione apenas dias do mês atual.");
        }
      } else if (mode === "cancel" && isAvailable) {
        toggleDaySelection(dayElement, dayNumber);
      } else if (mode === "cancel") {
        alert("Este dia não possui disponibilidade para cancelar.");
      }
    });
  });
}

function resetSelection() {
  renderCalendar(); // Apenas redefine o estado interno e renderiza
}


function validateInitialState() {
  if (mode === 'remove') {
    alert("Nenhum dia selecionado para remover.");
    resetSelection();
    return;
  }
}

