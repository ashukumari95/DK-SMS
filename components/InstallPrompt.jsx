'use client';

import { useState, useEffect } from 'react';
import { Download, X, ExternalLink } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Check if iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Check for in-app browsers (WhatsApp, Facebook, Instagram)
    const inAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line|Snapchat|LinkedIn/i.test(navigator.userAgent);
    
    if (inAppBrowser) {
      setIsInAppBrowser(true);
      setTimeout(() => setShowPrompt(true), 1500);
      return; // Stop here, in-app browsers don't support PWA install
    }

    if (isIosDevice) {
      setIsIOS(true);
      // Show iOS prompt instruction after 1.5 seconds
      setTimeout(() => setShowPrompt(true), 1500);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show our custom prompt UI after a small delay
      setTimeout(() => setShowPrompt(true), 1500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 transition-transform duration-500 transform translate-y-0">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.15)] border-2 border-[var(--color-brand-blue)] overflow-hidden">
        <div className="p-4 sm:p-5 flex items-start gap-4 relative">
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="w-14 h-14 bg-[var(--color-brand-blue)] rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            DK
          </div>
          
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-gray-900 text-lg">Install D.K.Mishra App</h3>
            
            {isInAppBrowser ? (
              <>
                <p className="text-xs text-red-600 font-medium mt-1 leading-snug">
                  You are using WhatsApp/In-App browser. App cannot be installed from here.
                </p>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Please click the <span className="font-bold">3 dots (⋮)</span> in the top right corner and select <span className="font-bold">"Open in Chrome"</span>.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {isIOS 
                    ? "Tap Share (square with arrow) below, then 'Add to Home Screen' to install this app."
                    : "Install our app on your phone for a faster, better experience. Login easily next time!"}
                </p>
                
                {!isIOS && (
                  <button
                    onClick={handleInstallClick}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-[var(--color-brand-blue)] text-white text-sm font-bold py-3 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(27,154,247,0.39)] hover:bg-blue-700 transition-all hover:shadow-[0_6px_20px_rgba(27,154,247,0.23)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={18} />
                    Install Now
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
