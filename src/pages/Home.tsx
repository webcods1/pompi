import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations';
import SouthIndiaDestinations from '../components/SouthIndiaDestinations';
import BusServices from '../components/BusServices';
import RecentTrips from '../components/RecentTrips';
import TravelServices from '../components/TravelServices';
import PlanVacation from '../components/PlanVacation';
import NefertitiCruise from '../components/NefertitiCruise';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import HomeOffers from '../components/HomeOffers';



const Home = () => {
    return (
        <div className="relative min-h-screen bg-white w-full">

            <div className="relative z-10">
                <Navbar />
                <Hero />

                <ScrollReveal animation="fade-up" delay={0}>
                    <PlanVacation />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={50}>
                    <HomeOffers />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <FeaturedDestinations />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <SouthIndiaDestinations />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <NefertitiCruise />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <BusServices />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <RecentTrips />
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={100}>
                    <TravelServices />
                </ScrollReveal>

                <ScrollReveal animation="fade" delay={0}>
                    <Footer />
                </ScrollReveal>
            </div>


        </div>
    );
};

export default Home;
