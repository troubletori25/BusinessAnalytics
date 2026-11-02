document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#task-form');
    const taskInput = document.querySelector('#task');
    const submitButton = document.querySelector('#submit');

    const tasksList = document.querySelector('#tasks');
    const completedList = document.querySelector('#completed-tasks');

    const activeCount = document.querySelector('#active-count');
    const completedCount = document.querySelector('#completed-count');


    // array storage for tasks
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    document.querySelector('#today').textContent =
        new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });


    // saving tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // 1 HTML-element for 1 task
    function createTaskElement(task) {

        const li = document.createElement('li');
        li.className = 'task-item';


        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;


        // text-container for a task
        const content = document.createElement('div');
        content.className = 'task-content';


        // task text
        const text = document.createElement('span');

        text.className = 'task-text';
        text.textContent = task.text;

        content.append(text); // adding text from input field into text container 'to-do'


        // showing date when done
        if (task.completed && task.completedAt) {

            const date = document.createElement('span');

            date.className = 'task-date';

            date.textContent = 'Accomplished at: ' +
                new Date(task.completedAt).toLocaleString('en-GB');

            content.append(date);
        }


        const deleteButton = document.createElement('button');

        deleteButton.className = 'delete-button';
        deleteButton.type = 'button';
        deleteButton.textContent = '×';


        checkbox.onchange = () => {
            task.completed = checkbox.checked;

            if (task.completed) {

                task.completedAt = new Date().toISOString();

            } else {

                task.completedAt = null;

            }

            saveTasks();
            renderTasks();
        };


        // delete task
        deleteButton.onclick = () => {

            tasks = tasks.filter(item => item.id !== task.id); // checking for id of the task next to which the delete button was clicked

            saveTasks();
            renderTasks();
        };


        // adding elements to the task card
        li.append(checkbox);
        li.append(content);
        li.append(deleteButton);

        return li;
    }


    // show active and completed tasks
    function renderTasks() {

        tasksList.innerHTML = '';
        completedList.innerHTML = '';

        // checking for active tasks
        const activeTasks = tasks.filter(task => !task.completed);
        // cheking for completed tasks and sorting by date
        const completedTasks = tasks
            .filter(task => task.completed)
            .sort((a, b) =>
                new Date(b.completedAt) - new Date(a.completedAt)
            );


        // adding active tasks to html
        activeTasks.forEach(task => {

            tasksList.append(createTaskElement(task));

        });


        // adding completed tasks to html
        completedTasks.forEach(task => {

            completedList.append(createTaskElement(task));

        });


        // if no active tasks

        if (activeTasks.length === 0) {

            const empty = document.createElement('li');

            empty.className = 'empty-state';

            empty.textContent =
                'It’s empty here for now. Add your first task!';

            tasksList.append(empty);
        }


        // if no completed tasks

        if (completedTasks.length === 0) {

            const empty = document.createElement('li');

            empty.className = 'empty-state';

            empty.textContent =
                'Completed tasks will appear here.';

            completedList.append(empty);
        }


        // updating counters
        activeCount.textContent = activeTasks.length;

        completedCount.textContent = completedTasks.length;
    }


    // checking for occupancy of input field
    taskInput.onkeyup = () => {

        if (taskInput.value.trim().length > 0) {

            submitButton.disabled = false;

        } else {

            submitButton.disabled = true;

        }
    };


    // adding new task
    form.onsubmit = () => {

        const taskText = taskInput.value.trim();

        // if field is empty
        if (taskText.length === 0) {

            return false;

        }


        const newTask = {

            id: Date.now(),

            text: taskText,

            completed: false,

            completedAt: null

        };


        // adding task to array
        tasks.push(newTask);
        // saving and updating list
        saveTasks();
        renderTasks();


        // clearing input field
        taskInput.value = '';
        submitButton.disabled = true;
        // canceling standard send form
        return false;
    };

    // initial display of the list
    renderTasks();
});