import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Clock, DollarSign, Tag } from 'lucide-react';
import { productsApi } from '../services/api';
import { CreateProductDto, ProductCategory } from '../types';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    originalPrice: '',
    quantity: '1',
    availableUntil: '',
    availableFrom: '',
    category: ProductCategory.OTHER,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadProduct();
    }
  }, [mode, id]);

  const loadProduct = async () => {
    try {
      const response = await productsApi.getProductById(Number(id));
      const product = response.data;
      
      setFormData({
        description: product.description || '',
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        quantity: product.quantity.toString(),
        availableUntil: product.availableUntil ? new Date(product.availableUntil).toISOString().slice(0, 16) : '',
        availableFrom: product.availableFrom ? new Date(product.availableFrom).toISOString().slice(0, 16) : '',
        category: product.category || ProductCategory.OTHER,
      });
    } catch (err) {
      setError('Failed to load product data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData: CreateProductDto = {
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        quantity: parseInt(formData.quantity),
        availableUntil: new Date(formData.availableUntil),
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom) : undefined,
        category: formData.category,
        sellerId: 0,
      };

      if (mode === 'create') {
        await productsApi.createProduct(productData);
      } else if (mode === 'edit' && id) {
        await productsApi.updateProduct(Number(id), productData);
      }

      navigate('/dashboard/seller');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
  };

  const categoryOptions = [
    { value: ProductCategory.BREAD, label: 'Bread & Bakery' },
    { value: ProductCategory.PASTRY, label: 'Pastry' },
    { value: ProductCategory.MAIN_DISH, label: 'Main Dishes' },
    { value: ProductCategory.DESSERT, label: 'Desserts' },
    { value: ProductCategory.BEVERAGE, label: 'Beverages' },
    { value: ProductCategory.SNACK, label: 'Snacks' },
    { value: ProductCategory.SALAD, label: 'Salads' },
    { value: ProductCategory.SOUP, label: 'Soups' },
    { value: ProductCategory.OTHER, label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/dashboard/seller')}
            className="mr-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {mode === 'create' ? 'Add Product' : 'Edit Product'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-2" />
              Product Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Product Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Fresh bread, pizza slices, sandwiches..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Sale Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="9.99"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Optional)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="19.99"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Available
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="1"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Available From (Optional)
              </label>
              <input
                type="datetime-local"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Until
              </label>
              <input
                type="datetime-local"
                name="availableUntil"
                value={formData.availableUntil}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
