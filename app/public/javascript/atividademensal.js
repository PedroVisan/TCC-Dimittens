document.addEventListener('DOMContentLoaded', function() {
    const monthsBr = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const tableDays = document.getElementById('dias');

    function GetDaysCalendar(mes, ano) {
        document.getElementById('mes').innerHTML = monthsBr[mes];
        document.getElementById('ano').innerHTML = ano;

   
        const cells = tableDays.getElementsByTagName('td');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerHTML = '';
            cells[i].classList.remove('mes-anterior', 'proximo-mes', 'dia-atual');
        }

        const firstDayOfWeek = new Date(ano, mes, 1).getDay();
        const getLastDayThisMonth = new Date(ano, mes + 1, 0).getDate();

        for (let i = 1; i <= getLastDayThisMonth; i++) {
            const dayTable = cells[firstDayOfWeek + i - 1];
            if (dayTable) {
                dayTable.innerHTML = i;
                dayTable.classList.add('dia-atual');
            }
        }

        const daysInLastMonth = new Date(ano, mes, 0).getDate();
        for (let i = 0; i < firstDayOfWeek; i++) {
            const dayTable = cells[i];
            if (dayTable) {
                dayTable.innerHTML = daysInLastMonth - firstDayOfWeek + 1 + i;
                dayTable.classList.add('mes-anterior');
            }
        }
        const totalCells = 42;
        for (let i = 1; firstDayOfWeek + getLastDayThisMonth + i <= totalCells; i++) {
            const dayTable = cells[firstDayOfWeek + getLastDayThisMonth + i - 1];
            if (dayTable) {
                dayTable.innerHTML = i;
                dayTable.classList.add('proximo-mes');
            }
        }
    }

    let now = new Date();
    let mes = now.getMonth();
    let ano = now.getFullYear();
    GetDaysCalendar(mes, ano);

    const botao_proximo = document.getElementById('btn_prev');
    const botao_anterior = document.getElementById('btn_ant');

    botao_proximo.onclick = function() {
        mes++;
        if (mes > 11) {
            mes = 0;
            ano++;
        }
        GetDaysCalendar(mes, ano);
    };

    botao_anterior.onclick = function() {
        mes--;
        if (mes < 0) {
            mes = 11;
            ano--;
        }
        GetDaysCalendar(mes, ano);
    };
});