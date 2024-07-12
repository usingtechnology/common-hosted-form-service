const {
  RetentionPolicy,
  AckPolicy,
  DeliverPolicy,
  connect,
  millis,
  nuid,
  Empty,
  consumerOpts,
} = require("nats");
// Get the passed NATS_URL or fallback to the default. This can be
// a comma-separated string.
const server = { port: 4222 };
const servers = [
  {},
  { port: 4224 },
  { port: 4223 },
  { port: 4222 },
  { servers: "localhost" },
  { servers: ["localhost:4222", "localhost:4223", "localhost:4224"] },
];

const connectionDemo = async () => {
  await servers.forEach(async (v) => {
    try {
      const nc = await connect(v);
      console.log(`connected to ${nc.getServer()}`);
      // this promise indicates the client closed
      const done = nc.closed();
      // do something with the connection

      // close the connection
      await nc.close();
      // check if the close was OK
      const err = await done;
      if (err) {
        console.log(`error closing:`, err);
      }
    } catch (err) {
      console.log(`error connecting to ${JSON.stringify(v)}`);
    }
  });
};

const pull = async () => {
  const nc = await connect({
    servers: ["localhost:4222", "localhost:4223", "localhost:4224"],
    user: "chefs",
    pass: "password",
  });

  const anonc = await connect({
    servers: ["localhost:4222", "localhost:4223", "localhost:4224"],
  });
  const anonjs = anonc.jetstream();
  const anonjsm = await anonjs.jetstreamManager();

  // ### Creating the stream
  // Define the stream configuration, specifying `RetentionPolicy.Interest` for retention, and
  // create the stream.

  // access JetStream
  const js = nc.jetstream();
  // CRUD operations in jetstream are performed by the JetStreamManager:
  const jsm = await js.jetstreamManager();

  // ### Creating the stream
  // Define the stream configuration, specifying `RetentionPolicy.Interest` for retention, and
  // create the stream.
  // make the stream/subjects unique
  const subj = "PUBLIC.forms";
  const name = "CHEFS";

  await jsm.streams.add({
    name,
    subjects: [`${subj}.>`],
  });
  // Publish a few messages for the example.
  await Promise.all([
    js.publish(
      `${subj}.1`,
      JSON.stringify({ meta: { id: 1 }, payload: { data: "one" } })
    ),
    js.publish(
      `${subj}.2`,
      JSON.stringify({ meta: { id: 2 }, payload: { data: "two" } })
    ),
    js.publish(
      `${subj}.3`,
      JSON.stringify({ meta: { id: 3 }, payload: { data: "three" } })
    ),
  ]);
  /*
  const handleJetStreamMessage = async (err, msg) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(
      `Received message, on ${msg.subject} , Sequence ::  [${msg.seq}], sid ::  [${msg.sid}], redelivered ::  [${msg.redelivered}] :: Data ::`,
      msg.data
    );
    try {
      msg.ack(); // acknowledge to JetStream
    } catch (e) {
      console.log(
        "Error while handling school data from update school event",
        e
      );
    }
  };

  const consumerOpts = {
    config: {
      name: "CHEFS",
      durable_name: "student-admin-institute-node-durable",
      ack_policy: AckPolicy.Explicit,
      deliver_policy: DeliverPolicy.New,
      deliver_subject: "INSTITUTE_EVENTS_STUDENT_ADMIN_NODE",
    },
    mack: true,
    queue: "student-admin-institute-node-js-queue-group",
    stream: "CHEFS",
    callbackFn: handleJetStreamMessage,
  };
  console.log("????????????????????????????????????");
  await anonjs.subscribe("CHEFS", consumerOpts);
*/
  // The new consumer API is a pull consumer
  // Let's create an ephemeral consumer. An ephemeral consumer
  // will be reaped by the server when inactive for some time
  let ci = await anonjsm.consumers.add(name, { ack_policy: AckPolicy.None });
  //console.log(ci);
  // by simply specifying the name of the stream
  const c = await anonjs.consumers.get(name, ci.name);
  console.log("c");
  //console.log(c);
  console.log(
    "ephemeral consumer will live until inactivity of ",
    millis((await c.info(true)).config.inactive_threshold),
    "millis"
  );

  // you can retrieve messages one at time with next():
  console.log("1...");
  let m = await c.next();
  console.log(m.subject);
  console.log(m.json());
  console.log("...1");
  console.log("2...");
  m = await c.next();
  console.log(m.subject);
  console.log(m.json());
  console.log("...2");
  console.log("3...");
  m = await c.next();
  console.log(m.subject);
  console.log(m.json());
  console.log("...3");

  // Let's create another consumer, this time well use fetch
  // we'll make this a durable
  console.log("add durable_name");
  await anonjsm.consumers.add(name, {
    ack_policy: AckPolicy.Explicit,
    durable_name: "A",
  });
  // by simply specifying the name of the stream
  const c2 = await anonjs.consumers.get(name, "A");
  console.log("get durable_name");
  let iter = await c2.fetch({ max_messages: 3 });
  for await (const m of iter) {
    console.log(m.subject);
    console.log(m.json());
    m.ack();
  }
  // if you know you don't need to save the state of the consumer, you can
  // delete it:
  await c2.delete();

  // Lastly we'll create another one but this time use consume
  // this consumer will be an ordered consumer - this one is an ephemeral
  // that guarantees that messages are delivered in order
  // These have a special shortcut, we only need the name of the stream
  // the underlying consumer is managed under the covers
  const c3 = await anonjs.consumers.get(name);
  console.log("c3");
  iter = await c3.consume({ max_messages: 3 });
  for await (const m of iter) {
    console.log(m.subject);
    console.log(m.json());
    // if we don't break, consume would keep waiting for messages
    // we know when we have seen all messages when no more are pending
    if (m.info.pending === 0) {
      break;
    }
  }

  // purge all messages in the stream, the stream itself
  // remains.
  await jsm.streams.purge("CHEFS");
  console.log("nc.drain()");
  await nc.drain();
  await anonc.drain();
};

