import { Context } from 'aws-lambda';
import { type Schema } from "../../data/resource";
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

export const handler = async (event: any, context: Context) => {
  try {
    const { name = '', email, message } = JSON.parse(event.body);

    if (!email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and message are required' })
      };
    }

    const contact = await client.models.Contact.create({
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify(contact)
    };
  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process contact form submission' })
    };
  }
};