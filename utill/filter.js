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
const filterDateByDays = (date, days) => {
    const currentDate = new Date();
    const targetDate = new Date(date);
    const differenceInTime = currentDate.getTime() - targetDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= days;
};

module.exports = {userUpdateFilterFields, filterDateByDays};
