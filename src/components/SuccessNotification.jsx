import { useEffect } from 'react';
import { HiCheckCircle, HiX } from 'react-icons/hi';

export default function SuccessNotification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <HiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Success!
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-600 animate-progress" style={{ animation: 'progress 3s linear' }}></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
