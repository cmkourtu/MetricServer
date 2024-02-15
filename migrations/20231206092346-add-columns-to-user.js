module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Users', 'firstName', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Users', 'lastName', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Users', 'companyName', {
        type: Sequelize.STRING,
      }),

    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'firstName'),
      queryInterface.removeColumn('Users', 'lastName'),
      queryInterface.removeColumn('Users', 'companyName'),
    ]);
  },
};
