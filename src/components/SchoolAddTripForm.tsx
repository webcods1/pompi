import { useState, useEffect } from 'react';
import { push, ref, serverTimestamp, update } from 'firebase/database';
import { db } from '../firebase';

interface SchoolAddTripFormProps {
    tripId?: string | null;
    initialData?: any;
    onCancel: () => void;
    onSuccess: () => void;
}

const SchoolAddTripForm = ({ tripId, initialData, onCancel, onSuccess }: SchoolAddTripFormProps) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    // Additional fields
    const [educationalFocus, setEducationalFocus] = useState(''); // e.g., Science, History, Nature
    const [groupSize, setGroupSize] = useState(''); // Min group size
    const [ageGroup, setAgeGroup] = useState(''); // e.g. 10-15 years

    // Itinerary State
    const [itinerary, setItinerary] = useState([{ day: 1, title: '', desc: '' }]);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setPrice(initialData.price || '');
            setDuration(initialData.duration || '');
            setLocation(initialData.location || '');
            setImage(initialData.image || '');
            setDescription(initialData.description || '');
            setEducationalFocus(initialData.educationalFocus || '');
            setGroupSize(initialData.groupSize || '');
            setAgeGroup(initialData.ageGroup || '');

            // Set Itinerary from initial data
            if (initialData.itinerary) {
                setItinerary(initialData.itinerary);
            } else {
                setItinerary([{ day: 1, title: '', desc: '' }]);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // Reset
            setTitle('');
            setPrice('');
            setDuration('');
            setLocation('');
            setImage('');
            setDescription('');
            setEducationalFocus('');
            setGroupSize('');
            setAgeGroup('');
            setItinerary([{ day: 1, title: '', desc: '' }]);
        }
    }, [initialData, tripId]);

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        resolve(compressedDataUrl);
                    } else {
                        reject(new Error("Canvas context error"));
                    }
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Itinerary Handlers
    const handleItineraryChange = (index: number, field: string, value: string) => {
        setItinerary(prevItinerary =>
            prevItinerary.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addItineraryDay = () => {
        setItinerary([...itinerary, { day: itinerary.length + 1, title: '', desc: '' }]);
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
        setItinerary(newItinerary);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (!title || !price || !duration) {
                alert("Please fill in required fields (Title, Price, Duration)");
                setSubmitting(false);
                return;
            }

            let imageUrl = image;
            if (imageFile) {
                try {
                    imageUrl = await compressImage(imageFile);
                } catch (err) {
                    console.error("Image compression error:", err);
                    alert("Failed to process image.");
                    setSubmitting(false);
                    return;
                }
            }

            if (!imageUrl) {
                alert("Please provide an image url or upload a file.");
                setSubmitting(false);
                return;
            }

            const tripData = {
                title,
                price,
                duration,
                location,
                image: imageUrl,
                description,

                // School Specific Data
                educationalFocus,
                groupSize,
                ageGroup,

                itinerary, // Add Itinerary to data

                // Include commonly used fields for compatibility
                inclusions: educationalFocus ? [educationalFocus] : [],
                category: 'school_trips',
                updatedAt: serverTimestamp()
            };

            if (tripId) {
                await update(ref(db, `packages/${tripId}`), tripData);
                alert('School Trip updated successfully!');
            } else {
                await push(ref(db, 'packages'), {
                    ...tripData,
                    createdAt: serverTimestamp()
                });
                alert('School Trip added successfully!');
            }

            onSuccess();
        } catch (error) {
            console.error("Error saving package:", error);
            alert('Failed to save package.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#fffbeb] p-8 rounded-2xl shadow-xl border border-yellow-200 relative overflow-hidden animate-fadeIn">
            {/* School/Education Themed Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10 border-b border-yellow-200 pb-6">
                <div>
                    <span className="text-yellow-600 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Educational Tours</span>
                    <h2 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow-md">🎓</span>
                        {tripId ? 'Edit School Package' : 'New School Trip'}
                    </h2>
                </div>
                {tripId && (
                    <button
                        onClick={onCancel}
                        className="bg-white hover:bg-red-50 text-gray-500 hover:text-red-500 px-5 py-2.5 rounded-xl transition-all border border-gray-200 shadow-sm flex items-center gap-2 group"
                    >
                        <span>Cancel</span>
                        <span className="group-hover:rotate-90 transition-transform">✕</span>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Trip Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300"
                                placeholder="e.g. Science City Exploration"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Price per Student</label>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300 font-mono"
                                    placeholder="e.g. ₹850"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Duration</label>
                                <input
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300"
                                    placeholder="e.g. 1 Day"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Location / Destination</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300"
                                placeholder="e.g. Local Science Park"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Educational Focus</label>
                                <select
                                    value={educationalFocus}
                                    onChange={(e) => setEducationalFocus(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Focus...</option>
                                    <option value="Science">Science & Technology</option>
                                    <option value="History">History & Heritage</option>
                                    <option value="Nature">Nature & Ecology</option>
                                    <option value="Adventure">Adventure & Sports</option>
                                    <option value="Art">Art & Culture</option>
                                </select>
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Age Group (Optional)</label>
                                <input
                                    type="text"
                                    value={ageGroup}
                                    onChange={(e) => setAgeGroup(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300"
                                    placeholder="e.g. 10-15 Years"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Trip Image</label>
                            <div className="bg-white border border-yellow-200 rounded-xl p-4 space-y-4 hover:shadow-md transition-all">
                                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                    {(imageFile || image) ? (
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-xs">No image selected</span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="block w-full text-xs text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100 cursor-pointer"
                                />
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="Or paste image URL..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 outline-none transition-all text-gray-800 placeholder-gray-300 resize-none"
                                placeholder="Describe the educational value..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Itinerary Section */}
                <div className="bg-white border border-yellow-200 rounded-xl p-6 mt-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <span>📅</span>
                            Activity Schedule
                        </h3>
                        <button type="button" onClick={addItineraryDay} className="text-xs font-bold bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <span>+</span> Add Activity/Day
                        </button>
                    </div>

                    <div className="space-y-4">
                        {itinerary.map((day, index) => (
                            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-300 transition-colors group">
                                <div className="flex flex-col gap-2 pt-1">
                                    <span className="bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-xs whitespace-nowrap text-center shadow-sm">Step {day.day}</span>
                                    {itinerary.length > 1 && (
                                        <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-400 hover:text-red-600 text-[10px] text-center hover:underline transition-colors">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Activity Title (e.g. Museum Visit)"
                                        value={day.title}
                                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-800 text-sm"
                                    />
                                    <textarea
                                        placeholder="Details of what students will learn or do..."
                                        value={day.desc}
                                        onChange={(e) => handleItineraryChange(index, 'desc', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-gray-800 text-sm resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-yellow-200 flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span>{tripId ? 'Update Trip' : 'Create School Trip'}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SchoolAddTripForm;
