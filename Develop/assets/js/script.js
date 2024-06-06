// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) ||"122";

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskId = JSON.parse(localStorage.getItem("taskId")) ?? 0;
    taskId++;
    localStorage.setItem('taskId', taskId);
    return taskId;
}

function createTaskCard() {
    const task = {
        id: generateTaskId(),
        title: $("#taskTitle").val(),
        description: $("#taskDescription").val(),
        dueDate: $("#dueDate").val(),
        status:"To Do"
    };

    console.log("Task ID:", task.id);
    console.log("Task Card Created:", task); 

    return task; 
}

function handleAddTask(event) {
    event.preventDefault();
    const taskCard = createTaskCard(); 
    taskList.push(taskCard); 

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const todoCards = $("#todo-cards");
    const inProgressCards = $("#in-progress-cards");
    const doneCards = $("#done-cards");

    todoCards.empty();
    inProgressCards.empty();
    doneCards.empty();

    const currentDate = new Date(); // Get current date

    taskList.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const daysDifference = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

        // Add appropriate class based on due date status
        let taskItemClass = "card draggable";
        if (daysDifference <= 0) {
            // Task is overdue
            taskItemClass += " overdue";
        } else if (daysDifference <= 2) {
            // Task is nearing deadline
            taskItemClass += " nearing-deadline";
        }
        const taskItem = `<div class="${taskItemClass}" style="width: 18rem;" data-status="${task.status}" data-task-id="${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <h6 class="description mb-2 text-body-secondary">${task.description}</h6>
            <p class="due-Date">${task.dueDate}</p>  
            <button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Delete</button>
        </div>
    </div>`;
    

        // Append the task card to appropriate swim lane
        if (task.status === "To Do") {
            todoCards.append(taskItem);
        } else if (task.status === "in-progress") {
            inProgressCards.append(taskItem);
        } else if (task.status === "done") {
            doneCards.append(taskItem);
        }
    });

    // Make the task cards draggable
    $(".draggable").draggable({
        zIndex: 50
    });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
    const index = taskList.findIndex(task => task.id.toString() === taskId);
    
    if (index !== -1) {
        taskList.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
    } else {
        console.log("Task not found!");
    }
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('data-task-id');
    const newStatus = $(event.target).attr('data-status');

    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    renderTaskList();
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#taskForm").on("submit", handleAddTask); 
    
    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop,
    });
});

$(document).on("click", ".delete-task", function() {
    const taskId = $(this).attr('data-task-id');
    handleDeleteTask(taskId);
});
