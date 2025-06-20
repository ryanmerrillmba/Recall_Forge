'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'parent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement actual form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="landing" />
        
        <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-8">✅</div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 font-child">
                Message Sent! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Thank you for reaching out! We'll get back to you within 24 hours (usually much faster).
              </p>
              
              <div className="space-y-4">
                <Link href="/">
                  <Button className="btn-primary px-8 py-4 text-lg font-child">
                    Back to Home ✨
                  </Button>
                </Link>
                <div className="text-gray-600">
                  Need immediate help? Check our <Link href="/help" className="text-blue-600 hover:text-blue-700 underline">Help Center</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer variant="landing" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-child">
              We're Here to Help! 💬
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Questions, feedback, or need support? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 font-child">
                  Send Us a Message 📝
                </h2>
                
                <Card className="card-enhanced p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                          I am a...
                        </label>
                        <select
                          id="userType"
                          name="userType"
                          value={formData.userType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="parent">Parent/Guardian</option>
                          <option value="teacher">Teacher</option>
                          <option value="homeschool">Homeschool Parent</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">Select a topic</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing Question</option>
                          <option value="feature">Feature Request</option>
                          <option value="feedback">Feedback</option>
                          <option value="education">Educational Question</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary py-4 text-lg font-child"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending message...
                        </div>
                      ) : (
                        'Send Message ✨'
                      )}
                    </Button>
                  </form>
                </Card>
              </div>

              {/* Contact Information & FAQ */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 font-child">
                    Other Ways to Reach Us 📞
                  </h2>
                  
                  <div className="space-y-6">
                    <Card className="card-enhanced p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">💬</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2">Live Chat Support</h3>
                          <p className="text-gray-600 mb-3">
                            Get instant help from our support team during business hours.
                          </p>
                          <div className="text-sm text-blue-600">
                            Monday - Friday, 9 AM - 5 PM PST
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="card-enhanced p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">📚</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2">Help Center</h3>
                          <p className="text-gray-600 mb-3">
                            Find answers to common questions and step-by-step guides.
                          </p>
                          <Link href="/help" className="text-blue-600 hover:text-blue-700 font-medium">
                            Visit Help Center →
                          </Link>
                        </div>
                      </div>
                    </Card>

                    <Card className="card-enhanced p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">👥</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-2">Community Forum</h3>
                          <p className="text-gray-600 mb-3">
                            Connect with other parents and teachers using RecallForge.
                          </p>
                          <Link href="/community" className="text-blue-600 hover:text-blue-700 font-medium">
                            Join Community →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Quick FAQ */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 font-child">
                    Quick Answers 🚀
                  </h3>
                  
                  <div className="space-y-4">
                    <Card className="card-enhanced p-4">
                      <h4 className="font-bold text-gray-800 mb-2">How quickly do you respond?</h4>
                      <p className="text-gray-600 text-sm">
                        We respond to all messages within 24 hours, usually within 2-4 hours during business days.
                      </p>
                    </Card>

                    <Card className="card-enhanced p-4">
                      <h4 className="font-bold text-gray-800 mb-2">Do you offer phone support?</h4>
                      <p className="text-gray-600 text-sm">
                        We provide email and chat support. For urgent issues, live chat is the fastest way to reach us.
                      </p>
                    </Card>

                    <Card className="card-enhanced p-4">
                      <h4 className="font-bold text-gray-800 mb-2">Can you help with CSV formatting?</h4>
                      <p className="text-gray-600 text-sm">
                        Absolutely! We're happy to help you format your flashcards for optimal results with RecallForge.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="landing" />
    </div>
  );
}