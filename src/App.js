import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import HomePage from './components/HomePage';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import VideoConsultation from './components/VideoConsultation';
import SymptomChecker from './components/SymptomChecker';
import MedicineTracker from './components/MedicineTracker';
import HealthRecords from './components/HealthRecords';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const theme = {
  colors: {
    primary: '#2E8B57',
    secondary: '#4CAF50',
    accent: '#FFC107',
    background: '#F5F5F5',
    white: '#FFFFFF',
    text: '#333333',
    error: '#F44336'
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router basename="/nabha-telemedicine">
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/consultation/:id" element={<VideoConsultation />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/medicines" element={<MedicineTracker />} />
            <Route path="/records" element={<HealthRecords />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;