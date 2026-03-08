// Seleciona todos os inputs do tipo radio e as seções correspondentes
const radios = document.querySelectorAll('input[name="options"]');
const sections = {
    edit: document.querySelector('.editarperf'),
    consultations: document.querySelector('.consultpsic'),
    saved: document.querySelector('.salvopsic'),
    help: document.querySelector('.needhelp'),
};
 
// Função que oculta todas as seções
function hideAllSections() {
    Object.values(sections).forEach(section => {
        section.style.display = 'none';
    });
}
 
// Função que exibe a seção correspondente ao ID salvo
function showSectionById(id) {
    const sectionToShow = sections[id];
    if (sectionToShow) {
        sectionToShow.style.display = 'block';
    }
}
 
// Evento para salvar a opção selecionada no LocalStorage
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        hideAllSections(); // Oculta todas as seções
        const sectionId = radio.id; // Identifica o ID do input selecionado
        showSectionById(sectionId); // Exibe a seção correspondente
        localStorage.setItem('selectedSection', sectionId); // Salva no LocalStorage
    });
});
 
// Restaura a seção salva no LocalStorage ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    const savedSectionId = localStorage.getItem('selectedSection');
    if (savedSectionId) {
        const radioToSelect = document.getElementById(savedSectionId);
        if (radioToSelect) radioToSelect.checked = true;
        showSectionById(savedSectionId); // Exibe a seção salva
    } else {
        // Exibe a primeira seção se nenhuma estiver salva
        radios[0].checked = true;
        showSectionById(radios[0].id);
    }
});