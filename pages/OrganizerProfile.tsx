import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { EventCard } from '../components/EventComponents';
import { User, Star, MapPin, Mail, ArrowLeft, Globe } from 'lucide-react';

export const OrganizerProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, events, reviews } = useStore();

  const organizer = users.find((u) => u.id === id);

  if (!organizer) {
    return <div className='text-center py-20'>Organizer not found</div>;
  }

  // Get Organizer's Events
  const orgEvents = events.filter(
    (e) => e.organizerId === organizer.id && e.isPublished
  );

  // Get All Reviews for Organizer's Events
  const orgReviews = reviews.filter((r) =>
    orgEvents.some((e) => e.id === r.eventId)
  );

  // Calculate Average Rating
  const totalRating = orgReviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating =
    orgReviews.length > 0
      ? (totalRating / orgReviews.length).toFixed(1)
      : 'N/A';

  return (
    <div className='bg-gray-50 min-h-screen pt-32'>
      {/* Header / Cover */}
      <div className='bg-[#1e1e2e] relative container ml-36'>
        <button
          onClick={() => navigate(-1)}
          className=' container absolute -top-28 left-52 hover:text-gray-300 flex items-center text-black'
        >
          <ArrowLeft className='h-6 w-6 mr-2 text-black' /> Back
        </button>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12'>
        <div className='bg-white rounded-xl shadow-lg p-8 border border-gray-100 mb-8'>
          <div className='flex flex-col md:flex-row items-start md:items-center'>
            <div className='h-32 w-32 rounded-full bg-white p-1 shadow-md -mt-16 md:-mt-0 md:mr-8 overflow-hidden border-4 border-white'>
              <img
                src={
                  organizer.avatar ||
                  `https://ui-avatars.com/api/?name=${organizer.name}`
                }
                alt={organizer.name}
                className='w-full h-full object-cover rounded-full'
              />
            </div>

            <div className='mt-4 md:mt-0 flex-1'>
              <h1 className='text-3xl font-bold text-gray-900'>
                {organizer.name}
              </h1>
              <p className='text-gray-500 mb-4'>
                {organizer.company || 'Event Organizer'}
              </p>

              <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                <div className='flex items-center'>
                  <Star className='h-5 w-5 text-yellow-400 fill-current mr-1' />
                  <span className='font-bold text-gray-900'>{avgRating}</span>
                  <span className='mx-1'>/</span>
                  <span>5 ({orgReviews.length} reviews)</span>
                </div>
                {organizer.city && (
                  <div className='flex items-center'>
                    <MapPin className='h-4 w-4 mr-1' /> {organizer.city},{' '}
                    {organizer.country}
                  </div>
                )}
                {organizer.website && (
                  <div className='flex items-center'>
                    <Globe className='h-4 w-4 mr-1' />{' '}
                    <a
                      href={organizer.website}
                      target='_blank'
                      rel='noreferrer'
                      className='hover:underline text-blue-600'
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className='mt-6 md:mt-0'>
              <button className='bg-[#1e1e2e] text-white px-6 py-2.5 rounded-md font-medium hover:bg-[#2d2d44] transition-colors shadow-sm'>
                Contact Organizer
              </button>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left: Events */}
          <div className='lg:col-span-2 space-y-8'>
            <h2 className='text-2xl font-bold text-gray-900 border-b pb-4'>
              Upcoming Events
            </h2>
            {orgEvents.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {orgEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className='text-gray-500 italic'>No upcoming events listed.</p>
            )}
          </div>

          {/* Right: Reviews */}
          <div>
            <h2 className='text-2xl font-bold text-gray-900 border-b pb-4 mb-6'>
              Recent Reviews
            </h2>
            <div className='space-y-6'>
              {orgReviews.length > 0 ? (
                orgReviews.slice(0, 5).map((review) => {
                  const reviewEvent = events.find(
                    (e) => e.id === review.eventId
                  );
                  const reviewer = users.find((u) => u.id === review.userId);

                  return (
                    <div
                      key={review.id}
                      className='bg-white p-5 rounded-lg shadow-sm border border-gray-100'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div className='flex items-center'>
                          <div className='h-8 w-8 rounded-full bg-gray-200 mr-3 overflow-hidden'>
                            <img
                              src={
                                reviewer?.avatar ||
                                `https://ui-avatars.com/api/?name=${
                                  reviewer?.name || 'User'
                                }`
                              }
                              alt=''
                              className='w-full h-full object-cover'
                            />
                          </div>
                          <div>
                            <p className='text-sm font-bold text-gray-900'>
                              {reviewer?.name || 'Anonymous'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className='flex bg-yellow-50 px-2 py-1 rounded text-yellow-600 text-xs font-bold items-center'>
                          <Star className='h-3 w-3 fill-current mr-1' />{' '}
                          {review.rating}
                        </div>
                      </div>
                      <p className='text-gray-600 text-sm mb-3'>
                        "{review.comment}"
                      </p>
                      {reviewEvent && (
                        <Link
                          to={`/events/${reviewEvent.id}`}
                          className='text-xs text-blue-600 hover:underline'
                        >
                          Event: {reviewEvent.title}
                        </Link>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className='bg-gray-50 p-6 rounded-lg text-center text-gray-500'>
                  No reviews yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
