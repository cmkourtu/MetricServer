"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("Users", "avatar", {
            type: Sequelize.STRING,
        });
        await queryInterface.addColumn("Users", "isActive", {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("Users", "avatar");
        await queryInterface.removeColumn("Users", "isActive");
    },
};
