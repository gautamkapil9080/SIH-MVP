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

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(Link)`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 10px 0;
  font-size: 1.4rem;
`;

const CardDescription = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.5;
`;

const StatusBar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    margin: 0 20px 30px 20px;
  }
`;

function PatientDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login?type=patient');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
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

  const features = [
    {
      to: '/consultation/new',
      icon: '📹',
      title: t('consultation'),
      description: 'Connect with doctors through video calls',
      color: '#4CAF50'
    },
    {
      to: '/symptoms',
      icon: '🔍',
      title: t('symptoms'),
      description: 'AI-powered symptom assessment tool',
      color: '#FF9800'
    },
    {
      to: '/medicines',
      icon: '💊',
      title: t('medicines'),
      description: 'Check medicine availability in nearby pharmacies',
      color: '#2196F3'
    },
    {
      to: '/records',
      icon: '📋',
      title: t('records'),
      description: 'View and manage your health records offline',
      color: '#9C27B0'
    }
  ];

  return (
    <DashboardContainer>
      <LanguageSelector />
      
      <Header>
        <HeaderContent>
          <WelcomeText>
            <h1>Welcome, {user.name}!</h1>
            <p>Your health, our priority</p>
          </WelcomeText>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </HeaderContent>
      </Header>

      <StatusBar className="container">
        <h3 style={{ marginBottom: '15px', color: '#2E8B57' }}>Quick Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <strong>Village:</strong> {user.village || 'Nabha'}
          </div>
          <div>
            <strong>Network Status:</strong> <span style={{ color: '#4CAF50' }}>Online</span>
          </div>
          <div>
            <strong>Last Sync:</strong> Just now
          </div>
          <div>
            <strong>Available Doctors:</strong> 3 online
          </div>
        </div>
      </StatusBar>

      <Grid>
        {features.map((feature, index) => (
          <FeatureCard key={index} to={feature.to}>
            <CardIcon color={feature.color}>
              {feature.icon}
            </CardIcon>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </FeatureCard>
        ))}
      </Grid>
    </DashboardContainer>
  );
}

export default PatientDashboard;