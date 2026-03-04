// shared utilities
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function loadFromStorage(key, def) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : def;
}

// quiz logic
if (document.getElementById('save-quiz')) {
  const quizzes = loadFromStorage('smartlearn_quizzes', []);
  const newQuizArea = document.getElementById('new-quiz');
  const saveBtn = document.getElementById('save-quiz');
  const quizList = document.getElementById('quiz-list');
  const startBtn = document.getElementById('start-quiz');
  const quizContent = document.getElementById('quiz-content');

  function refreshQuizList() {
    quizList.innerHTML = '';
    quizzes.forEach((q, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = q.title || (`Quiz ${idx+1}`);
      quizList.appendChild(opt);
    });
  }

  saveBtn.addEventListener('click', () => {
    try {
      const obj = JSON.parse(newQuizArea.value);
      quizzes.push(obj);
      saveToStorage('smartlearn_quizzes', quizzes);
      newQuizArea.value = '';
      refreshQuizList();
      alert('Quiz disimpan');
    } catch (e) {
      alert('Format JSON tidak valid');
    }
  });

  startBtn.addEventListener('click', () => {
    const idx = parseInt(quizList.value, 10);
    if (isNaN(idx) || !quizzes[idx]) return;
    const q = quizzes[idx];
    quizContent.innerHTML = '';
    let score = 0;
    q.questions.forEach((ques, i) => {
      const div = document.createElement('div');
      div.innerHTML = `<p>${i+1}. ${ques.question}</p>`;
      ques.options.forEach(opt => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + i;
        input.value = opt;
        label.appendChild(input);
        label.append(' ' + opt);
        div.appendChild(label);
      });
      quizContent.appendChild(div);
    });
    const submit = document.createElement('button');
    submit.textContent = 'Submit';
    submit.addEventListener('click', () => {
      q.questions.forEach((ques, i) => {
        const sel = document.querySelector(`input[name=q${i}]:checked`);
        if (sel && sel.value === ques.answer) score++;
      });
      alert(`Skor Anda: ${score} / ${q.questions.length}`);
    });
    quizContent.appendChild(submit);
  });

  refreshQuizList();
}

// video logic
if (document.getElementById('add-video')) {
  const videos = loadFromStorage('smartlearn_videos', []);
  const videoList = document.getElementById('video-list');
  const addBtn = document.getElementById('add-video');
  const newUrl = document.getElementById('new-video-url');
  const player = document.getElementById('player');

  function refreshVideos() {
    videoList.innerHTML = '';
    videos.forEach((url, i) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = url;
      link.addEventListener('click', () => {
        showVideo(url);
      });
      li.appendChild(link);
      videoList.appendChild(li);
    });
  }

  function showVideo(url) {
    // handle youtube
    let embed = url;
    const yt = url.match(/v=([^&]+)/);
    if (yt) {
      embed = `https://www.youtube.com/embed/${yt[1]}`;
    }
    player.innerHTML = `<iframe src="${embed}" frameborder="0" allowfullscreen></iframe>`;
  }

  addBtn.addEventListener('click', () => {
    const url = newUrl.value.trim();
    if (url) {
      videos.push(url);
      saveToStorage('smartlearn_videos', videos);
      newUrl.value = '';
      refreshVideos();
    }
  });

  refreshVideos();
}

// notes logic
if (document.getElementById('save-notes')) {
  const notesArea = document.getElementById('notes-area');
  const saveBtn = document.getElementById('save-notes');
  const exportBtn = document.getElementById('export-notes');
  const notesKey = 'smartlearn_notes';

  notesArea.value = loadFromStorage(notesKey, '');
  saveBtn.addEventListener('click', () => {
    saveToStorage(notesKey, notesArea.value);
    alert('Catatan disimpan lokal');
  });
  exportBtn.addEventListener('click', () => {
    const blob = new Blob([notesArea.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(url);
  });
}
