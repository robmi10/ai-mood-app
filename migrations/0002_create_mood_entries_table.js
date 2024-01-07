// migrations/[timestamp]_create_mood_entries_table.js
exports.up = function (knex) {
    return knex.schema.createTable('moods', function (table) {
        table.increments('id');
        table.integer('userId').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('moodScore').notNullable();
        table.text('notes');
        table.specificType('activities', 'TEXT[]'); // Using specificType to define an array of text
        table.text('weather'); // Assuming one weather condition per entry
        table.text('sleepQuality'); // Assuming one sleep quality entry
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable();
        table.index('userId');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('moods');
};