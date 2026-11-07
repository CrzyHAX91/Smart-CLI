require('node:net').Socket.prototype.connect = function () {
  throw new Error('Live network is disabled in the offline test suite');
};
