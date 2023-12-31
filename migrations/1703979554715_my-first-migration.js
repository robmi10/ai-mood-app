require('dotenv').config();

exports.up = (pgm) => {
    pgm.createTable('users', {
        id: 'id',
        name: { type: 'varchar(500)', notNull: true },
        age: { type: 'varchar(500)', notNull: true },
        createdAt: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
}