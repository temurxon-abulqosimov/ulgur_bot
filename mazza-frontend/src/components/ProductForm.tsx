import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Clock, DollarSign, Tag } from 'lucide-react';
import { productsApi } from '../services/api';
import { CreateProductDto, ProductCategory } from '../types';
import ImageUpload from './ImageUpload';
import Notification, { NotificationProps } from './Notification';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<NotificationProps>({
    type: 'success',
    title: '',
    message: '',
    isVisible: false,
    onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
  });
  
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
      console.error('Failed to load product:', err);
      setError('Failed to load product details');
    }
  };

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true,
      onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
    });
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

      console.log('ProductForm: Submitting product data:', productData);

      if (mode === 'create') {
        const response = await productsApi.createProduct(productData);
        console.log('ProductForm: Product created successfully:', response.data);
        showNotification(
          'success',
          'Product Created Successfully!',
          'Your product has been added to your store. You can view it in your products list.'
        );
        
        // Navigate after a short delay to let user see the notification
        setTimeout(() => {
          navigate('/seller');
        }, 2000);
      } else if (mode === 'edit' && id) {
        const response = await productsApi.updateProduct(Number(id), productData);
        console.log('ProductForm: Product updated successfully:', response.data);
        showNotification(
          'success',
          'Product Updated Successfully!',
          'Your product has been updated with the new information.'
        );
        
        // Navigate after a short delay to let user see the notification
        setTimeout(() => {
          navigate('/seller');
        }, 2000);
      }
    } catch (err: any) {
      console.error('ProductForm: Submit error:', err);
      showNotification(
        'error',
        'Failed to Save Product',
        'There was an error saving your product. Please try again.'
      );
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
    { value: ProductCategory.OTHER, label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={notification.onClose}
        duration={4000}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/seller')}
              className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {mode === 'create' ? 'Add Product' : 'Edit Product'}
            </h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto p-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageUpload
                onImageSelect={handleImageSelect}
                label="Upload product image"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Describe your product..."
            />
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Sale Price
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Optional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                />
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Available
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availableFrom" className="block text-sm font-medium text-gray-700 mb-2">
                Available From (Optional)
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="availableFrom"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="availableUntil" className="block text-sm font-medium text-gray-700 mb-2">
                Available Until
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="availableUntil"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Add Product' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
