const table = document.getElementById('table-show');
const row = document.querySelectorAll('#table-show>.row');
const cancel_modal = document.getElementById('cancel');
const save_modal = document.getElementById('save');
var today = document.querySelector('.today');
var next_week = document.querySelector('.next-week');
var last_week = document.querySelector('.last-week');
var date_current = new Date();
var show = false;

const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];


var data = [
    {
        id: 1,
        title: 'Play Soccer',
        description: 'at YU',
        date: '2022-06-29',
        time: 3,
    },
];

var width_screen = table.offsetWidth;
resizeWidthColumn();
addTaskToWeek(date_current);
setIDCols();

next_week.addEventListener('click', function() {
    date_current = getNextWeek(date_current);
    addTaskToWeek(date_current);
});

last_week.addEventListener('click', function() {
    date_current = getLastWeek(date_current);
    addTaskToWeek(date_current);
});


today.addEventListener('click', function() {
    date_current = new Date();
    addTaskToWeek(date_current);
}
);

document.onclick = function(e) {
    if (e.target.classList.contains('col') && !show) {
        clearModal();
        document.getElementById('title-modal').innerHTML = 'Making Notes';
        document.querySelector('.modal').style = 'margin-left: -20px;animation: show 0.5s;';
        show = true;

        const col = e.target.getAttribute('data-col');
        const row = e.target.getAttribute('data-row');
        const first = getFirstAndLastDayOfWeek(date_current).firstDay;
        const last = getFirstAndLastDayOfWeek(date_current).lastDay;
        const days = getDays(first, last);
        const date = formatDate(days[col-1]);
        const hour = getHourName(row);

        setDataModal(date, hour);
    }
};

save_modal.addEventListener('click', function() {
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;
    var hour = document.getElementById('hour-task').value;
    var date = document.getElementById('date-task').value;
    var id = document.getElementById('task-id').value;

    if (title == '' || description == '' || hour == '' || date == '') {
        alert('You are missing tittle/description,complete filling now or later ASAP please!');
    }

    hour = changeHourNameToNumber(hour);

    if (id != -1) {
        var task = data.find(function(item) {
            return item.id == id;
        });

        task.title = title;
        task.description = description;
        task.time = hour;
        task.date = date;

        document.querySelector('.modal').style = 'margin-left: -100%;animation: hide 0.5s;';
        show = false;
        clearModal();

        clearTable();
        addTaskToWeek(date_current);
        return;
    }

    var maxId = data.reduce(function(a, b) {
        return a.id > b.id ? a : b;
    },
    { id: 0 }).id;

    var task = {
        id: maxId + 1,
        title: title,
        description: description,
        date: date,
        time: hour,
    };

    data.push(task);

    document.querySelector('.modal').style = 'margin-left: -100%;animation: hide 0.5s;';

    show = false;
    clearModal();

    clearTable();
    addTaskToWeek(date_current);
});

cancel_modal.addEventListener('click', function() {
    document.querySelector('.modal').style = 'margin-left: -100%;animation: hide 0.5s;';
    show = false;
});

function selectTask(id) {
    var task = data.find(function(item) {
        return item.id == id;
    });
    setDataModal(task.date, getHourName(task.time), task.title, task.description, task.id);
    document.getElementById('title-modal').innerHTML = 'Edit task';

    document.querySelector('.modal').style = 'margin-left: -20px;animation: show 0.5s;';
    show = true;
}

function clearTable() {
    document.querySelectorAll('#table-show>.row>.col:not(:first-child)').forEach(function(item) {
        item.innerHTML = '';
    });
    let tasks = getNumberTask(date_current);
    let first = getFirstAndLastDayOfWeek(date_current).firstDay;
    let last = getFirstAndLastDayOfWeek(date_current).lastDay;
    let days = getDays(first, last);

    document.querySelectorAll('.table-calendar>.header>.item').forEach(function(item, index) {
        item.classList.remove('future');
        if (index != 0) {
            document.getElementById(`task-${index}`).style = "";
            document.getElementById(`task-${index}`).innerHTML = tasks[index-1] == 0 ? '' : tasks[index-1] + ' tasks';
            if (tasks[index-1] != 0) {
                if (isFuture(days[index-1]))
                {
                    item.classList.add('future');
                }

                document.getElementById(`task-${index}`).style = "padding: 2px 5px";
                
            } 
        }
    });
}

function clearModal() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('hour-task').value = '';
    document.getElementById('date-task').value = '';
    document.getElementById('task-id').value = '';
}

