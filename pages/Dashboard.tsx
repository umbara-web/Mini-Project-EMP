import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Role, TransactionStatus, EventCategory } from '../types';
import { formatDate, formatRupiah } from '../utils';
import { StatusBadge } from '../components/EventComponents';
import { Modal } from '../components/Layout';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Plus, Check, X, Trash2, Clock, Users, Calendar as CalendarIcon, TrendingUp, Ticket as TicketIcon, DollarSign } from 'lucide-react';

// --- COUNTDOWN TIMER COMPONENT ---
const CountdownTimer: React.FC<{ targetDate: number }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft <= 0) return <span className="text-red-500 font-bold text-xs">Expired</span>;

  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-mono font-bold">
      <Clock className="h-3 w-3 mr-1" />
      {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

// --- CUSTOMER DASHBOARD ---
export const CustomerDashboard: React.FC = () => {
  const { transactions, events, currentUser, uploadProof, reviewEvent } = useStore();
  const myTrxs = transactions.filter(t => t.userId === currentUser?.id).sort((a,b) => b.createdAt - a.createdAt);
  
  const [selectedTrx, setSelectedTrx] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTrx, setReviewTrx] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleUpload = () => {
    if(selectedTrx && proofUrl) {
      uploadProof(selectedTrx, proofUrl);
      setSelectedTrx(null);
      setProofUrl('');
    }
  };

  const openReview = (trx: any) => {
    setReviewTrx(trx);
    setReviewModalOpen(true);
  };

  const submitReview = () => {
    if(reviewTrx) {
      reviewEvent(reviewTrx.eventId, rating, comment);
      setReviewModalOpen(false);
      setComment('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>
      
      {/* Points Card */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-lg p-6 text-white shadow-lg transform transition-all hover:scale-[1.01]">
        <div className="flex justify-between items-center">
           <div>
             <p className="text-sm opacity-80">Your Points Balance</p>
             <h3 className="text-3xl font-bold">{currentUser?.points || 0}</h3>
           </div>
           <div>
             <p className="text-sm opacity-80">Referral Code</p>
             <code className="bg-white/20 px-2 py-1 rounded font-mono select-all cursor-pointer">{currentUser?.referralCode}</code>
           </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {myTrxs.length === 0 && <li className="p-4 text-center text-gray-500">No transactions found.</li>}
          {myTrxs.map(trx => {
            const event = events.find(e => e.id === trx.eventId);
            // 2 Hour expiry time
            const expiryTime = trx.createdAt + (2 * 60 * 60 * 1000);
            
            return (
              <li key={trx.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-primary-600 truncate">{event?.title}</p>
                    <p className="text-sm text-gray-500">{formatDate(trx.createdAt)}</p>
                    <p className="text-sm font-bold mt-1">{formatRupiah(trx.totalPrice)} ({trx.quantity} tickets)</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <StatusBadge status={trx.status} />
                    
                    {trx.status === TransactionStatus.WAITING_PAYMENT && (
                      <div className="flex flex-col items-end space-y-2">
                        <CountdownTimer targetDate={expiryTime} />
                        <button onClick={() => setSelectedTrx(trx.id)} className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 transition-colors">
                          Upload Proof
                        </button>
                      </div>
                    )}
                    
                    {trx.status === TransactionStatus.DONE && (
                       <button onClick={() => openReview(trx)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                         Write Review
                       </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={!!selectedTrx} onClose={() => setSelectedTrx(null)} title="Upload Payment Proof">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Please transfer to BCA 1234567890 (Eventify) and upload your proof URL below.</p>
          <input 
            type="text" 
            placeholder="https://example.com/proof.jpg" 
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2"
          />
          <button onClick={handleUpload} className="w-full bg-primary-600 text-white py-2 rounded font-bold hover:bg-primary-700 transition-colors">Submit Payment</button>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} title="Review Event">
         <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700">Rating</label>
             <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md p-2">
               <option value="5">5 - Excellent</option>
               <option value="4">4 - Good</option>
               <option value="3">3 - Fair</option>
               <option value="2">2 - Poor</option>
               <option value="1">1 - Terrible</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">Comment</label>
             <textarea 
               rows={3}
               value={comment} 
               onChange={(e) => setComment(e.target.value)}
               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
             />
           </div>
           <button onClick={submitReview} className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors">Submit Review</button>
         </div>
      </Modal>
    </div>
  );
};

// --- ORGANIZER DASHBOARD ---
export const OrganizerDashboard: React.FC = () => {
  const { events, transactions, currentUser, organizerAction, deleteEvent, users } = useStore();
  const navigate = useNavigate();
  
  const myEventIds = events.filter(e => e.organizerId === currentUser?.id).map(e => e.id);
  const myTrxs = transactions.filter(t => myEventIds.includes(t.eventId));
  
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'transactions'>('overview');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null);
  
  // Participant List State
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<{name: string, email: string, qty: number, total: number}[]>([]);
  const [selectedEventName, setSelectedEventName] = useState('');

  // Statistics State
  const [statsGranularity, setStatsGranularity] = useState<'day' | 'month' | 'year'>('day');

  const promptDelete = (id: string) => {
    setEventToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDeleteId) {
      deleteEvent(eventToDeleteId);
      setDeleteModalOpen(false);
      setEventToDeleteId(null);
    }
  };

  const openParticipants = (eventId: string, eventTitle: string) => {
    const eventTrxs = transactions.filter(t => t.eventId === eventId && t.status === TransactionStatus.DONE);
    const participants = eventTrxs.map(t => {
      const user = users.find(u => u.id === t.userId);
      return {
        name: user?.name || 'Unknown',
        email: user?.email || '-',
        qty: t.quantity,
        total: t.totalPrice
      };
    });
    setSelectedEventParticipants(participants);
    setSelectedEventName(eventTitle);
    setParticipantModalOpen(true);
  };
  
  // Advanced Statistics Calculation
  const { chartData, summaryStats } = useMemo(() => {
    // Filter out canceled/expired/rejected transactions for accurate revenue stats if needed, 
    // but usually dashboards show gross volume or confirmed revenue. 
    // Let's assume confirmed transactions (DONE) for revenue, but maybe keep all for traffic? 
    // Sticking to "Sales Statistics", so mostly interested in DONE or WAITING_CONFIRMATION.
    // Let's filter for DONE for accurate revenue.
    const validTrxs = myTrxs.filter(t => t.status === TransactionStatus.DONE);

    const grouped = validTrxs.reduce((acc, curr) => {
      const date = new Date(curr.createdAt);
      let key = '';
      let sortTime = 0;

      if (statsGranularity === 'day') {
        // e.g. "20 Dec"
        key = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        // Set time to start of day for sorting
        sortTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      } else if (statsGranularity === 'month') {
        // e.g. "Dec 2023"
        key = date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        sortTime = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
      } else {
        // e.g. "2023"
        key = date.getFullYear().toString();
        sortTime = new Date(date.getFullYear(), 0, 1).getTime();
      }

      if (!acc[key]) {
        acc[key] = { name: key, revenue: 0, tickets: 0, sortTime };
      }
      acc[key].revenue += curr.totalPrice;
      acc[key].tickets += curr.quantity;
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by time
    const data = Object.values(grouped).sort((a: any, b: any) => a.sortTime - b.sortTime);

    // Calculate Summary totals
    const totalRevenue = validTrxs.reduce((sum, t) => sum + t.totalPrice, 0);
    const totalTickets = validTrxs.reduce((sum, t) => sum + t.quantity, 0);
    const totalTransactions = validTrxs.length;

    return { chartData: data, summaryStats: { totalRevenue, totalTickets, totalTransactions } };
  }, [myTrxs, statsGranularity]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Organizer Dashboard</h2>
        <Link to="/create-event" className="bg-primary-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-primary-700 transition-colors shadow-md">
          <Plus className="h-5 w-5 mr-2" /> Create Event
        </Link>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'events', 'transactions'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`${activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}>{tab}</button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatRupiah(summaryStats.totalRevenue)}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <TicketIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tickets Sold</p>
                <h3 className="text-2xl font-bold text-gray-900">{summaryStats.totalTickets}</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-900">{summaryStats.totalTransactions}</h3>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Performance Analytics</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['day', 'month', 'year'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setStatsGranularity(period)}
                    className={`px-4 py-1 text-sm font-medium rounded-md capitalize transition-all ${
                      statsGranularity === period
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart */}
              <div className="h-72">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">Revenue Trend (IDR)</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                    <Tooltip 
                      formatter={(value: number) => formatRupiah(value)}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tickets Sold Chart */}
              <div className="h-72">
                <h4 className="text-sm font-semibold text-gray-600 mb-4 text-center">Tickets Sold</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="tickets" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Tickets" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 gap-4">
           {events.filter(e => e.organizerId === currentUser?.id).map(e => (
             <div key={e.id} className="bg-white p-4 rounded shadow flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-bold">{e.title}</h4>
                  <p className="text-sm text-gray-500">{formatDate(e.startDate)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right mr-4">
                    <p className="text-sm">Sold: {e.totalSeats - e.seatsAvailable}/{e.totalSeats}</p>
                  </div>
                  <button onClick={() => openParticipants(e.id, e.title)} className="flex items-center text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors" title="View Participants">
                    <Users className="h-4 w-4 mr-2" /> Participants
                  </button>
                  <button onClick={() => promptDelete(e.id)} className="flex items-center text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors" title="Cancel & Delete Event">
                    <Trash2 className="h-4 w-4 mr-2" /> Cancel
                  </button>
                </div>
             </div>
           ))}
           {events.filter(e => e.organizerId === currentUser?.id).length === 0 && <p className="text-gray-500 text-center py-4">No events yet.</p>}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myTrxs.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{events.find(e => e.id === t.eventId)?.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatRupiah(t.totalPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">{t.paymentProofUrl ? <a href={t.paymentProofUrl} target="_blank" rel="noreferrer">View</a> : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {t.status === TransactionStatus.WAITING_CONFIRMATION && (
                      <div className="flex space-x-2">
                        <button onClick={() => organizerAction(t.id, 'CONFIRM')} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"><Check className="h-5 w-5"/></button>
                        <button onClick={() => organizerAction(t.id, 'REJECT')} className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"><X className="h-5 w-5"/></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myTrxs.length === 0 && <p className="text-gray-500 text-center py-4">No transactions yet.</p>}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Cancel Event">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to cancel this event?</p>
          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">No, Keep It</button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">Yes, Cancel Event</button>
          </div>
        </div>
      </Modal>

      {/* Participants List Modal */}
      <Modal isOpen={participantModalOpen} onClose={() => setParticipantModalOpen(false)} title={`Participants - ${selectedEventName}`}>
         <div className="max-h-96 overflow-y-auto">
            {selectedEventParticipants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No confirmed participants yet.</p>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tickets</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEventParticipants.map((p, idx) => (
                            <tr key={idx}>
                                <td className="px-4 py-2 text-sm text-gray-900">{p.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{p.email}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{p.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
         </div>
      </Modal>
    </div>
  );
};