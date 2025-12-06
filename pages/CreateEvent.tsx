
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { EventCategory, Event } from '../types';
import { ArrowLeft, Upload, Check, Plus, Minus, MapPin, Calendar, Clock, Ticket, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Edit' },
  { id: 2, label: 'Banner' },
  { id: 3, label: 'Ticketing' },
  { id: 4, label: 'Review' }
];

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { createEvent } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    eventType: 'single', // single or recurring
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    price: 0,
    totalSeats: 100,
    image: '',
    imageName: '',
    isFree: true,
    ticketName: 'General Admission',
    tags: []
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-fill End Date if Start Date changes and End Date is empty
      if (field === 'startDate' && !prev.endDate) {
        updated.endDate = value;
      }
      
      return updated;
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image file.' }));
        return;
      }

      // Validate file size (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB.' }));
        return;
      }

      setIsUploading(true);
      handleChange('imageName', file.name);
      
      // Clear previous error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate network delay for upload experience
        setTimeout(() => {
            handleChange('image', reader.result as string);
            setIsUploading(false);
        }, 1500);
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, image: 'Failed to read file.' }));
        setIsUploading(false);
      }
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
       if (!formData.title.trim()) newErrors.title = "Event title is required";
       if (!formData.category) newErrors.category = "Category is required";
       
       if (!formData.startDate) newErrors.startDate = "Start date is required";
       if (!formData.startTime) newErrors.startTime = "Start time is required";
       if (!formData.endDate) newErrors.endDate = "End date is required";
       if (!formData.endTime) newErrors.endTime = "End time is required";
       
       // Date Logic Validation
       if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
          const start = new Date(`${formData.startDate}T${formData.startTime}`);
          const end = new Date(`${formData.endDate}T${formData.endTime}`);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
             newErrors.dateTime = "Invalid date format";
          } else if (end <= start) {
             newErrors.dateTime = "Event end time must be after start time";
          }
       }

       if (!formData.location) newErrors.location = "Location is required";
       if (!formData.description.trim()) newErrors.description = "Description is required";
    }

    if (step === 2) {
       if (!formData.image) newErrors.image = "Event banner image is required";
    }

    if (step === 3) {
       if (!formData.ticketName.trim()) newErrors.ticketName = "Ticket name is required";
       if (!formData.isFree && Number(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/organizer');
    }
  };

  const handleSubmit = () => {
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`).getTime();
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`).getTime();

    createEvent({
      title: formData.title,
      description: formData.description,
      category: formData.category as EventCategory,
      location: formData.location,
      startDate: startDateTime || Date.now(),
      endDate: endDateTime || Date.now() + 3600000,
      price: formData.isFree ? 0 : Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      image: formData.image || 'https://picsum.photos/800/400',
      isPublished: true,
      tags: [],
    });
    navigate('/organizer');
  };

  // --- STEPS ---

  const renderStep1_Edit = () => (
    <div className="space-y-8 max-w-3xl animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-900">Create a New Event</h2>
      
      {/* Event Details */}
      <section className="space-y-4">
         <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
         
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
           <input 
             type="text" 
             className={`w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
             placeholder="Enter the name of your event"
             value={formData.title}
             onChange={(e) => handleChange('title', e.target.value)}
           />
           {errors.title && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {errors.title}</p>}
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Event Category <span className="text-red-500">*</span></label>
           <select 
             className={`w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 bg-white ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
             value={formData.category}
             onChange={(e) => handleChange('category', e.target.value)}
           >
             <option value="">Please select one</option>
             {Object.values(EventCategory).map(c => <option key={c} value={c}>{c}</option>)}
           </select>
           {errors.category && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {errors.category}</p>}
         </div>
      </section>

      {/* Date & Time */}
      <section className="space-y-4">
         <h3 className="text-xl font-semibold text-gray-800">Date & Time</h3>
         
         <div className="flex items-center space-x-6 mb-2">
            <label className="block text-sm font-medium text-gray-700 mr-2">Event Type</label>
            <label className="flex items-center cursor-pointer">
               <input 
                 type="radio" 
                 name="eventType" 
                 checked={formData.eventType === 'single'} 
                 onChange={() => handleChange('eventType', 'single')} 
                 className="text-primary-600 focus:ring-primary-500 mr-2" 
               />
               <span>Single Event</span>
            </label>
            <label className="flex items-center cursor-pointer">
               <input 
                 type="radio" 
                 name="eventType" 
                 checked={formData.eventType === 'recurring'} 
                 onChange={() => handleChange('eventType', 'recurring')} 
                 className="text-primary-600 focus:ring-primary-500 mr-2" 
               />
               <span>Recurring Event</span>
            </label>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Start */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <label className="block text-sm font-bold text-gray-900">Event Starts <span className="text-red-500">*</span></label>
               <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Calendar className="h-4 w-4 text-gray-500" />
                     </div>
                     <input 
                       type="date" 
                       className={`w-full pl-9 border rounded-md shadow-sm text-sm py-2 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                       value={formData.startDate}
                       onChange={(e) => handleChange('startDate', e.target.value)}
                     />
                  </div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Clock className="h-4 w-4 text-gray-500" />
                     </div>
                     <input 
                       type="time" 
                       className={`w-full pl-9 border rounded-md shadow-sm text-sm py-2 ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                       value={formData.startTime}
                       onChange={(e) => handleChange('startTime', e.target.value)}
                     />
                  </div>
               </div>
               {(errors.startDate || errors.startTime) && <p className="text-xs text-red-500">Start date & time required.</p>}
            </div>

            {/* End */}
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
               <label className="block text-sm font-bold text-gray-900">Event Ends <span className="text-red-500">*</span></label>
               <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Calendar className="h-4 w-4 text-gray-500" />
                     </div>
                     <input 
                       type="date" 
                       className={`w-full pl-9 border rounded-md shadow-sm text-sm py-2 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                       value={formData.endDate}
                       min={formData.startDate} // Cannot end before it starts (HTML5 validation helper)
                       onChange={(e) => handleChange('endDate', e.target.value)}
                     />
                  </div>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Clock className="h-4 w-4 text-gray-500" />
                     </div>
                     <input 
                       type="time" 
                       className={`w-full pl-9 border rounded-md shadow-sm text-sm py-2 ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                       value={formData.endTime}
                       onChange={(e) => handleChange('endTime', e.target.value)}
                     />
                  </div>
               </div>
               {(errors.endDate || errors.endTime) && <p className="text-xs text-red-500">End date & time required.</p>}
            </div>
         </div>
         
         {errors.dateTime && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-center text-sm border border-red-200">
               <AlertCircle className="h-4 w-4 mr-2" />
               {errors.dateTime}
            </div>
         )}
      </section>

      {/* Location */}
      <section className="space-y-4">
         <h3 className="text-xl font-semibold text-gray-800">Location</h3>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Where will your event take place? <span className="text-red-500">*</span></label>
            <select 
              className={`w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 bg-white ${errors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            >
              <option value="">Please select one</option>
              <option value="Online">Online</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bali">Bali</option>
            </select>
            {errors.location && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {errors.location}</p>}
         </div>
      </section>

      {/* Additional Info */}
      <section className="space-y-4">
         <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
         <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Description <span className="text-red-500">*</span></label>
            <textarea 
              rows={6}
              className={`w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Describe what's special about your event & other important details."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
            {errors.description && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/> {errors.description}</p>}
         </div>
      </section>
    </div>
  );

  const renderStep2_Banner = () => (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
      
      <div className="space-y-4">
        <div className={`flex items-center border rounded-md overflow-hidden bg-white max-w-lg shadow-sm ${errors.image ? 'border-red-500' : 'border-gray-300'}`}>
          <label className={`cursor-pointer bg-gray-50 border-r border-inherit px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isUploading ? 'Uploading...' : 'Choose File'}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              disabled={isUploading}
              onChange={handleImageUpload}
            />
          </label>
          <span className="px-4 py-2 text-sm text-gray-500 truncate">
            {formData.imageName || 'No file chosen'}
          </span>
        </div>
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

        <div className="text-gray-500 text-sm space-y-1">
          <p>Feature Image must be at least 1170 pixels wide by 504 pixels high.</p>
          <p>Valid file formats: JPG, GIF, PNG.</p>
        </div>

        {isUploading ? (
            <div className="mt-4 w-full max-w-xl h-64 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-3"></div>
                <p className="text-gray-500 text-sm">Uploading image...</p>
            </div>
        ) : formData.image ? (
          <div className="mt-4">
            <img src={formData.image} alt="Preview" className="w-full max-w-xl h-auto rounded-lg shadow-md border" />
          </div>
        ) : (
          <div className="mt-4 w-full max-w-xl h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
             Image Preview
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3_Ticketing = () => (
    <div className="space-y-10 max-w-3xl animate-fade-in">
       <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of event are you running?</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => handleChange('isFree', false)}
              className={`p-8 border-2 rounded-xl flex flex-col items-center justify-center space-y-4 transition-all ${!formData.isFree ? 'border-[#1e1e2e] bg-gray-50 ring-1 ring-[#1e1e2e]' : 'border-gray-200 hover:border-gray-300'}`}
            >
               <Ticket className="h-12 w-12 text-gray-800" />
               <div className="text-center">
                 <h3 className="font-bold text-lg">Ticketed Event</h3>
                 <p className="text-sm text-gray-500">My event requires tickets for entry</p>
               </div>
            </button>
            
            <button 
              onClick={() => handleChange('isFree', true)}
              className={`p-8 border-2 rounded-xl flex flex-col items-center justify-center space-y-4 transition-all ${formData.isFree ? 'border-[#1e1e2e] bg-gray-50 ring-1 ring-[#1e1e2e]' : 'border-gray-200 hover:border-gray-300'}`}
            >
               <div className="h-12 w-12 rounded-full border-4 border-gray-800 flex items-center justify-center font-bold text-xl">FREE</div>
               <div className="text-center">
                 <h3 className="font-bold text-lg">Free Event</h3>
                 <p className="text-sm text-gray-500">I'm running a free event</p>
               </div>
            </button>
         </div>
       </div>

       <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6">What tickets are you selling?</h2>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name <span className="text-red-500">*</span></label>
               <input 
                 type="text" 
                 className={`w-full border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 px-3 ${errors.ticketName ? 'border-red-500' : 'border-gray-300'}`}
                 value={formData.ticketName}
                 onChange={(e) => handleChange('ticketName', e.target.value)}
                 placeholder="e.g. General Admission"
               />
               {errors.ticketName && <p className="text-xs text-red-500 mt-1">{errors.ticketName}</p>}
            </div>
            {!formData.isFree && (
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price <span className="text-red-500">*</span></label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none bg-gray-100 rounded-l-md border-r px-2">
                     <span className="text-gray-500 sm:text-sm">₹</span>
                   </div>
                   <input 
                     type="number" 
                     className={`w-full pl-10 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 py-2.5 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                     value={formData.price}
                     onChange={(e) => handleChange('price', e.target.value)}
                   />
                 </div>
                 {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
            )}
            
            <button className="h-[46px] w-[46px] flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
               <Plus className="h-6 w-6 text-gray-500" />
            </button>
         </div>
       </div>
    </div>
  );

  const renderStep4_Review = () => (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Review Event</h2>
      <p className="text-gray-600">Nearly there! Check everything's correct.</p>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
         {/* Preview Banner */}
         <div className="h-64 bg-gray-100 relative">
            {formData.image ? (
               <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Upload className="h-12 w-12 mb-2" />
               </div>
            )}
         </div>
         
         <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-[#1e1e2e]">{formData.title || 'Event Title'}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h3 className="font-bold text-lg mb-2">Date and Time</h3>
                  <div className="flex items-start text-gray-700 mb-2">
                     <Calendar className="h-5 w-5 mr-3 mt-1" />
                     <div>
                       <div>Starts: {formData.startDate} at {formData.startTime}</div>
                       <div>Ends: {formData.endDate} at {formData.endTime}</div>
                     </div>
                  </div>
               </div>
               
               <div>
                  <h3 className="font-bold text-lg mb-2">Ticket Information</h3>
                  <div className="flex items-center text-gray-700">
                     <Ticket className="h-5 w-5 mr-3" />
                     <span>{formData.ticketName}: {formData.isFree ? 'Free' : `₹ ${formData.price}`}</span>
                  </div>
               </div>
            </div>

            <div>
               <h3 className="font-bold text-lg mb-2">Location</h3>
               <div className="flex items-center text-gray-700 mb-4">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{formData.location || 'Address'}</span>
               </div>
               {/* Map Placeholder */}
               <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center relative border">
                  <div className="absolute inset-0 opacity-50 bg-[url('https://mt1.google.com/vt/lyrs=m&x=1325&y=3143&z=13')] bg-cover bg-center"></div>
                  <MapPin className="h-10 w-10 text-red-500 relative z-10 drop-shadow-md" />
               </div>
            </div>

            <div>
               <h3 className="font-bold text-lg mb-2">Description</h3>
               <p className="text-gray-600 leading-relaxed">{formData.description || 'Event description goes here...'}</p>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
           <div className="flex items-center">
             <button onClick={handleBack} className="mr-4 text-gray-500 hover:text-gray-900">
               <ArrowLeft className="h-6 w-6" />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-gray-900">
                 {formData.title || 'New Event'}
               </h1>
               <div className="text-sm text-gray-500 flex space-x-4">
                 <span>{formData.location || 'Location'}</span>
                 <span>•</span>
                 <span>{formData.startTime || 'Time'}</span>
               </div>
             </div>
           </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute top-[14px] left-0 w-full h-[2px] bg-gray-200 rounded-full" />
            <div 
              className="absolute top-[14px] left-0 h-[2px] bg-[#1e1e2e] rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            
            <div className="relative flex justify-between w-full">
              {STEPS.map((step) => {
                const isActive = step.id <= currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center group cursor-pointer" onClick={() => setCurrentStep(step.id)}>
                    <div 
                      className={`w-7 h-7 rounded-full border-2 z-10 flex items-center justify-center bg-white transition-all duration-300
                        ${isActive ? 'border-[#1e1e2e]' : 'border-gray-300'}`}
                    >
                      {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#1e1e2e]" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-[#1e1e2e]' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex justify-center min-h-[500px]">
          {currentStep === 1 && renderStep1_Edit()}
          {currentStep === 2 && renderStep2_Banner()}
          {currentStep === 3 && renderStep3_Ticketing()}
          {currentStep === 4 && renderStep4_Review()}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center mt-12 pt-6 max-w-4xl mx-auto border-t">
          <button 
            onClick={handleBack}
            className="mr-6 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Go back
          </button>
          
          <button 
            onClick={handleNext}
            disabled={isUploading}
            className={`bg-[#1e1e2e] text-white px-8 py-3 rounded-md text-sm font-bold hover:bg-[#2d2d44] transition-colors shadow-lg ${currentStep === 4 ? 'w-48' : ''} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentStep === 4 ? 'Publish Event' : 'Save & Continue'}
          </button>
        </div>

      </div>
    </div>
  );
};
