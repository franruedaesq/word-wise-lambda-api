const AWS = require("aws-sdk");
const LEARNING_CONTENT_TABLE = process.env.LEARNING_CONTENT_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.getContentByID = async (event, context) => {
    const id = event.pathParameters.id;

    const params = {
        TableName: LEARNING_CONTENT_TABLE,
        Key: {
          id: id,
        },
      };
    

    try {
        const data = await dynamoDB.get(params).promise();

        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data.Item)
        };

        return response;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};
