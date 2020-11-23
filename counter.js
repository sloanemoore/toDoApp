// this gets the test counter in the controller to work.
// use this idea to update the taskCounter in the model

let controller = {
    test: 0,
    init: function() {
        let addTaskSubmitButton = document.getElementById("addTaskSubmitButton");
        addTaskSubmitButton.onclick = function() {
            controller.test++; // why do I need to use controller.test here and not this.test?
            console.log(controller.test); // why do I need to use controller.test here and not this.test?
            return controller.test;
        };
        },
    acceptNewTaskRequest: function() {
        addTaskSubmitButton.onclick = function() { 
        // you need to add this to the createTask method in the model
            let taskName = document.getElementById("taskEntry");
            let taskDate = document.getElementById("taskDate");
            let taskPriority = document.getElementById("taskPriority");
            if (taskName && taskDate && taskPriority) {
                view.hideErrorMessage();
                let task = new model.createTask(taskName, taskDate, taskPriority);
                model.taskArray.push(task);
                model.taskCount += 1;
            } else {
                view.displayErrorMessage();
            }
        }
    }
};

let model = {
    taskArray: [],
    taskCount:0,
    createTask: function(name, date, priority) {
        this.taskNumber = this.taskCount;
        this.taskName = name;
        this.taskDate = date;
        this.taskPriority = priority;
        this.editIcon = "editIcon.png";
        this.deleteIcon = "deleteIcon.png";
    }
};

let view = {
    displayErrorMessage: function() {
        document.getElementById("errorMessage").style.visibility.visible;
    },
    hideErrorMessage: function() {
        document.getElementById("errorMessage").style.visibility.hidden;
    }
};


window.onload = controller.init;