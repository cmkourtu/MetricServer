'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('UserFacebookAccounts', {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      facebookAccountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'FacebookAccounts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable('UserFacebookAccounts');
  },
};
