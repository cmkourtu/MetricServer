/* eslint-disable no-useless-escape */

const toSequelizeType = type => {
    const inSquareBracketsRegexp = /\[([^\]]+)]/i;
    if (inSquareBracketsRegexp.test(type)) {
        const dataType = toSequelizeType(type.match(inSquareBracketsRegexp)[1]);
        return `ARRAY(Sequelize.${dataType})`;
    }
    const withSquareBracketsEndingRegexp = /^([^)]+)\[]/i;
    if (withSquareBracketsEndingRegexp.test(type)) {
        const dataType = toSequelizeType(type.match(withSquareBracketsEndingRegexp)[1]);
        return `ARRAY(Sequelize.${dataType})`;
    }

    const withParameterRegexp = /\((["'0-9].+)\)]/i;
    if (withParameterRegexp.test(type)) {
        const dataType = toSequelizeType(type.match(withParameterRegexp)[1]);
        return type.replace(withParameterRegexp, `(${dataType})`);
    }

    const withNestedTypeRegexp = /\(((DataTypes\.|Sequelize\.)?.+)\)]/i;
    if (withNestedTypeRegexp.test(type)) {
        const dataType = toSequelizeType(type.match(withNestedTypeRegexp)[1]);
        return type.replace(withNestedTypeRegexp, `(Sequelize.${dataType})`);
    }

    return type.toUpperCase();
};

module.exports = toSequelizeType;
