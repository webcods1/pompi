import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, update, remove, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Place {
    name: string;
    image: string;
    description: string;
    packageId?: string; // explicit package link (same pattern as hero banners)
}

interface Destination {
    id?: string;
    state: string;
    tagline: string;
    description: string;
    places: Place[];
    order?: number;
    createdAt?: any;
    updatedAt?: any;
}

const emptyPlace = (): Place => ({ name: '', image: '', description: '', packageId: '' });

const emptyForm = (): Omit<Destination, 'id'> => ({
    state: '',
    tagline: '',
    description: '',
    places: [emptyPlace()],
    order: 0,
});

// ─── Image compression helper ─────────────────────────────────────────────────
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
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

// ─── Place Row Sub-component ──────────────────────────────────────────────────
const PlaceRow = ({
    place,
    index,
    onChange,
    onRemove,
    canRemove,
    allPackages,
}: {
    place: Place;
    index: number;
    onChange: (i: number, field: keyof Place, value: string) => void;
    onRemove: (i: number) => void;
    canRemove: boolean;
    allPackages: any[];
}) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const compressed = await compressImage(file);
        onChange(index, 'image', compressed);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 relative group shadow-sm hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Place {index + 1}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors"
                        title="Remove place"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Place Name *</label>
                    <input
                        type="text"
                        value={place.name}
                        onChange={(e) => onChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                        placeholder="e.g. Srinagar"
                        required
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Short Description *</label>
                    <input
                        type="text"
                        value={place.description}
                        onChange={(e) => onChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                        placeholder="e.g. Dal Lake & Houseboats"
                        required
                    />
                </div>
            </div>
            {/* Image */}
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Place Image</label>
                <div className="space-y-2">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    <div className="relative">
                        <input
                            type="url"
                            value={imageFile ? '(uploaded file)' : place.image}
                            onChange={(e) => {
                                setImageFile(null);
                                onChange(index, 'image', e.target.value);
                            }}
                            disabled={!!imageFile}
                            className="w-full pl-14 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 outline-none disabled:opacity-50"
                            placeholder="https://..."
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">OR URL</span>
                    </div>
                    {(imageFile || place.image) && (
                        <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                            <img
                                src={imageFile ? URL.createObjectURL(imageFile) : place.image}
                                alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Error'; }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* Package Link — same pattern as Hero Banner admin */}
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">
                    🔗 Link to Package <span className="font-normal text-blue-500">(Optional)</span>
                </label>
                <select
                    value={place.packageId || ''}
                    onChange={(e) => onChange(index, 'packageId', e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded-md text-xs focus:ring-2 focus:ring-blue-400 bg-white"
                >
                    <option value="">-- Auto-match by title (recommended) --</option>
                    {allPackages.map((pkg: any, i: number) => (
                        <option key={`${pkg.id}-${i}`} value={pkg.id}>
                            {pkg.title}{pkg.location ? ` · ${pkg.location}` : ''}
                        </option>
                    ))}
                </select>
                {place.packageId ? (
                    <p className="text-[10px] text-green-600 font-bold mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        Directly links to: {allPackages.find((p: any) => p.id === place.packageId)?.title || place.packageId}
                    </p>
                ) : (
                    <p className="text-[10px] text-blue-500 mt-1">✨ If blank, auto-matches a package by place name.</p>
                )}
            </div>
        </div>
    );
};


// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDestinationManager = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [form, setForm] = useState<Omit<Destination, 'id'>>(emptyForm());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allPackages, setAllPackages] = useState<any[]>([]);
    const formRef = useRef<HTMLDivElement>(null);

    // ── Firebase sync ──────────────────────────────────────────────────────
    useEffect(() => {
        const destRef = ref(db, 'destinations');
        const unsub = onValue(destRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                const list: Destination[] = Object.entries(data).map(([id, val]: [string, any]) => ({
                    id,
                    ...val,
                    places: val.places ? Object.values(val.places) : [],
                }));
                list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
                setDestinations(list);
            } else {
                setDestinations([]);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    // Load all packages for the link dropdown
    useEffect(() => {
        const pkgRef = ref(db, 'packages');
        const unsub = onValue(pkgRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val();
                setAllPackages(Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })));
            } else {
                setAllPackages([]);
            }
        });
        return () => unsub();
    }, []);

    // ── Form helpers ───────────────────────────────────────────────────────
    const handleField = (field: keyof Omit<Destination, 'id' | 'places'>, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handlePlaceChange = (i: number, field: keyof Place, value: string) => {
        setForm(prev => {
            const places = [...prev.places];
            places[i] = { ...places[i], [field]: value };
            return { ...prev, places };
        });
    };

    const addPlace = () => {
        setForm(prev => ({ ...prev, places: [...prev.places, emptyPlace()] }));
    };

    const removePlace = (i: number) => {
        setForm(prev => ({ ...prev, places: prev.places.filter((_, idx) => idx !== i) }));
    };

    const resetForm = () => {
        setForm(emptyForm());
        setEditingId(null);
    };

    const handleEdit = (dest: Destination) => {
        setEditingId(dest.id!);
        setForm({
            state: dest.state,
            tagline: dest.tagline,
            description: dest.description,
            places: dest.places.length > 0 ? dest.places : [emptyPlace()],
            order: dest.order ?? 0,
        });
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDelete = async (id: string, stateName: string) => {
        if (!window.confirm(`Delete "${stateName}" destination? This cannot be undone.`)) return;
        try {
            await remove(ref(db, `destinations/${id}`));
        } catch (e) {
            alert('Failed to delete destination.');
        }
    };

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.state.trim() || !form.tagline.trim()) {
            alert('State name and tagline are required.');
            return;
        }
        if (form.places.some(p => !p.name.trim())) {
            alert('All place names must be filled in.');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                state: form.state.trim(),
                tagline: form.tagline.trim(),
                description: form.description.trim(),
                places: form.places,
                order: Number(form.order) || 0,
                updatedAt: serverTimestamp(),
            };
            if (editingId) {
                await update(ref(db, `destinations/${editingId}`), payload);
                alert('Destination updated!');
            } else {
                await push(ref(db, 'destinations'), { ...payload, createdAt: serverTimestamp() });
                alert('Destination added!');
            }
            resetForm();
        } catch (err) {
            console.error(err);
            alert('Failed to save destination.');
        }
        setSubmitting(false);
    };

    // ── Filtered list ──────────────────────────────────────────────────────
    const filtered = destinations.filter(d =>
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ─────────────────────────────────────────────────────────────────── UI ──
    return (
        <div className="space-y-8 max-w-5xl mx-auto">

            {/* ── Form ──────────────────────────────────────────────── */}
            <div ref={formRef} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Form header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl text-lg">
                            {editingId ? '✏️' : '🗺️'}
                        </span>
                        {editingId ? 'Edit Destination' : 'Add New Destination'}
                    </h2>
                    {editingId && (
                        <button
                            onClick={resetForm}
                            className="text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* State / Tagline / Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">State / Region Name *</label>
                            <input
                                type="text"
                                value={form.state}
                                onChange={(e) => handleField('state', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                                placeholder="e.g. Jammu and Kashmir"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tagline *</label>
                            <input
                                type="text"
                                value={form.tagline}
                                onChange={(e) => handleField('tagline', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                                placeholder="e.g. Paradise on Earth"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => handleField('description', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all resize-none"
                                placeholder="Brief overview of the destination..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Display Order</label>
                            <input
                                type="number"
                                min={0}
                                value={form.order ?? 0}
                                onChange={(e) => handleField('order', Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                                placeholder="0"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Lower number = shown first on Destinations page.</p>
                        </div>
                    </div>

                    {/* Places */}
                    <div className="bg-emerald-50/40 rounded-xl border border-emerald-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="text-emerald-600">📍</span> Places in this Destination
                                <span className="ml-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{form.places.length}</span>
                            </h3>
                            <button
                                type="button"
                                onClick={addPlace}
                                className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Place
                            </button>
                        </div>
                        <div className="space-y-4">
                            {form.places.map((place, i) => (
                                <PlaceRow
                                    key={i}
                                    place={place}
                                    index={i}
                                    onChange={handlePlaceChange}
                                    onRemove={removePlace}
                                    canRemove={form.places.length > 1}
                                    allPackages={allPackages}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center gap-3 ${submitting ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {editingId ? 'Update Destination' : 'Save Destination'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Existing Destinations List ─────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-blue-500">🗂️</span> Saved Destinations
                        <span className="ml-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">{destinations.length}</span>
                    </h2>
                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search destinations..."
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-14">
                            <div className="text-5xl mb-3">🗺️</div>
                            <p className="text-gray-400 font-medium">
                                {searchQuery ? 'No destinations match your search.' : 'No destinations added yet. Add your first one above!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map((dest) => (
                                <div
                                    key={dest.id}
                                    className={`rounded-xl border overflow-hidden transition-all group ${editingId === dest.id
                                        ? 'border-emerald-400 ring-2 ring-emerald-200 shadow-md'
                                        : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
                                        }`}
                                >
                                    {/* Destination header with first place image as bg */}
                                    <div className="relative h-28 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600">
                                        {dest.places[0]?.image && (
                                            <img
                                                src={dest.places[0].image}
                                                alt={dest.state}
                                                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-3">
                                            <h3 className="text-white font-bold text-base leading-tight">{dest.state}</h3>
                                            <p className="text-emerald-200 text-xs font-semibold">{dest.tagline}</p>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                                            {dest.places.length} places
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-4 bg-white">
                                        {dest.description && (
                                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{dest.description}</p>
                                        )}
                                        {/* Places preview */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {dest.places.map((p, i) => (
                                                <span key={i} className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    📍 {p.name}
                                                </span>
                                            ))}
                                        </div>
                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(dest)}
                                                className="flex-1 text-xs font-bold bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(dest.id!, dest.state)}
                                                className="flex-1 text-xs font-bold bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Tip Box ────────────────────────────────────────────── */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <span className="text-2xl mt-0.5">💡</span>
                <div>
                    <p className="font-bold text-amber-800 text-sm mb-1">How Explore button links to packages</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        The <strong>Explore</strong> button on each place card uses the same system as Hero Banners.
                        If you set a <strong>Link to Package</strong> on a place, it goes directly there.
                        Otherwise it <strong>auto-matches</strong> by comparing the place name to package titles.
                        Fallback is the general <strong>/packages</strong> page.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminDestinationManager;
