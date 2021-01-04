const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sanitizeHtml = require('sanitize-html');
const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
const chalk = require('chalk');
const log = console.log;


const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const messages = [];
const users = [];

// Sockets
io.on('connection', socket => {

    // new connection
    log(chalk.green('New connection!'));

    socket.on('new-user', username => {
        const newUser = {
            id: socket.id,
            username: sanitizeHtml(username, sanitizeOptions)
        }
        users.push(newUser);
        io.emit('new-user', { users, messages });
    });

    socket.on('new-message', ({ username, message }) => {
        const newMessage = buildMessage(username, message);
        messages.push(newMessage);
        io.emit('new-message', newMessage);
    });

    socket.on('disconnect', () => {
        const x = users.findIndex(user => user.id === socket.id);
        if (x !== -1) {
            users.splice(x,1);
            io.emit('user-disconnect', users);
            log(chalk.red('User disconnected.'));
        }
    });
});

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/chat', (req, res) => {
    res.render('chat.ejs');
})

// Catch All
app.get('*', (req, res) => {
    res.status(404).send('404: Page does not exist.')
});

http.listen(port, () => {
    log(chalk.blue(`[server] listening on port ${port}.`))
});

// Utils
const buildMessage = (username, message) => {
    const newMessage = {
        username: sanitizeHtml(username, sanitizeOptions),
        message: sanitizeHtml(message, sanitizeOptions),
        time: Date.now()
    }

    return newMessage;
};