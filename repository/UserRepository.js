const { User } = require('../models');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

const isUserExistById = async (userId) => {
    const isValidUuid = checkValidUUID(userId);
    if(!isValidUuid) return false;
    const user = await User.findByPk(userId);
    return !!user;
}

const checkValidUUID = (uuidForValidating) => {
    return uuidValidate(uuidForValidating);
}

module.exports = {isUserExistById}