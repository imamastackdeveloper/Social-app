const AIChatBanner = ({ onDisable }) => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600 dark:text-yellow-400 text-sm">✨</span>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
            AI is responding on your behalf
          </p>
        </div>
        <button
          onClick={onDisable}
          className="text-xs font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline transition-colors"
        >
          Tap to disable
        </button>
      </div>
    </div>
  );
};

export default AIChatBanner;
