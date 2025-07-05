import { db } from './firebase.js';
import { ref, onValue, push } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

function loadSlots() {
  return new Promise(resolve => {
    onValue(ref(db, 'slots'), snap => {
      const data = snap.val() || {};
      const now = new Date();
      const items = Object.entries(data)
        .map(([id, slot]) => ({ id, ...slot }))
        .filter(s => new Date(s.start) > now);
      resolve(items);
    }, { onlyOnce: true });
  });
}

function loadQuestions() {
  return new Promise(resolve => {
    onValue(ref(db, 'questions'), snap => {
      const data = snap.val() || {};
      const items = Object.entries(data).map(([id, q]) => ({ id, ...q }));
      resolve(items);
    }, { onlyOnce: true });
  });
}

function renderQuestions(container, questions) {
  container.innerHTML = '';
  questions.forEach(q => {
    const wrapper = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = q.label;
    let input;
    if (q.type === 'select') {
      input = document.createElement('select');
      (q.options || '').split(',').forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.trim();
        o.textContent = opt.trim();
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = q.type || 'text';
    }
    if (q.required) input.required = true;
    input.name = q.id;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.appendChild(wrapper);
  });
}

export async function initBooking() {
  const slotsContainer = document.getElementById('slots');
  const form = document.getElementById('booking-form');
  const questionsContainer = document.getElementById('questions-container');
  const confirmation = document.getElementById('confirmation');

  const [slots, questions] = await Promise.all([loadSlots(), loadQuestions()]);

  slots.forEach(slot => {
    const btn = document.createElement('button');
    btn.textContent = `${slot.start} - ${slot.end}`;
    btn.addEventListener('click', () => {
      form.slotId = slot.id;
      renderQuestions(questionsContainer, questions);
      form.hidden = false;
      confirmation.hidden = true;
    });
    slotsContainer.appendChild(btn);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const answers = {};
    questions.forEach(q => {
      const input = form.elements[q.id];
      answers[q.id] = input.value;
    });
    await push(ref(db, 'appointments'), {
      slotId: form.slotId,
      answers,
      timestamp: Date.now()
    });
    form.reset();
    form.hidden = true;
    confirmation.hidden = false;
  });
}
