let ioInstance = null;

function init(io) {
  ioInstance = io;
}

function broadcast(event, data) {
  if (!ioInstance) return;

  ioInstance.emit(event, data);
}

module.exports = {
  init,
  broadcast
};