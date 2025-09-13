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
  max-width: 800px;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 20px 0;
  text-align: center;
`;

const SymptomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const SymptomButton = styled.button`
  padding: 15px;
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : '#E0E0E0'};
  background: ${props => props.selected ? props.theme.colors.primary : 'white'};
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SeveritySection = styled.div`
  margin: 30px 0;
`;

const SeveritySlider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #E0E0E0;
  outline: none;
  margin: 10px 0;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
`;

const ResultCard = styled.div`
  background: ${props => {
    switch(props.severity) {
      case 'high': return '#FFEBEE';
      case 'medium': return '#FFF3E0';
      default: return '#E8F5E8';
    }
  }};
  border: 1px solid ${props => {
    switch(props.severity) {
      case 'high': return '#FFCDD2';
      case 'medium': return '#FFE0B2';
      default: return '#C8E6C9';
    }
  }};
  padding: 25px;
  border-radius: 15px;
  margin-top: 30px;
`;

const RecommendationList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 15px 0 0 0;
  
  li {
    padding: 10px 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    &::before {
      content: "•";
      color: ${props => props.theme.colors.primary};
      font-weight: bold;
      margin-right: 10px;
    }
  }
`;

function SymptomChecker() {
  const { t } = useTranslation();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const symptoms = [
    { id: 'fever', name: t('fever'), icon: '🌡️' },
    { id: 'cough', name: t('cough'), icon: '🤧' },
    { id: 'headache', name: t('headache'), icon: '🤕' },
    { id: 'bodyache', name: t('bodyache'), icon: '💪' },
    { id: 'nausea', name: t('nausea'), icon: '🤢' },
    { id: 'breathless', name: 'Shortness of breath', icon: '💨' },
    { id: 'chestpain', name: 'Chest pain', icon: '💔' },
    { id: 'diarrhea', name: 'Diarrhea', icon: '🚽' },
    { id: 'vomiting', name: 'Vomiting', icon: '🤮' },
    { id: 'fatigue', name: 'Fatigue', icon: '😴' },
    { id: 'dizziness', name: 'Dizziness', icon: '😵‍💫' },
    { id: 'rash', name: 'Skin rash', icon: '🔴' }
  ];

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    setLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis based on symptoms and severity
    const analysisResult = analyzeSymptoms(selectedSymptoms, severity);
    setResult(analysisResult);
    setLoading(false);
  };

  const analyzeSymptoms = (symptoms, severityLevel) => {
    // Simple rule-based system (in real app, this would be AI-powered)
    let urgency = 'low';
    let recommendations = [];
    let possibleConditions = [];

    // High priority symptoms
    if (symptoms.includes('chestpain') || symptoms.includes('breathless')) {
      urgency = 'high';
      recommendations.push('Seek immediate medical attention');
      recommendations.push('Consider visiting emergency services');
      possibleConditions.push('Heart-related issue', 'Respiratory problem');
    }
    
    // Fever-related conditions
    if (symptoms.includes('fever')) {
      if (symptoms.includes('cough') || symptoms.includes('bodyache')) {
        urgency = urgency === 'high' ? 'high' : 'medium';
        possibleConditions.push('Viral infection', 'Flu', 'COVID-19');
        recommendations.push('Rest and stay hydrated');
        recommendations.push('Monitor temperature regularly');
        if (severityLevel >= 7) {
          recommendations.push('Consult doctor within 24 hours');
        }
      }
    }
    
    // Gastrointestinal symptoms
    if (symptoms.includes('nausea') || symptoms.includes('vomiting') || symptoms.includes('diarrhea')) {
      possibleConditions.push('Gastroenteritis', 'Food poisoning');
      recommendations.push('Stay hydrated with ORS');
      recommendations.push('Eat light, easily digestible foods');
    }
    
    // General recommendations
    if (urgency === 'low') {
      recommendations.push('Monitor symptoms for 24-48 hours');
      recommendations.push('Rest and maintain good hydration');
      recommendations.push('Consult doctor if symptoms worsen');
    }
    
    if (urgency === 'medium') {
      recommendations.push('Schedule consultation with doctor within 1-2 days');
    }

    return {
      urgency,
      possibleConditions,
      recommendations,
      confidence: Math.floor(Math.random() * 20) + 75 // Mock confidence 75-95%
    };
  };

  const getSeverityText = (level) => {
    if (level <= 3) return 'Mild';
    if (level <= 6) return 'Moderate';
    if (level <= 8) return 'Severe';
    return 'Very Severe';
  };

  const getSeverityColor = (urgency) => {
    switch(urgency) {
      case 'high': return '#C62828';
      case 'medium': return '#F57C00';
      default: return '#2E7D32';
    }
  };

  return (
    <Container>
      <LanguageSelector />
      
      <Header>
        <HeaderContent>
          <h1>🔍 {t('symptomChecker')}</h1>
          <BackButton to="/patient">← Back</BackButton>
        </HeaderContent>
      </Header>
      
      <Content>
        <Card>
          <Title>{t('selectSymptoms')}</Title>
          
          <SymptomGrid>
            {symptoms.map(symptom => (
              <SymptomButton
                key={symptom.id}
                selected={selectedSymptoms.includes(symptom.id)}
                onClick={() => toggleSymptom(symptom.id)}
              >
                <span>{symptom.icon}</span>
                {symptom.name}
              </SymptomButton>
            ))}
          </SymptomGrid>
          
          <SeveritySection>
            <h3>How severe are your symptoms? ({getSeverityText(severity)})</h3>
            <SeveritySlider
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
              <span>Mild</span>
              <span>Very Severe</span>
            </div>
          </SeveritySection>
          
          <button
            className="btn btn-primary"
            onClick={checkSymptoms}
            disabled={loading || selectedSymptoms.length === 0}
            style={{ width: '100%', padding: '15px', fontSize: '18px' }}
          >
            {loading ? 'Analyzing...' : `${t('checkSymptoms')} (${selectedSymptoms.length})`}
          </button>
        </Card>
        
        {result && (
          <ResultCard severity={result.urgency}>
            <h3 style={{ 
              color: getSeverityColor(result.urgency),
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {result.urgency === 'high' && '🚨'}
              {result.urgency === 'medium' && '⚠️'}
              {result.urgency === 'low' && '✅'}
              {t('recommendation')} - {result.urgency.toUpperCase()} Priority
            </h3>
            
            <p><strong>Analysis Confidence:</strong> {result.confidence}%</p>
            
            {result.possibleConditions.length > 0 && (
              <div style={{ margin: '20px 0' }}>
                <h4>Possible Conditions:</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {result.possibleConditions.map((condition, index) => (
                    <span key={index} style={{
                      background: 'rgba(255,255,255,0.7)',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      fontSize: '14px'
                    }}>
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <h4>Recommendations:</h4>
            <RecommendationList>
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </RecommendationList>
            
            {result.urgency !== 'low' && (
              <Link to="/consultation/new" style={{ textDecoration: 'none', marginTop: '20px', display: 'block' }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  📹 Book Video Consultation
                </button>
              </Link>
            )}
          </ResultCard>
        )}
        
        <div style={{ 
          background: 'rgba(255,193,7,0.1)', 
          padding: '20px', 
          borderRadius: '10px', 
          border: '1px solid rgba(255,193,7,0.3)',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <p><strong>⚠️ Disclaimer:</strong> This symptom checker is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare professional for accurate diagnosis and treatment.</p>
        </div>
      </Content>
    </Container>
  );
}

export default SymptomChecker;