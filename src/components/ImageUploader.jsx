import { useState, useRef } from 'react';
import { HiUpload, HiX, HiArrowLeft, HiArrowRight, HiZoomIn } from 'react-icons/hi';

export default function ImageUploader({ images, setImages, maxImages = 5 }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ zoom: 1, positionY: 0 });
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      zoom: 1,
      positionY: 0,
      isExisting: false,
    }));

    setImages([...images, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const moveImage = (index, direction) => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= images.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const openEditor = (index) => {
    const img = images[index];
    setEditingIndex(index);
    setEditData({
      zoom: img.zoom || 1,
      positionY: img.positionY || 0,
    });
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    
    const newImages = [...images];
    newImages[editingIndex] = {
      ...newImages[editingIndex],
      zoom: editData.zoom,
      positionY: editData.positionY,
    };
    setImages(newImages);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData({ zoom: 1, positionY: 0 });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Product Images ({images.length}/{maxImages})
        </h3>
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <HiUpload className="w-5 h-5" />
            Add Images
          </button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <div
                  className="w-full h-full overflow-hidden cursor-pointer flex items-center justify-center"
                  onClick={() => openEditor(index)}
                >
                  <img
                    src={img.preview || img.url}
                    alt={`Product ${index + 1}`}
                    className="object-cover transition-transform"
                    style={{
                      transform: `scale(${img.zoom || 1}) translateY(${img.positionY || 0}px)`,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              </div>

              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
                #{index + 1}
              </div>

              {/* Zoom/Position Indicator */}
              {((img.zoom && img.zoom !== 1) || (img.positionY && img.positionY !== 0)) && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                  <HiZoomIn className="w-3 h-3" />
                  {img.zoom?.toFixed(1)}x
                </div>
              )}

              {/* Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, 'left');
                    }}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Move left"
                  >
                    <HiArrowLeft className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditor(index);
                  }}
                  className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  title="Edit"
                >
                  <HiZoomIn className="w-4 h-4" />
                </button>
                
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, 'right');
                    }}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Move right"
                  >
                    <HiArrowRight className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Remove"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-brand transition-colors bg-gray-50"
            >
              <HiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Add Image
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
          <HiUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
            No images uploaded
          </h4>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
            Upload up to {maxImages} product images
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark transition-colors"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            Upload Images
          </button>
        </div>
      )}

      {/* MOBILE-RESPONSIVE EDITOR MODAL */}
      {editingIndex !== null && images[editingIndex] && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            {/* Scrollable content */}
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Edit Image #{editingIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <HiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
              </div>

              {/* Preview - Responsive height */}
              <div className="mb-6 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: 'clamp(250px, 50vh, 400px)' }}>
                <img
                  src={images[editingIndex].preview || images[editingIndex].url}
                  alt="Preview"
                  className="object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${editData.zoom}) translateY(${editData.positionY}px)`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </div>

              {/* Zoom Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    <HiZoomIn className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Zoom
                  </label>
                  <span className="text-xl sm:text-2xl font-bold text-brand" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {editData.zoom.toFixed(1)}x
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={editData.zoom}
                  onChange={(e) => setEditData({ ...editData, zoom: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#d29e0e' }}
                />
                
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.5x</span>
                </div>
                
                {/* Quick Zoom Presets */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[0.8, 1.0, 1.2, 1.5].map(zoom => (
                    <button
                      key={zoom}
                      type="button"
                      onClick={() => setEditData({ ...editData, zoom })}
                      className="px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {zoom}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Position Y Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-base sm:text-lg font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Position (Up/Down)
                  </label>
                  <span className="text-xl sm:text-2xl font-bold text-brand" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    {editData.positionY}px
                  </span>
                </div>
                
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={editData.positionY}
                  onChange={(e) => setEditData({ ...editData, positionY: parseInt(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#d29e0e' }}
                />
                
                <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600">
                  <span>↑ Up</span>
                  <span>Center</span>
                  <span>↓ Down</span>
                </div>
                
                {/* Quick Position Presets */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[-100, -50, 0, 50, 100].map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setEditData({ ...editData, positionY: pos })}
                      className="px-1 sm:px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {pos > 0 ? `+${pos}` : pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <div className="mb-6 text-center">
                <button
                  type="button"
                  onClick={() => setEditData({ zoom: 1, positionY: 0 })}
                  className="text-sm text-gray-600 hover:text-brand transition-colors underline"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Reset to Default
                </button>
              </div>

              {/* Action Buttons - Always visible at bottom */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="px-4 sm:px-6 py-3 sm:py-4 bg-brand text-white rounded-lg font-bold hover:bg-brand-dark transition-colors text-sm sm:text-base shadow-lg"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
