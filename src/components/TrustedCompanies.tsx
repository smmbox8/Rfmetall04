import React from 'react';
import { Building, Factory, Truck, Wrench } from 'lucide-react';
import { useCallModal } from '../contexts/CallModalContext';

const TrustedCompanies: React.FC = () => {
  const { openModal } = useCallModal();

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Нам доверяют <span className="text-blue-600">ведущие компании Казахстана</span>
          </h2>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Строительство */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Строительство</h3>
            <p className="text-gray-600 mb-4">
              Металлоконструкции, каркасы зданий, мосты
            </p>
            <div className="text-blue-600 font-bold text-lg mb-2">150+ объектов</div>
          </div>

          {/* Промышленность */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Factory className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Промышленность</h3>
            <p className="text-gray-600 mb-4">
              Машиностроение, нефтегаз, энергетика
            </p>
            <div className="text-blue-600 font-bold text-lg mb-2">80+ предприятий</div>
          </div>

          {/* Производство */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wrench className="h-10 w-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Производство</h3>
            <p className="text-gray-600 mb-4">
              Изготовление деталей, инструмента, оборудования
            </p>
            <div className="text-blue-600 font-bold text-lg mb-2">200+ заказов</div>
          </div>

          {/* Транспорт */}
          <div className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Truck className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Транспорт</h3>
            <p className="text-gray-600 mb-4">
              Железнодорожное и автомобильное машиностроение
            </p>
            <div className="text-blue-600 font-bold text-lg mb-2">45+ проектов</div>
          </div>
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 lg:p-12 text-white text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl mr-4">🏆</span>
            <h3 className="text-2xl lg:text-3xl font-bold">
              Более 500 успешных проектов за 5 лет работы
            </h3>
          </div>
          <p className="text-xl text-blue-100 mb-8">
            От небольших производств до крупнейших промышленных объектов Казахстана
          </p>
          <button
            onClick={() => openModal('Узнать о наших проектах')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            📋 Наша продукция
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;