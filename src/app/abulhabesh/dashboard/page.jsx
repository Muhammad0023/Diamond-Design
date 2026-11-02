'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { getAllProducts, deleteProduct } from '../../../firebase/productService'
import { deleteImage } from '../../../firebase/imageService'
import { HiPlus, HiPencil, HiTrash, HiLogout, HiHome, HiClipboardList, HiSearch } from 'react-icons/hi';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 30;
  
  const { logout, currentUser } = useAuth();
  const router = useRouter()

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic category counts — computed from whatever categories
  // actually exist in the data, not hardcoded to a fixed list.
  const categoryCounts = Object.entries(
    products.reduce((acc, p) => {
      const cat = p.category || 'uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }))
   .sort((a, b) => b.count - a.count);

  const filteredProducts = products
    .filter(p => activeCategory === 'all' || p.category === activeCategory)
    .filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/abulhabesh');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDelete = async (product) => {
    if (!deleteConfirm || deleteConfirm !== product.id) {
      setDeleteConfirm(product.id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      setDeleting(true);
      
      // Delete images from storage
      if (product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          await deleteImage(imageUrl);
        }
      } else {
        // Fallback for old structure
        if (product.image) await deleteImage(product.image);
        if (product.hoverImage) await deleteImage(product.hoverImage);
      }
      
      // Delete product from Firestore
      await deleteProduct(product.id);
      
      // Refresh list
      await fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Diamond Design Admin
              </h1>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                Logged in as: {currentUser?.email}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/abulhabesh/orders')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiClipboardList className="w-5 h-5" />
                Orders
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiHome className="w-5 h-5" />
                View Store
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                <HiLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category stat cards — dynamic, clickable to filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => { setActiveCategory('all'); setCurrentPage(1); }}
            className={`p-5 rounded-xl shadow-sm text-left transition-colors ${
              activeCategory === 'all' ? 'bg-brand text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <p className="text-sm mb-1 opacity-80" style={{ fontFamily: 'Roboto, sans-serif' }}>All Products</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>{products.length}</p>
          </button>
          {categoryCounts.map(({ category, count }) => (
            <button
              key={category}
              onClick={() => { setActiveCategory(category); setCurrentPage(1); }}
              className={`p-5 rounded-xl shadow-sm text-left transition-colors capitalize ${
                activeCategory === category ? 'bg-brand text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1 opacity-80" style={{ fontFamily: 'Roboto, sans-serif' }}>{category}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: 'Roboto, sans-serif' }}>{count}</p>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-6 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand focus:outline-none bg-white"
          />
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/abulhabesh/add-product')}
            className="flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors shadow-lg"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            <HiPlus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                No products yet
              </h3>
              <p className="text-gray-600 mb-6" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>
                Start by adding your first product!
              </p>
              <button
                onClick={() => router.push('/abulhabesh/add-product')}
                className="bg-brand text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.images?.[0] || product.image} 
                            alt={product.name} 
                            className="w-16 h-16 object-cover rounded" 
                          />
                          <div>
                            <p className="font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: 'Roboto, sans-serif' }}>{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1" style={{ fontFamily: 'Roboto, sans-serif', fontWeight: '300' }}>{product.description?.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                          {product.price ? `$${product.price}` : 'N/A'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {product.isNew ? (
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full" style={{ fontFamily: 'Roboto, sans-serif' }}>New</span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full" style={{ fontFamily: 'Roboto, sans-serif' }}>Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/abulhabesh/edit-product/${product.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deleting}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === product.id
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'text-red-600 hover:bg-red-50'
                            } disabled:opacity-50`}
                            title={deleteConfirm === product.id ? 'Click again to confirm' : 'Delete'}
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && filteredProducts.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
