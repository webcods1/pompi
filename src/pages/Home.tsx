import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations';
import SouthIndiaDestinations from '../components/SouthIndiaDestinations';
import BusServices from '../components/BusServices';
import TravelServices from '../components/TravelServices';
import PlanVacation from '../components/PlanVacation';
import Footer from '../components/Footer';

import ScrollTrack from '../components/ScrollTrack';

const Home = () => {
    return (
        <div className="relative min-h-screen bg-white">
            <ScrollTrack />
            <div className="relative z-10">
                <Navbar />
                <Hero />
                <PlanVacation />
                <FeaturedDestinations />
                <SouthIndiaDestinations />
                <BusServices />
                <TravelServices />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
