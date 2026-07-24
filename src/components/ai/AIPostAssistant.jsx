import { useState } from 'react';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import useAI from '../../hooks/useAI';

const AIPostAssistant = ({ onUseContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const { loading, error, generatePost, clearError } = useAI();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    clearError();
    setResult('');
    const response = await generatePost(prompt.trim());
    if (response.success) {
      setResult(response.description);
    }
  };

  const handleUseContent = () => {
    if (result && onUseContent) {
      onUseContent(result);
      setPrompt('');
      setResult('');
      setIsOpen(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">✨</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Writing Assistant</span>
        </div>
        <svg
          className={clsx('w-4 h-4 text-gray-500 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Describe your post idea and AI will generate content for you.
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., I just completed a React project"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-2"
          />

          <Button
            size="sm"
            variant="primary"
            onClick={handleGenerate}
            loading={loading}
            disabled={!prompt.trim() || loading}
          >
            Generate Post Content
          </Button>

          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}

          {result && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{result}</p>
              <div className="mt-3">
                <Button size="sm" variant="primary" onClick={handleUseContent}>
                  Use This Content
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPostAssistant;
