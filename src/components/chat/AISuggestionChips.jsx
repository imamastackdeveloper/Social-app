const AISuggestionChips = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 ml-10 mb-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="bg-white border border-blue-200 text-blue-700 text-sm rounded-full px-3 py-1 hover:bg-blue-50 cursor-pointer transition-colors dark:bg-gray-800 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-gray-700"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default AISuggestionChips;
