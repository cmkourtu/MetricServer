module.exports = (sequelize, DataTypes) => {
    /**
     * @typedef {object} FacebookAccount
     * @property {string} id - UUID
     * @property {string} accessToken
     * @property {Date} accessTokenReceiveTime
     * @property {number} facebookId
     * @property {string} name
     * @property {string} createdAt - ISO Date
     * @property {string} updatedAt - ISO Date
     */
    const FacebookAccount = sequelize.define(
        'FacebookAccounts',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
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
        },
        {}
    );

    FacebookAccount.associate = function () {
        // associations can be defined here
    };

    return FacebookAccount;
};
