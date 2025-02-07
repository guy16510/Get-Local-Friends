// src/components/ContactUs.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  Flex,
  Heading,
  TextField,
  TextAreaField,
  View,
} from '@aws-amplify/ui-react';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.models.Contact.create({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      setResponseMessage('Thank you for contacting us!');
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setResponseMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View padding="2rem">
      <Heading level={1}>Contact Us</Heading>
      {responseMessage && <p>{responseMessage}</p>}
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="1rem">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextAreaField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <Button type="submit" variation="primary" isLoading={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </Flex>
      </form>
    </View>
  );
};

export default ContactUs;