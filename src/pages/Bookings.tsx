import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Bookings = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-24 pb-16 px-6">
                <div className="container mx-auto">
                    <h1 className="text-5xl font-display font-bold mb-8 text-blue-600">My Bookings</h1>
                    <div className="bg-blue-50 rounded-3xl p-12 text-center max-w-2xl mx-auto border border-blue-100">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-display font-bold mb-4">No active bookings yet!</h2>
                        <p className="text-gray-600 mb-8 text-lg">Your adventure hasn't started yet. Let's find the perfect package for you.</p>
                        <a href="/packages" className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg shadow-blue-200">
                            Browse Packages
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Bookings;
