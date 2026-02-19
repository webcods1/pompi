import { useState, useEffect } from 'react';
import { push, ref, serverTimestamp, onValue, update, remove } from 'firebase/database';
import { db } from '../firebase';
import NefertitiAddTripForm from './NefertitiAddTripForm';
import KeralaAddTripForm from './KeralaAddTripForm';
import SchoolAddTripForm from './SchoolAddTripForm';

const AddTripForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        duration: '',
        location: '',
        rating: '',
        tag: '',
        features: '',
        isPopular: false,
        category: 'offer_trips'
    });

    const [itinerary, setItinerary] = useState([{ day: 1, title: '', desc: '' }]);
    const [inclusions, setInclusions] = useState(['']);
    const [exclusions, setExclusions] = useState(['']);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // New state for editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const packagesRef = ref(db, 'packages');
        const unsub = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const loadedPackages = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setPackages(loadedPackages);
            } else {
                setPackages([]);
            }
        });
        return () => unsub();
    }, []);

    const categories = [
        { id: 'offer_trips', label: 'Offer Trips' },
        { id: 'popular', label: 'Popular Destination' },
        { id: 'southside', label: 'Southside' },
        { id: 'nefertity', label: 'Nefertity' },
        { id: 'magic_kerala', label: 'Magic of Kerala' },
        { id: 'honeymoon', label: 'Honeymoon' },
        { id: 'spiritual', label: 'Spiritual' },
        { id: 'adventure', label: 'Adventure' },
        { id: 'school_trips', label: 'School Trips' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG with 0.7 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

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

    const handleInclusionChange = (index: number, value: string) => {
        setInclusions(prevInclusions =>
            prevInclusions.map((item, i) => i === index ? value : item)
        );
    };

    const addInclusion = () => {
        setInclusions([...inclusions, '']);
    };

    const removeInclusion = (index: number) => {
        const newInclusions = inclusions.filter((_, i) => i !== index);
        setInclusions(newInclusions);
    };

    const handleExclusionChange = (index: number, value: string) => {
        setExclusions(prevExclusions =>
            prevExclusions.map((item, i) => i === index ? value : item)
        );
    };

    const addExclusion = () => {
        setExclusions([...exclusions, '']);
    };

    const removeExclusion = (index: number) => {
        const newExclusions = exclusions.filter((_, i) => i !== index);
        setExclusions(newExclusions);
    };

    const handleEdit = (pkg: any) => {
        setEditingId(pkg.id);
        setFormData({
            title: pkg.title || '',
            image: pkg.image || '',
            description: pkg.description || '',
            price: pkg.price || '',
            originalPrice: pkg.originalPrice || '',
            discount: pkg.discount || '',
            duration: pkg.duration || '',
            location: pkg.location || '',
            rating: pkg.rating || '',
            tag: pkg.tag || '',
            features: pkg.features ? pkg.features.join(', ') : '',
            isPopular: pkg.popular || false,
            category: pkg.category || 'offer_trips'
        });
        setItinerary(pkg.itinerary || [{ day: 1, title: '', desc: '' }]);
        setInclusions(pkg.inclusions || ['']);
        setExclusions(pkg.exclusions || ['']);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '',
            image: '',
            description: '',
            price: '',
            originalPrice: '',
            discount: '',
            duration: '',
            location: '',
            rating: '',
            tag: '',
            features: '',
            isPopular: false,
            category: 'offer_trips'
        });
        setItinerary([{ day: 1, title: '', desc: '' }]);
        setInclusions(['']);
        setExclusions(['']);
        setImageFile(null);
    };

    const handleDelete = async (packageId: string) => {
        if (window.confirm("Are you sure you want to delete this trip package? This action cannot be undone.")) {
            try {
                await remove(ref(db, `packages/${packageId}`));
                alert("Trip package deleted successfully.");
                if (editingId === packageId) {
                    handleCancelEdit();
                }
            } catch (error) {
                console.error("Error deleting package:", error);
                alert("Failed to delete trip package.");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Basic validation
            if (!formData.title || (!formData.price)) {
                alert("Please fill in required fields (Title, Price)");
                setSubmitting(false);
                return;
            }

            if (!imageFile && !formData.image) {
                alert("Please provide a Trip Image or an Image URL.");
                setSubmitting(false);
                return;
            }

            let imageUrl = formData.image;

            if (imageFile) {
                try {
                    // Compress image before saving to avoid database size limits
                    const compressedBase64 = await compressImage(imageFile);
                    imageUrl = compressedBase64;
                } catch (error) {
                    console.error("Error compressing image:", error);
                    alert("Failed to process image.");
                    setSubmitting(false);
                    return;
                }
            }

            const tripData = {
                ...formData,
                image: imageUrl,
                itinerary,
                inclusions: inclusions.filter(i => i.trim() !== ''),
                exclusions: exclusions.filter(i => i.trim() !== ''),
                features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f !== '') : [],
                popular: formData.isPopular,
                updatedAt: serverTimestamp()
            };

            if (editingId) {
                await update(ref(db, `packages/${editingId}`), tripData);
                alert('Trip updated successfully!');
            } else {
                await push(ref(db, 'packages'), {
                    ...tripData,
                    createdAt: serverTimestamp()
                });
                alert('Trip added successfully!');
            }

            // Reset form
            handleCancelEdit();
        } catch (error) {
            console.error("Error saving trip:", error);
            alert('Failed to save trip.');
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-12">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-xl">{editingId ? '✏️' : '➕'}</span>
                        {editingId ? 'Edit Trip Package' : 'Add New Trip Package'}
                    </h2>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                            Cancel Edit
                        </button>
                    )}
                </div>

                {/* Conditional Form Rendering for Nefertiti */}
                {formData.category === 'nefertity' ? (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Category Selector for switching BACK from Nefertiti if needed (only if not editing) */}
                        {!editingId && (
                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Trip Category</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${formData.category === cat.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                checked={formData.category === cat.id}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-sm font-bold text-center">{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <NefertitiAddTripForm
                            tripId={editingId}
                            initialData={editingId ? formData : null} // Pass formData which is populated by handleEdit
                            onCancel={handleCancelEdit}
                            onSuccess={handleCancelEdit} // Reset state on success
                        />
                    </div>
                ) : formData.category === 'magic_kerala' ? (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Category Selector for switching BACK from Kerala if needed (only if not editing) */}
                        {!editingId && (
                            <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Trip Category</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${formData.category === cat.id
                                            ? 'bg-green-600 text-white border-green-600 shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:bg-green-50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                checked={formData.category === cat.id}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-sm font-bold text-center">{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <KeralaAddTripForm
                            tripId={editingId}
                            initialData={editingId ? formData : null}
                            onCancel={handleCancelEdit}
                            onSuccess={handleCancelEdit}
                        />
                    </div>
                ) : formData.category === 'school_trips' ? (
                    <div className="space-y-8 animate-fadeIn">
                        {/* Category Selector for switching BACK from School if needed (only if not editing) */}
                        {!editingId && (
                            <div className="bg-yellow-50/50 p-6 rounded-xl border border-yellow-100 mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Trip Category</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${formData.category === cat.id
                                            ? 'bg-yellow-500 text-white border-yellow-500 shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                checked={formData.category === cat.id}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="text-sm font-bold text-center">{cat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <SchoolAddTripForm
                            tripId={editingId}
                            initialData={editingId ? formData : null}
                            onCancel={handleCancelEdit}
                            onSuccess={handleCancelEdit}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Category Selection */}
                        <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Trip Category</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {categories.map((cat) => (
                                    <label key={cat.id} className={`flex items-center justify-center px-4 py-3 rounded-lg border cursor-pointer transition-all ${formData.category === cat.id
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="category"
                                            value={cat.id}
                                            checked={formData.category === cat.id}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-bold text-center">{cat.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trip Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Majestic Kashmir Tour" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trip Image</label>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    />
                                    <div className="relative">
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm pl-16"
                                            placeholder="https://..."
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">OR URL</span>
                                    </div>
                                    {(imageFile || formData.image) && (
                                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group relative">
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Err';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                                <input type="text" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. $599" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Original Price</label>
                                <input type="text" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. $850" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Discount Tag</label>
                                <input type="text" name="discount" value={formData.discount} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 30% OFF" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Duration</label>
                                <input type="text" name="duration" value={formData.duration} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. 6 Days / 5 Nights" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Kashmir, India" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Rating</label>
                                    <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="4.9" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Badge/Tag</label>
                                    <input type="text" name="tag" value={formData.tag} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Best Seller" />
                                </div>
                            </div>

                            {/* Nefertiti Specific Fields */}
                            {formData.category === 'nefertity' && (
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mt-4">
                                    <h4 className="font-bold text-indigo-800 mb-3 flex items-center gap-2">
                                        <span>🚢</span> Nefertiti Cruise Details
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Cruise Features (comma separated)</label>
                                            <input
                                                type="text"
                                                name="features"
                                                value={formData.features}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                placeholder="e.g. Dinner Buffet, Sunset Viewing, DJ Night"
                                            />
                                            <p className="text-xs text-indigo-500 mt-1">Used for the feature tags on the card.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="isPopular"
                                                name="isPopular"
                                                checked={formData.isPopular}
                                                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                            />
                                            <label htmlFor="isPopular" className="text-sm font-bold text-gray-700 cursor-pointer">Mark as "Most Popular"</label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description / Overview</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Detailed tour overview..."></textarea>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Day-wise Itinerary</h3>
                                <button type="button" onClick={addItineraryDay} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    <span>+</span> Add Day
                                </button>
                            </div>
                            <div className="space-y-4">
                                {itinerary.map((day, index) => (
                                    <div key={index} className="flex gap-4 items-start bg-white p-4 rounded-lg shadow-sm">
                                        <div className="flex flex-col gap-2">
                                            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded text-sm mt-1 whitespace-nowrap text-center">Day {day.day}</span>
                                            {itinerary.length > 1 && (
                                                <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-400 hover:text-red-600 text-xs text-center hover:underline">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Day Title"
                                                value={day.title}
                                                onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                            <textarea
                                                placeholder="Description"
                                                value={day.desc}
                                                onChange={(e) => handleItineraryChange(index, 'desc', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                                            ></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Inclusions</h3>
                                <button type="button" onClick={addInclusion} className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">
                                    <span>+</span> Add Inclusion
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {inclusions.map((inc, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder={`Inclusion ${index + 1}`}
                                            value={inc}
                                            onChange={(e) => handleInclusionChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                                        />
                                        {inclusions.length > 1 && (
                                            <button type="button" onClick={() => removeInclusion(index)} className="text-red-400 hover:text-red-600 p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Exclusions */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Exclusions</h3>
                                <button type="button" onClick={addExclusion} className="text-sm font-bold text-red-600 hover:underline flex items-center gap-1">
                                    <span>+</span> Add Exclusion
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {exclusions.map((exc, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder={`Exclusion ${index + 1}`}
                                            value={exc}
                                            onChange={(e) => handleExclusionChange(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                        />
                                        {exclusions.length > 1 && (
                                            <button type="button" onClick={() => removeExclusion(index)} className="text-red-400 hover:text-red-600 p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center gap-3 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span>{editingId ? 'Update Trip Package' : 'Save Trip Package'}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Existing Packages List */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                    Existing Packages - <span className="text-blue-600">{categories.find(c => c.id === formData.category)?.label}</span>
                </h2>
                {packages.filter(p => p.category === formData.category).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No packages found for this category.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packages.filter(p => p.category === formData.category).map((pkg) => (
                            <div key={pkg.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${editingId === pkg.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}>
                                <img src={pkg.image} alt={pkg.title} className="w-24 h-24 object-cover rounded-lg bg-gray-200" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 truncate">{pkg.title}</h4>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">{categories.find(c => c.id === pkg.category)?.label || pkg.category}</p>
                                    <p className="text-sm font-bold text-gray-900">{pkg.price}</p>
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleEdit(pkg)}
                                            className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pkg.id)}
                                            className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default AddTripForm;
