import { useState, useRef, useCallback } from 'react';
import { X, Plus, Tag, UploadCloud, Link2, ImageOff, CheckCircle2, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { uploadToCloudinary } from '../../utils/cloudinary';

const EMPTY = {
  title: '',
  description: '',
  techStack: [],
  status: 'active',
  coverImage: '',
  liveDemo: '',
};

const inputBase =
  'w-full px-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors';
const borderDefault = '1px solid rgba(201,168,76,0.2)';
const borderFocus   = '1px solid #C9A84C';
const borderError   = '1px solid rgba(239,68,68,0.6)';
const bgInput       = '#0a0a0a';

// Upload states
const STATE = { IDLE: 'idle', UPLOADING: 'uploading', DONE: 'done', ERROR: 'error' };

// ─── Dual image picker ────────────────────────────────────────────────────────
function CoverImagePicker({ value, onChange, initial }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver]     = useState(false);
  const [uploadState, setUploadState] = useState(STATE.IDLE);
  const [uploadError, setUploadError] = useState('');
  const [urlInput, setUrlInput]     = useState(
    initial && !initial.startsWith('data:') && !initial.includes('cloudinary') ? initial : ''
  );

  const isCloudinary = value && (value.includes('cloudinary') || value.startsWith('https://'));
  const hasImage = Boolean(value);

  // ── File upload → Cloudinary ──
  const processFile = useCallback(async (file) => {
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setUploadError('Please upload a PNG, JPG, WEBP, or GIF image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5 MB.');
      return;
    }

    setUploadError('');
    setUploadState(STATE.UPLOADING);
    setUrlInput(''); // clear URL field when file upload starts

    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
      setUploadState(STATE.DONE);
      // Reset done indicator after 2.5 s
      setTimeout(() => setUploadState(STATE.IDLE), 2500);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
      setUploadState(STATE.ERROR);
    }
  }, [onChange]);

  const handleFileInput = (e) => {
    processFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  // ── URL input ──
  const handleUrlChange = (e) => {
    const v = e.target.value;
    setUrlInput(v);
    setUploadError('');
    setUploadState(STATE.IDLE);
    onChange(v.trim() || '');
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
    setUploadError('');
    setUploadState(STATE.IDLE);
  };

  const isUploading = uploadState === STATE.UPLOADING;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#A0A0A0]">Cover Image</label>

      {/* ── Current image preview ── */}
      {hasImage && !isUploading && (
        <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a]" style={{ height: '140px' }}>
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Broken image fallback */}
          <div className="absolute inset-0 hidden items-center justify-center flex-col gap-2 text-[#555]">
            <ImageOff className="w-6 h-6" />
            <span className="text-xs">Image could not be loaded</span>
          </div>
          {/* Remove overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors group flex items-center justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
              style={{ background: 'rgba(239,68,68,0.8)' }}
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
          {/* Source badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.75)', color: '#C9A84C' }}
          >
            {uploadState === STATE.DONE ? '✓ Cloudinary' : isCloudinary ? 'Cloudinary' : 'URL'}
          </div>
        </div>
      )}

      {/* ── Upload zone ── */}
      <div
        role="button"
        tabIndex={isUploading ? -1 : 0}
        onClick={() => !isUploading && fileRef.current?.click()}
        onKeyDown={(e) => !isUploading && e.key === 'Enter' && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!isUploading) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-200 select-none"
        style={{
          height: '100px',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          background: isUploading
            ? 'rgba(201,168,76,0.06)'
            : dragOver
            ? 'rgba(201,168,76,0.08)'
            : 'rgba(201,168,76,0.03)',
          border: `2px dashed ${
            isUploading ? '#C9A84C' : dragOver ? '#C9A84C' : 'rgba(201,168,76,0.35)'
          }`,
        }}
        onMouseEnter={(e) => {
          if (!dragOver && !isUploading) e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
        }}
        onMouseLeave={(e) => {
          if (!dragOver && !isUploading) e.currentTarget.style.background = 'rgba(201,168,76,0.03)';
        }}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A84C' }} />
            <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>
              Uploading to Cloudinary...
            </p>
          </>
        ) : uploadState === STATE.DONE ? (
          <>
            <CheckCircle2 className="w-6 h-6" style={{ color: '#10b981' }} />
            <p className="text-sm font-medium text-emerald-400">Upload complete!</p>
          </>
        ) : (
          <>
            <UploadCloud
              className="w-6 h-6 transition-colors"
              style={{ color: dragOver ? '#C9A84C' : '#555' }}
            />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: dragOver ? '#C9A84C' : '#A0A0A0' }}>
                Click to upload or drag &amp; drop
              </p>
              <p className="text-xs text-[#555] mt-0.5">PNG, JPG, WEBP up to 5 MB · Stored on Cloudinary</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileInput}
        disabled={isUploading}
      />

      {/* ── URL input ── */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
        style={{ background: bgInput, border: borderDefault }}
      >
        <Link2 className="w-4 h-4 shrink-0 text-[#555]" />
        <input
          type="text"
          value={urlInput}
          onChange={handleUrlChange}
          placeholder="Or paste an image URL..."
          className="flex-1 bg-transparent text-white placeholder-[#555] text-sm focus:outline-none"
          disabled={isUploading}
        />
        {urlInput && !isUploading && (
          <button
            type="button"
            onClick={() => { setUrlInput(''); onChange(''); }}
            className="text-[#555] hover:text-[#A0A0A0] transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {uploadError && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <X className="w-3 h-3 shrink-0" />
          {uploadError}
        </p>
      )}
    </div>
  );
}

