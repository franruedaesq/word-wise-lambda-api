const AWS = require("aws-sdk");
const LEARNING_CONTENT_TABLE = process.env.LEARNING_CONTENT_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.getAllContent = async (event, context) => {
    const params = {
        TableName: LEARNING_CONTENT_TABLE
    }

    try {
        const data = await dynamoDB.scan(params).promise();

        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data.Items)
        };

        return response;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};