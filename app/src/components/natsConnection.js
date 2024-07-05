const config = require('config');
const nats = require('nats');
const log = require('./log')(module.filename);

let connection;
let connected = false;

const servers = config.get('nats.servers');
const username = config.get('nats.username');
const password = config.get('nats.password');
const streamName = config.get('nats.streamName');

const natsOptions = {
  servers: servers.split(','),
  maxReconnectAttempts: 24,
  name: streamName,
  reconnectTimeWait: 5000, // wait 5 seconds before retrying...
  waitOnFirstConnect: true,
  pingInterval: 2000,
  user: username,
  pass: password,
};

const natsConnection = {
  async open() {
    try {
      if (connected) return connection;

      connection = await nats.connect(natsOptions);
      if (connection && connection.getServer()) {
        connected = true;
      }
      log.debug('NATS connected!', connection.getServer());

      connection.closed().then((err) => {
        if (err) {
          log.error(`NATS closed with an error: ${err.message}`);
        } else {
          log.error('NATS closed.');
        }
        connected = false;
      });

      return connection;
    } catch (e) {
      log.error(`error ${e}`);
    }
  },
  async close() {
    if (connection) {
      await connection.close();
    }
  },
  async checkConnection() {
    if (!connected) {
      await this.open();
    }
    return connected;
  },
  getConnection() {
    return connection;
  },
};

module.exports = natsConnection;
