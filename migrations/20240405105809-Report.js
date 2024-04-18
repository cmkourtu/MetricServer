"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Reports", {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
            },
            metrics: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            adSets: {
                type: Sequelize.ARRAY(Sequelize.STRING),
            },
            viewMode: {
                type: Sequelize.STRING,
            },
            startDate: {
                type: Sequelize.DATE,
            },
            endDate: {
                type: Sequelize.DATE,
            },
            groupBy: {
                type: Sequelize.STRING,
            },
            chosenMetrics: {
                type: Sequelize.TEXT,
            },
            chosenAdSets: {
                type: Sequelize.TEXT,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
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
        await queryInterface.dropTable("Reports");
    },
};
