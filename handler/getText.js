const { Configuration, OpenAIApi } = require('openai');
const { getTextMessage } = require('../utils/openAIMessages');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports.getText = async (event) => {
  const requestBody = JSON.parse(event.body);
    console.log(requestBody)
  // Make sure the request method is POST
//   if (event.httpMethod !== 'POST') {
//     console.log(event.httpMethod)
//     return {
//       statusCode: 405,
//       body: 'Method Not Allowed'
//     };
//   }

  const { textType, textSize, textDifficulty } = requestBody;
  console.log(requestBody)
  try {
    // Generate text using GPT-3.5 Turbo model
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: getTextMessage(textType, textDifficulty, textSize),
    });
    console.log(completion)
    const responseData = {
      response: completion.data.choices[0].message,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'Internal Server Error'
    };
  }
};
