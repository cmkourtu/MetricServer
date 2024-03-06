'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('FacebookAccounts', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.literal('uuid_generate_v1()'),
        allowNull: false,
        primaryKey: true,
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessTokenReceiveTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      facebookId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    return queryInterface.dropTable('FacebookAccounts');
  },
};
