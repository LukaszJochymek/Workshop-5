const apikey = '7ffa16ed-c426-4c63-8dd3-af9184684946';
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function renderTask(taskId, title, description, status) {
    const section = document.createElement("section");
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    const listUl = document.createElement('ul');
    listUl.className = 'list-group list-group-flush';
    section.appendChild(listUl);

    apiListOperationsForTask(taskId).then(response => {
        response.data.forEach(operation => {
            renderOperation(listUl, status, operation.id, operation.description, operation.timeSpent);
        });
    });


    const divForm = document.createElement('div');
    divForm.className = 'card-body js-task-open';
    section.appendChild(divForm);

    const form = document.createElement('form');
    divForm.appendChild(form);


    const divInput = document.createElement('div');
    divInput.className = 'input-group js-task-open';
    form.appendChild(divInput);


    const inputAdd = document.createElement('input')
    inputAdd.className = 'form-control';
    inputAdd.innerHTML = 'type="text" placeholder="Operation description" minlength="5"';
    divInput.appendChild(inputAdd);


    const divBtnAppend = document.createElement('div');
    divBtnAppend.className = 'input-group-append';
    divInput.appendChild(divBtnAppend);

    const btnAppend = document.createElement('button');
    btnAppend.className = 'btn btn-info js-task-open';
    btnAppend.innerText = 'Add';
    divBtnAppend.appendChild(btnAppend);

    form.addEventListener("submit", e =>{
        e.preventDefault();
        const inputAddValue = inputAdd.value;
        apiCreateOperationForTask(taskId,inputAddValue).then(response =>{
            renderOperation(listUl,status,response.data.id,response.data.description)
        })
    })

    if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only js-task-open';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener("click" , (e)=>{
            apiUpdateTask(taskId,title,description,status).then(response=>{
                section.querySelectorAll(".js-task-open").forEach(el=>el.remove());


            })
        })
    }


    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    deleteButton.addEventListener('click', function(e) {
          apiDeleteTask(taskId).then(response => {
              section.remove();

              // renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
          });

    })


}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {
            headers: {Authorization: apikey}
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    );
}

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    // function (timeSpent){
    //     let timeFormat = number((timeSpent / 60));
    //     return timeFormat
    // }
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    // operationsList to lista <ul>
    operationsList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = timeSpent + 'm';
    descriptionDiv.appendChild(time);

    const divBtn = document.createElement('div');
    li.appendChild(divBtn);
    if (status == 'open') {

        const btnQuarter = document.createElement('button');
        btnQuarter.className = 'btn btn-outline-success btn-sm mr-2 js-task-open';
        btnQuarter.innerText = "+15m";
        divBtn.appendChild(btnQuarter);

        const btnHour = document.createElement('button');
        btnHour.className = 'btn btn-outline-success btn-sm mr-2 js-task-open';
        btnHour.innerText = "+1h";
        divBtn.appendChild(btnHour);

        btnQuarter.addEventListener("click", e=>{
            apiUpdateOperation(operationId,operationDescription,timeSpent+15).then(response =>{
                timeSpent = timeSpent+15;
                time.innerText= response.data.timeSpent;
            });

        })

        btnHour.addEventListener("click", e=>{
            apiUpdateOperation(operationId,operationDescription,timeSpent+60).then(response =>{
                timeSpent = timeSpent +60;
                time.innerText= response.data.timeSpent;
            });
        })

    }
    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn btn-outline-danger btn-sm';
    btnDelete.innerText = "Delete";
    divBtn.appendChild(btnDelete);

    btnDelete.addEventListener("click", e =>{
        apiDeleteOperation(operationId).then(response=>{
            li.remove();
        })
    })
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey,'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}
function apiDeleteTask(taskId) {
    return fetch(
        apihost + `/api/tasks/${taskId}`,
        {

            headers: {Authorization: apikey, 'Content-Type': 'application/json'},

            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();

        }
    )
}

function apiDeleteOperation(operationId){
    return fetch(
        apihost + `/api/operations/${operationId}`,
        {

            headers: {Authorization: apikey, 'Content-Type': 'application/json'},

            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();

        }
    )
}
function apiCreateOperationForTask(taskId, description) {
    return fetch(
        apihost + `/api/tasks/${taskId}/operations`,
        {
            body: JSON.stringify({description: description, timeSpent:0 }),
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            } else if (resp.ok) {
                return resp.json();
            }
        }
    )

}

function apiUpdateOperation(operationId, description, timeSpent){
    return fetch(
        apihost + `/api/operations/${operationId}`,
        {
            body: JSON.stringify({description:description, timeSpent: timeSpent }),
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            } else if (resp.ok) {
                return resp.json();
            }
        }
    )
}

function apiUpdateTask(taskId, title, description, status){
    return fetch(
        apihost + `/api/tasks/${taskId}`,
        {
            body: JSON.stringify({title: title, description: description, status: 'close'}),
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            method: 'PUT'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            } else if (resp.ok) {
                return resp.json();
            }
        }
    )
}


document.addEventListener('DOMContentLoaded', function () {
    apiListTasks().then(
        function (response) {
            // "response" zawiera obiekt z kluczami "error" i "data" (zob. wyżej)
            // "data" to tablica obiektów-zadań

            // uruchamiamy funkcję renderTask dla każdego zadania jakie dał nam backend

            response.data.forEach(
                function (task) {
                    renderTask(task.id, task.title, task.description, task.status);
                }
            );
        });



    const formAddTask = document.querySelector(".js-task-adding-form");
    formAddTask.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputName = formAddTask.querySelector("#name");
        const inputDecription = formAddTask.querySelector("#description");

        let formInputValueName = inputName.value;
        let formInputValueDescription = inputDecription.value;
        apiCreateTask(formInputValueName,formInputValueDescription).then(response => {
                            renderTask(response.data.id, response.data.title, response.data.description, response.data.status)
            });
        })





    });
