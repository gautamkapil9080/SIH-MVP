import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2E8B57 0%, #4CAF50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
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

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || 'patient';
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate login process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      const userData = {
        id: '1',
        name: userType === 'doctor' ? 'Dr. Singh' : 'Patient Name',
        email: formData.email,
        type: userType
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'mock-jwt-token');
      
      // Redirect based on user type
      navigate(userType === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LanguageSelector />
      <BackLink to="/">← {t('back')}</BackLink>
      
      <LoginCard>
        <Title>
          {userType === 'doctor' ? t('doctorLogin') : t('patientLogin')}
        </Title>
        
        {error && <div className="error-message">{error}</div>}
        
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">{t('password')}</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? t('loading') : t('login')}
          </button>
        </Form>
        
        {userType === 'patient' && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/register">{t('newPatient')}</Link>
          </p>
        )}
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;