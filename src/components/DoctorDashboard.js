import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';

const DashboardContainer = styled.div`
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.div`
  h1 {
    font-size: 2rem;
    margin: 0 0 5px 0;
  }
  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.online ? '#4CAF50' : '#F44336'};
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 20px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 20px 0;
  font-size: 1.4rem;
`;

const PatientItem = styled.div`
  padding: 15px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PatientInfo = styled.div`
  h4 {
    margin: 0 0 5px 0;
    color: ${props => props.theme.colors.text};
  }
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
`;

const UrgencyBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch(props.level) {
      case 'high': return '#FFEBEE';
      case 'medium': return '#FFF3E0';
      default: return '#E8F5E8';
    }
  }};
  color: ${props => {
    switch(props.level) {
      case 'high': return '#C62828';
      case 'medium': return '#F57C00';
      default: return '#2E7D32';
    }
  }};
`;

const ActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
  
  &:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const StatCard = styled.div`
  background: ${props => props.color || '#f8f9fa'};
  color: ${props => props.textColor || '#333'};
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 15px;
  
  h3 {
    font-size: 2rem;
    margin: 0 0 5px 0;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
  }
`;

function DoctorDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Mock data for waiting patients
  const [waitingPatients] = useState([
    { id: 1, name: 'Rajesh Kumar', village: 'Khera', urgency: 'high', symptoms: 'Chest pain, difficulty breathing', waitTime: '15 min' },
    { id: 2, name: 'Priya Singh', village: 'Dandian', urgency: 'medium', symptoms: 'Fever, cough for 3 days', waitTime: '8 min' },
    { id: 3, name: 'Harpreet Kaur', village: 'Bhaini', urgency: 'low', symptoms: 'Headache, general checkup', waitTime: '5 min' },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.type === 'doctor') {
        setUser(user);
      } else {
        navigate('/login?type=doctor');
      }
    } else {
      navigate('/login?type=doctor');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleStartConsultation = (patientId) => {
    navigate(`/consultation/${patientId}`);
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  if (!user) {
    return (
      <DashboardContainer>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <LanguageSelector />
      
      <Header>
        <HeaderContent>
          <WelcomeText>
            <h1>Dr. {user.name}</h1>
            <p>Nabha Civil Hospital</p>
          </WelcomeText>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StatusToggle>
              <StatusIndicator online={isOnline} />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
              <button 
                onClick={toggleOnlineStatus}
                style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Toggle
              </button>
            </StatusToggle>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </div>
        </HeaderContent>
      </Header>

      <MainContent>
        <div>
          <Section>
            <SectionTitle>Waiting Patients ({waitingPatients.length})</SectionTitle>
            {waitingPatients.map(patient => (
              <PatientItem key={patient.id}>
                <PatientInfo>
                  <h4>{patient.name}</h4>
                  <p>{patient.village} • {patient.symptoms} • Waiting: {patient.waitTime}</p>
                </PatientInfo>
                <div>
                  <UrgencyBadge level={patient.urgency}>
                    {patient.urgency.toUpperCase()}
                  </UrgencyBadge>
                  <ActionButton onClick={() => handleStartConsultation(patient.id)}>
                    Start Call
                  </ActionButton>
                </div>
              </PatientItem>
            ))}
          </Section>
        </div>

        <div>
          <Section>
            <SectionTitle>Today's Statistics</SectionTitle>
            <StatCard color="#4CAF50" textColor="white">
              <h3>12</h3>
              <p>Consultations</p>
            </StatCard>
            <StatCard color="#2196F3" textColor="white">
              <h3>3</h3>
              <p>Waiting</p>
            </StatCard>
            <StatCard color="#FF9800" textColor="white">
              <h3>2.5h</h3>
              <p>Avg. Wait Time</p>
            </StatCard>
            <StatCard>
              <h3>8</h3>
              <p>Villages Served</p>
            </StatCard>
          </Section>

          <Section style={{ marginTop: '20px' }}>
            <SectionTitle>Quick Actions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/records" style={{ textDecoration: 'none' }}>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  📋 Patient Records
                </button>
              </Link>
              <Link to="/medicines" style={{ textDecoration: 'none' }}>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  💊 Medicine Status
                </button>
              </Link>
            </div>
          </Section>
        </div>
      </MainContent>
    </DashboardContainer>
  );
}

export default DoctorDashboard;