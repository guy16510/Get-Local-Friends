import React, { useState } from 'react';

const ContactUs: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, summary }),
      });
      const data = await response.json();
      console.log(data)
      setMessage('Contact message sent!');
    } catch (error) {
      setMessage('Failed to send contact message.');
    }
  };

  return (
    <div>
      <h2>Contact Us</h2>
      <form onSubmit={handleContact}>
        <div>
          <label>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Message:</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <button type="submit">Send</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ContactUs;