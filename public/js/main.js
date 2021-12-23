const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', (data) => {
    const leaveRoom = data
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});

$(function() {
    $('#send-File').on('change', function(e) {
        var file = e.originalEvent.target.files[0]
        var reader = new FileReader();
        reader.onload = function(evt) {
            socket.emit('user-image', evt.target.result);
        }
        reader.readAsDataURL(file);
    });
});

socket.on('addImage', function(msg, base64image) {
    $('#image-messages')
        .append($('<p>').append($('<b>').text(msg), '<a target="_blank" href="' + base64image + '"><img src="' + base64image + '" /> </a>'));
});

