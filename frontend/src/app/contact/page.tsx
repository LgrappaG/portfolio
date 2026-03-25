'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Linkedin, ArrowRight } from 'lucide-react';
import { contactAPI, ContactFormData } from '@/lib/api/contact';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await contactAPI.sendContactForm(formData as ContactFormData);

      if (response.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(response.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      console.error('Contact form error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-black dark:text-white">
      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-slate-200 dark:border-slate-800">
        <div className="container-max container-px">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm md:text-base tracking-widest text-amber-600 dark:text-amber-400 font-light uppercase mb-4">
                Contact
              </p>
              <h1 className="text-5xl md:text-7xl font-black italic mb-6 leading-tight">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-light max-w-2xl">
                Have a question about a game project, or want to collaborate? Let's connect and bring your ideas to life
              </p>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full aspect-video max-w-md mx-auto lg:mx-0"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-slate-300 dark:border-slate-700">
                <img
                  src="/portfolio/images/contact.png"
                  alt="Contact"
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-colors p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Mail size={24} />
                  <h3 className="text-xl font-black">Email</h3>
                </div>
                <a href="mailto:rondomman422@gmail.com" className="text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                  rondomman422@gmail.com
                </a>
              </div>

              {/* Social */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-colors p-8">
                <h3 className="text-xl font-black mb-4">Social Links</h3>
                <div className="space-y-3">
                  <a href="https://github.com/LgrappaG" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                    <Github size={18} /> GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline font-semibold">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-colors p-8">
                <h3 className="text-xl font-black mb-3">Availability</h3>
                <p className="text-slate-700 dark:text-slate-300">Remote / Worldwide</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic">Typically respond within 24-48 hours</p>
              </div>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-3">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 focus:border-amber-500 dark:focus:border-amber-400 transition-colors outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-3">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 focus:border-amber-500 dark:focus:border-amber-400 transition-colors outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-3">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 focus:border-amber-500 dark:focus:border-amber-400 transition-colors outline-none"
                      placeholder="What's this about?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-black uppercase tracking-widest mb-3">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 focus:border-amber-500 dark:focus:border-amber-400 transition-colors outline-none resize-none"
                      placeholder="Your message here..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-300 dark:border-red-700 font-semibold"
                    >
                      ✗ {error}
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700 font-semibold"
                    >
                      ✓ Message sent! I'll get back to you soon.
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* FAQ Section */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm md:text-base tracking-widest text-amber-600 dark:text-amber-400 font-light uppercase mb-4">
              Common Questions
            </p>
            <h2 className="text-3xl md:text-4xl font-black italic">Frequently Asked Questions</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'What is your typical response time?', a: 'I usually respond within 24-48 hours during business days.' },
              { q: 'Do you work remotely?', a: 'Yes! I work remotely and collaborate with clients worldwide.' },
              { q: 'Can you sign NDAs?', a: 'Absolutely. I\'m happy to sign NDAs for confidential projects.' },
              { q: 'Do you offer consulting?', a: 'Yes, I provide game development consulting and technical guidance.' },
              { q: 'What payment methods do you accept?', a: 'We can discuss various payment arrangements based on project needs.' },
              { q: 'How do you handle project management?', a: 'I use industry-standard tools and maintain clear communication throughout.' }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-400 transition-colors p-6"
              >
                <h3 className="font-black text-amber-600 dark:text-amber-400 mb-3 text-lg">{faq.q}</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="container-max container-px">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-black dark:bg-white text-white dark:text-black p-12 md:p-16 lg:p-20"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-black italic">
                Ready to Start Your Project?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 dark:text-gray-700 italic font-light">
                Send me a message with details about your project, and let's discuss how we can make it happen
              </p>
              <motion.a
                href="#top"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-semibold hover:gap-3 transition-all"
              >
                Send a Message <ArrowRight size={20} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
