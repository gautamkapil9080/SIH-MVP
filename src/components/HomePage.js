import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2E8B57 0%, #4CAF50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ContentCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 90%;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.text};
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  
  .btn {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    border-radius: 10px;
  }
`;

const FeatureList = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &::before {
    content: "✓";
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
    margin-right: 10px;
  }
`;

function HomePage() {
  const { t } = useTranslation();

  return (
    <HomeContainer>
      <LanguageSelector />
      <ContentCard>
        <Title>{t('welcome')}</Title>
        <Subtitle>{t('subtitle')}</Subtitle>
        
        <ButtonGroup>
          <StyledLink to="/register">
            <button className="btn btn-primary">
              {t('getStarted')}
            </button>
          </StyledLink>
          
          <StyledLink to="/login?type=patient">
            <button className="btn btn-secondary">
              {t('patientLogin')}
            </button>
          </StyledLink>
          
          <StyledLink to="/login?type=doctor">
            <button className="btn btn-outline">
              {t('doctorLogin')}
            </button>
          </StyledLink>
        </ButtonGroup>
        
        <FeatureList>
          <h3>Key Features:</h3>
          <FeatureItem>Multilingual video consultations</FeatureItem>
          <FeatureItem>Offline health records</FeatureItem>
          <FeatureItem>Real-time medicine availability</FeatureItem>
          <FeatureItem>AI-powered symptom checker</FeatureItem>
          <FeatureItem>Low-bandwidth optimized</FeatureItem>
        </FeatureList>
        
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Serving 173+ villages in Nabha region
        </p>
      </ContentCard>
    </HomeContainer>
  );
}

export default HomePage;