import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, Event, Transaction, Review, Coupon, Voucher, Role, 
  TransactionStatus, EventCategory 
} from './types';
import { generateReferralCode } from './utils';

// --- MOCK DATA ---
const MOCK_ORGANIZER: User = {
  id: 'org1',
  name: 'City Youth Movement',
  email: 'admin@live.com',
  password: '123',
  role: Role.ORGANIZER,
  referralCode: 'ORG001',
  points: 0,
  pointsExpiry: null,
  avatar: 'https://ui-avatars.com/api/?name=City+Youth&background=random'
};

const MOCK_EVENTS: Event[] = [
  // --- EXISTING / FEATURED ---
  {
    id: 'evt1',
    organizerId: 'org1',
    title: 'Sound Of Christmas 2023',
    description: 'Get ready to kick off the Christmas season in Mumbai with SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!',
    category: EventCategory.CULTURE,
    location: 'Bal Gandharva Rang Mandir, Mumbai',
    startDate: new Date('2023-12-02T18:30:00').getTime(),
    endDate: new Date('2023-12-02T21:30:00').getTime(),
    price: 200,
    seatsAvailable: 450,
    totalSeats: 500,
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Holiday Concert', 'Live Performance', 'Seasonal Event'],
    interestedCount: 16
  },
  
  // --- BUSINESS & WORKSHOPS (From Screenshots) ---
  {
    id: 'evt_biz_1',
    organizerId: 'org1',
    title: 'Delhi Business Network | Business Networking',
    description: 'Join us for a premier networking event designed for entrepreneurs, startups, and business leaders in Delhi.',
    category: EventCategory.WORKSHOP,
    location: 'Gurgaon, India',
    startDate: new Date('2023-12-16T10:30:00').getTime(),
    endDate: new Date('2023-12-16T13:30:00').getTime(),
    price: 475,
    seatsAvailable: 30,
    totalSeats: 50,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Networking', 'Business', 'Startup'],
    interestedCount: 24
  },
  {
    id: 'evt_biz_2',
    organizerId: 'org1',
    title: 'Startup Talks - Innovative event for founders',
    description: 'An exclusive session with successful founders sharing their journey, challenges, and secrets to scaling.',
    category: EventCategory.TECH, // Fits Tech/Innovation
    location: 'New Delhi, India',
    startDate: new Date('2023-12-17T15:00:00').getTime(),
    endDate: new Date('2023-12-17T18:00:00').getTime(),
    price: 0,
    seatsAvailable: 100,
    totalSeats: 100,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Startup', 'Innovation', 'Free'],
    interestedCount: 89
  },
  {
    id: 'evt_biz_3',
    organizerId: 'org1',
    title: 'New Delhi 2024 Venture Capital World Summit',
    description: 'Connecting investors with the most promising startups in the region. Pitch your idea to top VCs.',
    category: EventCategory.WORKSHOP,
    location: 'New Delhi, India',
    startDate: new Date('2024-02-06T09:00:00').getTime(),
    endDate: new Date('2024-02-06T14:00:00').getTime(),
    price: 20980,
    seatsAvailable: 50,
    totalSeats: 200,
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c9e21?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Investment', 'Finance', 'Summit'],
    interestedCount: 102
  },

  // --- LIFESTYLE & CULTURE (From Screenshots) ---
  {
    id: 'evt_life_1',
    organizerId: 'org1',
    title: 'D2C Fashion Fiesta - For Fashion Founders',
    description: 'A dedicated event for Direct-to-Consumer fashion brands to showcase, network, and learn.',
    category: EventCategory.CULTURE,
    location: 'Hauz Khas, New Delhi',
    startDate: new Date('2023-12-02T17:00:00').getTime(),
    endDate: new Date('2023-12-02T21:00:00').getTime(),
    price: 1000,
    seatsAvailable: 40,
    totalSeats: 60,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Fashion', 'Lifestyle', 'Exhibition'],
    interestedCount: 56
  },
  {
    id: 'evt_life_2',
    organizerId: 'org1',
    title: 'Pet Fed Delhi 2023',
    description: "India's Biggest Pet Festival is back! Bring your furry friends for a day of fun, games, and treats.",
    category: EventCategory.CULTURE, // Or Entertainment
    location: 'NSIC Grounds, Okhla',
    startDate: new Date('2023-12-16T11:00:00').getTime(),
    endDate: new Date('2023-12-17T21:00:00').getTime(),
    price: 499,
    seatsAvailable: 500,
    totalSeats: 1000,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Pets', 'Festival', 'Family'],
    interestedCount: 340
  },
  {
    id: 'evt_life_3',
    organizerId: 'org1',
    title: 'The S&S Trunk Show Winter Edit',
    description: 'Shop from a super stylish and exclusive curation of products that are planet friendly and proudly made in India.',
    category: EventCategory.CULTURE,
    location: 'New Delhi, India',
    startDate: new Date('2023-11-28T11:00:00').getTime(),
    endDate: new Date('2023-11-28T20:00:00').getTime(),
    price: 0,
    seatsAvailable: 1000,
    totalSeats: 1000,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Shopping', 'Fashion', 'Winter'],
    interestedCount: 45
  },

  // --- ENTERTAINMENT & COMEDY (From Screenshots) ---
  {
    id: 'evt_fun_1',
    organizerId: 'org1',
    title: 'Vir Das MindFool India Tour - Vir Das',
    description: 'Catch Vir Das live as he embarks on his world tour. Prepare for an evening of unadulterated comedy.',
    category: EventCategory.MUSIC, // Using Music/Entertainment category
    location: 'Delhi, NCR, India',
    startDate: new Date('2023-12-24T20:00:00').getTime(),
    endDate: new Date('2023-12-24T21:30:00').getTime(),
    price: 799,
    seatsAvailable: 15,
    totalSeats: 500,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Comedy', 'Standup', 'Live'],
    interestedCount: 1200
  },
  {
    id: 'evt_fun_2',
    organizerId: 'org1',
    title: 'New Year Bash 2024',
    description: 'The biggest New Year party in town. DJ, Food, Drinks and Dance floor access included.',
    category: EventCategory.MUSIC,
    location: 'Mangalore, India',
    startDate: new Date('2023-12-31T20:00:00').getTime(),
    endDate: new Date('2024-01-01T01:00:00').getTime(),
    price: 2000,
    seatsAvailable: 100,
    totalSeats: 300,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Party', 'New Year', 'Music'],
    interestedCount: 88
  },
  {
    id: 'evt_fun_3',
    organizerId: 'org1',
    title: 'Sunburn Arena with Dimitri Vegas & Like Mike',
    description: 'Experience the magic of Sunburn Arena. World #1 DJs are coming to your city.',
    category: EventCategory.MUSIC,
    location: 'New Delhi, India',
    startDate: new Date('2023-11-27T16:00:00').getTime(),
    endDate: new Date('2023-11-27T22:00:00').getTime(),
    price: 899,
    seatsAvailable: 200,
    totalSeats: 5000,
    image: 'https://images.unsplash.com/photo-1459749411177-d4a428c3feae?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['EDM', 'Concert', 'Festival'],
    interestedCount: 450
  },
  {
    id: 'evt_fun_4',
    organizerId: 'org1',
    title: 'Aditya Gadhvi Live in Concert - Surat',
    description: 'The sensation behind "Khalasi" performs live in Surat for the first time.',
    category: EventCategory.MUSIC,
    location: 'Surat, India',
    startDate: new Date('2024-01-13T18:00:00').getTime(),
    endDate: new Date('2024-01-13T23:00:00').getTime(),
    price: 499,
    seatsAvailable: 150,
    totalSeats: 1000,
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Folk', 'Live', 'Concert'],
    interestedCount: 210
  },

  // --- ARTS & MISC ---
  {
    id: 'evt_art_1',
    organizerId: 'org1',
    title: 'Poetry and Storytelling Open Mic in Delhi',
    description: 'A safe space for poets and storytellers to share their work. Beginners welcome.',
    category: EventCategory.CULTURE,
    location: 'New Delhi, India',
    startDate: new Date('2023-12-31T11:00:00').getTime(),
    endDate: new Date('2023-12-31T14:00:00').getTime(),
    price: 100,
    seatsAvailable: 20,
    totalSeats: 30,
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Poetry', 'Open Mic', 'Art'],
    interestedCount: 15
  },
  {
    id: 'evt_sport_1',
    organizerId: 'org1',
    title: 'PlayAll Presents South Delhi Box Cricket Cup',
    description: 'Register your team for the most competitive box cricket tournament in South Delhi.',
    category: EventCategory.SPORTS,
    location: 'New Delhi, India',
    startDate: new Date('2023-12-16T15:00:00').getTime(),
    endDate: new Date('2023-12-17T20:00:00').getTime(),
    price: 4000,
    seatsAvailable: 4,
    totalSeats: 16,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Cricket', 'Tournament', 'Sports'],
    interestedCount: 32
  },
  {
    id: 'evt_art_2',
    organizerId: 'org1',
    title: 'Bollywood Gen Z Party',
    description: 'Dance to the latest Bollywood hits all night long.',
    category: EventCategory.MUSIC,
    location: 'Brown Alley, Melbourne',
    startDate: new Date('2023-12-01T21:30:00').getTime(),
    endDate: new Date('2023-12-02T03:00:00').getTime(),
    price: 0, // AUD 0-40 in mock
    seatsAvailable: 200,
    totalSeats: 300,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Party', 'Bollywood', 'Dance'],
    interestedCount: 137
  },
  {
    id: 'evt_misc_1',
    organizerId: 'org1',
    title: 'Sinful Sunday By Party Out Delhi',
    description: 'The ultimate Sunday night party in Gurgaon.',
    category: EventCategory.MUSIC,
    location: 'Gurgaon, India',
    startDate: new Date('2023-11-26T20:30:00').getTime(),
    endDate: new Date('2023-11-26T23:45:00').getTime(),
    price: 1099,
    seatsAvailable: 50,
    totalSeats: 100,
    image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=1000&auto=format&fit=crop',
    isPublished: true,
    tags: ['Party', 'Nightlife', 'Drinks'],
    interestedCount: 42
  }
];

