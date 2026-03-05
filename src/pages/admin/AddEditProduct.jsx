import { generateSlug } from '../../utils/slugUtils';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, updateProduct, getProductById } from '../../firebase/productService';
import { uploadImage } from '../../firebase/imageService';
import { HiArrowLeft } from 'react-icons/hi';
import ImageUploader from '../../components/ImageUploader';
import SuccessNotification from '../../components/SuccessNotification';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'simple',
    description: '',
    isNew: false,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id, isEditMode]);

  const loadProduct = async () => {
    try {
      const product = await getProductById(id);
      
      if (product) {
        setFormData({
          name: product.name || '',
          price: product.price || '',
          category: product.category || 'simple',
          description: product.description || '',
          isNew: product.isNew || false,
        });

        const loadedImages = [];
        
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach((url) => {
            loadedImages.push({
              preview: url,
              url: url,
              isExisting: true,
              zoom: 1,
              positionY: 0,
            });
          });
        } else if (product.image) {
          loadedImages.push({
            preview: product.image,
            url: product.image,
            isExisting: true,
            zoom: 1,
            positionY: 0,
          });
          
          if (product.hoverImage && product.hoverImage !== product.image) {
            loadedImages.push({
              preview: product.hoverImage,
              url: product.hoverImage,
              isExisting: true,
              zoom: 1,
              positionY: 0,
            });
          }
        }
        
        setImages(loadedImages);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('=== SUBMIT STARTED ===');
    console.log('Form Data:', formData);
    console.log('Images:', images);

    if (!formData.name || !formData.category) {
      alert('Please fill in all required fields (Name and Category)');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

    try {
      setLoading(true);
      setUploadingImages(true);
      
      const uploadedUrls = [];
      
      console.log('=== UPLOADING IMAGES ===');
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        console.log(`Image ${i}:`, img);
        
        if (img.isExisting && img.url) {
          console.log(`  -> Using existing URL: ${img.url}`);
          uploadedUrls.push(img.url);
        } else if (img.file) {
          console.log(`  -> Uploading new file...`);
          const url = await uploadImage(img.file, 'products');
          console.log(`  -> Uploaded to: ${url}`);
          uploadedUrls.push(url);
        } else if (img.preview && typeof img.preview === 'string' && img.preview.startsWith('http')) {
          console.log(`  -> Using preview URL: ${img.preview}`);
          uploadedUrls.push(img.preview);
        } else {
          console.warn(`  -> Skipping invalid image:`, img);
        }
      }

      console.log('=== UPLOADED URLs ===');
      console.log(uploadedUrls);

      setUploadingImages(false);

      // Base product data (WITHOUT slug yet)
      const productData = {
        name: formData.name,
        price: formData.price && formData.price !== "" ? parseFloat(formData.price) : null,
        category: formData.category,
        description: formData.description,
        isNew: formData.isNew,
        images: uploadedUrls,
        image: uploadedUrls[0],
        hoverImage: uploadedUrls[1] || uploadedUrls[0],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      };

      console.log('=== PRODUCT DATA (before save) ===');
      console.log(productData);

      if (isEditMode) {
        console.log('=== EDIT MODE ===');
        console.log('Generating slug with name:', formData.name, 'and id:', id);
        const slug = generateSlug(formData.name, id);
        console.log('Generated slug:', slug);
        
        await updateProduct(id, { ...productData, slug });
        setSuccessMessage('Product updated successfully!');
      } else {
        console.log('=== ADD MODE ===');
        console.log('Adding product to Firebase...');
        const docRef = await addProduct(productData);
        
        console.log('Product added! DocRef:', docRef);
        console.log('DocRef type:', typeof docRef);
        console.log('DocRef.id:', docRef?.id);
        
        if (!docRef || !docRef.id) {
          throw new Error('Failed to get document reference from addProduct');
        }
        
        console.log('Generating slug with name:', formData.name, 'and id:', docRef.id);
        const slug = generateSlug(formData.name, docRef.id);
        console.log('Generated slug:', slug);
        
        console.log('Updating product with slug...');
        await updateProduct(docRef.id, { slug });
        console.log('Product updated with slug!');
        
        setSuccessMessage('Product added successfully!');
      }

      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/abulhabesh/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('=== ERROR OCCURRED ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert('Failed to save product: ' + error.message);
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/abulhabesh/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-brand transition-colors mb-4"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <HiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
              placeholder="e.g., Elegant White Kemis Traditional Design"
              style={{ fontFamily: 'Roboto, sans-serif' }}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Price (USD) <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
                placeholder="2999"
                min="0"
                step="0.01"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
                required
              >
                <option value="latest">Latest Design</option>
                <option value="simple">Simple Dresses</option>
                <option value="wedding">Wedding Dresses</option>
                <option value="chiffon">Chiffon</option>
                <option value="holiday">Holidays</option>
                <option value="group">Group Outfits</option>
                <option value="mens">Men's</option>
                <option value="couples">Couples</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-brand transition-colors resize-none"
              placeholder="Beautiful handcrafted Ethiopian traditional dress featuring intricate embroidery..."
              style={{ fontFamily: 'Roboto, sans-serif' }}
            />
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
              />
              <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Mark as "New" (shows NEW badge)
              </span>
            </label>
          </div>

          <div className="mb-8">
            <ImageUploader images={images} setImages={setImages} maxImages={5} />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/abulhabesh/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'Roboto, sans-serif' }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-brand text-white rounded-lg font-semibold hover:bg-brand-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {uploadingImages ? 'Uploading images...' : 'Saving...'}
                </div>
              ) : (
                isEditMode ? 'Update Product' : 'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <SuccessNotification
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}