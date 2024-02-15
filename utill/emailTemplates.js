const testEmail = (to) => {
    return {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Text: {
                    Data: 'The test message from Statistic App by DevMaxUp!',
                }
            },
            Subject: {
                Data: 'Test Statistic app!',
            }
        },
        Source: 'admin@yhsh.me',
    }
};

module.exports = {testEmail}