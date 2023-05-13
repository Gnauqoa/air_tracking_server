class SocketServices {
  connection(socket) {
    console.log("client connected, id:", socket.id);
    socket.on("disconnect", () => {
      console.log(`client disconnect id is ${socket.id}`);
    });
  }
}

export default new SocketServices();
