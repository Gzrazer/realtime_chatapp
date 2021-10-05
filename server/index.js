const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
const io = new Server({ cors: { origin: "*" } });

const USERS = [];

io.on("connection", (socket) => {
  socket.emit("users-count", USERS.length);
  socket.on("new-user", (name) => {
    const newUser = { id: socket.id, name: name };
    USERS.push(newUser);
    socket.broadcast.emit("added-new-user", name)
  });

  socket.on("disconnect", () => {
    try {
      const user = USERS.find((e) => e.id === socket.id);
      const userName = user.name;

      socket.broadcast.emit("user-disconnected", userName);

      const index = USERS.indexOf(user);
      USERS.splice(index, 1);

      console.log(USERS);
    } catch (error) {
      console.log(socket.id + " disconnected");
    }
  });

  socket.on("new-chat", (userChat) => {
    const userName = USERS.find((e) => e.id === socket.id).name;

    socket.broadcast.emit("added-new-chat", { name: userName, chat: userChat });
  });
});

io.listen(PORT);
