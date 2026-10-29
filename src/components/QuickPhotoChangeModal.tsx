import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { processAndCompressImage } from '../utils/imageUtils';

interface QuickPhotoChangeModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProductPhotos: (productId: string, newImages: string[]) => void;
}

export const QuickPhotoChangeModal: React.FC<QuickPhotoChangeModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdateProductPhotos,
}) => {
  if (!isOpen || !product) return null;

  const [previewImages, setPreviewImages] = useState<string[]>(product.images || []);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setIsProcessing(true);
    try {
      const processed: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedDataUrl = await processAndCompressImage(file, 800, 0.75);
        processed.push(compressedDataUrl);
      }
      setPreviewImages((prev) => [...prev, ...processed]);
    } catch (err: any) {
      setError(err?.message || 'Error loading image file');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setPreviewImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const handleSave = () => {
    if (previewImages.length === 0) {
      setError('Please select or upload at least one image');
      return;
    }
    onUpdateProductPhotos(product.id, previewImages);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#080509] border border-[#FF168F]/60 rounded-2xl shadow-[0_0_50px_rgba(255,22,143,0.4)] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2e1a2b] bg-[#171017] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF168F]/20 text-[#FF168F] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">
                Change Product Photos
              </h3>
              <p className="text-[11px] text-[#FF8BC8] font-medium truncate max-w-xs">
                {product.name} ({product.category})
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Current & Preview Card */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs">Current Photos:</div>
            <div className="flex flex-wrap gap-2">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#0d090e] border border-[#FF168F]/40 shadow-[0_0_15px_rgba(255,22,143,0.25)] shrink-0">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewImages((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Buttons */}
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-xl bg-[#171017] hover:bg-[#251525] border-2 border-dashed border-[#FF168F]/50 hover:border-[#FF168F] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,22,143,0.3)]"
            >
              <Upload className="w-4 h-4 text-[#FF168F]" />
              <span>Add Picture from Device / Camera</span>
            </button>

            {/* URL alternative */}
            <div className="pt-2 border-t border-[#2e1a2b]">
              <label className="text-[11px] text-zinc-400 block mb-1">
                Or paste web image link:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-[#171017] border border-[#2e1a2b] focus:border-[#FF168F] rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3.5 py-2 rounded-lg bg-[#2e1a2b] hover:bg-[#FF168F] text-xs font-semibold text-white transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#2e1a2b] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-[#171017] text-xs font-medium text-zinc-300 hover:text-white border border-[#2e1a2b]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="btn-neon-pink px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,22,143,0.5)]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Photos Updated!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Save All Pictures</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
