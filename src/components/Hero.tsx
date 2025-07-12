import React from 'react';
import { Star, CheckCircle, DollarSign, Truck, Shield, Clock } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const Hero: React.FC = () => {
  const { openModal } = useCallModal();

  const handleOrderClick = () => {
    openModal('Заказ звонка!');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white overflow-hidden min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-40 h-40 bg-orange-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="text-center pt-20 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-3 mb-12">
            <span className="text-orange-300 font-semibold text-lg">⭐ Эксклюзивные поставки редкого металлопроката из России</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-white">
              НУЖЕН РЕДКИЙ
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent break-words">
              МЕТАЛЛОПРОКАТ?
            </span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-16">
            <p className="text-2xl text-blue-100 mb-4">
              <span className="font-bold">ТОО "АТЛАНТ МЕТАЛЛ"</span> — ваш надежный партнер в поставках
            </p>
            <p className="text-2xl">
              <span className="text-orange-300 font-bold">эксклюзивного металлопроката из России</span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="bg-gradient-to-r from-blue-800/50 to-purple-800/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-lg font-bold text-white">Привозим то, чего НЕТ в Казахстане</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Редкие марки стали, нестандартные размеры, специальные сплавы
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-orange-400 mr-3 flex-shrink-0" />
                  <span className="text-lg font-bold text-white">Доставка за 7-10 дней</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Прямые поставки с 15+ ведущих заводов России
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                  <span className="text-lg font-bold text-white">Экономия до 50%</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Без посредников, прямые заводские цены
                </p>
              </div>

              <div className="text-left">
                <div className="flex items-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" />
                  <span className="text-lg font-bold text-white">100% гарантия качества</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Полный пакет документов, сертификаты ГОСТ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;