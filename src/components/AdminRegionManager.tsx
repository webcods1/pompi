import { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, remove, serverTimestamp } from 'firebase/database';
import { db } from '../firebase';

// ─── Types ───────────────────────────────────────────────────────────────────
interface RegionPlace {
    name: string;
    image: string;
    description: string;
    packageId?: string;
}

interface RegionData {
    tagline: string;
    description: string;
    heroImage: string;
    highlights: string;
    places: RegionPlace[];
    updatedAt?: any;
}

// ─── Region Config ────────────────────────────────────────────────────────────
const REGIONS = [
    {
        key: 'north_india',
        label: 'North India',
        color: 'from-blue-600 to-indigo-700',
        light: 'bg-blue-50',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-700',
        btn: 'bg-blue-600 hover:bg-blue-700',
        editRing: 'ring-blue-400',
        pillActive: 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md border-transparent',
    },
    {
        key: 'south_india',
        label: 'South India',
        color: 'from-emerald-600 to-teal-700',
        light: 'bg-emerald-50',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700',
        btn: 'bg-emerald-600 hover:bg-emerald-700',
        editRing: 'ring-emerald-400',
        pillActive: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border-transparent',
    },
    {
        key: 'rajasthan',
        label: 'Rajasthan',
        color: 'from-orange-500 to-amber-600',
        light: 'bg-orange-50',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-700',
        btn: 'bg-orange-500 hover:bg-orange-600',
        editRing: 'ring-orange-400',
        pillActive: 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md border-transparent',
    },
    {
        key: 'goa',
        label: 'Goa',
        color: 'from-cyan-500 to-sky-600',
        light: 'bg-cyan-50',
        border: 'border-cyan-200',
        badge: 'bg-cyan-100 text-cyan-700',
        btn: 'bg-cyan-500 hover:bg-cyan-600',
        editRing: 'ring-cyan-400',
        pillActive: 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-md border-transparent',
    },
];

const emptyPlace = (): RegionPlace => ({ name: '', image: '', description: '', packageId: '' });
const emptyRegion = (): RegionData => ({ tagline: '', description: '', heroImage: '', highlights: '', places: [emptyPlace()] });

// ─── Image compression ────────────────────────────────────────────────────────
const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (ev) => {
            const img = new Image();
            img.src = ev.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX = 900;
                const scale = MAX / img.width;
                canvas.width = MAX;
                canvas.height = img.height * scale;
                canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.72));
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });

