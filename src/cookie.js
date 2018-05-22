/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function (e) {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    populateCookiesToTable(e.target.value);
});

function getCookiesObj() {
    let cookiesObj = document.cookie.split('; ')
        .reduce((prev, current) => {
            const [name, value] = current.split('=');

            prev[name] = value;

            return prev;
        }, {});

    return cookiesObj;
}

document.onload = populateCookiesToTable();

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"

    let cookieName = addNameInput.value;
    let cookieValue = addValueInput.value;

    if (cookieName && cookieValue) {
        document.cookie = `${cookieName}=${cookieValue}`;
    }

    // addNameInput.value = '';
    // addValueInput.value = '';

    populateCookiesToTable(filterNameInput.value);
});

function populateCookiesToTable(filter = '' ) {
    const cookiesObj = getCookiesObj();
    
    listTable.innerHTML = '';

    for (const key of Object.keys(cookiesObj)) {
        let cookieName = key;
        let cookieValue = cookiesObj[key];
        
        if (!cookieName || !cookieValue) {
            continue;
        }

        if (cookiesObj.hasOwnProperty(key) && (isMatching(cookieName, filter) || isMatching(cookieValue, filter))) {
            let newTr = document.createElement('tr');
            let tdName = document.createElement('td');
            let tdValue = document.createElement('td');
            let tdDelete = document.createElement('td');
            let deleteBtn = document.createElement('button');

            tdName.innerText = cookieName;
            tdValue.innerText = cookieValue;
            deleteBtn.innerText = ' удалить';
            deleteBtn.setAttribute('data-id', cookieName);
            tdDelete.appendChild(deleteBtn);
            newTr.appendChild(tdName);
            newTr.appendChild(tdValue);
            newTr.appendChild(tdDelete);
            listTable.appendChild(newTr);
        }
    }
}

function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase()); 
}

listTable.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        deleteCookie(e.target.getAttribute('data-id'));
    }
});

function deleteCookie(name) {
    document.cookie = `${name}=; expires=${new Date(0)}`;
    populateCookiesToTable(filterNameInput.value);
}