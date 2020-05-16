module.exports = {
  up: (queryInterface) => queryInterface.sequelize.transaction(() => Promise.all([
    queryInterface.sequelize.query(`do $$
    begin
      IF NOT EXISTS (
          SELECT
            NULL
          FROM
            INFORMATION_SCHEMA.COLUMNS
          WHERE
            TABLE_NAME = 'Users' AND COLUMN_NAME = 'verified')
        THEN
          ALTER TABLE "Users"
            ADD verified BOOLEAN NOT NULL default false;
            END IF;
    end
    $$`),

  ])),
  down: (queryInterface) => queryInterface.sequelize.transaction((t) => Promise.all([
    queryInterface.removeColumn('Users', 'verified', { transaction: t }),
  ])),
};
