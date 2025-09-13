import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 20px 0;
`;

const Header = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 20px 0;
  margin-bottom: 30px;
`;

const HeaderContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SearchCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 12px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const PharmacyGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const PharmacyCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => props.theme.colors.primary};
`;

const PharmacyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const PharmacyInfo = styled.div`
  h3 {
    color: ${props => props.theme.colors.primary};
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  p {
    margin: 2px 0;
    color: #666;
    font-size: 14px;
  }
`;

const DistanceBadge = styled.span`
  background: ${props => props.theme.colors.accent};
  color: #333;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
`;

const MedicineList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const MedicineItem = styled.div`
  background: ${props => props.available ? '#E8F5E8' : '#FFEBEE'};
  border: 1px solid ${props => props.available ? '#C8E6C9' : '#FFCDD2'};
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MedicineInfo = styled.div`
  h4 {
    margin: 0 0 5px 0;
    color: #333;
    font-size: 16px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    color: #666;
  }
`;

const StatusBadge = styled.span`
  background: ${props => props.available ? '#4CAF50' : '#F44336'};
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  .icon {
    font-size: 60px;
    margin-bottom: 20px;
  }
`;

function MedicineTracker() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  // Mock data for pharmacies and medicine availability
  const [pharmacies] = useState([
    {
      id: 1,
      name: "City Medical Store",
      location: "Nabha Main Market",
      distance: "0.5 km",
      phone: "+91 98765-43210",
      lastUpdated: "2 hours ago",
      medicines: [
        { name: "Paracetamol 500mg", price: "₹15", available: true, stock: "50+ tablets" },
        { name: "Amoxicillin 250mg", price: "₹80", available: true, stock: "20+ capsules" },
        { name: "Cough Syrup", price: "₹45", available: false, stock: "Out of stock" },
        { name: "Aspirin 75mg", price: "₹25", available: true, stock: "30+ tablets" }
      ]
    },
    {
      id: 2,
      name: "Health Plus Pharmacy",
      location: "Khera Village",
      distance: "3.2 km",
      phone: "+91 98765-43211",
      lastUpdated: "1 hour ago",
      medicines: [
        { name: "Paracetamol 500mg", price: "₹12", available: true, stock: "100+ tablets" },
        { name: "Insulin Injection", price: "₹320", available: true, stock: "5 vials" },
        { name: "Blood pressure tablets", price: "₹150", available: false, stock: "Expected tomorrow" },
        { name: "Antacid Syrup", price: "₹35", available: true, stock: "15+ bottles" }
      ]
    },
    {
      id: 3,
      name: "Rural Health Pharmacy",
      location: "Dandian Village",
      distance: "5.8 km",
      phone: "+91 98765-43212",
      lastUpdated: "30 minutes ago",
      medicines: [
        { name: "Diabetes medication", price: "₹180", available: true, stock: "10+ strips" },
        { name: "Antibiotic Course", price: "₹120", available: true, stock: "8 courses" },
        { name: "Paracetamol 500mg", price: "₹18", available: false, stock: "Out of stock" },
        { name: "Heart medication", price: "₹250", available: true, stock: "5+ strips" }
      ]
    }
  ]);

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = searchTerm === '' || 
      pharmacy.medicines.some(medicine => 
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesLocation = filterLocation === 'all' || 
      pharmacy.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const locations = ['all', 'nabha', 'khera', 'dandian'];

  return (
    <Container>
      <LanguageSelector />
      
      <Header>
        <HeaderContent>
          <h1>💊 {t('medicineAvailability')}</h1>
          <BackButton to="/patient">← Back</BackButton>
        </HeaderContent>
      </Header>
      
      <Content>
        <SearchCard>
          <h3 style={{ marginBottom: '20px', color: '#2E8B57' }}>Search Medicines</h3>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder={t('searchMedicine') + "..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="nabha">Nabha</option>
              <option value="khera">Khera</option>
              <option value="dandian">Dandian</option>
            </FilterSelect>
          </SearchBar>
          
          <div style={{ 
            background: 'rgba(46,139,87,0.1)', 
            padding: '15px', 
            borderRadius: '8px',
            border: '1px solid rgba(46,139,87,0.2)'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>💡 Tip:</strong> Medicine availability is updated in real-time by pharmacies. 
              Call ahead to confirm availability before traveling.
            </p>
          </div>
        </SearchCard>
        
        <PharmacyGrid>
          {filteredPharmacies.length === 0 ? (
            <EmptyState>
              <div className="icon">🔍</div>
              <h3>No medicines found</h3>
              <p>Try adjusting your search terms or location filter</p>
            </EmptyState>
          ) : (
            filteredPharmacies.map(pharmacy => (
              <PharmacyCard key={pharmacy.id}>
                <PharmacyHeader>
                  <PharmacyInfo>
                    <h3>
                      🏪 {pharmacy.name}
                    </h3>
                    <p>📍 {pharmacy.location}</p>
                    <p>📞 {pharmacy.phone}</p>
                    <p>🕒 Updated: {pharmacy.lastUpdated}</p>
                  </PharmacyInfo>
                  <DistanceBadge>{pharmacy.distance}</DistanceBadge>
                </PharmacyHeader>
                
                <h4 style={{ marginBottom: '15px', color: '#333' }}>Available Medicines:</h4>
                <MedicineList>
                  {pharmacy.medicines
                    .filter(medicine => 
                      searchTerm === '' || 
                      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((medicine, index) => (
                    <MedicineItem key={index} available={medicine.available}>
                      <MedicineInfo>
                        <h4>{medicine.name}</h4>
                        <p>{medicine.price} • {medicine.stock}</p>
                      </MedicineInfo>
                      <StatusBadge available={medicine.available}>
                        {medicine.available ? t('available') : t('outOfStock')}
                      </StatusBadge>
                    </MedicineItem>
                  ))}
                </MedicineList>
                
                <div style={{ 
                  marginTop: '20px', 
                  padding: '15px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Need directions or want to call?
                  </span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      onClick={() => window.open(`tel:${pharmacy.phone}`)}
                    >
                      📞 Call
                    </button>
                    <button 
                      className="btn btn-primary"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                      onClick={() => window.open(`https://maps.google.com/search/${pharmacy.location}`)}
                    >
                      🗺️ Directions
                    </button>
                  </div>
                </div>
              </PharmacyCard>
            ))
          )}
        </PharmacyGrid>
        
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '15px', 
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#2E8B57', marginBottom: '15px' }}>📋 How to Use</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h4>🔍 Search</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Enter medicine name to find availability across all pharmacies
              </p>
            </div>
            <div>
              <h4>📞 Call Ahead</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Contact pharmacy to confirm availability and reserve medicines
              </p>
            </div>
            <div>
              <h4>🗺️ Get Directions</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Use Google Maps integration to navigate to the pharmacy
              </p>
            </div>
            <div>
              <h4>⏰ Real-time Updates</h4>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Medicine availability is updated regularly by pharmacy owners
              </p>
            </div>
          </div>
        </div>
      </Content>
    </Container>
  );
}

export default MedicineTracker;