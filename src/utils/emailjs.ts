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
    console.warn('EmailJS not configured or missing public key/service ID. Skipping email send.');
    return;
  }
  console.log('Sending contact email via EmailJS...', { serviceId: SERVICE_ID, templateId: TEMPLATE_ID });
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        company_name: 'Phoenix Cargo',
        from_name: data.name,
        from_email: data.email,
        inquiry_type: data.subject || 'General Inquiry',
        submitted_at: new Date().toLocaleString(),
        message: data.message,
      },
      PUBLIC_KEY
    );
    console.log('EmailJS success response:', result);
    return result;
  } catch (err) {
    console.error('EmailJS error sending contact email:', err);
    throw err;
  }
};

export const sendQuoteEmail = async (data: QuoteEmailData) => {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured or missing public key/service ID. Skipping email send.');
    return;
  }
  const targetTemplateId = QUOTE_TEMPLATE_ID || TEMPLATE_ID;
  console.log('Sending quote email via EmailJS...', { serviceId: SERVICE_ID, templateId: targetTemplateId });
  try {
    const result = await emailjs.send(
      SERVICE_ID,
      targetTemplateId,
      {
        company_name: 'Phoenix Cargo',
        from_name: data.name,
        from_email: data.email,
        inquiry_type: `Quote Request: ${data.service || 'Logistics Service'}`,
        submitted_at: new Date().toLocaleString(),
        message: `Phone: ${data.phone}\nCompany: ${data.company || 'N/A'}\n\nDetails:\n${data.message}`,
      },
      PUBLIC_KEY
    );
    console.log('EmailJS success response:', result);
    return result;
  } catch (err) {
    console.error('EmailJS error sending quote email:', err);
    throw err;
  }
};
