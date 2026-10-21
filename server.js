const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); // Разрешаем фронтенду общаться с бэкендом
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Временная "база данных" (позже это будет Firebase)
const users = {
    mikudasu: { username: "Mikudasu", email: "dararan41@gmail.com", joined: "May 16, 2026" }
};

// Единственный роут для получения данных профиля
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const user = users[userId];
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: "Пользователь не найден" });
    }
});

// Запуск сервера
app.listen(3000, () => {
    console.log('Бэкенд ArtEX запущен на порту 3000');
});