// --- CONTEXT ---

interface AppState {
  users: User[];
  currentUser: User | null;
  events: Event[];
  transactions: Transaction[];
  reviews: Review[];
  coupons: Coupon[];
  vouchers: Voucher[];
}

interface AppContextType extends AppState {
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string, role: Role, refCode?: string) => void;
  updateProfile: (userId: string, data: Partial<User>) => void;
  changePassword: (userId: string, oldPass: string, newPass: string) => boolean;
  
  // Event
  createEvent: (evt: Omit<Event, 'id' | 'organizerId' | 'seatsAvailable' | 'interestedCount'>) => void;
  deleteEvent: (eventId: string) => void;
  createVoucher: (v: Omit<Voucher, 'id'>) => void;
  
  // Transaction
  createTransaction: (eventId: string, qty: number, pointsToUse: number, couponId?: string, voucherId?: string) => Promise<boolean>;
  uploadProof: (trxId: string, proofUrl: string) => void;
  organizerAction: (trxId: string, action: 'CONFIRM' | 'REJECT') => void;
  reviewEvent: (eventId: string, rating: number, comment: string) => void;
  refreshUserData: () => void;
  toggleInterest: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  const [users, setUsers] = useState<User[]>([MOCK_ORGANIZER]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  // --- MOCK BACKGROUND JOBS (Timers) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      
      setTransactions(prevTrxs => prevTrxs.map(t => {
        // 1. Expire if waiting payment > 2 hours
        if (t.status === TransactionStatus.WAITING_PAYMENT) {
          if (now - t.createdAt > 2 * 60 * 60 * 1000) {
             return { ...t, status: TransactionStatus.EXPIRED };
          }
        }
        // 2. Auto Cancel if waiting confirmation > 3 days
        if (t.status === TransactionStatus.WAITING_CONFIRMATION && t.paymentProofUploadedAt) {
          if (now - t.paymentProofUploadedAt > 3 * 24 * 60 * 60 * 1000) {
            return { ...t, status: TransactionStatus.CANCELLED };
          }
        }
        return t;
      }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---

  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const register = (name: string, email: string, pass: string, role: Role, refCodeInput?: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: pass,
      role,
      referralCode: generateReferralCode(name),
      points: 0,
      pointsExpiry: null,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
    };

    if (role === Role.CUSTOMER && refCodeInput) {
      const referrer = users.find(u => u.referralCode === refCodeInput);
      if (referrer) {
        // 1. Reward Referrer
        const updatedReferrer = { 
          ...referrer, 
          points: referrer.points + 10000, 
          pointsExpiry: Date.now() + (3 * 30 * 24 * 60 * 60 * 1000) // 3 Months
        };
        setUsers(prev => prev.map(u => u.id === referrer.id ? updatedReferrer : u));

        // 2. Reward Referee (Coupon)
        const newCoupon: Coupon = {
          id: Math.random().toString(36).substr(2, 9),
          code: 'REF-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
          discountAmount: 10000, // 10k discount
          validUntil: Date.now() + (3 * 30 * 24 * 60 * 60 * 1000),
          userId: newUser.id,
          isUsed: false
        };
        setCoupons(prev => [...prev, newCoupon]);
        newUser.referredBy = referrer.id;
      }
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const updateProfile = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const changePassword = (userId: string, oldPass: string, newPass: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.password === oldPass) {
      const updatedUser = { ...user, password: newPass };
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }
      return true;
    }
    return false;
  };

  const createEvent = (evtData: Omit<Event, 'id' | 'organizerId' | 'seatsAvailable' | 'interestedCount'>) => {
    if (!currentUser || currentUser.role !== Role.ORGANIZER) return;
    const newEvent: Event = {
      ...evtData,
      id: Math.random().toString(36).substr(2, 9),
      organizerId: currentUser.id,
      seatsAvailable: evtData.totalSeats,
      interestedCount: 0
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const createVoucher = (v: Omit<Voucher, 'id'>) => {
    setVouchers(prev => [...prev, { ...v, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const createTransaction = async (eventId: string, qty: number, pointsToUse: number, couponId?: string, voucherId?: string) => {
    if (!currentUser) return false;
    
    const event = events.find(e => e.id === eventId);
    if (!event || event.seatsAvailable < qty) return false;

    // Calculate Price
    let total = event.price * qty;

    // Apply Voucher (Event Specific)
    if (voucherId) {
      const voucher = vouchers.find(v => v.id === voucherId);
      if (voucher) {
        const discount = total * (voucher.discountPercentage / 100);
        total -= discount;
      }
    }

    // Apply Coupon (Platform Wide)
    if (couponId) {
      const coupon = coupons.find(c => c.id === couponId && !c.isUsed);
      if (coupon) {
        total -= coupon.discountAmount;
        // Mark used
        setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isUsed: true } : c));
      }
    }

    // Apply Points
    let usedPoints = 0;
    if (pointsToUse > 0 && currentUser.points >= pointsToUse) {
      // Logic: Ensure we don't reduce below 0
      const maxPoints = Math.min(pointsToUse, total); // 1 point = 1 RP
      total -= maxPoints;
      usedPoints = maxPoints;
      
      // Deduct points from user
      const updatedUser = { ...currentUser, points: currentUser.points - usedPoints };
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
    }

    total = Math.max(0, total);

    // Create Transaction
    const newTrx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      eventId,
      quantity: qty,
      totalPrice: total,
      originalPrice: event.price * qty,
      pointsUsed: usedPoints,
      couponUsedId: couponId,
      voucherUsedId: voucherId,
      status: total === 0 ? TransactionStatus.DONE : TransactionStatus.WAITING_PAYMENT, // Free events or full point coverage = done (simplified)
      createdAt: Date.now()
    };

    // Deduct Seats
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, seatsAvailable: e.seatsAvailable - qty } : e));
    setTransactions(prev => [...prev, newTrx]);
    return true;
  };

  const uploadProof = (trxId: string, proofUrl: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === trxId ? { 
        ...t, 
        status: TransactionStatus.WAITING_CONFIRMATION, 
        paymentProofUrl: proofUrl, 
        paymentProofUploadedAt: Date.now() 
      } : t
    ));
  };

  const organizerAction = (trxId: string, action: 'CONFIRM' | 'REJECT') => {
    setTransactions(prev => prev.map(t => {
      if (t.id !== trxId) return t;
      
      if (action === 'REJECT') {
        // Recover seats
        setEvents(events.map(e => e.id === t.eventId ? {...e, seatsAvailable: e.seatsAvailable + t.quantity} : e));
        
        // Recover points (Simple update for demo)
        const user = users.find(u => u.id === t.userId);
        if (user && t.pointsUsed > 0) {
           const updatedUser = { ...user, points: user.points + t.pointsUsed };
           setUsers(us => us.map(u => u.id === user.id ? updatedUser : u));
        }

        return { ...t, status: TransactionStatus.REJECTED };
      }
      
      return { ...t, status: TransactionStatus.DONE };
    }));
  };

  const reviewEvent = (eventId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      userId: currentUser.id,
      rating,
      comment,
      createdAt: Date.now()
    };
    setReviews(prev => [...prev, newReview]);
  };

  const refreshUserData = () => {
    if(currentUser) {
      const fresh = users.find(u => u.id === currentUser.id);
      if(fresh) setCurrentUser(fresh);
    }
  }

  const toggleInterest = (eventId: string) => {
    if (!currentUser) return;
    
    const isInterested = currentUser.interestedEventIds?.includes(eventId);
    let newInterestedIds = currentUser.interestedEventIds || [];
    
    if (isInterested) {
      newInterestedIds = newInterestedIds.filter(id => id !== eventId);
    } else {
      newInterestedIds = [...newInterestedIds, eventId];
    }
    
    // Update User
    const updatedUser = { ...currentUser, interestedEventIds: newInterestedIds };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    // Update Event Count
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { 
          ...e, 
          interestedCount: isInterested ? Math.max(0, e.interestedCount - 1) : e.interestedCount + 1 
        };
      }
      return e;
    }));
  };

  return (
    <AppContext.Provider value={{
      users, currentUser, events, transactions, reviews, coupons, vouchers,
      login, logout, register, updateProfile, changePassword, createEvent, deleteEvent, createVoucher,
      createTransaction, uploadProof, organizerAction, reviewEvent, refreshUserData,
      toggleInterest
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useStore must be used within AppProvider");
  return context;
};