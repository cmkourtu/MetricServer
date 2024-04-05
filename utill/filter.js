const userUpdateFilterFields = data => {
    const allowedFields = ["firstName", "lastName", "companyName", "jobTitle"];
    const filteredData = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== null && data[key] !== undefined && allowedFields.includes(key)) {
            filteredData[key] = data[key];
        }
    });
    return filteredData;
};

module.exports = {userUpdateFilterFields};
