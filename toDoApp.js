

let controller = {
    test: 0,
    init: function() {
        let addTaskSubmitButton = document.getElementById("addTaskSubmitButton");
        addTaskSubmitButton.onclick = controller.acceptNewTaskRequest;
        let editItems = document.getElementsByClassName("editIcon");
        for (let i = 0; i < editItems.length; i++) {
            editItems[i].onclick = view.displayEditModal;
        }
        let deleteAllMainButton = document.getElementById("deleteAllMainButton");
        deleteAllMainButton.onclick = view.displayDeleteModal;
    },
    acceptNewTaskRequest: function() { 
        let taskNameField = document.getElementById("taskEntry")
        let taskName = taskNameField.value.trim();
        let taskDateField = document.getElementById("dateEntry");
        let taskDate = controller.transformTaskDate(taskDateField.value);
        let taskPriorityDropdown = document.getElementById("priorityEntry");
        let taskPriority = taskPriorityDropdown.options[taskPriorityDropdown.selectedIndex].text;
        if (!taskName || taskDate.includes(undefined) || taskPriority.includes("Level")) {
            view.displayErrorMessage();
        } else {
            view.hideErrorMessage();
            let task = new model.createTask(taskName, taskDate, taskPriority);
            model.taskArray.push(task);
            view.displayTask(task);
            taskNameField.value = "";
            taskDateField.value = "";
            taskPriorityDropdown.value = "";
            model.taskCount += 1;
        }
    },
    transformTaskDate: function(dateEntry) {
        let date = dateEntry.split("-");
        date = date[1] + "/" + date[2] + "/" + date[0];
        return date;
    },
};


let model = {
    taskArray: [],
    taskCount:0,
    createTask: function(name, date, priority) {
        this.taskNumber = model.taskCount;
        this.taskName = name;
        this.taskDate = date;
        this.taskPriority = priority;
    },
    deleteTask: function(taskId) {
        let taskNumToDelete = Number(taskId.slice(4));
        model.taskArray = model.taskArray.filter(task => task.taskNumber != taskNumToDelete);
        view.removeTaskFromTable(taskNumToDelete);
    }
};

let view = {
    displayTask: function(task) {
        if (model.taskArray.length > 0) {
            document.getElementById("taskSection").style.display = "block";
        };
        let taskTable = document.getElementById("taskTable");
        let tableRow = taskTable.insertRow(-1);
        tableRow.setAttribute("id", "task" + String(task.taskNumber));
        let tableCell0 = tableRow.insertCell(0);
        let tableCell1 = tableRow.insertCell(1);
        let tableCell2 = tableRow.insertCell(2);
        let tableCell3 = tableRow.insertCell(3);
        let tableCell4 = tableRow.insertCell(4);
        tableCell0.innerHTML = task.taskName;
        tableCell0.setAttribute("class", "taskItem");
        let taskNameId = "taskNameId" + String(task.taskNumber);
        tableCell0.setAttribute("id", taskNameId);
        tableCell1.innerHTML = task.taskDate;
        let taskDateId = "taskDateId" + String(task.taskNumber);
        tableCell1.setAttribute("id", taskDateId);
        tableCell2.innerHTML = task.taskPriority;
        let taskPriorityId = "taskPriorityId" + String(task.taskNumber);
        tableCell2.setAttribute("id", taskPriorityId);
        let editId = "edit" + String(task.taskNumber);
        tableCell3.insertAdjacentHTML("afterbegin", `<img id=${editId} class="editIcon" src="editIcon.png">`);
        let editIcon = document.getElementById(editId);
        editIcon.addEventListener("click", function() {
            let taskId = "task" + String(task.taskNumber);
            view.displayEditModal(taskId);
        });
        let deleteId = "delete" + task.taskNumber;
        tableCell4.insertAdjacentHTML("afterbegin", `<img id=${deleteId} class="deleteIcon" src="deleteIcon.png">`);
        let deleteIcon = document.getElementById(deleteId);
        deleteIcon.addEventListener("click", function() {
            let taskId = "task" + String(task.taskNumber);
            model.deleteTask(taskId)
        });
    },
    displayErrorMessage: function() {
        document.getElementById("error").style.visibility = "visible";
    },
    hideErrorMessage: function() {
        document.getElementById("error").style.visibility = "hidden";
    },
    displayEditModal: function(taskId) {
        document.getElementById("editModal").style.display = "block";
        let closeButton = document.getElementsByClassName("closeButton")[0];
        closeButton.addEventListener("click", function() {document.getElementById("editModal").style.display = "none";});
        let taskNumber = taskId.slice(4);
        let task = model.taskArray.filter(task => taskNumber == task.taskNumber);
        let taskName = task[0].taskName;
        let taskPriority = task[0].taskPriority;
        let taskDate = task[0].taskDate;
        taskDate = taskDate.split("/");
        taskDate = taskDate[2] + "-" + taskDate[0] + "-" + taskDate[1];
        document.getElementById("editTaskName").value = taskName;
        document.getElementById("editTaskDate").value = taskDate;
        document.getElementById("editTaskPriority").value = taskPriority;
        let editTaskSubmitButton = document.getElementById("editTaskSubmitButton");
        editTaskSubmitButton.addEventListener("click", function() {
            task[0].taskName = document.getElementById("editTaskName").value;
            task[0].taskDate = controller.transformTaskDate(document.getElementById("editTaskDate").value);
            task[0].taskPriority = document.getElementById("editTaskPriority").value;
            document.getElementById("taskNameId" + taskNumber).innerHTML = task[0].taskName;
            document.getElementById("taskDateId" + taskNumber).innerHTML = task[0].taskDate;
            document.getElementById("taskPriorityId" + taskNumber).innerHTML = task[0].taskPriority;
            document.getElementById("editModal").style.display = "none";
        })
    },
    removeTaskFromTable: function(taskNumToDelete) {
        let taskItem = "task" + String(taskNumToDelete);
        document.getElementById(taskItem).remove();
        if (model.taskArray.length == 0) {
            document.getElementById("taskSection").style.display = "none";
        }
    },
    displayDeleteModal: function() {
        document.getElementById("deleteModal").style.display = "block";
        document.getElementById("cancelButton").addEventListener("click", function() {document.getElementById("deleteModal").style.display = "none";})
        document.getElementById("deleteAllModalButton").addEventListener("click", function() {
            while (true) {
                let tableLength = document.getElementById("taskTable").rows.length;
                if (tableLength == 1) {
                    break
                } else {
                    document.getElementById("taskTable").deleteRow(tableLength - 1);
                }
            }
            model.taskArray = [];
            model.taskCount = 0;
            document.getElementById("taskSection").style.display = "none";
            document.getElementById("deleteModal").style.display = "none";
        })
    }
};


window.onload = controller.init;