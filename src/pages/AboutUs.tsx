import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-5xl font-display font-bold mb-8 text-blue-600 text-center">About Us</h1>
                    <div className="prose prose-lg mx-auto text-gray-700 space-y-6">
                        <p className="text-xl">
                            We are more than just a travel agency. We are creators of memories, explorers of the unknown, and your dedicated partners in discovering the world.
                        </p>
                        <p>
                            Founded in 2024, our mission has been to provide personalized, high-quality travel experiences that go beyond the usual tourist paths. Whether it's the mountains of Kashmir or the beaches of the south, we ensure every detail is perfect.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
                            <div className="bg-blue-50 p-6 rounded-2xl">
                                <h4 className="font-bold text-blue-800 mb-2">Our Vision</h4>
                                <p>To become the most trusted name in personalized travel services worldwide.</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-2xl">
                                <h4 className="font-bold text-blue-800 mb-2">Our Values</h4>
                                <p>Integrity, Passion, and Excellence in every journey we plan.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
