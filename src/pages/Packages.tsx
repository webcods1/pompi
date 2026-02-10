import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Packages = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-display font-bold mb-8 text-blue-600">Travel Packages</h1>
                    <p className="text-xl text-gray-700 mb-12">Exclusive deals and curated experiences for every traveler.</p>
                    <div className="space-y-6">
                        {['Premium Adventure', 'Family Retreat', 'Romantic getaway'].map((pkg) => (
                            <div key={pkg} className="border border-gray-200 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center hover:shadow-lg transition-shadow">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-gray-800">{pkg}</h3>
                                    <p className="text-gray-600">All-inclusive stay, guided tours, and local transfers.</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-center md:text-right">
                                    <span className="block text-2xl font-bold text-blue-600 mb-2">Starting from $999</span>
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Packages;