// ─── Main form ────────────────────────────────────────────────────────────────
export default function ProjectForm({ initial = null, onSave, onCancel }) {
  const [title, setTitle]           = useState(initial?.title ?? '');
  const [description, setDesc]      = useState(initial?.description ?? '');
  const [techStack, setTechStack]   = useState(initial?.techStack ?? []);
  const [status, setStatus]         = useState(initial?.status ?? 'active');
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '');
  const [liveDemo, setLiveDemo]     = useState(initial?.liveDemo ?? '');
  const [techInput, setTechInput]   = useState('');
  const [errors, setErrors]         = useState({});

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSave({ title, description, techStack, status, coverImage, liveDemo });
  };

  const addTech = () => {
    const tag = techInput.trim();
    if (tag && !techStack.includes(tag)) setTechStack((t) => [...t, tag]);
    setTechInput('');
  };

  const removeTech = (tag) => setTechStack((t) => t.filter((x) => x !== tag));

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTech(); }
  };

  const fieldStyle = (hasErr) => ({
    background: bgInput,
    border: hasErr ? borderError : borderDefault,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
          Project Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors((p) => ({ ...p, title: '' })); }}
          placeholder="e.g. Pharmacy Inventory ERP"
          className={inputBase}
          style={fieldStyle(errors.title)}
          onFocus={(e) => (e.target.style.border = borderFocus)}
          onBlur={(e) => (e.target.style.border = errors.title ? borderError : borderDefault)}
        />
        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => { setDesc(e.target.value); if (errors.description) setErrors((p) => ({ ...p, description: '' })); }}
          rows={3}
          placeholder="Brief description of the project..."
          className={`${inputBase} resize-none`}
          style={fieldStyle(errors.description)}
          onFocus={(e) => (e.target.style.border = borderFocus)}
          onBlur={(e) => (e.target.style.border = errors.description ? borderError : borderDefault)}
        />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
      </div>

      {/* Tech stack */}
      <div>
        <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Tech Stack</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="Type a technology and press Enter"
            className={`flex-1 ${inputBase}`}
            style={{ background: bgInput, border: borderDefault }}
            onFocus={(e) => (e.target.style.border = borderFocus)}
            onBlur={(e) => (e.target.style.border = borderDefault)}
          />
          <Button type="button" variant="secondary" size="md" onClick={addTech}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStack.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#C9A84C' }}
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button type="button" onClick={() => removeTech(tag)} className="hover:text-red-400 transition-colors ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-colors appearance-none"
          style={{ background: bgInput, border: borderDefault }}
          onFocus={(e) => (e.target.style.border = borderFocus)}
          onBlur={(e) => (e.target.style.border = borderDefault)}
        >
          <option value="active">Active</option>
          <option value="in development">In Development</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Cover image — dual picker with Cloudinary upload */}
      <CoverImagePicker
        value={coverImage}
        onChange={setCoverImage}
        initial={initial?.coverImage ?? ''}
      />

      {/* Live demo */}
      <div>
        <label className="block text-sm font-medium text-[#A0A0A0] mb-1.5">
          Live Demo URL <span className="text-[#555]">(optional)</span>
        </label>
        <input
          type="url"
          value={liveDemo}
          onChange={(e) => setLiveDemo(e.target.value)}
          placeholder="https://demo.example.com"
          className={inputBase}
          style={{ background: bgInput, border: borderDefault }}
          onFocus={(e) => (e.target.style.border = borderFocus)}
          onBlur={(e) => (e.target.style.border = borderDefault)}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" className="flex-1">
          {initial ? 'Save Changes' : 'Add Project'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
