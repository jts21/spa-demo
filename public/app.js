const app = document.getElementById('app');

const views = {
  '/': () => {
    app.innerHTML = `<h1 data-test="page-title">Home Page</h1><p>A simple single page app served by Express.</p>`;
  },
  '/about': () => {
    app.innerHTML = `<h1 data-test="page-title">About</h1><p>Built with Node.js, Docker and GitHub Actions.</p>`;
  },
  '/tasks': async () => {
    app.innerHTML = `
      <h1 data-test="page-title">Tasks</h1>
      <form id="task-form">
        <input id="task-input" data-test="task-input" placeholder="New task" />
        <button type="submit" data-test="add-task">Add</button>
      </form>
      <p id="error" data-test="error" style="color:#b91c1c"></p>
      <ul id="task-list" data-test="task-list"></ul>`;

    const list = document.getElementById('task-list');
    const error = document.getElementById('error');

    async function load() {
      const tasks = await (await fetch('/api/tasks')).json();
      list.innerHTML = tasks.map(t => `
        <li data-test="task-item">
          <span>${escapeHtml(t.title)}</span>
          <button data-id="${t.id}" data-test="delete-task">Delete</button>
        </li>`).join('');
    }

    document.getElementById('task-form').addEventListener('submit', async e => {
      e.preventDefault();
      const input = document.getElementById('task-input');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value })
      });
      error.textContent = res.ok ? '' : 'Title is required';
      if (res.ok) input.value = '';
      load();
    });

    list.addEventListener('click', async e => {
      const id = e.target.dataset.id;
      if (!id) return;
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      load();
    });

    load();
  }
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function router() {
  const route = location.hash.slice(1) || '/';
  (views[route] || views['/'])();
  document.querySelectorAll('nav a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + route));
}

window.addEventListener('hashchange', router);
router();
