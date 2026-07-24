const MediaPreview = ({ file, previewUrl, onRemove }) => {
  if (!file || !previewUrl) return null;

  const isVideo = file.type.startsWith('video/');

  return (
    <div className="px-4 pb-2">
      <div className="relative inline-block">
        {isVideo ? (
          <video src={previewUrl} className="max-h-24 rounded-lg" controls />
        ) : (
          <img src={previewUrl} alt="Preview" className="max-h-24 rounded-lg object-cover" />
        )}
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
          aria-label="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default MediaPreview;
