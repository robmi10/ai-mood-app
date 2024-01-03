// migrations/[timestamp]_create_users_table.js
exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('id');
        table.string('name', 500).notNullable();
        table.string('email', 500).notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users');
};
