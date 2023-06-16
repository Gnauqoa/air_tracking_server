dayjs.extend(window.dayjs_plugin_relativeTime);
const max_dust = 500;
const connectionObject = {
  withCredentials: true,
};
const socket = io("", connectionObject);
let updated_at;
let cur_sensor_list = [];
let first_time = 1;
const getStatusNode = (value) => {
  if (value <= 50)
    return {
      background: "#57bf9c",
      status: "Good",
      width: `${parseInt((value / max_dust) * 100)}%`,
    };
  if (value <= 100)
    return {
      background: "#fafda6",
      status: "Moderate",
      width: `${parseInt((value / max_dust) * 100)}%`,
    };
  if (value <= 200)
    return {
      background: "#f9d16b",
      status: "Unhealthy",
      width: `${parseInt((value / max_dust) * 100)}%`,
    };
  if (value <= 300)
    return {
      background: "#c09ff8",
      status: "Very Unhealthy",
      width: `${parseInt((value / max_dust) * 100)}%`,
    };
  return {
    background: "#9f7684",
    status: "Very Unhealthy",
    width: `${parseInt((value / max_dust) * 100)}%`,
  };
};
const createNode = (node_id, value) => {
  const node_status = getStatusNode(value);
  const string_node = `
  <div id="${node_id}_node" class="flex flex-col gap-1 relative">
    <div class="flex flex-row gap-1 items-center">
      <div class="w-[16px] h-[16px] mt-[2px] overflow-hidden flex flex-row items-center"> 
        <img class="w-full h-full fill-inherit" src="./icon/icon_info_circle.svg" />
      </div>
      <p class="text-[16px]">Node: ${node_id}</p>
    </div>
    <div class="flex flex-row rounded-[24px] bg-[#909f98] items-center relative w-full overflow-hidden">    
    <div id="${node_id}_mask" class="absolute w-full h-full bg-[#000000] z-30 opacity-[0]"></div>
      <div id="${node_id}_status_bar" class="absolute status_bar hover:bg-[#fafda6] w-[${node_status.width}] h-full bg-[${node_status.background}] z-10 rounded-[24px]"></div>
      <div class="flex flex-row items-center px-4 py-2 z-20 w-full">
        <div class="flex flex-col gap-1">
          <p class="text-[16px] text-[#1e2822] font-[600]" id="dust_value">
            <span id="${node_id}_value">${value}</span>
            &mu;g/m<sup>3</sup>
          </p>
          <p class="text-[12px] text-[#1e2822]">PM2.5</p>
        </div>
        <p id="${node_id}_status" class="ml-auto text-[24px] text-[#1e2822] font-[600]">${node_status.status}</p>
      </div>
    </div>
  </div>`;
  $("#node_list").append(string_node);
};
const updateEmptyNode = (node_id) => {
  $(`#${node_id}_mask`).css("opacity", 0.6);
  $(`#${node_id}_value`).html("0.0");
  $(`#${node_id}_status`).html("No-data");
  $(`#${node_id}_status_bar`).width(0);
};
const createDevice = (device_id, value) => {
  const string_device = `   
  <div class="flex flex-col w-full rounded-[12px] bg-[#aab8b3] px-4 pt-3 pb-4 gap-3">
    <div class="flex flex-row">
      <div class="flex flex-col">
        <p class="text-[18px] text-[#1e2822] font-[400]">Air tracking</p>
        <div class="flex flex-row gap-1 items-center">
          <img class="w-[14px] h-[14px] mt-[1px]" src="./icon/icon_clock_bold.svg" />
          <p id="${device_id}_update_time" class="text-[14px] text-[#556664]">4 mins ago</p>
        </div>
      </div>
      <div class="ml-auto p-1 bg-[#050b04] rounded-full mb-auto">
        <img src="./icon/icon_location.svg" />
      </div>
    </div>
    <div id="${device_id}_alert_threshold class="flex flex-row items-center">
      <div>
      </div>
    </div>
    <div id="node_list" class="flex flex-col gap-3">
    </div>
  </div>`;
  $("#root").append(string_device);
};
const updateNode = (node_id, value) => {
  const statusNode = getStatusNode(value);
  $(`#${node_id}_status_bar`).css("background", statusNode.background);
  $(`#${node_id}_status_bar`).width(statusNode.width);
  $(`#${node_id}_status`).html(statusNode.status);
  $(`#${node_id}_value`).html(value);
  $(`#${node_id}_mask`).css("opacity", 0);
};
setInterval(function () {
  $(`#255_update_time`).html(dayjs(updated_at).fromNow());
}, 1000);
socket.on("new_device_data", function (data) {
  console.log(data);
  const { sensor_list } = data.data;
  updated_at = data.data.updated_at;
  if (!first_time) {
    $(`#255_update_time`).html(dayjs(updated_at).fromNow());
    sensor_list.forEach((sensor) => {
      sensor.dust
        ? updateNode(sensor.sensor_id, sensor.dust)
        : updateEmptyNode(sensor.sensor_id);
    });
    return;
  }
  first_time = 0;
  createDevice(255);
  sensor_list.forEach((sensor) => {
    createNode(sensor.sensor_id, sensor.dust);
    if (!sensor.dust) updateEmptyNode(sensor.sensor_id);
  });
  cur_sensor_list = sensor_list;
  $("#circular-process").remove();
  $(`#255_update_time`).html(dayjs(updated_at).fromNow());
});
