"use strict";

$(document).ready(() => {
    const tasks = [];
    const originalTasks = []; 

    // Function to add a new task
    const addTask = (title, description, assignedTo, details, priority) => {
        const task = {
            id: Date.now(),
            title,
            description,
            assignedTo,
            details,
            priority, 
        };
        tasks.push(task);
        updateTaskList();
    };

    // Function to update the task list on the page
    const updateTaskList = (tasksToDisplay = tasks) => {
        const taskList = $("#task-list");
        taskList.empty();

        for (const task of tasksToDisplay) {
            let backgroundColor = ''; 

            if (task.priority === 'High') {
                backgroundColor = 'lightcoral'; 
            } else if (task.priority === 'Medium') {
                backgroundColor = 'lightyellow'; 
            } else if (task.priority === 'Low') {
                backgroundColor = 'lightblue'; 
            }

            const taskItem = $('<div class="task-item"></div>');
            taskItem.css('background-color', backgroundColor); 
            taskItem.append(`
                <h3>${task.title}</h3>
                <p>Description: ${task.description}</p>
                <p>Assigned To: ${task.assignedTo}</p>
                <p>Details: ${task.details}</p>
                <p>Priority: ${task.priority}</p>
                <button class="edit-task" data-id="${task.id}">Edit</button>
                <button class="delete-task" data-id="${task.id}">Delete</button>
            `);

            taskList.append(taskItem);
        }
    };

    // Function to handle form submission
    $("#task-form").submit((e) => {
        e.preventDefault();

        const title = $("#task-title").val();
        const description = $("#task-description").val();
        const assignedTo = $("#assigned-to").val();
        const details = $("#details").val();
        const priority = $('input[name="priority"]:checked').val();

        if (description && assignedTo && priority) {
            addTask(title, description, assignedTo, details, priority);
            $("#task-form")[0].reset();
            updateTaskList(); 
        } else {
            alert("Please fill in all fields and select a priority.");
        }
    });

    // Function to handle task deletion
    $(document).on('click', '.delete-task', function () {
        const taskId = parseInt($(this).data('id'));

        // Find the index of the task to delete
        const taskIndex = tasks.findIndex((task) => task.id === taskId);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1); 
            updateTaskList();
        }
    });

    // Function to handle task editing
    $(document).on('click', '.edit-task', function () {
        const taskId = parseInt($(this).data('id'));
        const taskToEdit = tasks.find((task) => task.id === taskId);

        // Show the edit form and populate it with task details
        $("#edit-form").show();
        $("#edit-task-id").val(taskToEdit.id);
        $("#edit-task-title").val(taskToEdit.title);
        $("#edit-task-description").val(taskToEdit.description);
        $("#edit-assigned-to").val(taskToEdit.assignedTo);
        $("#edit-details").val(taskToEdit.details);

        // Check the correct priority radio button
        $('input[name="edit-priority"]').each(function() {
            if ($(this).val() === taskToEdit.priority) {
                $(this).prop("checked", true);
            }
        });

        // Hide the original task
        tasks = tasks.filter((task) => task.id !== taskId);
        updateTaskList();
    });

    // Function to handle edit form submission
    $("#edit-task-form").submit((e) => {
        e.preventDefault();

        const taskId = parseInt($("#edit-task-id").val());
        const updatedTitle = $("#edit-task-title").val();
        const updatedDescription = $("#edit-task-description").val();
        const updatedAssignedTo = $("#edit-assigned-to").val();
        const updatedDetails = $("#edit-details").val();
        const updatedPriority = $('input[name="edit-priority"]:checked').val(); 

        // Update the original task
        const taskToUpdate = tasks.find((task) => task.id === taskId);
        taskToUpdate.title = updatedTitle;
        taskToUpdate.description = updatedDescription;
        taskToUpdate.assignedTo = updatedAssignedTo;
        taskToUpdate.details = updatedDetails;
        taskToUpdate.priority = updatedPriority;

        // Hide the edit form
        $("#edit-form").hide();
        updateTaskList();
    });

    // Function to handle search filter
    $("#search-button").click(() => { 
        const searchTerm = $("#search-input").val().toLowerCase();
        const filteredTasks = originalTasks.filter((task) => {
            return (
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm) ||
                task.assignedTo.toLowerCase().includes(searchTerm) ||
                task.details.toLowerCase().includes(searchTerm)
            );
        });

        updateTaskList(filteredTasks); 
    });
    // Function to handle the "Show All" button
    $("#show-all-button").click(() => {
        $("#search-input").val(""); 
        updateTaskList(); 
    });

    // Load tasks from localStorage on page load
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(...storedTasks);
    originalTasks.push(...storedTasks); 
    updateTaskList();

    // Save tasks to localStorage whenever the tasks array changes
    const saveTasksToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    setInterval(saveTasksToLocalStorage, 1000); 
});
