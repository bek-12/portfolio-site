import { useState, useRef } from 'react';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Palette, Save, Type, Zap, UploadCloud, X, ImageOff,
  Loader2, CheckCircle2,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import { useBrand } from '../../context/BrandContext';
import { useToast } from '../../components/ui/Toast';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { authAPI } from '../../utils/api';

// ─── Shared style constants (module-level) ────────────────────────────────────
const inputBase =
  'w-full px-4 py-3 rounded-xl text-white placeholder-[#555] text-sm focus:outline-none transition-colors';
const S = {
  default: { background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.2)' },
  focus:   { borderColor: '#C9A84C', boxShadow: '0 0 0 1px rgba(201,168,76,0.15)' },
  blur:    { borderColor: 'rgba(201,168,76,0.2)', boxShadow: 'none' },
  error:   { borderColor: 'rgba(239,68,68,0.6)', boxShadow: 'none' },
};
function mergedStyle(hasError) {
  return hasError ? { ...S.default, ...S.error } : S.default;
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#111111', border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          <Icon className="w-4 h-4" style={{ color: '#C9A84C' }} />
        </div>
        <h2 className="text-base font-semibold" style={{ color: '#C9A84C' }}>
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Field label wrapper ──────────────────────────────────────────────────────
function FieldLabel({ label, icon: Icon, error, hint, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-[#A0A0A0] mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: '#C9A84C' }} />}
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-[#555]">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Logo mark preview (text-based, used in brand preview) ───────────────────
function LogoMarkPreview({ companyName, accentColor, logoImage }) {
  const words = (companyName || 'BM Software').trim().split(/\s+/);
  const initials = words.slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex items-center gap-2.5">
      {logoImage ? (
        <img
          src={logoImage}
          alt="Custom logo"
          className="w-8 h-8 rounded-lg object-cover"
          style={{ boxShadow: `0 4px 14px ${accentColor}40` }}
        />
      ) : (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-[11px]"
          style={{
            background: accentColor,
            color: '#000',
            letterSpacing: '-0.5px',
            boxShadow: `0 4px 14px ${accentColor}40`,
          }}
        >
          {initials}
        </div>
      )}
      <span className="text-sm font-bold tracking-tight">
        <span style={{ color: accentColor }}>{words[0]}</span>
        {words.length > 1 && (
          <span className="text-white"> {words.slice(1).join(' ')}</span>
        )}
      </span>
    </div>
  );
}

// ─── Section 1: Brand Settings ────────────────────────────────────────────────
function BrandSettingsSection() {
  const { brand, updateBrand } = useBrand();
  const { addToast } = useToast();
  const fileRef = useRef(null);

  const [companyName, setCompanyName] = useState(brand.companyName);
  const [tagline, setTagline]         = useState(brand.tagline);
  const [accentColor, setAccentColor] = useState(brand.accentColor);
  const [dragOver, setDragOver]       = useState(false);
  const [uploadState, setUploadState] = useState('idle'); // idle | uploading | done | error
  const [uploadError, setUploadError] = useState('');

  // ── Logo file upload → Cloudinary ──
  const processLogoFile = async (file) => {
    if (!file) return;
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadError('Please upload a PNG, JPG, SVG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2 MB.');
      return;
    }
    setUploadError('');
    setUploadState('uploading');
    try {
      const url = await uploadToCloudinary(file);
      updateBrand({ logoImage: url });
      setUploadState('done');
      addToast({ message: 'Logo uploaded and applied across the site.' });
      setTimeout(() => setUploadState('idle'), 2500);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
      setUploadState('error');
    }
  };

  const handleFileInput = (e) => {
    processLogoFile(e.target.files?.[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processLogoFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveLogo = () => {
    updateBrand({ logoImage: null });
    addToast({ message: 'Logo removed. Default text logo restored.' });
  };

  const handleSaveBrand = () => {
    if (!companyName.trim()) {
      addToast({ message: 'Company name cannot be empty.', type: 'error' });
      return;
    }
    updateBrand({ companyName: companyName.trim(), tagline: tagline.trim(), accentColor });
    addToast({ message: 'Brand settings saved.' });
  };

  return (
    <SectionCard title="Brand Settings" icon={Palette}>
      <div className="space-y-6 max-w-lg">

        {/* ── Live preview ── */}
        <div>
          <p className="text-xs text-[#555] uppercase tracking-wider mb-3">Live Preview</p>
          <div
            className="flex items-center gap-5 px-5 py-4 rounded-xl"
            style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.12)' }}
          >
            <LogoMarkPreview
              companyName={companyName || 'BM Software'}
              accentColor={accentColor}
              logoImage={brand.logoImage}
            />
            <div className="h-8 w-px" style={{ background: 'rgba(201,168,76,0.15)' }} />
            {/* Avatar circle */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0"
              style={{
                background: brand.logoImage ? 'transparent' : `${accentColor}18`,
                border: `2px solid ${accentColor}45`,
                color: accentColor,
              }}
            >
              {brand.logoImage ? (
                <img src={brand.logoImage} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (companyName || 'BM Software').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
              )}
            </div>
          </div>
        </div>

        {/* ── Logo upload (file only, no URL) ── */}
        <div>
          <p className="text-sm font-medium text-[#A0A0A0] mb-2">Custom Logo Image</p>

          {uploadState === 'uploading' ? (
            /* ── Uploading state ── */
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-xl"
              style={{
                height: '110px',
                background: 'rgba(201,168,76,0.06)',
                border: '2px dashed #C9A84C',
              }}
            >
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A84C' }} />
              <p className="text-sm font-medium" style={{ color: '#C9A84C' }}>
                Uploading to Cloudinary...
              </p>
            </div>
          ) : brand.logoImage ? (
            /* ── Uploaded logo preview ── */
            <div className="space-y-3">
              <div
                className="relative rounded-xl overflow-hidden flex items-center justify-center"
                style={{ height: '100px', background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <img
                  src={brand.logoImage}
                  alt="Custom logo"
                  className="max-h-full max-w-full object-contain p-3"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 items-center justify-center flex-col gap-1 text-[#555]">
                  <ImageOff className="w-5 h-5" />
                  <span className="text-xs">Could not load image</span>
                </div>
                {/* Cloudinary badge */}
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{ background: 'rgba(0,0,0,0.75)', color: '#C9A84C' }}
                >
                  {uploadState === 'done' ? '✓ Cloudinary' : 'Cloudinary'}
                </div>
                {/* Change overlay */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors group flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-black"
                    style={{ background: '#C9A84C' }}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Change
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="flex items-center gap-2 text-sm text-[#555] hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove / Reset to default text logo
              </button>
            </div>
          ) : (
            /* ── Upload drop zone ── */
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-2 rounded-xl cursor-pointer transition-all duration-200 select-none"
              style={{
                height: '110px',
                background: dragOver ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.03)',
                border: `2px dashed ${dragOver ? '#C9A84C' : 'rgba(201,168,76,0.35)'}`,
              }}
              onMouseEnter={(e) => { if (!dragOver) e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
              onMouseLeave={(e) => { if (!dragOver) e.currentTarget.style.background = 'rgba(201,168,76,0.03)'; }}
            >
              {uploadState === 'done' ? (
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
                    <p className="text-xs text-[#555] mt-0.5">PNG, JPG, SVG up to 2 MB · Stored on Cloudinary</p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
            onChange={handleFileInput}
            disabled={uploadState === 'uploading'}
          />
          {uploadError && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
              <X className="w-3 h-3 shrink-0" />
              {uploadError}
            </p>
          )}
          <p className="mt-1.5 text-xs text-[#555]">
            If no logo is uploaded, the default text mark is used.
          </p>
        </div>

        <div className="h-px" style={{ background: 'rgba(201,168,76,0.08)' }} />

        {/* ── Company name ── */}
        <FieldLabel
          label="Company Display Name"
          icon={Type}
          hint="Shown in the navbar and admin sidebar."
        >
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="BM Software"
            className={inputBase}
            style={S.default}
            onFocus={(e) => Object.assign(e.target.style, S.focus)}
            onBlur={(e) => Object.assign(e.target.style, S.blur)}
          />
        </FieldLabel>

        {/* ── Tagline ── */}
        <FieldLabel
          label="Tagline"
          icon={Zap}
          hint="Shown in the hero badge on the public site."
        >
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Enterprise Software Solutions"
            className={inputBase}
            style={S.default}
            onFocus={(e) => Object.assign(e.target.style, S.focus)}
            onBlur={(e) => Object.assign(e.target.style, S.blur)}
          />
        </FieldLabel>

        {/* ── Accent color ── */}
        <FieldLabel
          label="Primary Accent Color"
          icon={Palette}
          hint="Updates gold accents across the entire site live."
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="w-12 h-12 rounded-xl cursor-pointer p-1"
              style={{ background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.2)' }}
              title="Pick accent color"
            />
            <input
              type="text"
              value={accentColor}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setAccentColor(v);
              }}
              placeholder="#C9A84C"
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-[#555] text-sm font-mono focus:outline-none transition-colors"
              style={S.default}
              onFocus={(e) => Object.assign(e.target.style, S.focus)}
              onBlur={(e) => Object.assign(e.target.style, S.blur)}
            />
            <button
              type="button"
              onClick={() => setAccentColor('#C9A84C')}
              className="px-3 py-2 rounded-lg text-xs text-[#555] hover:text-[#A0A0A0] transition-colors whitespace-nowrap"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              Reset
            </button>
          </div>
        </FieldLabel>

        <div className="pt-1">
          <Button onClick={handleSaveBrand}>
            <Save className="w-4 h-4" />
            Save Brand Settings
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Section 2: Personal Info ─────────────────────────────────────────────────
function PersonalInfoSection() {
  const { brand, updateBrand } = useBrand();
  const { addToast } = useToast();

  const [fullName, setFullName] = useState(brand.fullName);
  const [email, setEmail]       = useState(brand.email);
  const [phone, setPhone]       = useState(brand.phone);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Valid email is required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    try {
      await authAPI.updateProfile({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
      updateBrand({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() });
      addToast({ message: 'Profile information saved successfully.' });
    } catch (err) {
      addToast({ message: err.message || 'Failed to save profile.', type: 'error' });
    }
  };

  return (
    <SectionCard title="Personal Information" icon={User}>
      <div className="space-y-4 max-w-lg">
        <FieldLabel label="Full Name" icon={User} error={errors.fullName}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); if (errors.fullName) setErrors((p) => ({ ...p, fullName: '' })); }}
            placeholder="Bereket Mebratu"
            className={inputBase}
            style={mergedStyle(errors.fullName)}
            onFocus={(e) => Object.assign(e.target.style, S.focus)}
            onBlur={(e) => Object.assign(e.target.style, errors.fullName ? S.error : S.blur)}
          />
        </FieldLabel>

        <FieldLabel label="Email Address" icon={Mail} error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: '' })); }}
            placeholder="you@example.com"
            className={inputBase}
            style={mergedStyle(errors.email)}
            onFocus={(e) => Object.assign(e.target.style, S.focus)}
            onBlur={(e) => Object.assign(e.target.style, errors.email ? S.error : S.blur)}
          />
        </FieldLabel>

        <FieldLabel label="Phone Number" icon={Phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9XX XXX XXX"
            className={inputBase}
            style={S.default}
            onFocus={(e) => Object.assign(e.target.style, S.focus)}
            onBlur={(e) => Object.assign(e.target.style, S.blur)}
          />
        </FieldLabel>

        <div className="pt-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Password strength helper ─────────────────────────────────────────────────
function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

// ─── Section 3: Change Password ───────────────────────────────────────────────
// All three inputs are rendered directly — no inner component — to prevent
// React from unmounting/remounting them on state changes (focus-loss bug).
function ChangePasswordSection() {
  const { brand, updateBrand } = useBrand();
  const { addToast } = useToast();

  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors]           = useState({});

  const clearError = (field) => setErrors((p) => ({ ...p, [field]: '' }));

  const validate = () => {
    const e = {};
    if (!currentPw)                        e.currentPw = 'Current password is required';
    else if (currentPw !== brand.password) e.currentPw = 'Current password is incorrect';
    if (!newPw)                            e.newPw = 'New password is required';
    else if (newPw.length < 8)            e.newPw = 'Password must be at least 8 characters';
    if (!confirmPw)                        e.confirmPw = 'Please confirm your new password';
    else if (newPw && confirmPw !== newPw) e.confirmPw = 'Passwords do not match';
    return e;
  };

  const handleUpdate = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      addToast({ message: 'Please fix the errors below.', type: 'error' });
      return;
    }
    try {
      await authAPI.changePassword(currentPw, newPw);
      setCurrentPw(''); setNewPw(''); setConfirmPw(''); setErrors({});
      addToast({ message: 'Password updated successfully.' });
    } catch (err) {
      setErrors({ currentPw: err.message || 'Failed to update password.' });
      addToast({ message: err.message || 'Failed to update password.', type: 'error' });
    }
  };

  const strength = getStrength(newPw);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = strength <= 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : strength === 3 ? '#C9A84C' : '#10b981';

  return (
    <SectionCard title="Change Password" icon={Lock}>
      <div className="space-y-4 max-w-lg">

        {/* Current password */}
        <FieldLabel label="Current Password" icon={Lock} error={errors.currentPw}>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPw}
              onChange={(e) => { setCurrentPw(e.target.value); clearError('currentPw'); }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`${inputBase} pr-11`}
              style={mergedStyle(errors.currentPw)}
              onFocus={(e) => Object.assign(e.target.style, S.focus)}
              onBlur={(e) => Object.assign(e.target.style, errors.currentPw ? S.error : S.blur)}
            />
            <button type="button" tabIndex={-1} onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#A0A0A0] transition-colors"
              aria-label={showCurrent ? 'Hide' : 'Show'}>
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldLabel>

        <div className="h-px" style={{ background: 'rgba(201,168,76,0.08)' }} />

        {/* New password */}
        <FieldLabel label="New Password" icon={Lock} error={errors.newPw}>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => { setNewPw(e.target.value); clearError('newPw'); }}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`${inputBase} pr-11`}
              style={mergedStyle(errors.newPw)}
              onFocus={(e) => Object.assign(e.target.style, S.focus)}
              onBlur={(e) => Object.assign(e.target.style, errors.newPw ? S.error : S.blur)}
            />
            <button type="button" tabIndex={-1} onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#A0A0A0] transition-colors"
              aria-label={showNew ? 'Hide' : 'Show'}>
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldLabel>

        {/* Strength bar */}
        {newPw.length > 0 && (
          <div className="flex items-center gap-2 -mt-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: i < strength ? strengthColor : 'rgba(255,255,255,0.08)' }} />
            ))}
            <span className="text-xs w-12 text-right" style={{ color: strengthColor }}>
              {strengthLabel}
            </span>
          </div>
        )}

        {/* Confirm password */}
        <FieldLabel label="Confirm New Password" icon={Lock} error={errors.confirmPw}>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => { setConfirmPw(e.target.value); clearError('confirmPw'); }}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`${inputBase} pr-11`}
              style={mergedStyle(errors.confirmPw)}
              onFocus={(e) => Object.assign(e.target.style, S.focus)}
              onBlur={(e) => Object.assign(e.target.style, errors.confirmPw ? S.error : S.blur)}
            />
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#A0A0A0] transition-colors"
              aria-label={showConfirm ? 'Hide' : 'Show'}>
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldLabel>

        <div className="pt-2">
          <Button onClick={handleUpdate}>
            <Lock className="w-4 h-4" />
            Update Password
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Profile() {
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-[#A0A0A0] mt-1">
            Manage your brand identity, personal info, and account security.
          </p>
        </div>
        <div className="space-y-6">
          <BrandSettingsSection />
          <PersonalInfoSection />
          <ChangePasswordSection />
        </div>
      </div>
    </AdminLayout>
  );
}
