const socket = io();

socket.on("response", (data) => console.log(data));
$(document).ready(function () {});

$("#btn").click(function () {
  socket.emit("device_send_data", { id: $("#id").val() });
});
