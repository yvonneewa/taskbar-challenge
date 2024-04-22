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

    taskList.forEach(task => {
        // const taskItem = $("<div>").text(`${task.title}: ${task.description}: ${task.dueDate}`);
        const taskItem = `<div class="card draggable" style="width: 18rem;" data-status="${task.status}" data-task-id ="${task.id}">
         <div class="card-body">
           <h5 class="card-title">${task.title}</h5>
           <h6 class="description mb-2 text-body-secondary">${task.description}</h6>
           <p class= "due-Date"> ${task.dueDate}</p>  
         </div>
       </div>`
        if (task.status === "To Do") {
            todoCards.append(taskItem);
        } else if (task.status === "in-progress") {
            inProgressCards.append(taskItem);
        } else if (task.status === "done") {
            doneCards.append(taskItem);
        }
    });

$( function() {
    $( ".draggable" ).draggable({
        zIndex: 50
    });
    // $( "#draggable2" ).draggable({ cancel: "p.ui-widget-header" });
    // $( "div, p" ).disableSelection();
  } );
}


// // Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
        const index = taskList.findIndex(task => task.id === taskId);
    
        
        if (index !== -1) {
            
            taskList.splice(index, 1);
    
            
            localStorage.setItem("tasks", JSON.stringify(taskList));
    
          
            renderTaskList();
        } else {
            console.log("Task not found!");
}
}


// // Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('data-task-id');
    const newStatus = $(event.target).attr('data-status');
console.log(newStatus)
    const taskIndex = taskList.findIndex(task => task.id.toString() === taskId);
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    renderTaskList();
}


// // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#taskForm").on("submit", handleAddTask); 
  //  $("#btnAddTask").on("click", handleAddTask); 
    
    $( ".lane" ).droppable({
        accept: ".draggable",
        drop: handleDrop,
         
      
      });

});


function colorCodeTasks() {
    const currentDate = new Date();

    taskList.forEach(task => {
        const dueDate = new Date(task.dueDate);
        const daysDifference = Math.floor((dueDate - currentDate) / (1000 * 60 * 60 * 24));

        if (daysDifference <= 0) {
            // Task is overdue
            todoCards.append(taskItem).find('.task-card').addClass('overdue');
        } else if (daysDifference <= 2) {
            // Task is nearing deadline
            todoCards.append(taskItem).find('.task-card').addClass('nearing-deadline');
        } else {
            // Task is normal
            todoCards.append(taskItem);
        }
    });
}





// // // GIVEN a task board to manage a project
// // // WHEN I open the task board
// // // THEN the list of project tasks is displayed in columns representing the task progress state (Not Yet Started, In Progress, Completed)
// // // WHEN I view the task board for the project
// // // THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
// // // WHEN I click on the button to define a new task
// // // THEN I can enter the title, description and deadline date for the new task into a modal dialog
// // // WHEN I click the save button for that task
// // // THEN the properties for that task are saved in localStorage
// // // WHEN I drag a task to a different progress column
// // // THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
// // // WHEN I click the delete button for a task
// // // THEN the task is removed from the task board and will not be added back after refreshing
// // // WHEN I refresh the page
// // // THEN the saved tasks persist
