import React, { useState } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
} from 'react-router-dom';
import { AppProvider, useStore } from './store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { CustomerDashboard, OrganizerDashboard } from './pages/Dashboard';
import { CreateEvent } from './pages/CreateEvent';
import { Profile } from './pages/Profile';
import { InterestedEvents } from './pages/InterestedEvents';
import { OrganizerProfile } from './pages/OrganizerProfile';
import { Role } from './types';
import { Eye, EyeOff, Facebook, Ticket, X, ChevronDown } from 'lucide-react';

// ... (GoogleIcon, AuthLayoutSide, Login, Register components remain same)
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24'>
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
  </svg>
);

const AuthLayoutSide = () => (
  <div className='hidden md:flex md:w-1/2 bg-[#1e1e2e] p-12 text-white flex-col justify-between relative overflow-hidden'>
    <div className='relative z-10'>
      <Link to='/' className='flex items-center space-x-2 mb-12'>
        <Ticket className='h-8 w-8 text-yellow-400' />
        <span className='text-2xl font-bold text-yellow-400'>Eventify</span>
      </Link>
      <h1 className='text-5xl font-bold leading-tight mb-6'>
        Discover tailored events.
        <br />
        Sign in for personalized recommendations today!
      </h1>
    </div>
    <div className='absolute top-1/2 right-0 transform translate-x-1/3 -translate-y-1/2 opacity-10 pointer-events-none'>
      <svg
        width='600'
        height='600'
        viewBox='0 0 200 200'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fill='#FFFFFF'
          d='M45.7,-70.5C58.9,-62.5,69.3,-49.4,75.9,-34.7C82.5,-20,85.4,-3.7,82.4,11.5C79.4,26.7,70.6,40.8,59.6,51.8C48.6,62.8,35.4,70.7,21.3,74.5C7.2,78.3,-7.8,78.1,-21.8,73.6C-35.8,69.1,-48.8,60.3,-58.5,48.7C-68.2,37.1,-74.6,22.7,-76.3,7.6C-78,-7.5,-75,-23.3,-66.1,-36.2C-57.2,-49.1,-42.4,-59.1,-27.6,-66.2C-12.8,-73.3,2,-77.5,17.4,-77.1C32.8,-76.7,48.9,-71.7,45.7,-70.5Z'
          transform='translate(100 100)'
        />
      </svg>
    </div>
  </div>
);

const Login: React.FC = () => {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@live.com');
  const [pass, setPass] = useState('123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, pass)) {
      setError('');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]'>
        <AuthLayoutSide />

        <div className='w-full md:w-1/2 p-8 md:p-16 relative flex flex-col justify-center'>
          <Link
            to='/'
            className='absolute top-8 right-8 text-gray-400 hover:text-gray-600'
          >
            <X className='h-6 w-6' />
          </Link>

          <h2 className='text-3xl font-bold text-gray-900 mb-8'>Login</h2>

          <div className='grid grid-cols-2 gap-4 mb-8'>
            <button className='flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'>
              <GoogleIcon className='w-5 h-5 mr-3' />
              <span className='text-sm font-medium text-gray-700'>
                Login with Google
              </span>
            </button>
            <button className='flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'>
              <Facebook className='w-5 h-5 text-[#1877F2] mr-3' />
              <span className='text-sm font-medium text-gray-700'>
                Login with Facebook
              </span>
            </button>
          </div>

          <div className='relative mb-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='text-red-500 text-sm text-center bg-red-50 p-2 rounded'>
                {error}
              </div>
            )}

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                E-mail Address
              </label>
              <input
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none'
                placeholder='Enter your e-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none'
                  placeholder='Enter password'
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <button className='w-full bg-[#1e1e2e] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#2d2d44] transition-colors shadow-lg shadow-indigo-500/20'>
              Login
            </button>
          </form>

          <p className='mt-8 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link
              to='/register'
              className='font-semibold text-indigo-600 hover:text-indigo-500'
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const { register } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [refCode, setRefCode] = useState('');
  const [role, setRole] = useState(Role.CUSTOMER);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(name, email, pass, role, refCode);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='max-w-6xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:min-h-[800px]'>
        <AuthLayoutSide />

        <div className='w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center'>
          <Link
            to='/'
            className='absolute top-8 right-8 text-gray-400 hover:text-gray-600'
          >
            <X className='h-6 w-6' />
          </Link>

          <h2 className='text-3xl font-bold text-gray-900 mb-8'>
            Create Account
          </h2>

          {/* Social Sign Up */}
          <div className='grid grid-cols-2 gap-4 mb-8'>
            <button className='flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'>
              <GoogleIcon className='w-5 h-5 mr-3' />
              <span className='text-sm font-medium text-gray-700'>
                Sign up with Google
              </span>
            </button>
            <button className='flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors'>
              <Facebook className='w-5 h-5 text-[#1877F2] mr-3' />
              <span className='text-sm font-medium text-gray-700'>
                Sign up with Facebook
              </span>
            </button>
          </div>

          <div className='relative mb-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-4 bg-white text-gray-500'>OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                placeholder='Enter your full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                E-mail Address
              </label>
              <input
                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                placeholder='Enter your e-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                  placeholder='Enter password'
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            <div className='space-y-1'>
              <label className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <div className='relative'>
                <select
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white appearance-none pr-10 transition-all'
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value={Role.CUSTOMER}>Pelanggan (Customer)</option>
                  <option value={Role.ORGANIZER}>
                    Penyelenggara (Organizer)
                  </option>
                </select>
                <div className='absolute right-3 top-3 pointer-events-none text-gray-400'>
                  <ChevronDown className='h-5 w-5' />
                </div>
              </div>
            </div>

            {role === Role.CUSTOMER && (
              <div className='space-y-1'>
                <label className='block text-sm font-medium text-gray-700'>
                  Referral Code (Optional)
                </label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all'
                  placeholder='e.g. JOHN1234'
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                />
              </div>
            )}

            <button className='w-full bg-[#1e1e2e] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#2d2d44] transition-colors shadow-lg shadow-indigo-500/20 mt-4'>
              Create Account
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='font-semibold text-indigo-600 hover:text-indigo-500'
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  roles?: Role[];
}> = ({ children, roles }) => {
  const { currentUser } = useStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

// Redirect if already logged in
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  if (currentUser) return <Navigate to='/' replace />;
  return <>{children}</>;
};

const WithLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path='/register'
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />

      <Route
        path='/'
        element={
          <WithLayout>
            <Home />
          </WithLayout>
        }
      />
      <Route
        path='/events'
        element={
          <WithLayout>
            <Events />
          </WithLayout>
        }
      />
      <Route
        path='/events/:id'
        element={
          <WithLayout>
            <EventDetails />
          </WithLayout>
        }
      />

      <Route
        path='/create-event'
        element={
          <WithLayout>
            <ProtectedRoute roles={[Role.ORGANIZER]}>
              <CreateEvent />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      <Route
        path='/my-tickets'
        element={
          <WithLayout>
            <ProtectedRoute roles={[Role.CUSTOMER]}>
              <CustomerDashboard />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      <Route
        path='/interested'
        element={
          <WithLayout>
            <ProtectedRoute>
              <InterestedEvents />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      <Route
        path='/organizer'
        element={
          <WithLayout>
            <ProtectedRoute roles={[Role.ORGANIZER]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          </WithLayout>
        }
      />

      <Route
        path='/organizer/:id'
        element={
          <WithLayout>
            <OrganizerProfile />
          </WithLayout>
        }
      />

      <Route
        path='/profile'
        element={
          <WithLayout>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </WithLayout>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
};

export default App;
