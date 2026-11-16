import React, { useEffect } from 'react';
import { X, Mail, Copy, Share2, ArrowRight } from 'lucide-react';
import { TripPlanResponse } from '../types/travel';
import { generateShareSummary } from '../pages/ResultsPage';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TripPlanResponse;
  onToast: (message: string) => void;
}

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0Zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943Z"/>
  </svg>
);

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, plan, onToast }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shareText = generateShareSummary(plan);
  const destinationName = plan.destination?.name || 'Vacation';
  const originCity = plan.originCity || 'Origin';

  // 1. WhatsApp share
  const handleWhatsApp = () => {
    try {
      const text = encodeURIComponent(shareText);
      const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
      const win = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        onToast('WhatsApp is not available. Please use Copy Plan instead.');
      } else {
        onClose();
      }
    } catch {
      onToast('WhatsApp is not available. Please use Copy Plan instead.');
    }
  };

  // 2. Telegram share
  const handleTelegram = () => {
    try {
      const text = encodeURIComponent(shareText);
      const telegramUrl = `https://t.me/share/url?text=${text}`;
      const win = window.open(telegramUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        onToast('Telegram is not available. Please use Copy Plan instead.');
      } else {
        onClose();
      }
    } catch {
      onToast('Telegram is not available. Please use Copy Plan instead.');
    }
  };

  // 3. Email share
  const handleEmail = () => {
    try {
      const subject = encodeURIComponent(`My AI Travel Plan - ${destinationName}`);
      const body = encodeURIComponent(shareText);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      onClose();
    } catch {
      onToast('Unable to open email client. Please use Copy Plan instead.');
    }
  };

  // 4. Copy Plan
  const handleCopyPlan = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      onToast('Trip plan copied to clipboard.');
      onClose();
    } catch {
      onToast('Unable to copy trip plan to clipboard.');
    }
  };

  // 5. More Sharing Options (Native Web Share API)
  const handleMoreOptions = async () => {
    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local'));

    const shareData: ShareData = {
      title: `AI Travel Plan: ${originCity} → ${destinationName}`,
      text: shareText,
      ...(!isLocalhost && window.location.href ? { url: window.location.href } : {}),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onClose();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return;
        }
      }
    }

    // Fallback if native sharing is unavailable or fails
    await handleCopyPlan();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172033]/60 backdrop-blur-xs animate-fade-in no-print"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E4EAE7] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E4EAE7] flex items-center justify-between bg-[#F7FAF9]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center border border-[#BAEEDB]">
              <Share2 className="w-5 h-5 text-[#0F9D72]" />
            </div>
            <div>
              <h3 id="share-modal-title" className="text-lg font-black text-[#172033]">
                Share Your Trip
              </h3>
              <p className="text-xs text-[#667085]">Share your complete travel plan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share options"
            className="p-2 text-[#667085] hover:text-[#172033] rounded-xl hover:bg-[#E4EAE7]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options List */}
        <div className="p-5 sm:p-6 space-y-2.5">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E4EAE7] hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#E8FBF0] text-[#25D366] flex items-center justify-center shrink-0 border border-[#BFF3D4] group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#172033] group-hover:text-[#087A5A] transition-colors">
                  WhatsApp
                </div>
                <div className="text-xs text-[#667085] truncate">
                  Send complete itinerary via WhatsApp chat
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#087A5A] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Telegram */}
          <button
            type="button"
            onClick={handleTelegram}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E4EAE7] hover:border-[#229ED9]/40 hover:bg-[#229ED9]/5 transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#EDF8FD] text-[#229ED9] flex items-center justify-center shrink-0 border border-[#C8E9F8] group-hover:scale-105 transition-transform">
                <TelegramIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#172033] group-hover:text-[#229ED9] transition-colors">
                  Telegram
                </div>
                <div className="text-xs text-[#667085] truncate">
                  Share with Telegram contacts or channels
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#229ED9] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmail}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E4EAE7] hover:border-[#6366F1]/40 hover:bg-[#6366F1]/5 transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0 border border-[#C7D2FE] group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#172033] group-hover:text-[#6366F1] transition-colors">
                  Email
                </div>
                <div className="text-xs text-[#667085] truncate">
                  Send itinerary via your default mail client
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Copy Plan */}
          <button
            type="button"
            onClick={handleCopyPlan}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E4EAE7] hover:border-[#0F9D72]/40 hover:bg-[#DDF7EF]/30 transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#DDF7EF] text-[#087A5A] flex items-center justify-center shrink-0 border border-[#BAEEDB] group-hover:scale-105 transition-transform">
                <Copy className="w-5 h-5 text-[#0F9D72]" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#172033] group-hover:text-[#087A5A] transition-colors">
                  Copy Plan
                </div>
                <div className="text-xs text-[#667085] truncate">
                  Copy formatted summary to clipboard
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#087A5A] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* More Sharing Options */}
          <button
            type="button"
            onClick={handleMoreOptions}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-[#E4EAE7] hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/5 transition-all group text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] flex items-center justify-center shrink-0 border border-[#DDD6FE] group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#172033] group-hover:text-[#8B5CF6] transition-colors">
                  More Sharing Options
                </div>
                <div className="text-xs text-[#667085] truncate">
                  Use device system share panel
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#8B5CF6] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
