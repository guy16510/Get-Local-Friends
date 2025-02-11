import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { SES } from 'aws-sdk';

const ses = new SES();
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'your-verified-email@domain.com';
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'your-support@domain.com';

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

    const params = {
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
    };

    await ses.sendEmail(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: "Message sent successfully"
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