const pubsub = async () => {
  const pubnc = await connect({
    servers: ["localhost:4222", "localhost:4223", "localhost:4224"],
  });

  let sub = pubnc.subscribe("PUBLIC.forms.*", { max: 3 });

  const done = (async () => {
    for await (const msg of sub) {
      console.log(`${msg.string()} on subject ${msg.subject}`);
    }
  })();

  const nc = await connect({
    servers: ["localhost:4222", "localhost:4223", "localhost:4224"],
    user: "chefs",
    pass: "password",
  });

  nc.publish("PUBLIC.forms.bob", "hello");

  nc.publish("PUBLIC.forms.joe", "hello");
  nc.publish("PUBLIC.forms.pam", "hello");
  nc.publish("PUBLIC.forms.sue", "hello");

  await done;

  await nc.drain();
  await pubnc.drain();
};

const pullsub = async () => {
  // Create a client connection to an available NATS server.
  const nc = await connect({
    servers: ["localhost:4222", "localhost:4223", "localhost:4224"],
    user: "chefs",
    pass: "password",
  });

  // Resource creation has not changed. To create a stream and consumers,
  // create a JetStream Manager context - this context has API you can use to
  // create those resources
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({
    name: "CHEFS",
    subjects: ["PUBLIC.forms.>"],
  });

  // To add messages to the stream, create a JetStream context, and
  // publish data to the stream
  const js = nc.jetstream();
  const proms = Array.from({ length: 20 }).map((_v, idx) => {
    return js.publish(`PUBLIC.forms.${idx}`);
  });
  await Promise.all(proms);

  // ### Processing Messages
  // Now lets compare and contrast the new and legacy ways of processing
  // messages.

  // #### Legacy Push Subscribe
  //
  // Previously, the easiest way to continuously receive messages
  // was to use _push_ consumer. The `subscribe()` API call was
  // intended for these _push_ consumers. These looked very natural
  // to NATS users.
  // <!break>

  // the legacy `subscribe()` variants relied on consumer options
  // being provided. These options defined the consumer to use.
  // if the consumer didn't exist, it would be created, if it did,
  // and the options were different, the consumer would be updated
  let opts = consumerOpts()
    .deliverTo("eventprocessing")
    .ackExplicit()
    .manualAck();

  // The `subscribe` call automatically creates a consumer that matches the specified
  // options, and returns an async iterator with the messages from the stream.
  // If no messages are available, the loop will wait.
  //
  // You can check if the stream currently has more messages
  // by checking the number of pending messages, and break
  // if you are done - typically your code will simply wait until
  // new messages become available.
  const pushSub = await js.subscribe("PUBLIC.forms.>", opts);
  for await (const m of pushSub) {
    console.log(`legacy push subscriber received ${m.subject}`);
    m.ack();
    if (m.info.pending === 0) {
      break;
    }
  }

  // `destroy()` deletes the consumer! - this is not really necessary on ephemeral
  // consumers, since the server will destroy them after some specified inactivity.
  // If you know the consumer is not going to be needed, then destroying it will
  // help with resource management. Durable consumers are not deleted, will
  // consume resources forever if not managed.
  await pushSub.destroy();

  // #### Legacy Pull Subscription
  //
  // The above is quite easy - however for streams that
  // contain huge number of messages, it required that you set up
  // other options, and if you didn't you could run into issues such as
  // _slow consumers_, or have a consumer that cannot be horizontally scaled.
  //
  // To prevent those issues, the legacy API also provided a
  // `pullSubscribe()`, which effectively avoided the issues of _push_
  // by enabling the client to request the number of messages it wanted
  // to process:
  opts = consumerOpts().ackExplicit().manualAck();

  // `pullSubscribe()` would create a subscription to process messages
  // received from the stream, but required a `pull()` to trigger
  // a request on the server to yield messages
  const pullSub = await js.pullSubscribe("PUBLIC.forms.>", opts);
  const done = (async () => {
    for await (const m of pullSub) {
      console.log(`legacy pull subscriber received ${m.subject}`);
      m.ack();
      if (m.info.pending === 0) {
        return;
      }
    }
  })();

  // To get messages flowing, you called `pull()` on
  // the subscription to start.
  pullSub.pull({ batch: 15, no_wait: true });

  // and also do so at some interval to keep messages flowing.
  // Unfortunately, there no coordination between the processing
  // of the messages and the triggering of the pulls was provided.
  const timer = setInterval(() => {
    pullSub.pull({ batch: 15, no_wait: true });
  }, 1000);

  await done;
  clearInterval(timer);

  // ### New JetStream Processing API
  //
  // The new API doesn't automatically create or update consumers. This
  // is something that the JetStreamManager API does rather well. Instead,
  // you simply use JetStreamManager to create your consumer:
  await jsm.consumers.add("CHEFS", {
    name: "my-ephemeral",
    ack_policy: AckPolicy.Explicit,
  });

  // To process messages, you retrieve the consumer by specifying
  // the stream name and consumer names. If the consumer doesn't exist
  // this call will reject. Note that only _pull consumers_ are supported.
  // If your existing consumer is a push consumer, you will have to recreate
  // it as a pull consumer (not specifying a `deliver_subject` option on a
  // consumer configuration, nor specifying `deliverTo()` as an option):
  const consumerA = await js.consumers.get("CHEFS", "my-ephemeral");

  // With a consumer in hand, you can now retrieve messages - in different ways.
  // The different ways of getting messages from the consumers are there
  // to help you align the buffering requirements of your application with
  // what the client is doing.

  // #### Consuming Messages
  //
  // Firstly, we'll discuss consume, this is analogous to the push consumer example
  // above, where the consumer will yield messages from the stream to match any
  // buffering options specified on the call. The defaults are safe, however you
  // can ask for as many messages as you will be able to process within your ack window.
  // As you consume messages, the library will retrieve more messages for you.
  // Yes, under the hood this is actually a pull consumer, but that actually works smartly
  // for you.
  const messages = await consumerA.consume({ max_messages: 5000 });
  for await (const m of messages) {
    console.log(`consume received ${m.subject}`);
    m.ack();
    if (m.info.pending === 0) {
      break;
    }
  }

  // If you wanted to preempt delete the consumer you can - however
  // this is something you should do only if you know you are not
  // going to need that consumer to resume processing.
  await consumerA.delete();

  // Let's create a new consumer, this time a durable
  await jsm.consumers.add("CHEFS", {
    durable_name: "my-durable",
    ack_policy: AckPolicy.Explicit,
  });

  // #### Processing Single Messages
  //
  // Some clients such as services typically to worry about processing a single message
  // at a time. The idea being, instead of optimizing a client to pull many messages
  // for processing, you can horizontally scale the number of process that work on
  // just one message.
  //
  // #### Legacy Pull
  //
  // The legacy API provided `pull()` as a way of retrieving a single message:
  const m = await js.pull("CHEFS", "my-durable").catch((err) => {
    console.log(err.message);
    return null;
  });

  if (m === null) {
    console.log("legacy pull got no messages");
  } else {
    console.log(`jetstream legacy pull: ${m.subject}`);
    m.ack();
  }

  // #### Get
  //
  // With the new JetStream API we can do the same, but it is now called `get()`.
  // The API is more ergonomic, if no messages it will be `null`.
  const consumerB = await js.consumers.get("CHEFS", "my-durable");
  consumerB
    .next()
    .then((m) => {
      if (m === null) {
        console.log("consumer next - no messages available");
      } else {
        console.log(`consumer next - ${m.subject}`);
        m.ack();
      }
    })
    .catch((err) => {
      console.error(err.message);
    });

  // Processing a Small Batch of Messages
  //
  // Finally some clients will want to manage the rate at which they receive
  // messages more explicitly.
  //
  // Legacy JetStream provided the `fetch()` API which
  // returned one or more messages in a single request:
  let iter = await js.fetch("CHEFS", "my-durable", {
    batch: 3,
    expires: 5000,
  });
  for await (const m of iter) {
    console.log(`legacy fetch: ${m.subject}`);
    m.ack();
  }

  // The new API also provides the same facilities - notice we already
  // retrieved the consumer as `consumer`. The batch property, is now called
  // `max_messages`:
  iter = await consumerB.fetch({ max_messages: 3, expires: 5000 });
  for await (const m of iter) {
    console.log(`consumer fetch: ${m.subject}`);
    m.ack();
  }

  await nc.drain();
};

//pubsub();

//pullsub();
//connectionDemo();
pull();
