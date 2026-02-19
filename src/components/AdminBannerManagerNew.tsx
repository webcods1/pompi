import { useState, useEffect } from 'react';
import { ref, push, remove, onValue, update } from 'firebase/database';
import { db } from '../firebase';

interface Destination {
    id: number;
    name: string;
}

interface Slide {
    id: string;
    image: string;
    title: string;
    quote: string;
    destinations: Destination[];
    packageId?: string;
}

// Static packages to ensure dropdown has options
const staticPackages = [
    { id: '1', title: 'Majestic Kashmir Tour', category: 'North India' },
    { id: '2', title: 'Royal Rajasthan Heritage', category: 'North India' },
    { id: '3', title: 'Kerala Backwaters Bliss', category: 'South India' },
    { id: '4', title: 'Goa Beach & Party', category: 'West India' },
    { id: '5', title: 'Himalayan Trek Adventure', category: 'Adventure' },
    { id: '6', title: 'Andaman Island Paradise', category: 'Islands' },
    { id: '7', title: 'Varanasi Spiritual Journey', category: 'Spiritual' },
    { id: '8', title: 'Mysore Royal Heritage', category: 'South India' }
];

const AdminBannerManagerNew = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [quote, setQuote] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [destinationsInput, setDestinationsInput] = useState('');
    const [packageId, setPackageId] = useState('');
    const [allPackages, setAllPackages] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const slidesRef = ref(db, 'hero_slides');
        const unsub = onValue(slidesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setSlides(list);
            } else {
                setSlides([]);
            }
            setLoading(false);
        });

        // Fetch all packages for the dropdown
        const packagesRef = ref(db, 'packages');
        const unsubPkgs = onValue(packagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                // Merge static and firebase packages
                setAllPackages([...staticPackages, ...list]);
            } else {
                setAllPackages(staticPackages);
            }
        });

        return () => { unsub(); unsubPkgs(); };
    }, []);

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1200; // Larger width for Hero Banner
                    const scaleSize = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scaleSize;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Compress to JPEG with 0.8 quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    resolve(compressedDataUrl);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Parse destinations from comma-separated string
        const destArray = destinationsInput.split(',').map((d, index) => ({
            id: index + 1,
            name: d.trim()
        })).filter(d => d.name !== '');

        let finalImageUrl = imageUrl;

        if (imageFile) {
            try {
                // Compress image before saving
                const compressedBase64 = await compressImage(imageFile);
                finalImageUrl = compressedBase64;
            } catch (error) {
                console.error("Error compressing image:", error);
                alert("Failed to process image.");
                setSubmitting(false);
                return;
            }
        } else if (!imageUrl && !imageFile) {
            alert("Please provide a Banner Image or URL.");
            setSubmitting(false);
            return;
        }

        const newSlide: any = {
            title,
            quote,
            image: finalImageUrl,
            destinations: destArray
        };
        if (packageId) {
            newSlide.packageId = packageId;
        }

        try {
            await push(ref(db, 'hero_slides'), newSlide);
            // Reset form
            setTitle('');
            setQuote('');
            setImageUrl('');
            setImageFile(null);
            setDestinationsInput('');
            setPackageId('');
            alert('Banner added successfully!');
        } catch (error) {
            console.error('Error adding slide:', error);
            alert('Failed to add banner.');
        }
        setSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await remove(ref(db, `hero_slides/${id}`));
            } catch (error) {
                console.error('Error deleting slide:', error);
                alert('Failed to delete banner.');
            }
        }
    };

    const handleLinkPackage = async (slideId: string, selectedPackageId: string) => {
        try {
            await update(ref(db, `hero_slides/${slideId}`), {
                packageId: selectedPackageId || null
            });
        } catch (error) {
            console.error('Error linking package:', error);
            alert('Failed to link package.');
        }
    };

    if (loading) return <div className="p-8 text-center text-blue-600 font-bold animate-pulse">Loading Banner Manager V2...</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 ring-1 ring-blue-50">
                <h2 className="text-xl font-bold mb-4 text-blue-900 flex items-center gap-2">
                    <span>🖼️</span> Add New Hero Banner
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 max-w-full"
                                placeholder="e.g., Kashmir: The Paradise"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                />
                                <div className="relative">
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 max-w-full text-sm pl-16"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">OR URL</span>
                                </div>
                                {(imageFile || imageUrl) && (
                                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group relative">
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
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
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quote / Subtitle</label>
                        <input
                            type="text"
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 max-w-full"
                            placeholder='"If there is heaven on earth..."'
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (Comma separated)</label>
                        <input
                            type="text"
                            value={destinationsInput}
                            onChange={(e) => setDestinationsInput(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 max-w-full"
                            placeholder="Srinagar, Gulmarg, Pahalgam"
                        />
                        <p className="text-xs text-gray-500 mt-1">These will appear as points in the travel route animation.</p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="block text-sm font-bold text-blue-900 mb-2">🔗 Link to Package (Optional)</label>
                        <select
                            value={packageId}
                            onChange={(e) => setPackageId(e.target.value)}
                            className="w-full p-2.5 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 max-w-full text-sm font-medium bg-white"
                        >
                            <option value="">-- Select a package to link --</option>
                            {allPackages.map((pkg, i) => (
                                <option key={`${pkg.id}-${i}`} value={pkg.id}>
                                    {pkg.title} ({pkg.category || 'Static'})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-blue-600 mt-2 font-medium">✨ Linking a package will make the "Package Details" button navigate directly to it.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {submitting ? 'Adding Banner...' : 'Add Banner to Homepage'}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Existing Banners</h3>
                {slides.length === 0 ? (
                    <p className="text-gray-500 italic p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">No banners active. Add one above!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slides.map((slide) => (
                            <div key={slide.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden flex flex-col group">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:scale-105 transition-transform shadow-lg"
                                        >
                                            🗑️ Delete Banner
                                        </button>
                                    </div>
                                    {slide.packageId && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md z-12">
                                            Linked
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{slide.title}</h4>
                                    <p className="text-sm text-gray-600 italic mb-4">"{slide.quote}"</p>

                                    <div className="mt-auto pt-4 border-t border-gray-100">
                                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                                            <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                🔗 Link to Package
                                            </label>
                                            <select
                                                value={slide.packageId || ''}
                                                onChange={(e) => handleLinkPackage(slide.id, e.target.value)}
                                                className="w-full p-2 border border-blue-200 rounded-md text-xs focus:ring-2 focus:ring-blue-500 bg-white shadow-sm cursor-pointer hover:bg-blue-50 transition-colors"
                                            >
                                                <option value="">-- No Link (General) --</option>
                                                {allPackages.map((pkg, i) => (
                                                    <option key={`${pkg.id}-${i}`} value={pkg.id}>
                                                        {pkg.title}
                                                    </option>
                                                ))}
                                            </select>
                                            {slide.packageId ? (
                                                <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                                                    Directs to: <span className="text-gray-900 truncate max-w-[150px]">{allPackages.find(p => p.id === slide.packageId)?.title || slide.packageId}</span>
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-gray-400 mt-2 italic">Select a package to enable direct navigation</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {slide.destinations && slide.destinations.map((dest, idx) => (
                                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                                                {dest.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminBannerManagerNew;
