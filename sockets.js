const playHandler = require("./sockets/play");
const adminHandler = require("./sockets/admin");

/**
 * @function
 * @param {SocketIO.Server} io
 */
module.exports = (io) => {
    adminHandler(io);
    playHandler(io);
};