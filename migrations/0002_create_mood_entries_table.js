// migrations/[timestamp]_create_mood_entries_table.js
exports.up = function (knex) {
    return knex.schema.createTable('mood_entries', function (table) {
        table.increments('id');
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('moodScore').notNullable();
        table.text('notes');
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.index('userId');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('mood_entries');
};
