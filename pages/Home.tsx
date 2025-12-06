import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { EventCard } from '../components/EventComponents';
import { EventCategory } from '../types';
import { Search, MapPin, ArrowRight } from 'lucide-react';

const CATEGORY_IMAGES: Record<EventCategory, string> = {
  [EventCategory.MUSIC]: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=200&h=200&fit=crop',
  [EventCategory.WORKSHOP]: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=200&h=200&fit=crop',
  [EventCategory.CULTURE]: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=200&h=200&fit=crop',
  [EventCategory.SPORTS]: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=200&h=200&fit=crop',
  [EventCategory.TECH]: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&h=200&fit=crop',
  [EventCategory.TRAVEL]: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=200&h=200&fit=crop',
};

export const Home: React.FC = () => {
  const { events } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Mumbai');

  const handleSearch = () => {
    navigate(`/events?search=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const featuredEvents = events.slice(0, 3);
  const onlineEvents = events.filter(e => e.tags?.includes('Education') || e.category === EventCategory.WORKSHOP).slice(0, 3);
  const trendingEvents = events.slice(3, 6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#2e2532] text-white">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2e] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <p className="text-xl md:text-2xl font-semibold mb-2 text-yellow-400">Don't miss out!</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            Explore the <span className="text-yellow-400">vibrant events</span> happening locally and globally.
          </h1>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row items-center gap-2 md:gap-0">
            <div className="flex-1 flex items-center px-4 w-full">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search Events, Categories, Location,..." 
                className="w-full py-3 text-gray-700 focus:outline-none placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="h-8 w-px bg-gray-200 hidden md:block mx-2"></div>
            <div className="flex-none flex items-center px-4 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-2 md:pt-0">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="py-3 text-gray-700 bg-transparent focus:outline-none cursor-pointer w-full md:w-auto"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bali">Bali</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#1e1e2e] text-white px-8 py-3 rounded-md font-bold hover:bg-[#2d2d44] transition-colors md:ml-2"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Categories */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(EventCategory).map(([key, label]) => (
              <Link to={`/events?category=${label}`} key={key} className="flex flex-col items-center group">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-md group-hover:shadow-lg transition-all border-2 border-transparent group-hover:border-yellow-400">
                  <img src={CATEGORY_IMAGES[label as EventCategory]} alt={label} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-[#1e1e2e]">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Events */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Events in Mumbai</h2>
            <div className="flex space-x-2">
               <button onClick={() => navigate('/events')} className="px-3 py-1 rounded-full border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">All</button>
               <button onClick={() => navigate('/events?date=today')} className="px-3 py-1 rounded-full border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Today</button>
               <button onClick={() => navigate('/events?date=tomorrow')} className="px-3 py-1 rounded-full border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">Tomorrow</button>
               <button onClick={() => navigate('/events?date=weekend')} className="px-3 py-1 rounded-full border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">This Weekend</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {featuredEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
          <div className="mt-8 text-center">
             <Link to="/events" className="inline-block border border-gray-300 px-8 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
               See More
             </Link>
          </div>
        </section>

        {/* Discover Online Events */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover Best of Online Events</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {onlineEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </section>

        {/* Curated Banner */}
        <section className="bg-yellow-100 rounded-2xl p-8 md:p-12 relative overflow-hidden">
           <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path fill="#FBBF24" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,87.9,-3.3C85.7,11.4,78.6,25.3,69.5,37.3C60.4,49.3,49.3,59.4,36.9,65.9C24.5,72.4,10.8,75.3,-2.3,79.2C-15.4,83.1,-27.8,88,-39.3,83.7C-50.8,79.4,-61.4,65.9,-70.3,51.8C-79.2,37.7,-86.4,23,-86.9,8.1C-87.4,-6.8,-81.2,-21.9,-72.1,-34.5C-63,-47.1,-51,-57.2,-38.3,-65.2C-25.6,-73.2,-12.3,-79.1,1.9,-82.4C16.1,-85.7,30.5,-73.6,44.7,-76.4Z" transform="translate(100 100)" />
              </svg>
           </div>
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Events specially curated for you!</h2>
              <p className="text-gray-700 mb-6">Get event suggestions tailored to your interests! Don't let your favorite events slip away.</p>
              <button onClick={() => navigate('/login')} className="bg-[#1e1e2e] text-white px-6 py-3 rounded-md font-bold flex items-center hover:bg-opacity-90 transition-opacity">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </button>
           </div>
        </section>

        {/* Trending Events */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Events around the World</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {trendingEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
          <div className="mt-8 text-center">
             <Link to="/events" className="inline-block border border-gray-300 px-8 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
               See More
             </Link>
          </div>
        </section>

        {/* Subscription Banner */}
        <section className="bg-yellow-400 rounded-xl p-8 md:p-12 text-[#1e1e2e]">
           <div className="md:flex justify-between items-center">
             <div className="md:w-1/2 mb-6 md:mb-0">
               <h2 className="text-2xl font-bold mb-2">Subscribe to our Newsletter</h2>
               <p className="text-[#1e1e2e]/80">Receive our weekly newsletter & updates with new events from your favorite organizers & venues.</p>
             </div>
             <div className="md:w-1/2 md:pl-8">
               <div className="flex bg-white rounded-md overflow-hidden p-1">
                 <input type="email" placeholder="Enter your e-mail address" className="flex-1 px-4 py-2 text-gray-700 focus:outline-none" />
                 <button className="bg-[#1e1e2e] text-white px-6 py-2 rounded-md font-medium hover:bg-gray-800 transition-colors">Subscribe</button>
               </div>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
};