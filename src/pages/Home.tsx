import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations';
import SouthIndiaDestinations from '../components/SouthIndiaDestinations';
import BusServices from '../components/BusServices';
import TravelServices from '../components/TravelServices';
import PlanVacation from '../components/PlanVacation';
import NefertitiCruise from '../components/NefertitiCruise';
import Footer from '../components/Footer';



const Home = () => {
    return (
        <div className="relative min-h-screen bg-white max-w-screen-xl mx-auto shadow-xl">

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <PlanVacation />
                <FeaturedDestinations />
                <SouthIndiaDestinations />
                <NefertitiCruise />
                <BusServices />
                <TravelServices />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
