import useAI from '../../hooks/useAI';
import Button from '../ui/Button';

const AICommentSuggest = ({ postDescription, onUseSuggestion }) => {
  const { loading, error, suggestComment, clearError } = useAI();

  const handleSuggest = async () => {
    clearError();
    const response = await suggestComment(postDescription);
    if (response.success && onUseSuggestion) {
      onUseSuggestion(response.comment);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleSuggest}
        loading={loading}
        disabled={loading}
        className="text-primary-500 hover:text-primary-600"
      >
        <span className="mr-1">✨</span> Suggest Comment
      </Button>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AICommentSuggest;
