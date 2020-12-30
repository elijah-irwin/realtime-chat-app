const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const chalk = require('chalk');
const moment = require('moment');
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
            _id: socket.id,
            username
        }
        users.push(newUser);
        socket.emit('new-user', { users, messages });
    });

    socket.on('new-message', ({ username, message }) => {
        const newMessage = {
            username,
            message,
            time: moment().format('h:mmA')
        }
        messages.push(newMessage);
        io.emit('new-message', newMessage);
    });

    socket.on('disconnect', () => {
        const x = users.findIndex(user => user.id === socket.id);
        users.splice(x,1);
        io.emit('user-disconnect', users);
        log(chalk.red('User disconnected.'));
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