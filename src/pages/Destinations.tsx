import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Destinations = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-display font-bold mb-8 text-blue-600">Our Destinations</h1>
                    <p className="text-xl text-gray-700 mb-12">Explore the world's most breathtaking locations curated just for you.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Placeholder for destinations */}
                        <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-500 font-display italic">Coming Soon: Himalayan Peaks</span>
                        </div>
                        <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-500 font-display italic">Coming Soon: Tropical Islands</span>
                        </div>
                        <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-500 font-display italic">Coming Soon: European Classics</span>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Destinations;
