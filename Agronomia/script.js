// Система пользователей
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM элементы
const authContainer = document.getElementById('auth-container');
const siteContent = document.getElementById('site-content');
const regForm = document.getElementById('registration');
const loginForm = document.getElementById('login');
const regBtn = document.getElementById('reg-btn');
const loginBtn = document.getElementById('login-btn');
const showLogin = document.getElementById('show-login');
const showRegister = document.getElementById('show-register');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const greeting = document.getElementById('greeting');

// Данные для квиза
const quizData = [
    {
        question: "Какая культура используется для производства хлеба?",
        answers: ["Пшеница", "Рис", "Кукуруза", "Картофель"],
        correct: 0
    },
    {
        question: "Что такое точное земледелие?",
        answers: [
            "Метод случайного внесения удобрений",
            "Технология управления сельским хозяйством с использованием точных данных",
            "Старинный способ обработки земли",
            "Выращивание растений в теплицах"
        ],
        correct: 1
    },
    {
        question: "Какой метод обработки почвы сохраняет больше влаги?",
        answers: [
            "Глубокая вспашка",
            "Дискование",
            "Нулевая обработка (No-Till)",
            "Фрезерование"
        ],
        correct: 2
    },
    {
        question: "Какая технология использует дроны для мониторинга полей?",
        answers: [
            "Традиционное земледелие",
            "Органическое земледелие",
            "Прецизионное земледелие",
            "Гидропоника"
        ],
        correct: 2
    }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();

    if (currentUser) {
        updateGreeting();
        if (document.getElementById('quiz-container')) {
            buildQuiz();
        }
    }
});

// Проверка авторизации
function checkAuth() {
    if (currentUser) {
        authContainer.style.display = 'none';
        siteContent.style.display = 'block';
        userInfo.textContent = `Пользователь: ${currentUser.username}`;
    } else {
        authContainer.style.display = 'block';
        siteContent.style.display = 'none';
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    showLogin.addEventListener('click', () => {
        regForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    showRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
    });

    regBtn.addEventListener('click', register);
    loginBtn.addEventListener('click', login);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
}

// Регистрация
function register() {
    const username = document.getElementById('reg-username').value.trim();
    const password = document.getElementById('reg-password').value;
    const age = document.getElementById('reg-age').value;

    if (!username || !password || !age) {
        alert('Заполните все поля!');
        return;
    }

    if (users.some(u => u.username === username)) {
        alert('Пользователь уже существует!');
        return;
    }

    const newUser = { username, password, age };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Регистрация успешна! Теперь войдите в систему.');
    showLogin.click();
    document.getElementById('login-username').value = username;
    document.getElementById('login-password').value = '';
}

// Вход
function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        checkAuth();
        updateGreeting();

        if (document.getElementById('quiz-container')) {
            buildQuiz();
        }
    } else {
        alert('Неверный логин или пароль!');
    }
}

// Выход
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    checkAuth();
}

// Приветствие
function updateGreeting() {
    if (!greeting) return;

    const hours = new Date().getHours();
    let timeGreeting;

    if (hours < 6) timeGreeting = "Доброй ночи";
    else if (hours < 12) timeGreeting = "Доброе утро";
    else if (hours < 18) timeGreeting = "Добрый день";
    else timeGreeting = "Добрый вечер";

    greeting.textContent = `${timeGreeting}, ${currentUser.age}-летний посетитель! Добро пожаловать на наш сайт!`;
}

// Построение квиза
function buildQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    quizContainer.innerHTML = '';

    quizData.forEach((question, index) => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-box';
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            ${question.answers.map((answer, i) => `
                <label>
                    <input type="radio" name="question${index}" value="${i}">
                    ${answer}
                </label>
            `).join('')}
        `;
        quizContainer.appendChild(questionElement);
    });

    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Проверить ответы';
    submitBtn.addEventListener('click', checkQuizAnswers);
    quizContainer.appendChild(submitBtn);

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'quiz-results';
    resultsDiv.style.display = 'none';
    quizContainer.appendChild(resultsDiv);
}

// Проверка ответов
function checkQuizAnswers() {
    const resultsDiv = document.getElementById('quiz-results');
    let score = 0;
    let resultsHTML = '<h3>Результаты теста</h3>';

    quizData.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const isCorrect = selectedOption && parseInt(selectedOption.value) === question.correct;

        if (isCorrect) score++;

        resultsHTML += `
            <div class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Вопрос ${index + 1}:</strong> ${question.question}</p>
                <p>Ваш ответ: ${selectedOption ? question.answers[parseInt(selectedOption.value)] : 'Нет ответа'}</p>
                <p>Правильный ответ: ${question.answers[question.correct]}</p>
            </div>
        `;
    });

    resultsHTML += `
        <p class="score">Вы набрали: ${score} из ${quizData.length}</p>
        <button id="retry-btn">Попробовать снова</button>
    `;

    resultsDiv.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';

    document.getElementById('retry-btn').addEventListener('click', () => {
        buildQuiz();
    });
}