// ─── Place Row (form) ────────────────────────────────────────────────────────
const PlaceRow = ({
    place, index, onChange, onRemove, canRemove, allPackages, highlighted,
}: {
    place: RegionPlace;
    index: number;
    onChange: (i: number, field: keyof RegionPlace, val: string) => void;
    onRemove: (i: number) => void;
    canRemove: boolean;
    allPackages: any[];
    highlighted?: boolean;
}) => {
    const [imgFile, setImgFile] = useState<File | null>(null);
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (highlighted && rowRef.current) {
            rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [highlighted]);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setImgFile(f);
        onChange(index, 'image', await compressImage(f));
    };

    return (
        <div
            ref={rowRef}
            className={`bg-white border rounded-xl p-4 space-y-3 shadow-sm transition-all ${highlighted ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-200'}`}
        >
            <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${highlighted ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    Place {index + 1} {highlighted && '← Editing'}
                </span>
                {canRemove && (
                    <button type="button" onClick={() => onRemove(index)}
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors" title="Remove place">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Place Name *</label>
                    <input type="text" value={place.name} required
                        onChange={(e) => onChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="e.g. Agra" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Short Description *</label>
                    <input type="text" value={place.description} required
                        onChange={(e) => onChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                        placeholder="e.g. Home of the Taj Mahal" />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Place Image</label>
                <div className="space-y-2">
                    <input type="file" accept="image/*" onChange={handleFile}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                    <div className="relative">
                        <input type="url"
                            value={imgFile ? '(uploaded file)' : place.image}
                            onChange={(e) => { setImgFile(null); onChange(index, 'image', e.target.value); }}
                            disabled={!!imgFile}
                            className="w-full pl-14 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
                            placeholder="https://..." />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">OR URL</span>
                    </div>
                    {(imgFile || place.image) && (
                        <div className="w-full h-28 rounded-lg overflow-hidden border border-gray-200">
                            <img src={imgFile ? URL.createObjectURL(imgFile) : place.image} alt="preview"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Error'; }} />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-1.5">
                    Link to Package <span className="font-normal text-blue-500">(Optional)</span>
                </label>
                <select value={place.packageId || ''} onChange={(e) => onChange(index, 'packageId', e.target.value)}
                    className="w-full p-2 border border-blue-200 rounded-md text-xs focus:ring-2 focus:ring-blue-400 bg-white">
                    <option value="">-- Auto-match by title --</option>
                    {allPackages.map((pkg: any, i: number) => (
                        <option key={`${pkg.id}-${i}`} value={pkg.id}>
                            {pkg.title}{pkg.location ? ` · ${pkg.location}` : ''}
                        </option>
                    ))}
                </select>
                {place.packageId
                    ? <p className="text-[10px] text-green-600 font-bold mt-1">✅ Linked: {allPackages.find((p: any) => p.id === place.packageId)?.title || place.packageId}</p>
                    : <p className="text-[10px] text-blue-500 mt-1">✨ Auto-matches package by place name if left blank.</p>}
            </div>
        </div>
    );
};

// ─── Region Panel ─────────────────────────────────────────────────────────────
const RegionPanel = ({
    regionCfg, allPackages,
}: {
    regionCfg: typeof REGIONS[0];
    allPackages: any[];
}) => {
    const [form, setForm] = useState<RegionData>(emptyRegion());
    const [savedData, setSavedData] = useState<RegionData | null>(null);
    const [saving, setSaving] = useState(false);
    const [heroFile, setHeroFile] = useState<File | null>(null);
    const [saved, setSaved] = useState(false);
    const [deletingSection, setDeletingSection] = useState(false);
    const [editingPlaceIndex, setEditingPlaceIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    // ── Sync from Firebase ────────────────────────────────────────────────
    useEffect(() => {
        const r = ref(db, `region_sections/${regionCfg.key}`);
        const unsub = onValue(r, (snap) => {
            if (snap.exists()) {
                const val = snap.val();
                const places: RegionPlace[] = val.places
                    ? (Array.isArray(val.places) ? val.places : Object.values(val.places))
                    : [];
                const data: RegionData = {
                    tagline: val.tagline || '',
                    description: val.description || '',
                    heroImage: val.heroImage || '',
                    highlights: val.highlights || '',
                    places,
                };
                setSavedData(data);
                setForm(data.places.length > 0 ? data : { ...data, places: [emptyPlace()] });
            } else {
                setSavedData(null);
                setForm(emptyRegion());
            }
        });
        return () => unsub();
    }, [regionCfg.key]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleHeroFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setHeroFile(f);
        const compressed = await compressImage(f);
        setForm(p => ({ ...p, heroImage: compressed }));
    };

    const handlePlaceChange = (i: number, field: keyof RegionPlace, val: string) => {
        setForm(prev => {
            const places = [...prev.places];
            places[i] = { ...places[i], [field]: val };
            return { ...prev, places };
        });
    };

    const addPlace = () => setForm(prev => ({ ...prev, places: [...prev.places, emptyPlace()] }));

    const removePlace = (i: number) => {
        setForm(prev => ({ ...prev, places: prev.places.filter((_, idx) => idx !== i) }));
        if (editingPlaceIndex === i) setEditingPlaceIndex(null);
    };

    // Edit a specific saved place → load into that form row & scroll to it
    const handleEditPlace = (placeIndex: number) => {
        setEditingPlaceIndex(placeIndex);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Delete a specific saved place → remove from array and save
    const handleDeletePlace = async (placeIndex: number) => {
        if (!savedData) return;
        if (!window.confirm(`Delete place "${savedData.places[placeIndex]?.name}"?`)) return;
        const newPlaces = savedData.places.filter((_, i) => i !== placeIndex);
        try {
            await set(ref(db, `region_sections/${regionCfg.key}`), {
                ...savedData,
                places: newPlaces.length > 0 ? newPlaces : [],
                updatedAt: serverTimestamp(),
            });
        } catch {
            alert('Failed to delete place.');
        }
    };

    // Delete the entire section
    const handleDeleteSection = async () => {
        if (!window.confirm(`Delete the entire ${regionCfg.label} section? This cannot be undone.`)) return;
        setDeletingSection(true);
        try {
            await remove(ref(db, `region_sections/${regionCfg.key}`));
        } catch {
            alert('Failed to delete section.');
        }
        setDeletingSection(false);
    };

    // Save the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.tagline.trim()) { alert('Tagline is required.'); return; }
        if (form.places.some(p => !p.name.trim())) { alert('All place names must be filled.'); return; }
        setSaving(true);
        try {
            await set(ref(db, `region_sections/${regionCfg.key}`), {
                ...form,
                updatedAt: serverTimestamp(),
            });
            setSaved(true);
            setEditingPlaceIndex(null);
            setTimeout(() => setSaved(false), 2500);
        } catch (err) {
            console.error(err);
            alert('Failed to save. Please try again.');
        }
        setSaving(false);
    };

    const hasSaved = savedData && (savedData.tagline || savedData.places.length > 0);

    return (
        <div className="space-y-6">

            {/* ── Edit Form ──────────────────────────────────────────────── */}
            <div ref={formRef}>
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Section Info */}
                    <div className={`rounded-2xl border ${regionCfg.border} ${regionCfg.light} p-5 space-y-4`}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Section Details</h3>
                            {hasSaved && (
                                <button type="button" onClick={handleDeleteSection} disabled={deletingSection}
                                    className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-red-200 transition-colors">
                                    {deletingSection
                                        ? <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                                    Delete Entire Section
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Tagline *</label>
                                <input type="text" value={form.tagline} required
                                    onChange={(e) => setForm(p => ({ ...p, tagline: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
                                    placeholder="e.g. The Golden Heart of India" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Highlights <span className="font-normal text-gray-400">(comma-separated)</span></label>
                                <input type="text" value={form.highlights}
                                    onChange={(e) => setForm(p => ({ ...p, highlights: e.target.value }))}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
                                    placeholder="e.g. Taj Mahal, Jaipur Forts, Shimla" />
                                <p className="text-[10px] text-gray-400 mt-1">Shown as badge chips on the Destinations page.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                            <textarea value={form.description} rows={3}
                                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm resize-none"
                                placeholder="Overview shown on the Destinations page..." />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Hero / Banner Image</label>
                            <div className="space-y-2">
                                <input type="file" accept="image/*" onChange={handleHeroFile}
                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm" />
                                <div className="relative">
                                    <input type="url"
                                        value={heroFile ? '(uploaded file)' : form.heroImage}
                                        onChange={(e) => { setHeroFile(null); setForm(p => ({ ...p, heroImage: e.target.value })); }}
                                        disabled={!!heroFile}
                                        className="w-full pl-14 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 outline-none disabled:opacity-50"
                                        placeholder="https://..." />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">OR URL</span>
                                </div>
                                {(heroFile || form.heroImage) && (
                                    <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200">
                                        <img src={heroFile ? URL.createObjectURL(heroFile) : form.heroImage}
                                            alt="hero preview" className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=Error'; }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Places */}
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                Places / Spots
                                <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{form.places.length}</span>
                            </h3>
                            <button type="button" onClick={addPlace}
                                className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-xl transition-colors">
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
                                    highlighted={editingPlaceIndex === i}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between">
                        {editingPlaceIndex !== null && (
                            <button type="button" onClick={() => setEditingPlaceIndex(null)}
                                className="text-sm font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel Edit
                            </button>
                        )}
                        <div className="ml-auto">
                            <button type="submit" disabled={saving}
                                className={`px-8 py-3.5 ${regionCfg.btn} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3 ${saving ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}>
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : saved ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Saved!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        Save {regionCfg.label} Section
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* ── Saved Section Preview ──────────────────────────────────── */}
            {hasSaved && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Preview header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <div>
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                Saved Section — Live Preview
                                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">LIVE</span>
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">This is exactly what users see on the Destinations page.</p>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Section meta */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-1">
                                {savedData?.tagline && (
                                    <p className="text-lg font-bold text-gray-800">{savedData.tagline}</p>
                                )}
                                {savedData?.description && (
                                    <p className="text-sm text-gray-500 leading-relaxed">{savedData.description}</p>
                                )}
                                {savedData?.highlights && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {savedData.highlights.split(',').map((h, i) => h.trim() && (
                                            <span key={i} className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${regionCfg.badge}`}>
                                                {h.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {savedData?.heroImage && (
                                <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img src={savedData.heroImage} alt="hero" className="w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                            )}
                        </div>

                        {/* Saved places */}
                        {savedData && savedData.places.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                                    Saved Places ({savedData.places.length})
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {savedData.places.map((place, i) => (
                                        <div key={i} className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                            {/* Image */}
                                            <div className="relative h-32 overflow-hidden bg-gray-100">
                                                {place.image ? (
                                                    <img src={place.image} alt={place.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {/* Place number badge */}
                                                <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                                    #{i + 1}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="p-3">
                                                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-0.5">{place.name}</h4>
                                                <p className="text-xs text-gray-500 leading-tight line-clamp-2">{place.description}</p>

                                                {/* Action buttons */}
                                                <div className="flex gap-1.5 mt-3">
                                                    <button
                                                        onClick={() => handleEditPlace(i)}
                                                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePlace(i)}
                                                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded-lg transition-colors"
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminRegionManager = () => {
    const [activeRegion, setActiveRegion] = useState(REGIONS[0].key);
    const [allPackages, setAllPackages] = useState<any[]>([]);

    useEffect(() => {
        const pkgRef = ref(db, 'packages');
        const unsub = onValue(pkgRef, (snap) => {
            if (snap.exists()) {
                setAllPackages(Object.entries(snap.val()).map(([id, val]: [string, any]) => ({ id, ...val })));
            } else {
                setAllPackages([]);
            }
        });
        return () => unsub();
    }, []);

    const regionCfg = REGIONS.find(r => r.key === activeRegion)!;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header + Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-800">Manage Region Sections</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Configure destinations for each region. Saved content appears live on the Destinations page.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {REGIONS.map((r) => (
                        <button key={r.key} onClick={() => setActiveRegion(r.key)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${activeRegion === r.key
                                ? r.pillActive
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                                }`}>
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`bg-gradient-to-r ${regionCfg.color} px-6 py-5`}>
                    <h3 className="text-xl font-bold text-white">{regionCfg.label}</h3>
                    <p className="text-white/70 text-xs">Configure the {regionCfg.label} destination section</p>
                </div>
                <div className="p-6">
                    <RegionPanel key={activeRegion} regionCfg={regionCfg} allPackages={allPackages} />
                </div>
            </div>

            {/* Tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
                <span className="text-2xl mt-0.5">💡</span>
                <div>
                    <p className="font-bold text-amber-800 text-sm mb-1">How Region Sections Work</p>
                    <ul className="text-xs text-amber-700 space-y-1 leading-relaxed list-disc list-inside">
                        <li>Each region has its <strong>own dedicated section</strong> on the Destinations page.</li>
                        <li>Fill in the form above and click <strong>Save</strong> — changes appear live immediately.</li>
                        <li>The <strong>Saved Section Preview</strong> below the form shows exactly what users see.</li>
                        <li>Use <strong>Edit</strong> on any place card to jump to and modify that row in the form.</li>
                        <li>Use <strong>Delete</strong> on any card to instantly remove that place from the live site.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminRegionManager;
