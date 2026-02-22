import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../firebase';
import { sendSMS } from '../utils/smsService';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await push(ref(db, "contact_messages"), {
                ...formData,
                createdAt: new Date().toISOString(),
                status: 'New'
            });
            setIsSubmitted(true);

            // Notify Admin via SMS
            await sendSMS("919745008000", `New Contact Msg from ${formData.fullName}: ${formData.message.substring(0, 50)}...`);

            setFormData({ fullName: '', email: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error("Error submitting message: ", error);
            alert("Failed to send message. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/2">
                            <h1 className="text-5xl font-display font-bold mb-8 text-blue-600">Contact Us</h1>
                            <p className="text-xl text-gray-700 mb-8">Have questions? We're here to help you plan your next perfect trip.</p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Phone</h4>
                                        <p className="text-gray-600">9745008000, 9495968593</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 012 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-gray-600">pompitravels@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-1/2 bg-gray-50 p-8 rounded-3xl shadow-sm">
                            {isSubmitted && (
                                <div className="mb-4 bg-green-100 text-green-700 p-4 rounded-xl border border-green-200">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                        placeholder="Tell us about your trip..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
