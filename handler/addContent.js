const AWS = require("aws-sdk");
const LEARNING_CONTENT_TABLE = process.env.LEARNING_CONTENT_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

module.exports.addContent = (event, context, callback) => {
  const learningContent = JSON.parse(event.body);
  console.log(learningContent)
  const params = {
    TableName: LEARNING_CONTENT_TABLE,
    Item: {
      id: uuid.v1(),
      title: {
        german: learningContent?.title?.german,
        english: learningContent?.title?.english,
      },
      text: learningContent.text,
      type: learningContent.type,
      size: learningContent.size,
      difficulty: learningContent.difficulty,
      grammar: learningContent.grammar,
      flashcards: learningContent.flashcards || [],
    },
  };
  console.log(params.Item.flashcards)
  dynamoDb.put(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    const getItemParams = {
      TableName: LEARNING_CONTENT_TABLE,
      Key: {
        id: params.Item.id
      }
    };

    dynamoDb.get(getItemParams, (error, data) => {
      if (error) {
        console.error(error);
        callback(new Error(error));
        return;
      }

      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Content added to DynamoDB!", data: data.Item }),
      };
      callback(null, response);
    });
  });
};
