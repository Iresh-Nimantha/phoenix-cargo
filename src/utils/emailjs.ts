import emailjs from '@emailjs/browser';

// Configure these in your .env file:
// VITE_EMAILJS_SERVICE_ID=your_service_id
// VITE_EMAILJS_TEMPLATE_ID=your_template_id
// VITE_EMAILJS_QUOTE_TEMPLATE_ID=your_quote_template_id
// VITE_EMAILJS_PUBLIC_KEY=your_public_key

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const QUOTE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_QUOTE_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface QuoteEmailData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export const sendContactEmail = async (data: ContactEmailData) => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured. Skipping email send.');
    return;
  }
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    },
    PUBLIC_KEY
  );
};

export const sendQuoteEmail = async (data: QuoteEmailData) => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured. Skipping email send.');
    return;
  }
  return emailjs.send(
    SERVICE_ID,
    QUOTE_TEMPLATE_ID || TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.service,
      message: data.message,
    },
    PUBLIC_KEY
  );
};
