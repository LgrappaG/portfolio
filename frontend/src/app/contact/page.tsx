'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container-max container-px py-12 md:py-20">
      {/* Header */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">Get In Touch</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Have a question or want to collaborate? I'd love to hear from you. Send me a message!
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 md:mb-24">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="card-base p-6">
            <h3 className="text-lg font-bold mb-2">Email</h3>
            <a href="mailto:contact@example.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact@example.com
            </a>
          </div>

          <div className="card-base p-6">
            <h3 className="text-lg font-bold mb-2">Social</h3>
            <div className="space-y-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="block text-blue-600 dark:text-blue-400 hover:underline">
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="block text-blue-600 dark:text-blue-400 hover:underline">
                Twitter
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="block text-blue-600 dark:text-blue-400 hover:underline">
                LinkedIn
              </a>
            </div>
          </div>

          <div className="card-base p-6">
            <h3 className="text-lg font-bold mb-2">Location</h3>
            <p className="text-slate-700 dark:text-slate-300">Remote / Available Worldwide</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card-base p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your email"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Your message here..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>

              {/* Success Message */}
              {submitted && (
                <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                  ✓ Message sent! I'll get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: "What's your typical response time?", a: "I usually respond within 24-48 hours." },
            { q: "Do you work remotely?", a: "Yes! I work remotely and collaborate with clients worldwide." },
            { q: "What's your hourly rate?", a: "Rates vary based on project scope. Let's discuss your needs." },
            { q: "Can you sign NDAs?", a: "Absolutely. I'm happy to sign NDAs for confidential projects." }
          ].map((faq, i) => (
            <div key={i} className="card-base p-6">
              <h3 className="font-bold mb-2 text-blue-600 dark:text-blue-400">{faq.q}</h3>
              <p className="text-slate-700 dark:text-slate-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
