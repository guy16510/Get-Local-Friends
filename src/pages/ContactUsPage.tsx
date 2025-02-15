import React, { useState } from 'react';
// import { contactService } from '../services/modelServices';
import * as API from '@aws-amplify/api-rest';
interface ContactFormData {
  email: string;
  name: string;
  summary: string;
}

const ContactUsPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    email: '',
    name: '',
    summary: ''
  });
  const [status, setStatus] = useState({ message: '', error: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ message: 'Sending...', error: false });

    try {
      // await contactService.create(formData);
      const { response } = API.post({
        apiName: 'myRestApi',
        path: 'contact',
        options: {
          body: {
            email: formData.email,
            name: formData.name,
            summary: formData.summary
          }
      }});
      const res = await response;
      const json = await res.body.json();
      console.log(json);
      setStatus({ message: 'Message sent successfully!', error: false });
      setFormData({ email: '', name: '', summary: '' });
    } catch (error) {
      setStatus({ 
        message: 'Failed to send message. Please try again.', 
        error: true 
      });
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              name: e.target.value 
            }))}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              email: e.target.value 
            }))}
            required
          />
        </div>
        <div>
          <label htmlFor="summary">Message:</label>
          <textarea
            id="summary"
            value={formData.summary}
            onChange={e => setFormData(prev => ({ 
              ...prev, 
              summary: e.target.value 
            }))}
            required
          />
        </div>
        <button type="submit">Send Message</button>
      </form>
      {status.message && (
        <p className={status.error ? 'error' : 'success'}>
          {status.message}
        </p>
      )}
    </div>
  );
};

export default ContactUsPage;