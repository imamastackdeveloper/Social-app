import { useState } from 'react';
import Button from '../ui/Button';
import useAI from '../../hooks/useAI';

const AIProfileOptimize = ({ bio, name, location, onUseSuggestion }) => {
  const [suggestion, setSuggestion] = useState('');
  const { loading, error, optimizeProfile, clearError } = useAI();

  const handleOptimize = async () => {
    clearError();
    setSuggestion('');
    const response = await optimizeProfile(bio, name, location);
    if (response.success) {
      setSuggestion(response.bio);
    }
  };

  const handleUseSuggestion = () => {
    if (suggestion && onUseSuggestion) {
      onUseSuggestion(suggestion);
      setSuggestion('');
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleOptimize}
        loading={loading}
        disabled={loading}
        className="mb-3"
      >
        <span className="mr-1">✨</span> Optimise with AI
      </Button>

      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}

      {suggestion && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Suggested bio:</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">{suggestion}</p>
          <div className="mt-2">
            <Button size="sm" variant="primary" onClick={handleUseSuggestion}>
              Use Suggestion
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProfileOptimize;
