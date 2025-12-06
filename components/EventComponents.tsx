import React from 'react';
import { Link } from 'react-router-dom';
import { Event, TransactionStatus } from '../types';
import { formatRupiah } from '../utils';
import { MapPin, Star } from 'lucide-react';
import { useStore } from '../store';

export const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { currentUser, toggleInterest } = useStore();
  const dateObj = new Date(event.startDate);
  const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();
  
  const isInterested = currentUser?.interestedEventIds?.includes(event.id);

  const handleInterestClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    if(currentUser) {
       toggleInterest(event.id);
    } else {
       alert("Please log in to add this event to your interested list.");
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-gray-100 group">
      <div className="relative h-48 overflow-hidden">
        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={event.image} alt={event.title} />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-center min-w-[50px] shadow-sm">
           <div className="text-xs font-bold text-primary-600 uppercase">{month}</div>
           <div className="text-lg font-bold text-gray-900">{day}</div>
        </div>
        <button 
          onClick={handleInterestClick}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white transition-colors"
        >
           <Star 
             className={`h-4 w-4 transition-colors ${isInterested ? 'text-yellow-400 fill-current' : 'text-gray-400 hover:text-yellow-400'}`} 
           />
        </button>
        <div className="absolute bottom-3 left-3 bg-[#facc15] text-[#1e1e2e] px-2 py-0.5 text-[10px] font-bold uppercase rounded">
           {event.category}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[40px] hover:text-primary-600 transition-colors">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{event.location.split(',')[0]}</span>
        </div>
        
        <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
             <span className="text-xs text-gray-500 block">Starting from</span>
             <span className="text-sm font-bold text-gray-900">
              {event.price === 0 ? 'FREE' : formatRupiah(event.price)}
             </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
            {event.interestedCount} interested
          </div>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  const colors = {
    [TransactionStatus.WAITING_PAYMENT]: 'bg-yellow-100 text-yellow-800',
    [TransactionStatus.WAITING_CONFIRMATION]: 'bg-blue-100 text-blue-800',
    [TransactionStatus.DONE]: 'bg-green-100 text-green-800',
    [TransactionStatus.REJECTED]: 'bg-red-100 text-red-800',
    [TransactionStatus.EXPIRED]: 'bg-gray-100 text-gray-800',
    [TransactionStatus.CANCELLED]: 'bg-red-100 text-red-800'
  };
  
  const labels = {
    [TransactionStatus.WAITING_PAYMENT]: 'Menunggu Pembayaran',
    [TransactionStatus.WAITING_CONFIRMATION]: 'Verifikasi Admin',
    [TransactionStatus.DONE]: 'Selesai',
    [TransactionStatus.REJECTED]: 'Ditolak',
    [TransactionStatus.EXPIRED]: 'Kedaluwarsa',
    [TransactionStatus.CANCELLED]: 'Dibatalkan'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
      {labels[status]}
    </span>
  );
};