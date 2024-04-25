module.exports = (sequelize, DataTypes) => {
    /**
     * @typedef {object} Report
     * @property {string} id - UUID
     * @property {string} name
     * @property {string} description
     * @property {Array<string>} metrics
     * @property {Array<string>} adSets
     * @property {string} viewMode
     * @property {Date} startDate
     * @property {Date} endDate
     * @property {string} groupBy
     * @property {string} userId - UUID
     * @property {string} createdAt - ISO Date
     * @property {string} updatedAt - ISO Date
     */
    const Report = sequelize.define(
        "Report",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
            },
            metrics: {
                type: DataTypes.ARRAY(DataTypes.STRING),
            },
            adSets: {
                type: DataTypes.ARRAY(DataTypes.STRING),
            },
            viewMode: {
                type: DataTypes.STRING,
            },
            startDate: {
                type: DataTypes.DATE,
            },
            endDate: {
                type: DataTypes.DATE,
            },
            groupBy: {
                type: DataTypes.STRING,
            },
            chosenMetrics: {
                type: DataTypes.TEXT,
            },
            chosenAdSets: {
                type: DataTypes.TEXT,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
        },
        {
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        }
    );

    Report.associate = function (models) {
        Report.belongsTo(models.User, {
            foreignKey: "userId",
            as: "user",
        });
    };

    return Report;
};
