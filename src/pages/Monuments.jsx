import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { API_ENDPOINTS } from '../config/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon for World Wonders (gold/yellow marker)
const worldWonderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Regular icon for normal monuments (blue marker)
const regularIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Monuments = () => {
  const { t } = useLanguage();
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedMonument, setSelectedMonument] = useState(null);
  const [monuments, setMonuments] = useState([]);
  const [filteredMonuments, setFilteredMonuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch monuments from API
    fetchMonuments();
  }, []);

  const fetchMonuments = async () => {
    try {
      // Fetch ALL monuments from Laravel API (without pagination)
      const response = await fetch(`${API_ENDPOINTS.monuments}?per_page=1000`);
      const result = await response.json();

      // Laravel returns paginated data with 'data' property
      const apiData = result.data || result;

      // Transform API data to match component structure
      const transformedMonuments = apiData.map(monument => ({
        id: monument.id,
        title: monument.title || 'Untitled Monument',
        zone: monument.zone || 'Central',
        description: monument.description || 'No description available',
        image: monument.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
        latitude: parseFloat(monument.latitude) || 0,
        longitude: parseFloat(monument.longitude) || 0,
        location: monument.location || monument.zone,
        history: monument.history || monument.description || 'No history available',
        content: monument.content || monument.history || monument.description || 'No content available',
        is_world_wonder: monument.is_world_wonder === 1 || monument.is_world_wonder === true,
      }));

      console.log('✅ Fetched monuments from API:', transformedMonuments);
      console.log('📊 Total monuments:', transformedMonuments.length);
      setMonuments(transformedMonuments);
      setFilteredMonuments(transformedMonuments);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching monuments:', error);
      // Fallback to mock data if API fails
      const mockData = [
        {
          id: 1,
          title: 'Taj Mahal',
          zone: 'South',
          description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, India.',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500',
          latitude: 27.1751,
          longitude: 78.0421,
          history: 'Built between 1632 and 1653 by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
        },
        {
          id: 2,
          title: 'Great Wall of China',
          zone: 'East',
          description: 'A series of fortifications made of stone, brick, tamped earth, and other materials.',
          image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500',
          latitude: 40.4319,
          longitude: 116.5704,
          history: 'Built over centuries by various Chinese dynasties to protect against invasions.',
        },
        {
          id: 3,
          title: 'Colosseum',
          zone: 'West',
          description: 'An oval amphitheatre in the centre of Rome, Italy.',
          image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500',
          latitude: 41.8902,
          longitude: 12.4922,
          history: 'Built in 70-80 AD, it could hold between 50,000 and 80,000 spectators.',
        },
        {
          id: 4,
          title: 'Machu Picchu',
          zone: 'Central',
          description: 'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.',
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500',
          latitude: -13.1631,
          longitude: -72.5450,
          history: 'Built around 1450 at the height of the Inca Empire.',
        },
      ];

      setMonuments(mockData);
      setFilteredMonuments(mockData);
      setLoading(false);
    }
  };

  const zones = ['all', 'East', 'West', 'North', 'South', 'Central'];

  useEffect(() => {
    if (selectedZone === 'all') {
      setFilteredMonuments(monuments);
    } else {
      setFilteredMonuments(monuments.filter(m => m.zone === selectedZone));
    }
  }, [selectedZone, monuments]);

  // Filter World Wonders from monuments (from database)
  const worldWonders = monuments.filter(m => m.is_world_wonder === 1 || m.is_world_wonder === true);

  console.log('🌟 World Wonders from database:', worldWonders);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.monuments.title}</h1>
          <p className="text-xl text-primary-100">
            {t.monuments.subtitle}
          </p>
        </div>
      </section>

      {/* Zone Filter */}
      <section className="bg-white shadow-sm sticky top-20 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedZone === zone
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {zone === 'all' ? t.monuments.allZones : (t.monuments.zones[zone] || zone)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Monument Locations</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '500px' }}>
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Show ALL monuments on map, not just filtered ones */}
              {monuments.map((monument) => (
                <Marker
                  key={monument.id}
                  position={[monument.latitude, monument.longitude]}
                  icon={monument.is_world_wonder ? worldWonderIcon : regularIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{monument.title}</h3>
                        {monument.is_world_wonder && <span className="text-xl">⭐</span>}
                      </div>
                      <img
                        src={monument.image}
                        alt={monument.title}
                        className="w-48 h-32 object-cover rounded mb-2"
                      />
                      <p className="text-sm text-gray-600">{monument.zone} Zone</p>
                      {monument.is_world_wonder && (
                        <p className="text-xs text-yellow-600 font-semibold mt-1">🌟 World Wonder</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Monuments Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedZone === 'all' ? 'All Monuments' : `${selectedZone} Zone Monuments`}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMonuments.map((monument) => (
                <div
                  key={monument.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => window.location.href = `/monuments/${monument.id}`}
                >
                  <img
                    src={monument.image}
                    alt={monument.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{monument.title}</h3>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {monument.zone}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{monument.description}</p>
                    <button className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                      {t.common.readMore} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* World Wonders Section */}
      <section id="wonders" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.monuments.worldWonders}</h2>
            <p className="text-xl text-gray-600">
              {t.monuments.worldWondersDesc}
            </p>
          </div>

          {worldWonders.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {worldWonders.map((wonder) => (
                <div
                  key={wonder.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => window.location.href = `/monuments/${wonder.id}`}
                >
                  <img
                    src={wonder.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={wonder.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">⭐</span>
                      <h3 className="text-lg font-bold text-gray-900">{wonder.title}</h3>
                    </div>
                    <p className="text-sm text-primary-600 mb-3">📍 {wonder.location || wonder.zone}</p>
                    <p className="text-gray-600 text-sm line-clamp-3">{wonder.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t.monuments.noWonders}</p>
            </div>
          )}
        </div>
      </section>

      {/* Monument Detail Modal */}
      {selectedMonument && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMonument(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedMonument.image}
              alt={selectedMonument.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">{selectedMonument.title}</h2>
                <button
                  onClick={() => setSelectedMonument(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                {selectedMonument.zone} Zone
              </span>
              <p className="text-gray-700 mb-6 leading-relaxed">{selectedMonument.description}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-3">History</h3>
              <p className="text-gray-700 leading-relaxed">{selectedMonument.history}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monuments;

