import { db } from './firebase.js';
import { ref, onValue, push, update, remove } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

function renderList(container, items, renderRow) {
  container.innerHTML = '';
  items.forEach(item => container.appendChild(renderRow(item)));
}

function createInput(value='') {
  const inp = document.createElement('input');
  inp.value = value;
  return inp;
}

function createButton(text, handler) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.addEventListener('click', handler);
  return btn;
}

function usersSection() {
  const container = document.getElementById('users');
  const list = document.createElement('div');
  const addBtn = createButton('إضافة مستخدم', () => {
    const name = prompt('الاسم');
    const email = prompt('البريد الإلكتروني');
    const role = prompt('الدور');
    if (name && email) {
      push(ref(db, 'users'), { name, email, role });
    }
  });
  container.appendChild(addBtn);
  container.appendChild(list);

  onValue(ref(db, 'users'), snap => {
    const data = snap.val() || {};
    const items = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
    renderList(list, items, item => {
      const row = document.createElement('div');
      const name = createInput(item.name);
      const email = createInput(item.email);
      const role = createInput(item.role || '');
      const save = createButton('حفظ', () => {
        update(ref(db, 'users/' + item.id), { name: name.value, email: email.value, role: role.value });
      });
      const del = createButton('حذف', () => remove(ref(db, 'users/' + item.id)));
      row.append(name, email, role, save, del);
      return row;
    });
  });
}

function slotsSection() {
  const container = document.getElementById('slots');
  const list = document.createElement('div');
  const addBtn = createButton('إضافة موعد', () => {
    const start = prompt('بداية الموعد');
    const end = prompt('نهاية الموعد');
    const capacity = parseInt(prompt('السعة'), 10) || 1;
    if (start && end) {
      push(ref(db, 'slots'), { start, end, capacity });
    }
  });
  container.appendChild(addBtn);
  container.appendChild(list);

  onValue(ref(db, 'slots'), snap => {
    const data = snap.val() || {};
    const items = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
    renderList(list, items, item => {
      const row = document.createElement('div');
      const start = createInput(item.start);
      const end = createInput(item.end);
      const capacity = createInput(item.capacity);
      const save = createButton('حفظ', () => {
        update(ref(db, 'slots/' + item.id), { start: start.value, end: end.value, capacity: capacity.value });
      });
      const del = createButton('حذف', () => remove(ref(db, 'slots/' + item.id)));
      row.append(start, end, capacity, save, del);
      return row;
    });
  });
}

function questionsSection() {
  const container = document.getElementById('questions');
  const list = document.createElement('div');
  const addBtn = createButton('سؤال جديد', () => {
    const label = prompt('نص السؤال');
    const type = prompt('نوع السؤال (text, select...)');
    const required = confirm('إلزامي؟');
    const options = prompt('الخيارات (مفصولة بفواصل)');
    push(ref(db, 'questions'), { label, type, required, options });
  });
  container.appendChild(addBtn);
  container.appendChild(list);

  onValue(ref(db, 'questions'), snap => {
    const data = snap.val() || {};
    const items = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
    renderList(list, items, item => {
      const row = document.createElement('div');
      const label = createInput(item.label);
      const type = createInput(item.type);
      const required = document.createElement('input');
      required.type = 'checkbox';
      required.checked = item.required;
      const options = createInput(item.options);
      const save = createButton('حفظ', () => {
        update(ref(db, 'questions/' + item.id), { label: label.value, type: type.value, required: required.checked, options: options.value });
      });
      const del = createButton('حذف', () => remove(ref(db, 'questions/' + item.id)));
      row.append(label, type, required, options, save, del);
      return row;
    });
  });
}

function appointmentsSection() {
  const container = document.getElementById('appointments');
  const list = document.createElement('div');
  container.appendChild(list);

  onValue(ref(db, 'appointments'), snap => {
    const data = snap.val() || {};
    const items = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
    renderList(list, items, item => {
      const row = document.createElement('div');
      row.textContent = JSON.stringify(item);
      return row;
    });
  });
}

export function initAdmin() {
  usersSection();
  slotsSection();
  questionsSection();
  appointmentsSection();
}
