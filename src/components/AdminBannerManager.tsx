import { useState, useEffect } from 'react';
import { ref, push, remove, onValue } from 'firebase/database';
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
}

const AdminBannerManager = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [quote, setQuote] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [destinationsInput, setDestinationsInput] = useState('');
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

        return () => unsub();
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

        const newSlide = {
            title,
            quote,
            image: finalImageUrl,
            destinations: destArray
        };

        try {
            await push(ref(db, 'hero_slides'), newSlide);
            // Reset form
            setTitle('');
            setQuote('');
            setImageUrl('');
            setImageFile(null);
            setDestinationsInput('');
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

    if (loading) return <div className="p-8 text-center">Loading banners...</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Hero Banner</h2>
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

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition-colors ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {submitting ? 'Adding...' : 'Add Banner'}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800">Existing Banners</h3>
                {slides.length === 0 ? (
                    <p className="text-gray-500 italic">No banners added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {slides.map((slide) => (
                            <div key={slide.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden flex flex-col">
                                <div className="h-40 overflow-hidden relative group">
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(slide.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold"
                                        >
                                            Delete Banner
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1">
                                    <h4 className="font-bold text-gray-900 mb-1">{slide.title}</h4>
                                    <p className="text-sm text-gray-600 italic mb-3">"{slide.quote}"</p>
                                    <div className="flex flex-wrap gap-1">
                                        {slide.destinations && slide.destinations.map((dest, idx) => (
                                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
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

export default AdminBannerManager;
