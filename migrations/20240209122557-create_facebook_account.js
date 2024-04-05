"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("FacebookAccounts", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            accessToken: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            accessTokenReceiveTime: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            facebookId: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("FacebookAccounts");
    },
};
