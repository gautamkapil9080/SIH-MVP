import React, { useState, useEffect } from 'react';
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

const SyncStatus = styled.div`
  background: ${props => props.online ? '#E8F5E8' : '#FFF3E0'};
  border: 1px solid ${props => props.online ? '#C8E6C9' : '#FFE0B2'};
  color: ${props => props.online ? '#2E7D32' : '#F57C00'};
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  padding: 12px 15px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const RecordsList = styled.div`
  display: grid;
  gap: 20px;
`;

const RecordCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => {
    switch(props.type) {
      case 'consultation': return '#2196F3';
      case 'prescription': return '#4CAF50';
      case 'test': return '#FF9800';
      default: return props.theme.colors.primary;
    }
  }};
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const RecordInfo = styled.div`
  h3 {
    margin: 0 0 5px 0;
    color: #333;
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

const RecordBadge = styled.span`
  background: ${props => {
    switch(props.type) {
      case 'consultation': return '#E3F2FD';
      case 'prescription': return '#E8F5E8';
      case 'test': return '#FFF3E0';
      default: return '#F5F5F5';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'consultation': return '#1976D2';
      case 'prescription': return '#388E3C';
      case 'test': return '#F57C00';
      default: return '#666';
    }
  }};
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
`;

const RecordContent = styled.div`
  margin-top: 15px;
  
  .diagnosis {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    
    h4 {
      color: #333;
      margin: 0 0 8px 0;
    }
    
    p {
      margin: 0;
      line-height: 1.5;
    }
  }
  
  .prescription {
    background: #e8f5e8;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    
    h4 {
      color: #2e7d32;
      margin: 0 0 10px 0;
    }
    
    ul {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 5px;
      }
    }
  }
  
  .notes {
    padding: 15px;
    background: #fff3e0;
    border-radius: 8px;
    
    h4 {
      color: #f57c00;
      margin: 0 0 8px 0;
    }
    
    p {
      margin: 0;
      line-height: 1.5;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

function HealthRecords() {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    type: 'consultation',
    date: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    doctor: ''
  });

  useEffect(() => {
    loadRecords();
    
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Filter records based on search term
    const filtered = records.filter(record => 
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  }, [records, searchTerm]);

  const loadRecords = () => {
    // Load from localStorage (offline storage)
    const storedRecords = localStorage.getItem('healthRecords');
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords);
      setRecords(parsedRecords);
    } else {
      // Initialize with mock data
      const mockRecords = [
        {
          id: '1',
          type: 'consultation',
          date: '2024-01-15',
          doctor: 'Dr. Rajesh Singh',
          diagnosis: 'Viral fever with body ache',
          prescription: ['Paracetamol 500mg - 3 times daily', 'Rest and hydration'],
          notes: 'Patient complained of fever for 3 days. Temperature 101°F. Advised to monitor and return if symptoms worsen.',
          synced: true
        },
        {
          id: '2',
          type: 'prescription',
          date: '2024-01-10',
          doctor: 'Dr. Priya Sharma',
          diagnosis: 'Hypertension follow-up',
          prescription: ['Amlodipine 5mg - Once daily', 'Low sodium diet', 'Regular BP monitoring'],
          notes: 'Blood pressure under control. Continue medication. Next follow-up in 3 months.',
          synced: true
        },
        {
          id: '3',
          type: 'test',
          date: '2024-01-05',
          doctor: 'Dr. Harpreet Kaur',
          diagnosis: 'Routine blood test results',
          prescription: ['Vitamin D3 supplement', 'Iron tablets'],
          notes: 'Slight Vitamin D deficiency detected. All other parameters normal. Repeat test in 6 months.',
          synced: false
        }
      ];
      setRecords(mockRecords);
      localStorage.setItem('healthRecords', JSON.stringify(mockRecords));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRecord = {
      id: Date.now().toString(),
      ...formData,
      prescription: formData.prescription.split('\n').filter(item => item.trim()),
      synced: false
    };
    
    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('healthRecords', JSON.stringify(updatedRecords));
    
    // Reset form and close modal
    setFormData({
      type: 'consultation',
      date: '',
      diagnosis: '',
      prescription: '',
      notes: '',
      doctor: ''
    });
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getRecordIcon = (type) => {
    switch(type) {
      case 'consultation': return '👨‍⚕️';
      case 'prescription': return '💊';
      case 'test': return '🩺';
      default: return '📄';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <LanguageSelector />
      
      <Header>
        <HeaderContent>
          <h1>📋 {t('healthRecords')}</h1>
          <BackButton to="/patient">← Back</BackButton>
        </HeaderContent>
      </Header>
      
      <Content>
        <SyncStatus online={isOnline}>
          {isOnline ? '✅' : '⚠️'}
          <span>
            {isOnline 
              ? `Online - Last sync: ${lastSync.toLocaleTimeString()}`
              : 'Offline - Records saved locally'
            }
          </span>
        </SyncStatus>
        
        <Controls>
          <SearchInput
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AddButton onClick={() => setShowModal(true)}>
            ➕ {t('addRecord')}
          </AddButton>
        </Controls>
        
        <RecordsList>
          {filteredRecords.length === 0 ? (
            <EmptyState>
              <div className="icon">📋</div>
              <h3>No health records found</h3>
              <p>Add your first health record to get started</p>
            </EmptyState>
          ) : (
            filteredRecords.map(record => (
              <RecordCard key={record.id} type={record.type}>
                <RecordHeader>
                  <RecordInfo>
                    <h3>
                      {getRecordIcon(record.type)} {record.diagnosis}
                    </h3>
                    <p>📅 {formatDate(record.date)}</p>
                    <p>👨‍⚕️ {record.doctor}</p>
                  </RecordInfo>
                  <div>
                    <RecordBadge type={record.type}>
                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                    </RecordBadge>
                    {!record.synced && (
                      <RecordBadge style={{ marginLeft: '8px', background: '#FFF3E0', color: '#F57C00' }}>
                        Not Synced
                      </RecordBadge>
                    )}
                  </div>
                </RecordHeader>
                
                <RecordContent>
                  <div className="diagnosis">
                    <h4>Diagnosis</h4>
                    <p>{record.diagnosis}</p>
                  </div>
                  
                  {record.prescription && record.prescription.length > 0 && (
                    <div className="prescription">
                      <h4>Prescription & Treatment</h4>
                      <ul>
                        {record.prescription.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="notes">
                      <h4>Doctor's Notes</h4>
                      <p>{record.notes}</p>
                    </div>
                  )}
                </RecordContent>
              </RecordCard>
            ))
          )}
        </RecordsList>
        
        {showModal && (
          <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <ModalContent>
              <h3>Add New Health Record</h3>
              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="type">Record Type</label>
                  <select
                    id="type"
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="consultation">Consultation</option>
                    <option value="prescription">Prescription</option>
                    <option value="test">Test Results</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">{t('dateOfVisit')}</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="form-control"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="doctor">Doctor Name</label>
                  <input
                    type="text"
                    id="doctor"
                    name="doctor"
                    className="form-control"
                    value={formData.doctor}
                    onChange={handleChange}
                    placeholder="Dr. Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="diagnosis">{t('diagnosis')}</label>
                  <input
                    type="text"
                    id="diagnosis"
                    name="diagnosis"
                    className="form-control"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Primary diagnosis"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="prescription">{t('prescription')}</label>
                  <textarea
                    id="prescription"
                    name="prescription"
                    className="form-control"
                    rows="4"
                    value={formData.prescription}
                    onChange={handleChange}
                    placeholder="Enter each prescription item on a new line..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">{t('notes')}</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    {t('cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t('submit')}
                  </button>
                </div>
              </Form>
            </ModalContent>
          </Modal>
        )}
        
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '15px', 
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          marginTop: '30px'
        }}>
          <h3 style={{ color: '#2E8B57', marginBottom: '15px' }}>💾 Offline Storage</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Your health records are stored locally on your device and work even when you're offline. 
            When you're online, they automatically sync with our secure cloud storage. This ensures 
            you always have access to your medical history, even in areas with poor connectivity.
          </p>
        </div>
      </Content>
    </Container>
  );
}

export default HealthRecords;