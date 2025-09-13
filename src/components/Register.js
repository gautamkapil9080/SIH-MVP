import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageSelector from './LanguageSelector';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2E8B57 0%, #4CAF50 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 0;
`;

const RegisterCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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
  gap: 15px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    village: '',
    age: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock registration success
      setSuccess('Registration successful! Please login to continue.');
      
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate('/login?type=patient');
      }, 2000);
      
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <LanguageSelector />
      <BackLink to="/">← {t('back')}</BackLink>
      
      <RegisterCard>
        <Title>{t('register')}</Title>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">{t('name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
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
              minLength="6"
            />
          </div>
          
          <Row>
            <div className="form-group">
              <label htmlFor="phone">{t('phone')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="village">{t('village')}</label>
              <input
                type="text"
                id="village"
                name="village"
                className="form-control"
                value={formData.village}
                onChange={handleChange}
                required
              />
            </div>
          </Row>
          
          <Row>
            <div className="form-group">
              <label htmlFor="age">{t('age')}</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="150"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">{t('gender')}</label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t('gender')}...</option>
                <option value="male">{t('male')}</option>
                <option value="female">{t('female')}</option>
              </select>
            </div>
          </Row>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? t('loading') : t('register')}
          </button>
        </Form>
        
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account? <Link to="/login?type=patient">{t('login')}</Link>
        </p>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;