function setDataModal(date, hour, title = '', description = '', $id = '-1') {
    document.getElementById('date-task').value = date;
    document.getElementById('hour-task').value = hour;
    document.getElementById('title').value = title;
    document.getElementById('description').value = description;
    document.getElementById('task-id').value = $id;
}

function getNumberTask(date) {
    var first = getFirstAndLastDayOfWeek(date).firstDay;
    var last = getFirstAndLastDayOfWeek(date).lastDay;
    var days = getDays(first, last);
    var number = [];
    for (var i = 0; i < days.length; i++) {
        temp = 0;
        temp += data.filter(function(item) {
            return item.date == formatDate(days[i]);
        }
        ).length;
        number.push(temp);
    }
    return number;
}

window.addEventListener('resize', function() {
    width_screen = table.offsetWidth;
    resizeWidthColumn();
});

function setIDCols() {
    row.forEach(function(item, index) {
        const col = item.querySelectorAll('.col');
        col.forEach(function(item, index2) {
            item.setAttribute('data-col', index2);
            item.setAttribute('data-row', index);
        });
    });
}

function addTaskToWeek(date) {
    clearTable();
    let first = getFirstAndLastDayOfWeek(date).firstDay;
    let last = getFirstAndLastDayOfWeek(date).lastDay;
    updateMonthAndYear(first);
    updateDaysOfWeek(getDays(first, last));

    let days = getDays(first, last);
    days.forEach(item => {
        addTaskToDate(item);
    }
    );
}

function addTaskToDate(date) {
    const day = date.getDay();
    date = formatDate(date);

    const result = data.filter(item => item.date === date);
    if (result.length > 0) {
        let html = '';
        result.forEach(item => {
            const colorRandom = colors[Math.floor(Math.random() * colors.length)];
            html = `<div class="item" style="background-color: ${colorRandom};" data-id="${item.id}">
                        <p>x</p>
                        <span">${item.title}</span>
                    </div>`;
            row[item.time].querySelectorAll('.col')[day].insertAdjacentHTML('beforeend', html);
            const e = document.querySelector(`.item[data-id="${item.id}"]`);
            e.addEventListener('click', function () {
                selectTask(item.id);
            });
            const p = e.querySelector('p');
            p.addEventListener('click', function () {
                removeTask(item.id);
            });
        }
        );
    }
}

function removeTask(id) {
    data = data.filter(item => item.id !== id);
    clearTable();
    addTaskToWeek(date_current);
}

function updateMonthAndYear(date) {
    var month = date.toLocaleString('en-US', { month: 'long' });
    var year = date.getFullYear();
    document.querySelector('.time').innerHTML = month + ' ' + year;
}

function updateDaysOfWeek(days) {
    var i = 1;
    days.forEach(element => {
        document.getElementById(`day-${i++}`).innerHTML = element.getDate();
    });
}

function resizeWidthColumn() {
    let width_column = (width_screen - 70)/7;
    document.querySelectorAll('.header>.item:not(:first-child)').forEach(function(item) {
        item.style.width = width_column + 'px';
    });
    document.querySelectorAll('#table-show>.row>.col:not(:first-child)').forEach(function(item) {
        item.style.width = width_column + 'px';
    });
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}

function getFirstAndLastDayOfWeek(date) {
    var firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7);
    return {
        firstDay: firstDay,
        lastDay: lastDay
    }
}

function getDays(a, b) {
    var days = [];
    var currentDate = new Date(a);
    while (currentDate <= b) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
}

function getMonthAndYear(date) {
    var month = date.getMonth();
    var year = date.getFullYear();
    return {
        month: month + 1,
        year: year
    }
}

function getLastWeek(date) {
    var lastWeek = new Date(date);
    lastWeek.setDate(lastWeek.getDate() - 7);
    return lastWeek;
}

function getNextWeek(date) {
    var lastWeek = new Date(date);
    lastWeek.setDate(lastWeek.getDate() + 7);
    return lastWeek;
}

function formatDate(date) {
    var d = new Date(date),

    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getHourName(hour) {
    if (hour == 0)
        return '12 AM';
    if (hour < 12)
        return hour + ' AM';
    if (hour == 12)
        return '12 PM';
    return hour - 12 + ' PM';
}

function changeHourNameToNumber(hourName) {
    if (hourName == '12 AM')
        return 0;
    if (hourName == '12 PM')
        return 12;
    if (hourName.indexOf('AM') > -1)
        return parseInt(hourName.split(' ')[0]);
    return parseInt(hourName.split(' ')[0]) + 12;
}

function isFuture(date) {
    var today = new Date();
    date = new Date(date);
    // date.setHours(hour);
    return date >= today;
}