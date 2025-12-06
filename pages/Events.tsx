import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { EventCard } from '../components/EventComponents';
import { EventCategory } from '../types';
import { Search, MapPin, SearchX } from 'lucide-react';
import { useDebounce } from '../utils';

export const Events: React.FC = () => {
  const { events } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state from URL params
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || 'Mumbai';
  const initialDateFilter = searchParams.get('date');

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceType, setPriceType] = useState<'any'|'free'|'paid'>('any');
  
  // Date Filters State
  const [dateFilters, setDateFilters] = useState({
    today: initialDateFilter === 'today',
    tomorrow: initialDateFilter === 'tomorrow',
    thisWeek: initialDateFilter === 'week',
    thisWeekend: initialDateFilter === 'weekend'
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const term = debouncedSearchTerm.toLowerCase();
      const matchSearch = event.title.toLowerCase().includes(term) || 
                          event.description.toLowerCase().includes(term);
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchPrice = priceType === 'any' || 
                         (priceType === 'free' && event.price === 0) || 
                         (priceType === 'paid' && event.price > 0);
      
      // Date Filtering Logic
      let matchDate = true;
      const hasDateFilters = Object.values(dateFilters).some(Boolean);

      if (hasDateFilters) {
        const eventDate = new Date(event.startDate);
        const now = new Date();
        
        // Normalize today start (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Today End (23:59:59)
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        todayEnd.setMilliseconds(-1);

        // Tomorrow
        const tomorrowStart = new Date(todayStart);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
        tomorrowEnd.setMilliseconds(-1);

        // This Week (Today until end of upcoming Sunday)
        const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
        const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;
        const weekEnd = new Date(todayStart);
        weekEnd.setDate(weekEnd.getDate() + daysUntilSunday + 1);
        weekEnd.setMilliseconds(-1);

        // This Weekend (Saturday & Sunday)
        // If today is Sunday, weekend includes yesterday(Sat) and today(Sun).
        // If today is Mon-Sat, weekend is upcoming Sat & Sun.
        const daysUntilSaturday = (6 - currentDay + 7) % 7;
        const weekendStart = new Date(todayStart);
        // If today is Sunday (0), weekend started yesterday (-1)
        weekendStart.setDate(weekendStart.getDate() + (currentDay === 0 ? -1 : daysUntilSaturday));
        const weekendEnd = new Date(weekendStart);
        weekendEnd.setDate(weekendEnd.getDate() + 2); // Sat + 2 days = Mon start
        weekendEnd.setMilliseconds(-1);

        const isToday = eventDate >= todayStart && eventDate <= todayEnd;
        const isTomorrow = eventDate >= tomorrowStart && eventDate <= tomorrowEnd;
        const isThisWeek = eventDate >= todayStart && eventDate <= weekEnd;
        const isThisWeekend = eventDate >= weekendStart && eventDate <= weekendEnd;

        matchDate = (dateFilters.today && isToday) ||
                    (dateFilters.tomorrow && isTomorrow) ||
                    (dateFilters.thisWeek && isThisWeek) ||
                    (dateFilters.thisWeekend && isThisWeekend);
      }
      
      return matchSearch && matchCat && matchPrice && matchDate && event.isPublished;
    });
  }, [events, debouncedSearchTerm, selectedCategories, priceType, dateFilters]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleDateFilter = (key: keyof typeof dateFilters) => {
    setDateFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('Mumbai');
    setSelectedCategories([]);
    setPriceType('any');
    setDateFilters({
      today: false,
      tomorrow: false,
      thisWeek: false,
      thisWeekend: false
    });
    setSearchParams({});
  };

  // Sync URL with Search Term
  useEffect(() => {
    const params: any = {};
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (location) params.location = location;
    // We don't sync complex date filters back to URL for simplicity in this MVP, 
    // but we could if needed.
    setSearchParams(params);
  }, [debouncedSearchTerm, location, setSearchParams]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Search */}
      <div className="bg-[#1e1e2e] py-12 px-4">
         <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-6">Explore a world of events. Find what excites you!</h1>
            <div className="max-w-4xl mx-auto bg-white rounded-lg p-1.5 flex flex-col md:flex-row items-center">
              <div className="flex-1 flex items-center px-4 w-full mb-2 md:mb-0">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search Events, Categories, Location,..." 
                  className="w-full py-3 text-gray-700 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="h-8 w-px bg-gray-200 hidden md:block mx-2"></div>
              <div className="flex-none flex items-center px-4 w-full md:w-auto mb-2 md:mb-0">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <select 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="py-3 text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Jakarta">Jakarta</option>
                </select>
              </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0 space-y-8">
           <div>
             <h3 className="font-bold text-gray-900 mb-4 text-lg">Filters</h3>
             
             <div className="mb-6">
               <h4 className="text-sm font-semibold text-gray-700 mb-3">Price</h4>
               <div className="space-y-2">
                 <label className="flex items-center cursor-pointer">
                   <input type="checkbox" checked={priceType === 'free'} onChange={() => setPriceType(prev => prev === 'free' ? 'any' : 'free')} className="rounded text-primary-600 focus:ring-primary-500 mr-2" />
                   <span className="text-sm text-gray-600">Free</span>
                 </label>
                 <label className="flex items-center cursor-pointer">
                   <input type="checkbox" checked={priceType === 'paid'} onChange={() => setPriceType(prev => prev === 'paid' ? 'any' : 'paid')} className="rounded text-primary-600 focus:ring-primary-500 mr-2" />
                   <span className="text-sm text-gray-600">Paid</span>
                 </label>
               </div>
             </div>

             <div className="mb-6">
               <h4 className="text-sm font-semibold text-gray-700 mb-3">Date</h4>
               <div className="space-y-2 text-sm text-gray-600">
                 <label className="flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="mr-2 rounded text-primary-600 focus:ring-primary-500" 
                     checked={dateFilters.today}
                     onChange={() => toggleDateFilter('today')}
                   /> 
                   Today
                 </label>
                 <label className="flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="mr-2 rounded text-primary-600 focus:ring-primary-500" 
                     checked={dateFilters.tomorrow}
                     onChange={() => toggleDateFilter('tomorrow')}
                   /> 
                   Tomorrow
                 </label>
                 <label className="flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="mr-2 rounded text-primary-600 focus:ring-primary-500" 
                     checked={dateFilters.thisWeek}
                     onChange={() => toggleDateFilter('thisWeek')}
                   /> 
                   This Week
                 </label>
                 <label className="flex items-center cursor-pointer">
                   <input 
                     type="checkbox" 
                     className="mr-2 rounded text-primary-600 focus:ring-primary-500" 
                     checked={dateFilters.thisWeekend}
                     onChange={() => toggleDateFilter('thisWeekend')}
                   /> 
                   This Weekend
                 </label>
               </div>
             </div>

             <div className="mb-6">
               <h4 className="text-sm font-semibold text-gray-700 mb-3">Category</h4>
               <div className="space-y-2 text-sm text-gray-600">
                 {Object.values(EventCategory).map(cat => (
                   <label key={cat} className="flex items-center cursor-pointer">
                     <input 
                       type="checkbox" 
                       checked={selectedCategories.includes(cat)}
                       onChange={() => toggleCategory(cat)}
                       className="mr-2 rounded text-primary-600" 
                     /> 
                     {cat}
                   </label>
                 ))}
               </div>
             </div>

           </div>
        </div>

        {/* Content */}
        <div className="flex-1">
           <div className="flex justify-between items-center mb-6">
             <p className="text-gray-500 text-sm">Showing {filteredEvents.length} Events</p>
             <div className="flex items-center">
               <span className="text-sm text-gray-500 mr-2">Sort by:</span>
               <div className="relative inline-block text-left">
                 <select className="block w-full pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md">
                   <option>Relevance</option>
                   <option>Date</option>
                   <option>Price: Low to High</option>
                 </select>
               </div>
             </div>
           </div>

           {filteredEvents.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredEvents.map(event => <EventCard key={event.id} event={event} />)}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <SearchX className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500 max-w-sm text-center mb-6">
                  We couldn't find any events matching your current filters. Try adjusting your search criteria.
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#1e1e2e] text-white rounded-lg font-medium hover:bg-[#2d2d44] transition-colors"
                >
                  Clear All Filters
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
