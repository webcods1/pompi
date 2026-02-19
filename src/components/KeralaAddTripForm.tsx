import { useState, useEffect } from 'react';
import { push, ref, serverTimestamp, update } from 'firebase/database';
import { db } from '../firebase';

interface KeralaAddTripFormProps {
    tripId?: string | null;
    initialData?: any;
    onCancel: () => void;
    onSuccess: () => void;
}

const KeralaAddTripForm = ({ tripId, initialData, onCancel, onSuccess }: KeralaAddTripFormProps) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('Kerala, India');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');

    // Additional fields
    const [originalPrice, setOriginalPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [features, setFeatures] = useState(''); // Comma separated for easy input

    // Itinerary State
    const [itinerary, setItinerary] = useState([{ day: 1, title: '', desc: '' }]);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setPrice(initialData.price || '');
            setDuration(initialData.duration || '');
            setLocation(initialData.location || 'Kerala, India');
            setImage(initialData.image || '');
            setDescription(initialData.description || '');
            setOriginalPrice(initialData.originalPrice || '');
            setDiscount(initialData.discount || '');
            setFeatures(initialData.features ? (Array.isArray(initialData.features) ? initialData.features.join(', ') : initialData.features) : '');

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
            setLocation('Kerala, India');
            setImage('');
            setDescription('');
            setOriginalPrice('');
            setDiscount('');
            setFeatures('');
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
                originalPrice,
                discount,

                itinerary, // Add Itinerary to data

                inclusions: features ? features.split(',').map(f => f.trim()).filter(f => f !== '') : [],
                features: features ? features.split(',').map(f => f.trim()).filter(f => f !== '') : [],
                category: 'magic_kerala',
                updatedAt: serverTimestamp()
            };

            if (tripId) {
                await update(ref(db, `packages/${tripId}`), tripData);
                alert('Kerala Package updated successfully!');
            } else {
                await push(ref(db, 'packages'), {
                    ...tripData,
                    createdAt: serverTimestamp()
                });
                alert('Kerala Package added successfully!');
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
        <div className="bg-[#052e16] p-8 rounded-2xl shadow-2xl border border-green-800/50 relative overflow-hidden animate-fadeIn">
            {/* Nature/Green Themed Background Effects */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6">
                <div>
                    <span className="text-green-400 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">God's Own Country</span>
                    <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <span className="text-4xl filter drop-shadow-lg">🌴</span>
                        {tripId ? 'Edit Kerala Package' : 'New Kerala Package'}
                    </h2>
                </div>
                {tripId && (
                    <button
                        onClick={onCancel}
                        className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-5 py-2.5 rounded-xl transition-all border border-white/10 flex items-center gap-2 group"
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
                            <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Package Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20"
                                placeholder="e.g. Munnar Tea Gardens Escape"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Price</label>
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20 font-mono"
                                    placeholder="e.g. ₹12,999"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Duration</label>
                                <input
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20"
                                    placeholder="e.g. 3 Days / 2 Nights"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Backwater/Hill Station Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20"
                                placeholder="e.g. Alleppey, Munnar, Wayanad"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Original Price</label>
                                <input
                                    type="text"
                                    value={originalPrice}
                                    onChange={(e) => setOriginalPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20 font-mono"
                                    placeholder="e.g. ₹15,000"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Discount</label>
                                <input
                                    type="text"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20"
                                    placeholder="e.g. 15% OFF"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Highlights / Inclusions</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={features}
                                    onChange={(e) => setFeatures(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20 pl-10"
                                    placeholder="Houseboat Stay, Breakfast, Sightseeing..."
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">🍃</span>
                            </div>
                            <p className="text-[10px] text-green-200/40 mt-1.5 ml-1">Comma separated list of key highlights.</p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Package Image</label>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4 hover:bg-white/10 transition-colors">
                                <div className="relative aspect-video bg-black/40 rounded-lg overflow-hidden border border-white/5 group-hover:border-green-500/30 transition-colors">
                                    {(imageFile || image) ? (
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : image}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-white/20">
                                            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <span className="text-xs">No image selected</span>
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="block w-full text-xs text-green-200/70
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-green-500/10 file:text-green-400
                                    hover:file:bg-green-500/20 cursor-pointer"
                                />
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-white/80 focus:border-green-500/50 outline-none"
                                        placeholder="Or paste image URL..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-green-200/70 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-green-400 transition-colors">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white placeholder-white/20 resize-none"
                                placeholder="Immerse yourself in nature..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Itinerary Section */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <span>📅</span>
                            Day-wise Itinerary
                        </h3>
                        <button type="button" onClick={addItineraryDay} className="text-xs font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <span>+</span> Add Day
                        </button>
                    </div>

                    <div className="space-y-4">
                        {itinerary.map((day, index) => (
                            <div key={index} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5 hover:border-green-500/30 transition-colors group">
                                <div className="flex flex-col gap-2 pt-1">
                                    <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded text-xs whitespace-nowrap text-center">Day {day.day}</span>
                                    {itinerary.length > 1 && (
                                        <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-400/70 hover:text-red-400 text-[10px] text-center hover:underline transition-colors">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Day Title (e.g. Arrival in Kochi)"
                                        value={day.title}
                                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:bg-black/40 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white text-sm placeholder-white/20"
                                    />
                                    <textarea
                                        placeholder="Detailed description of the day's activities..."
                                        value={day.desc}
                                        onChange={(e) => handleItineraryChange(index, 'desc', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:bg-black/40 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none transition-all text-white text-sm placeholder-white/20 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{tripId ? 'Update Package' : 'Create Kerala Escape'}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default KeralaAddTripForm;
