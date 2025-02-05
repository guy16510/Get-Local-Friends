import React, { useState, ChangeEvent, FormEvent } from 'react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
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
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await client.models.Contact.create({
        ...formData,
        timestamp: new Date().toISOString()
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
    <div>
      
      <h1>Contact Us</h1>
      {responseMessage && <p>{responseMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
