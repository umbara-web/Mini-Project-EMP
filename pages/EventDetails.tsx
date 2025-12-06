import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatRupiah } from '../utils';
import { MapPin, Calendar, Clock, Share2, Star, Ticket, User, Gift, Coins, Check } from 'lucide-react';
import { Modal } from '../components/Layout';
import { EventCard } from '../components/EventComponents';

export const EventDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, users, currentUser, createTransaction, toggleInterest, coupons, vouchers, reviews } = useStore();
  
  const event = events.find(e => e.id === id);
  const organizer = users.find(u => u.id === event?.organizerId);
  const relatedEvents = events.filter(e => e.category === event?.category && e.id !== event?.id).slice(0, 3);
  const eventReviews = reviews.filter(r => r.eventId === event?.id);
  
  const [ticketQty, setTicketQty] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Transaction State
  const [usePoints, setUsePoints] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{type: 'coupon'|'voucher', id: string, amount: number} | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!event) return <div className="text-center py-20">Event not found</div>;

  const isInterested = currentUser?.interestedEventIds?.includes(event.id);

  // Calculate Totals
  const basePrice = event.price * ticketQty;
  let discount = 0;
  
  // 1. Apply Promo (Voucher/Coupon)
  if (appliedPromo) {
     discount += appliedPromo.amount;
  }

  // 2. Apply Points (Max logic handled here visually, simpler logic in store)
  let pointsDiscount = 0;
  if (usePoints && currentUser) {
     // Max points we can use is the remaining price
     const remainingPrice = Math.max(0, basePrice - discount);
     pointsDiscount = Math.min(currentUser.points, remainingPrice);
  }

  const finalPrice = Math.max(0, basePrice - discount - pointsDiscount);

  const handleApplyPromo = () => {
    setPromoError('');
    setAppliedPromo(null);
    if (!promoCode) return;

    // Check Event Vouchers
    const voucher = vouchers.find(v => v.code === promoCode && v.eventId === event.id);
    if (voucher) {
       const disc = basePrice * (voucher.discountPercentage / 100);
       setAppliedPromo({ type: 'voucher', id: voucher.id, amount: disc });
       return;
    }

    // Check Global Coupons (User specific)
    const coupon = coupons.find(c => c.code === promoCode && c.userId === currentUser?.id && !c.isUsed);
    if (coupon) {
       setAppliedPromo({ type: 'coupon', id: coupon.id, amount: coupon.discountAmount });
       return;
    }

    setPromoError('Invalid or expired code.');
  };

  const handleBuy = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setIsProcessing(true);
    try {
      const couponId = appliedPromo?.type === 'coupon' ? appliedPromo.id : undefined;
      const voucherId = appliedPromo?.type === 'voucher' ? appliedPromo.id : undefined;
      const pointsToUse = usePoints ? pointsDiscount : 0;

      const success = await createTransaction(event.id, ticketQty, pointsToUse, couponId, voucherId);
      if (success) {
        setIsConfirmOpen(false);
        navigate('/my-tickets');
      } else {
        alert("Transaction failed. Seats might be full.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInterestClick = () => {
    if(currentUser) toggleInterest(event.id);
    else alert("Please log in.");
  };

  const formatDateToICS = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  const handleAddToCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${formatDateToICS(new Date(event.startDate))}\nDTEND:${formatDateToICS(new Date(event.endDate))}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event.ics';
    link.click();
  };

  const dateStr = new Date(event.startDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bg-white min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-gray-900 flex items-center">← Back</button>

        {/* Banner & Header (Similar to previous) */}
        <div className="w-full h-[350px] rounded-2xl overflow-hidden mb-8 shadow-lg bg-gray-100 relative">
           <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
           <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold shadow-sm">{event.category}</div>
        </div>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900 max-w-3xl">{event.title}</h1>
          <div className="flex space-x-3">
             <button onClick={handleInterestClick} className={`p-2 rounded-full border ${isInterested ? 'bg-yellow-50 border-yellow-400 text-yellow-500' : 'border-gray-300'}`}><Star className={`h-6 w-6 ${isInterested ? 'fill-current' : ''}`} /></button>
             <button className="p-2 rounded-full border border-gray-300"><Share2 className="h-6 w-6 text-gray-600" /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-10">
              <section className="space-y-3">
                <div className="flex items-center text-gray-700"><Calendar className="h-5 w-5 mr-3 text-[#1e1e2e]" /><span>{dateStr}</span></div>
                <div className="flex items-center text-gray-700"><MapPin className="h-5 w-5 mr-3 text-[#1e1e2e]" /><span>{event.location}</span></div>
                <button onClick={handleAddToCalendar} className="text-primary-600 text-sm font-medium ml-8">+ Add to Calendar</button>
              </section>

              {/* Organizer Section */}
              <section className="flex items-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden mr-4">
                      <img src={organizer?.avatar || `https://ui-avatars.com/api/?name=${organizer?.name}`} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900">{organizer?.name}</h4>
                      <p className="text-xs text-gray-500">Organizer</p>
                   </div>
              </section>

              <section>
                 <h3 className="text-xl font-bold text-gray-900 mb-4">About</h3>
                 <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </section>

              {/* Reviews Section */}
              <section>
                 <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews ({eventReviews.length})</h3>
                 {eventReviews.length > 0 ? (
                   <div className="space-y-4">
                     {eventReviews.map(r => (
                       <div key={r.id} className="border-b pb-4">
                         <div className="flex items-center mb-1">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                           ))}
                         </div>
                         <p className="text-gray-600 text-sm">"{r.comment}"</p>
                       </div>
                     ))}
                   </div>
                 ) : <p className="text-gray-500 italic">No reviews yet.</p>}
              </section>
           </div>

           <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
                 <button onClick={() => setIsConfirmOpen(true)} className="w-full bg-[#facc15] text-[#1e1e2e] py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 shadow-md">
                    <Ticket className="h-5 w-5 mr-2 inline" /> Buy Tickets
                 </button>
                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-900">{event.price === 0 ? 'Free' : formatRupiah(event.price)}</p>
                    <p className="text-xs text-green-600">{event.seatsAvailable} seats left</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Purchase Modal with Points & Coupons */}
        <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Checkout">
           <div className="space-y-6">
             <div className="flex justify-between items-center py-2 border-b border-gray-100">
               <span className="font-medium text-gray-700">Quantity</span>
               <div className="flex items-center space-x-4">
                  <button onClick={() => setTicketQty(Math.max(1, ticketQty-1))} className="w-8 h-8 bg-gray-200 rounded">-</button>
                  <span className="font-bold">{ticketQty}</span>
                  <button onClick={() => setTicketQty(Math.min(5, ticketQty+1))} className="w-8 h-8 bg-gray-200 rounded">+</button>
               </div>
             </div>

             {/* 1. Points Section */}
             {currentUser && currentUser.points > 0 && (
               <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
                 <div className="flex items-center">
                   <Coins className="h-5 w-5 text-blue-600 mr-2" />
                   <div>
                     <p className="text-sm font-bold text-blue-800">Use Points</p>
                     <p className="text-xs text-blue-600">Balance: {currentUser.points}</p>
                   </div>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" className="sr-only peer" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
               </div>
             )}

             {/* 2. Promo Code Section */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm uppercase" 
                    placeholder="VOUCHER123"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  />
                  <button 
                    onClick={handleApplyPromo}
                    className="bg-gray-800 text-white px-4 rounded-r-md text-sm hover:bg-gray-700"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                {appliedPromo && <p className="text-xs text-green-600 mt-1 flex items-center"><Check className="h-3 w-3 mr-1"/> Applied: -{formatRupiah(appliedPromo.amount)}</p>}
             </div>

             {/* Summary */}
             <div className="border-t pt-4 space-y-2 text-sm">
               <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatRupiah(basePrice)}</span></div>
               {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatRupiah(discount)}</span></div>}
               {usePoints && pointsDiscount > 0 && <div className="flex justify-between text-blue-600"><span>Points Used</span><span>-{formatRupiah(pointsDiscount)}</span></div>}
               <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2 mt-2"><span>Total</span><span>{formatRupiah(finalPrice)}</span></div>
             </div>

             <button onClick={handleBuy} disabled={isProcessing} className="w-full bg-[#1e1e2e] text-white py-3.5 rounded-lg font-bold hover:bg-[#2d2d44] disabled:opacity-70">
               {isProcessing ? 'Processing...' : 'Pay & Confirm'}
             </button>
           </div>
        </Modal>
      </div>
    </div>
  );
};