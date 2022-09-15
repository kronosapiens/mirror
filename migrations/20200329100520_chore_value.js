exports.up = function(knex, Promise) {
    return knex.schema.createTable('chore_value', function(t) {
        t.increments('id').unsigned().primary();
        t.timestamps(useTimestamps = true, defaultToNow = true);
        t.integer('chore_id').references('chore.id').notNull();
        t.integer('value');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('chore_value');
};
