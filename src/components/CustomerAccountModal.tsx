import React, { useState } from 'react';
import {
  X,
  User,
  ShoppingBag,
  PackageCheck,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Tag,
  CheckCircle2,
  Truck,
  Clock,
  Sparkles,
  Camera,
} from 'lucide-react';
import { UserAccount, PlacedOrder, Language } from '../types';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  orders: PlacedOrder[];
  language?: Language;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  language = 'en',
  onLogin,
  onLogout,
  onOpenAdminPanel,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'discounts'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saveMessage, setSaveMessage] = useState('');

  // Sign up / Login form if not logged in
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');

  // Customer specific orders
  const myOrders = currentUser
    ? orders.filter(
        (o) =>
          (currentUser.phone && o.customer.phone && o.customer.phone.includes(currentUser.phone)) ||
          (currentUser.email && o.customer.email && o.customer.email.toLowerCase() === currentUser.email.toLowerCase()) ||
          o.customer.fullName.toLowerCase().includes(currentUser.fullName.toLowerCase())
      )
    : [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserAccount = {
      fullName: fullName.trim() || 'Ayesha Customer',
      phone: phone.trim(),
      email: email.trim() || `${phone.trim()}@ayeshacustomer.pk`,
      city: city.trim() || 'Pakistan',
      address: address.trim(),
      avatar: avatar || undefined,
    };
    onLogin(updated);
    setIsEditing(false);
    setSaveMessage(language === 'ur' ? '🌸 معلومات کامیابی سے محفوظ ہو گئی ہیں!' : 'Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 2500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      fullName: loginName.trim() || 'Ayesha Customer',
      phone: loginPhone.trim(),
      email: `${loginPhone.trim()}@ayeshacustomer.pk`,
      city: 'Pakistan',
      address: '',
    };
    onLogin(newUser);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatar(dataUrl);
      if (currentUser) {
        onLogin({ ...currentUser, avatar: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#080509] border border-[#FF168F]/50 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.35)] overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF168F]/20 border border-[#FF168F]/50 text-[#FF168F] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(255,22,143,0.3)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                {currentUser ? (language === 'ur' ? `میرا اکاؤنٹ (${currentUser.fullName})` : `My Account - ${currentUser.fullName}`) : (language === 'ur' ? 'کسٹمر پورٹل و لاگ ان' : 'Customer Account')}
              </h2>
              <p className="text-[11px] text-[#FF8BC8]">
                Shopping By Ayesha · 100% Cash On Delivery
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-rose-950/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NOT LOGGED IN VIEW */}
        {!currentUser ? (
          <div className="p-6 sm:p-10 space-y-6 max-w-md mx-auto my-auto text-center">
            <div className="w-16 h-16 rounded-full bg-[#171017] border border-[#FF168F] text-[#FF168F] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,22,143,0.4)]">
              <User className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                {language === 'ur' ? 'اپنا اکاؤنٹ بنائیں یا لاگ ان کریں' : 'Customer Account Login'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {language === 'ur'
                  ? 'اپنے پچھلے اور موجودہ آرڈرز ٹریک کریں اور خصوصی 10% ڈسکاؤنٹ حاصل کریں۔'
                  : 'Track your orders, manage your shipping address, and view exclusive discounts.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  {language === 'ur' ? 'مکمل نام (Full Name) *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Khan"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">
                  {language === 'ur' ? 'فون / واٹس ایپ نمبر (Mobile Number) *' : 'Mobile / WhatsApp Number *'}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0300 1234567"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  className="w-full bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-neon-pink py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,22,143,0.5)]"
              >
                {language === 'ur' ? 'اکاؤنٹ میں داخل ہوں (Continue)' : 'Continue to My Account'}
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN CUSTOMER DASHBOARD */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Customer Navigation Bar */}
            <div className="w-full md:w-56 bg-[#120a13] border-b md:border-b-0 md:border-r border-[#2e1a2b] p-3 flex md:flex-col gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                  activeTab === 'profile'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 border border-[#2e1a2b]'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{language === 'ur' ? 'پروفائل و ایڈریس' : 'My Profile'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between gap-2 transition-all text-left ${
                  activeTab === 'orders'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 border border-[#2e1a2b]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{language === 'ur' ? 'میرے آرڈرز' : 'My Orders'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">
                  {myOrders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('discounts')}
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                  activeTab === 'discounts'
                    ? 'bg-[#FF168F] text-white shadow-[0_0_15px_rgba(255,22,143,0.5)]'
                    : 'bg-[#171017] text-zinc-400 border border-[#2e1a2b]'
                }`}
              >
                <Tag className="w-4 h-4 shrink-0" />
                <span>{language === 'ur' ? 'میرے ڈسکاؤنٹس' : 'Discounts & Offers'}</span>
              </button>

              <div className="pt-4 border-t border-[#2e1a2b] mt-auto space-y-2">
                {(currentUser?.email?.toLowerCase().includes('mashu0734@gmail.com') ||
                  currentUser?.email?.toLowerCase().includes('admin') ||
                  localStorage.getItem('sba_admin_auth') === 'true') &&
                  onOpenAdminPanel && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAdminPanel();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#171017] hover:bg-[#FF168F] border border-[#FF168F] text-[#FF8BC8] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,22,143,0.3)] cursor-pointer"
                    >
                      <span>🔐 {language === 'ur' ? 'ایڈمن ڈیش بورڈ کھولیں' : 'Open Admin Panel'}</span>
                    </button>
                  )}

                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-600/50 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'ur' ? 'لاگ آؤٹ' : 'Logout'}</span>
                </button>
              </div>
            </div>

            {/* TAB BODY */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-[#080509]">
              
              {saveMessage && (
                <div className="p-3 mb-4 rounded-xl bg-emerald-950 border border-emerald-500 text-xs text-emerald-200 font-bold">
                  {saveMessage}
                </div>
              )}

              {/* TAB 1: PROFILE & DELIVERY ADDRESS */}
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-white">
                      پروفائل و ڈلیوری ایڈریس (Customer Details)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-3 py-1.5 rounded-lg bg-[#171017] border border-[#FF168F]/50 text-xs font-bold text-[#FF8BC8] hover:text-white"
                    >
                      {isEditing ? 'کینسل' : 'ایڈٹ کریں (Edit)'}
                    </button>
                  </div>

                  {!isEditing ? (
                    <div className="p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-4 text-xs text-zinc-300">
                      <div className="flex items-center gap-4 border-b border-[#2e1a2b] pb-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black border-2 border-[#FF168F]">
                          {currentUser.avatar ? (
                            <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                              <User className="w-8 h-8 text-[#FF168F]" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-serif text-base font-bold text-white block">{currentUser.fullName}</span>
                          <span className="font-mono text-[#FF8BC8]">{currentUser.phone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <strong className="text-white block mb-1">✉️ ای میل:</strong>
                          <span>{currentUser.email || 'حساب میں درج نہیں'}</span>
                        </div>
                        <div>
                          <strong className="text-white block mb-1">🏙️ شہر (City):</strong>
                          <span>{currentUser.city || 'Pakistan'}</span>
                        </div>
                      </div>

                      <div>
                        <strong className="text-white block mb-1">📍 محفوظ شدہ ڈلیوری ایڈریس:</strong>
                        <p className="bg-[#080509] p-3 rounded-xl border border-[#2e1a2b]">
                          {currentUser.address || 'کوئی ایڈریس محفوظ نہیں ہے۔ آرڈر کرتے وقت ایڈریس شامل کریں۔'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* EDIT PROFILE FORM */
                    <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-[#171017] border border-[#FF168F] space-y-4">
                      {/* Avatar upload */}
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-black border border-[#FF168F]">
                          {avatar ? (
                            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-zinc-500" />
                            </div>
                          )}
                        </div>
                        <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-bold text-white transition-colors flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5" />
                          <span>تصویر تبدیل کریں</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-white block mb-1">نام (Full Name) *</label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-white block mb-1">فون نمبر *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-white block mb-1">ای میل</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-white block mb-1">شہر (City)</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl px-3 py-2 text-xs text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-white block mb-1">ڈلیوری ایڈریس</label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-[#080509] border border-[#2e1a2b] focus:border-[#FF168F] rounded-xl p-3 text-xs text-white outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full btn-neon-pink py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        محفوظ کریں (Save Profile)
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: MY ORDERS & ORDER TRACKING */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    میرے پچھلے اور موجودہ آرڈرز ({myOrders.length})
                  </h3>

                  {myOrders.length === 0 ? (
                    <div className="text-center py-12 text-xs text-zinc-400 bg-[#171017] rounded-2xl border border-[#2e1a2b] space-y-2">
                      <ShoppingBag className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p>آپ نے ابھی تک کوئی آرڈر نہیں کیا!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myOrders.map((ord) => (
                        <div
                          key={ord.orderId}
                          className="p-4 sm:p-5 rounded-2xl bg-[#171017] border border-[#2e1a2b] space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-[#2e1a2b] pb-2.5">
                            <div>
                              <span className="font-mono text-sm font-extrabold text-[#FF168F] block">
                                {ord.orderId}
                              </span>
                              <span className="text-[11px] text-zinc-400">{ord.date}</span>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                  : ord.status === 'Dispatched'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-600'
                                  : 'bg-[#2e1a2b] text-[#FF8BC8] border border-[#FF168F]'
                              }`}
                            >
                              {ord.status === 'Confirmed'
                                ? '✓ آرڈر کنفرم ہو گیا ہے'
                                : ord.status === 'Dispatched'
                                ? '🚚 آرڈر روانہ کر دیا گیا ہے'
                                : ord.status === 'Delivered'
                                ? '🎉 آرڈر ڈیلیور ہو چکا ہے'
                                : ord.status}
                            </span>
                          </div>

                          {/* Items List */}
                          <div className="space-y-2">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-[#080509] p-2.5 rounded-xl border border-[#2e1a2b]">
                                <img src={it.product.image || it.product.images[0]} alt={it.product.name} className="w-10 h-12 object-cover rounded-lg" />
                                <div className="flex-1 min-w-0 text-xs">
                                  <h4 className="font-bold text-white truncate">{it.product.name}</h4>
                                  <span className="text-[10px] text-zinc-400 block">رنگ: {it.selectedColor || 'Standard'}</span>
                                </div>
                                <span className="font-mono text-xs font-bold text-[#FF168F]">
                                  Rs. {it.product.price * it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#2e1a2b] flex items-center justify-between text-xs">
                            <span className="text-zinc-400">100% Cash On Delivery</span>
                            <span className="font-mono text-base font-extrabold text-[#FF168F]">
                              Total: Rs. {ord.total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DISCOUNTS & OFFERS */}
              {activeTab === 'discounts' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">
                    آپ کے لیے خصوصی 10% ڈسکاؤنٹ افر
                  </h3>

                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#171017] to-[#251525] border border-[#FF168F] space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF168F]" />
                      <span className="font-bold text-white text-sm">ریفرل پرومو کوڈ (Special Referral Discount):</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#080509] border border-[#FF168F] flex items-center justify-between">
                      <div>
                        <span className="font-mono text-lg font-extrabold text-[#FF168F] block">REF10</span>
                        <span className="text-xs text-zinc-300">10٪ رعایت ہر آرڈر پر حاصل کریں</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF168F] text-white shadow-[0_0_10px_#FF168F]">
                        10% OFF
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      آرڈر کرتے وقت چیک آؤٹ پر پرومو کوڈ <strong className="text-white font-mono">REF10</strong> درج کریں اور فوری 10٪ ڈسکاؤنٹ پائیں۔
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
