document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function save_todos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function render_todos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = todo.text;
            span.classList.add('todo-text');
            if (todo.completed) {
                span.classList.add('completed');
            }
            span.addEventListener('click', () => toggle_todo(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', () => delete_todo(index));

            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    function add_todo() {
        const text = todoInput.value.trim();
        if (text !== '') {
            todos.push({ text, completed: false });
            todoInput.value = '';
            save_todos();
            render_todos();
        }
    }

    function toggle_todo(index) {
        todos[index].completed = !todos[index].completed;
        save_todos();
        render_todos();
    }

    function delete_todo(index) {
        todos.splice(index, 1);
        save_todos();
        render_todos();
    }

    addBtn.addEventListener('click', add_todo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            add_todo();
        }
    });

    render_todos();
});
