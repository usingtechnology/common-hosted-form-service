const stamps = require('../stamps');

exports.up = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.createTable('form_components_proactive_help',table=>{
      table.uuid('id').primary();
      table.string('componentname').notNullable();
      table.string('externallink',500);
      table.binary('image').notNullable();
      table.string('imagetype').notNullable();
      table.integer('version').notNullable();
      table.string('groupname').notNullable();
      table.text('description').notNullable();
      table.boolean('publishstatus').defaultTo(false);
      table.unique(['componentname', 'version']);
      stamps(knex, table);
    }));
};

exports.down = function(knex) {
  return Promise.resolve()
    .then(() => knex.schema.dropTableIfExists('form_components_proactive_help'));
};
