const socket = io("http://localhost:4000/");

socket.on("message", (data) => console.log(data));
$(document).ready(function () {});
$("#btn").click(function () {
  socket.emit("device_send_data", $("#id").val());
});
