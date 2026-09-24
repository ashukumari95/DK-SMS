'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    // Manually register Service Worker to ensure PWA works
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('Service Worker registered successfully');
      }).catch((err) => {
        console.error('Service Worker registration failed: ', err);
      });
    }

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Check for in-app browsers
    const inAppBrowser = /FBAN|FBAV|Instagram|WhatsApp|Line|Snapchat|LinkedIn/i.test(userAgent);
    
    if (inAppBrowser) {
      setIsInAppBrowser(true);
    }

    if (isIosDevice) {
      setIsIOS(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If we got the event, we definitely don't need manual instructions
      setShowManualInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // ALWAYS show the prompt after 1.5 seconds, even if event didn't fire
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 1500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Browser supports automated install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Browser blocked the event or we are in incognito/etc.
      // Show manual instructions
      setShowManualInstructions(true);
    }
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
                  App cannot be installed from WhatsApp browser.
                </p>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  Click the <span className="font-bold">3 dots (⋮)</span> top right and select <span className="font-bold">"Open in Chrome"</span>.
                </p>
              </>
            ) : isIOS ? (
              <>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  Tap Share (square with arrow) below, then <strong>'Add to Home Screen'</strong> to install.
                </p>
              </>
            ) : (
              <>
                {showManualInstructions ? (
                  <p className="text-sm text-[var(--color-brand-blue)] font-semibold mt-2 leading-snug">
                    Click the 3 dots (⋮) in your browser menu and select "Install App" or "Add to Home screen".
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">
                      Install our app on your phone for a faster experience.
                    </p>
                    <button
                      onClick={handleInstallClick}
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-[var(--color-brand-blue)] text-white text-sm font-bold py-3 px-4 rounded-xl shadow-[0_4px_14px_0_rgba(27,154,247,0.39)] hover:bg-blue-700 transition-all active:scale-95"
                    >
                      <Download size={18} />
                      Install Now
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
