import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDB, SES } from 'aws-sdk';

const dynamoDB = new DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});
const ses = new SES({ region: process.env.AWS_REGION });

const TABLE_NAME = process.env.CONTACT_TABLE_NAME;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

if (!TABLE_NAME || !SENDER_EMAIL || !RECIPIENT_EMAIL) {
  throw new Error('Required environment variables must be set');
}

exports.handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          message: "Missing request body"
        })
      };
    }

    const { name, email, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify({
          message: "Missing required fields"
        })
      };
    }

    // Save to DynamoDB
    const contactId = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: {
        contactId,
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      }
    }).promise();

    // Send email
    await ses.sendEmail({
      Destination: {
        ToAddresses: [RECIPIENT_EMAIL]
      },
      Message: {
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
          }
        },
        Subject: {
          Data: 'New Contact Form Submission'
        }
      },
      Source: SENDER_EMAIL
    }).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: "Message sent successfully",
        contactId
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: "Internal server error"
      })
    };
  }
};
