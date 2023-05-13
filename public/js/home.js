const socket = io();

socket.on("response", (data) => console.log(data));
$(document).ready(function () {});

$("#btn").click(function () {
  socket.emit("chat message", { id: $("#id").val() });
});
