const log = require('./log')(module.filename);
const natsConnection = require('./natsConnection');
const config = require('config');
const streamName = config.get('nats.streamName');

const SERVICE = 'NatsService';

class NatsService {
  constructor() {}

  async onFormCreated(form) {
    try {
      const conn = await natsConnection.open();
      const js = conn.jetstream();
      const jsm = await js.jetstreamManager();
      const subj = 'PUBLIC.forms';
      const name = streamName;

      await jsm.streams.add({
        name,
        subjects: [`${subj}.>`],
      });

      const sub = `${subj}.${form.id}.schema.created`;
      const formVersionId = form.versions && form.versions[0] ? form.versions[0].id : null;
      const msg = {
        meta: {
          source: 'chefs',
          domain: 'forms',
          class: 'schema',
          type: 'created',
          formId: form.id,
          formVersionId: formVersionId,
        },
        payload: {
          form: form,
        },
      };
      await js.publish(sub, JSON.stringify(msg));
    } catch (e) {
      log.error(`${SERVICE}.onFormCreated: ${e.message}`, e);
    }
  }
}

let natsService = new NatsService();
module.exports = natsService;
