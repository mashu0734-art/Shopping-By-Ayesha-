import React, { useState, useRef } from 'react';
import { X, User, Lock, Phone, MapPin, Check, Mail, Sparkles, LogOut, Camera, Upload } from 'lucide-react';
import { UserAccount, Language } from '../types';
import { useTranslation } from '../translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  language?: Language;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  language = 'ur',
  onLogin,
  onLogout,
}) => {
  if (!isOpen) return null;

  const t = useTranslation(language);
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [avatar, setAvatar] = useState<string>(currentUser?.avatar || '');
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [password, setPassword] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      if (currentUser) {
        onLogin({ ...currentUser, avatar: dataUrl });
        setSuccessNotice(language === 'ur' ? '🌸 پروفائل تصویر کامیابی سے محفوظ ہو گئی ہے!' : '🌸 Profile picture updated successfully!');
        setTimeout(() => setSuccessNotice(''), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');

    if (mode === 'signup') {
      if (!fullName.trim() || !phone.trim()) {
        setErrorNotice(language === 'ur' ? 'براہ کرم اپنا نام اور فون نمبر درج کریں' : 'Please fill in your name and phone number');
        return;
      }

      const newUser: UserAccount = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${phone.trim()}@ayeshacustomer.pk`,
        city: city.trim() || 'Pakistan',
        address: address.trim(),
        avatar: avatar || undefined,
      };

      onLogin(newUser);
      setSuccessNotice(language === 'ur' ? 'اکاؤنٹ کامیابی سے بن گیا ہے! شاپنگ بائے عائشہ میں خوش آمدید۔' : 'Account created successfully! Welcome to Shopping By Ayesha.');
      setTimeout(() => {
        setSuccessNotice('');
        onClose();
      }, 900);
    } else {
      if (!phone.trim()) {
        setErrorNotice(language === 'ur' ? 'براہ کرم اپنا فون نمبر یا ای میل درج کریں' : 'Please enter your phone number or email');
        return;
      }

      const existingUser: UserAccount = {
        fullName: fullName.trim() || 'Ayesha Customer',
        phone: phone.trim(),
        email: email.trim() || `${phone.trim()}@ayeshacustomer.pk`,
        city: city.trim() || 'Pakistan',
        address: address.trim(),
        avatar: avatar || currentUser?.avatar || undefined,
      };

      onLogin(existingUser);
      setSuccessNotice(language === 'ur' ? 'کامیابی سے لاگ ان ہو گیا!' : 'Logged in successfully!');
      setTimeout(() => {
        setSuccessNotice('');
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Hidden File Input for Profile Picture Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFile}
        className="hidden"
      />

      <div className="relative w-full max-w-md bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.4)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF168F]/20 text-[#FF168F] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                {currentUser ? t.auth.profileTitle : mode === 'signup' ? t.auth.signupTitle : t.auth.loginTitle}
              </h3>
              <p className="text-[11px] text-[#FF8BC8]">
                Shopping By Ayesha · 100% Cash On Delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {currentUser ? (
            /* Logged in view with Profile Picture */
            <div className="space-y-4">
              {/* Profile Photo Display & Change Button */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#171017] border border-[#FF168F]/40 shadow-[0_0_15px_rgba(255,22,143,0.2)] text-center space-y-3">
                <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-[#FF168F] via-[#FF8BC8] to-[#FF2D9B] shadow-[0_0_20px_rgba(255,22,143,0.5)]">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-zinc-400">
                      <User className="w-10 h-10 text-[#FF168F]" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#FF168F] hover:bg-[#FF2D9B] text-white shadow-[0_0_10px_#FF168F] transition-transform active:scale-90"
                    title={language === 'ur' ? 'تصویر تبدیل کریں' : 'Change Photo'}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080509] border border-[#FF168F]/60 text-xs text-[#FFD6EA] hover:text-white font-semibold transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#FF168F]" />
                    <span>{language === 'ur' ? 'اپنی پروفائل تصویر تبدیل کریں / لگائیں' : 'Upload / Change Profile Picture'}</span>
                  </button>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4 rounded-xl bg-[#171017] border border-[#2e1a2b] space-y-2.5 text-xs text-zinc-300">
                <div className="flex justify-between items-center pb-2 border-b border-[#2e1a2b]">
                  <span className="text-zinc-400">{t.auth.fullName}:</span>
                  <strong className="text-white text-sm">{currentUser.fullName}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">{t.auth.phone}:</span>
                  <span className="text-[#FF8BC8] font-mono">{currentUser.phone}</span>
                </div>
                {currentUser.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">{t.auth.email}:</span>
                    <span className="text-white">{currentUser.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">{t.auth.city}:</span>
                  <span className="text-white">{currentUser.city}</span>
                </div>
                {currentUser.address && (
                  <div className="pt-2 border-t border-[#2e1a2b]">
                    <span className="text-zinc-400 block mb-0.5">{t.auth.address}:</span>
                    <span className="text-white leading-relaxed">{currentUser.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-neon-pink py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  {language === 'ur' ? 'خریداری جاری رکھیں' : 'Continue Shopping'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#171017] border border-[#2e1a2b] hover:border-rose-500 text-rose-400 text-xs font-semibold flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.auth.logoutBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Signup / Login Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Tab Switcher */}
              <div className="flex rounded-xl bg-[#171017] p-1 border border-[#2e1a2b]">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_12px_rgba(255,22,143,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.auth.signupTab}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-[#FF168F] text-white shadow-[0_0_12px_rgba(255,22,143,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.auth.loginTab}
                </button>
              </div>

              {/* Profile Picture Uploader for every user */}
              <div className="flex flex-col items-center justify-center py-2 text-center space-y-2">
                <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#FF168F] to-[#FF2D9B] shadow-[0_0_12px_rgba(255,22,143,0.4)]">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-full bg-black"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#171017] flex items-center justify-center text-zinc-400">
                      <User className="w-8 h-8 text-[#FF168F]" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#FF168F] hover:bg-[#FF2D9B] text-white shadow-[0_0_8px_#FF168F] transition-transform active:scale-90"
                    title={language === 'ur' ? 'تصویر منتخب کریں' : 'Select Photo'}
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#FF8BC8] hover:text-white underline font-semibold transition-colors"
                >
                  {avatar
                    ? (language === 'ur' ? 'تصویر منتخب ہو گئی (Change Photo)' : 'Change Photo')
                    : (language === 'ur' ? 'پروفائل تصویر لگائیں (Upload Profile Picture)' : 'Upload Profile Picture')}
                </button>
              </div>

              {errorNotice && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600 text-xs text-rose-200">
                  {errorNotice}
                </div>
              )}

              {successNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                    {t.auth.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ur' ? 'اپنا پورا نام درج کریں' : 'Enter your full name'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  {t.auth.phone} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        {t.auth.city}
                      </label>
                      <input
                        type="text"
                        placeholder={language === 'ur' ? 'لاہور، کراچی...' : 'Karachi, Lahore...'}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                        {t.auth.email}
                      </label>
                      <input
                        type="email"
                        placeholder="example@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                      {t.auth.address}
                    </label>
                    <textarea
                      rows={2}
                      placeholder={language === 'ur' ? 'گھر کا پتہ، گلی یا علاقہ' : 'House #, Street, Area...'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg p-2.5 text-xs text-white outline-none resize-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">
                  {t.auth.password}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-neon-pink py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,22,143,0.5)] mt-2"
              >
                <span>{mode === 'signup' ? t.auth.signupBtn : t.auth.loginBtn}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                  className="text-xs text-[#FF8BC8] hover:underline"
                >
                  {mode === 'signup' ? t.auth.switchLogin : t.auth.switchSignup}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
