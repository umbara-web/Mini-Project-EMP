import React from 'react';
import { useStore } from '../store';
import { EventCard } from '../components/EventComponents';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const InterestedEvents: React.FC = () => {
  const { events, currentUser } = useStore();
  const navigate = useNavigate();

  // Filter events that match the user's interested IDs
  const interestedEvents = events.filter(event => 
    currentUser?.interestedEventIds?.includes(event.id) ?? false
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="flex items-center mb-4">
              <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Interested Events</h1>
           </div>
           <p className="text-gray-500 ml-10">Events you have saved to watch later.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {interestedEvents.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {interestedEvents.map(event => (
                 <EventCard key={event.id} event={event} />
              ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No interested events yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start exploring events and click the heart icon to save them here for quick access later.
              </p>
              <Link 
                to="/events" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#1e1e2e] hover:bg-[#2d2d44] transition-colors shadow-lg"
              >
                Browse Events
              </Link>
           </div>
        )}
      </div>
    </div>
  );
};