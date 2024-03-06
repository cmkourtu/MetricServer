const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV1,
                allowNull: false,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(50),
                validate: {
                    isEmail: {
                        args: true,
                        msg: "Invalid email!",
                    },
                },
            },
            firstName: {
                type: DataTypes.STRING,
            },
            lastName: {
                type: DataTypes.STRING,
            },
            companyName: {
                type: DataTypes.STRING,
            },
            refreshToken: {
                type: DataTypes.STRING,
                unique: true,
            },
            encryptedPassword: {
                type: DataTypes.STRING,
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
            },
            password: {
                type: DataTypes.VIRTUAL,
                set(password) {
                    const saltRounds = 10; // Кількість раундів хешування
                    const encryptedPassword = bcrypt.hashSync(password, saltRounds);
                    this.setDataValue('password', password);
                    this.setDataValue('encryptedPassword', encryptedPassword);
                },
            },
            avatar: {
                type: DataTypes.STRING
            },
            isActive: {
                type: DataTypes.BOOLEAN
            }
        },
        {}
    );

    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());

        delete values.password;
        delete values.encryptedPassword;
        delete values.refreshToken;
        return values;
    };

    User.prototype.isEqualPassword = function (password) {
        return bcrypt.compareSync(password, this.encryptedPassword);
    };

    return User;
};
