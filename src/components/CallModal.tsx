import React, { useState, useEffect } from 'react';
import { X, Phone, User, MessageSquare } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';
import { submitLead } from '../services/bitrixService';

interface FormData {
  name: string;
  phone: string;
  comment: string;
}

const CallModal: React.FC = () => {
  const { isOpen, closeModal, formType, productData } = useCallModal();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', phone: '', comment: '' });
      setErrors({});
      setSubmitStatus('idle');
      document.body.style.overflow = 'hidden';

      // Автозаполнение комментария на основе выбранных данных
      if (productData) {
        let autoComment = '';
        
        if (productData.item) {
          autoComment += `Товар: ${productData.item.name} ${productData.item.size}\n`;
          autoComment += `Количество: ${productData.quantity} шт.\n`;
          autoComment += `Общий вес: ${productData.totalWeight?.toFixed(2)} т\n`;
          autoComment += `Стоимость: ${Math.round(productData.totalPrice || 0).toLocaleString()} ₸\n`;
          autoComment += `Филиал: ${productData.item.branch}\n`;
        }
        
        if (productData.selectedFilters) {
          autoComment += 'Выбранные фильтры:\n';
          if (productData.selectedFilters.branch) autoComment += `Филиал: ${productData.selectedFilters.branch}\n`;
          if (productData.selectedFilters.diameter) autoComment += `Диаметр: ${productData.selectedFilters.diameter}\n`;
          if (productData.selectedFilters.steel) autoComment += `Марка стали: ${productData.selectedFilters.steel}\n`;
          if (productData.selectedFilters.category) autoComment += `Категория: ${productData.selectedFilters.category}\n`;
        }
        
        setFormData(prev => ({ ...prev, comment: autoComment }));
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, productData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('8')) {
      return '+7' + cleaned.slice(1);
    } else if (cleaned.length === 10) {
      return '+7' + cleaned;
    } else if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return '+' + cleaned;
    }
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const leadData = {
        name: formData.name.trim(),
        phone: formatPhone(formData.phone.trim()),
        formType: formType,
        comment: formData.comment.trim(),
        productData: productData,
        source: 'Сайт АТЛАНТ МЕТАЛЛ',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      const result = await submitLead(leadData);
      
      if (result.success) {
        setSubmitStatus('success');
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    let formatted = value.replace(/\D/g, '');
    
    if (formatted.length > 0) {
      if (formatted.startsWith('8')) {
        formatted = '7' + formatted.slice(1);
      }
      if (!formatted.startsWith('7')) {
        formatted = '7' + formatted;
      }
      
      if (formatted.length > 11) {
        formatted = formatted.slice(0, 11);
      }
      
      if (formatted.length >= 1) {
        formatted = '+' + formatted;
      }
      if (formatted.length >= 5) {
        formatted = formatted.slice(0, 2) + ' (' + formatted.slice(2, 5) + ') ' + formatted.slice(5);
      }
      if (formatted.length >= 12) {
        formatted = formatted.slice(0, 10) + '-' + formatted.slice(10, 12) + '-' + formatted.slice(12);
      }
    }
    
    handleInputChange('phone', formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 rounded-2xl sm:rounded-3xl max-w-md w-full max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all border border-blue-400/30">
        {/* Header */}
        <div className="relative p-4 sm:p-8 text-center">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X className="h-6 w-6" />
          </button>
          
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">{formType}</h2>
          <p className="text-blue-100 text-sm sm:text-lg">
            Оставьте заявку и мы перезвоним в течение 15 минут
          </p>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 pb-4 sm:pb-8">
          {submitStatus === 'success' ? (
            <div className="text-center py-4 sm:py-8">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Phone className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Заявка отправлена! 🎉</h3>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">
                Наш менеджер свяжется с вами в течение <strong>15 минут</strong>
              </p>
              <div className="bg-blue-800/50 p-3 sm:p-4 rounded-xl border border-blue-400/30">
                <p className="text-blue-100 font-medium text-sm sm:text-base">
                  📞 Ожидайте звонка на номер: <br />
                  <span className="text-base sm:text-lg font-bold text-white">{formData.phone}</span>
                </p>
              </div>
            </div>
          ) : submitStatus === 'error' ? (
            <div className="text-center py-4 sm:py-8">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <X className="h-12 w-12 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Ошибка отправки</h3>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">
                Произошла ошибка при отправке заявки. Попробуйте еще раз или позвоните нам напрямую.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Попробовать снова
                </button>
                <a
                  href="tel:+77472199369"
                  className="block w-full bg-green-600 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
                >
                  📞 Позвонить: +7 (747) 219-93-69
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Product Data Display */}
              {productData && productData.item && (
                <div className="bg-blue-800/50 p-3 sm:p-4 rounded-xl border border-blue-400/30 mb-4">
                  <h4 className="text-white font-bold mb-2 text-sm sm:text-base">Выбранный товар:</h4>
                  <div className="text-blue-100 text-xs sm:text-sm space-y-1">
                    <p><strong>{productData.item.name}</strong> {productData.item.size}</p>
                    <p>Количество: {productData.quantity} шт.</p>
                    <p>Общий вес: {productData.totalWeight?.toFixed(2)} т</p>
                    <p>Стоимость: {Math.round(productData.totalPrice || 0).toLocaleString()} ₸</p>
                    <p>Филиал: {productData.item.branch}</p>
                  </div>
                </div>
              )}
              
              {/* Name Field */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Ваше имя *</label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-blue-300" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-blue-800/50 border-2 rounded-xl text-white placeholder-blue-200 focus:ring-4 focus:ring-orange-500/50 transition-all text-sm sm:text-lg ${
                      errors.name ? 'border-red-400 focus:border-red-400' : 'border-orange-400 focus:border-orange-300'
                    }`}
                    placeholder="Введите ваше имя"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-300 text-xs sm:text-sm mt-1 sm:mt-2">{errors.name}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Номер телефона *</label>
                <div className="relative">
                  <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 sm:h-5 w-4 sm:w-5 text-blue-300" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-blue-800/50 border-2 rounded-xl text-white placeholder-blue-200 focus:ring-4 focus:ring-orange-500/50 transition-all text-sm sm:text-lg ${
                      errors.phone ? 'border-red-400 focus:border-red-400' : 'border-orange-400 focus:border-orange-300'
                    }`}
                    placeholder="+7 (777) 777-77-77"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-300 text-xs sm:text-sm mt-1 sm:mt-2">{errors.phone}</p>
                )}
              </div>

              {/* Comment Field */}
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Комментарий</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 sm:h-5 w-4 sm:w-5 text-blue-300" />
                  <textarea
                    value={formData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    rows={3}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-blue-800/50 border-2 border-orange-400 rounded-xl text-white placeholder-blue-200 focus:ring-4 focus:ring-orange-500/50 focus:border-orange-300 transition-all resize-none text-sm sm:text-base"
                    placeholder="Дополнительная информация..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-xl transition-all disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Отправляем...
                  </span>
                ) : (
                  'Заказать звонок'
                )}
              </button>

              {/* Privacy Notice */}
              <p className="text-blue-200 text-xs sm:text-sm text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и политикой конфиденциальности
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallModal;