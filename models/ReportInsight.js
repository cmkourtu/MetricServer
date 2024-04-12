module.exports = (sequelize, DataTypes) => {
    /**
     * @typedef {object} ReportInsight
     * @property {string} id - UUID
     * @property {string} reportId - UUID, foreign key referencing a Report model
     * @property {string} insight - String, unlimited length
     */
    const ReportInsight = sequelize.define(
        "ReportInsight",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            reportId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Reports",
                    key: "id",
                },
            },
            insight: {
                type: DataTypes.TEXT, // Use TEXT for unlimited length strings
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING, // Use TEXT for unlimited length strings
                allowNull: false,
            },
        },
        {
            // Additional options can be specified here, if necessary
        }
    );

    ReportInsight.associate = function (models) {
        // Define associations here
        ReportInsight.belongsTo(models.Report, {
            foreignKey: "reportId",
            as: "report",
        });
    };

    return ReportInsight;
};
