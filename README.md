# Nabha Telemedicine - Rural Healthcare Access MVP

## Problem Statement
Nabha and its surrounding rural areas face significant healthcare challenges with the local Civil Hospital operating at less than 50% staff capacity (only 11 doctors for 23 sanctioned posts). Patients from 173 villages travel long distances only to find specialists unavailable or medicines out of stock.

## Solution Overview
A simple, offline-capable telemedicine web application designed specifically for rural areas with limited internet connectivity.

## Features

### ✅ MVP Features Implemented
- **Patient Portal**: Register consultation requests with basic information
- **Doctor Dashboard**: View and respond to patient requests sorted by urgency
- **Medicine Availability Tracker**: Real-time medicine stock updates from local pharmacies
- **Symptom Checker**: Basic decision tree for common health symptoms
- **Multilingual Support**: English, Hindi (हिंदी), and Punjabi (ਪੰਜਾਬੀ)
- **Offline Functionality**: Works without internet using browser local storage
- **Progressive Web App**: Can be installed on mobile devices
- **Responsive Design**: Works on phones, tablets, and desktops

## Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (no frameworks for maximum compatibility)
- **Storage**: Browser LocalStorage for offline data persistence
- **PWA**: Web App Manifest for mobile installation
- **Languages**: Multi-language support with JSON translation files

## File Structure
```
nabha-telemedicine/
├── index.html          # Main application file
├── styles.css          # Styling and responsive design
├── app.js             # Core application logic
├── translations.js    # Multilingual support
├── manifest.json      # Progressive Web App manifest
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Quick Start

### 1. Opening the Application
Simply open `index.html` in any modern web browser:
- Double-click the `index.html` file, or
- Right-click and "Open with" your preferred browser

### 2. Testing the MVP
The application comes with sample data for testing:
- **Patient Portal**: Submit a test consultation request
- **Doctor Portal**: View and respond to patient requests
- **Pharmacy Portal**: Search for medicines (try "paracetamol")
- **Symptom Checker**: Answer symptom questions for health advice

### 3. Language Switching
Use the language selector in the top-right corner to switch between:
- English
- हिंदी (Hindi)
- ਪੰਜਾਬੀ (Punjabi)

## User Guide

### For Patients
1. **Registration**: Fill out the patient form with your details
2. **Symptoms**: Describe your health concerns
3. **Urgency**: Select appropriate urgency level
4. **Submit**: Your request is saved locally and sent to doctors
5. **Symptom Checker**: Use for immediate health guidance

### For Doctors
1. **Dashboard**: View all pending patient requests
2. **Priority**: Requests are sorted by urgency (Emergency → High → Medium → Low)
3. **Response**: Enter consultation notes and send responses
4. **Patient Info**: Access full patient details including contact information

### For Pharmacies
1. **Update Stock**: Add or update medicine availability
2. **Status Options**: Available, Limited Stock, Out of Stock
3. **Search Feature**: Patients can search for specific medicines
4. **Multi-Pharmacy**: Support for multiple pharmacy locations

## Key Features

### Offline Capability
- All data stored in browser's local storage
- Works without internet connection
- Sync indicator shows online/offline status
- Data persists between browser sessions

### Mobile-First Design
- Responsive layout for all screen sizes
- Touch-friendly interface
- Progressive Web App capabilities
- Can be "installed" on mobile home screen

### Rural-Specific Features
- **Low Bandwidth Optimized**: Minimal data usage
- **Simple Interface**: Easy to use for all literacy levels
- **Village-Based**: Specific fields for village information
- **Emergency Priority**: Special handling for urgent cases

## Sample Data
The MVP includes sample medicines for testing:
- Paracetamol (Available at multiple pharmacies)
- Amoxicillin (Limited stock)
- Omeprazole (Out of stock)
- Cough Syrup (Available)

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements (Roadmap)
1. **Real-time Communication**: Video consultations via WebRTC
2. **Backend Integration**: Server database with user authentication
3. **SMS Integration**: Notifications via SMS for areas with limited internet
4. **AI Symptom Checker**: Machine learning-based diagnosis assistance
5. **Digital Health Records**: Persistent patient medical history
6. **Prescription Management**: Digital prescription generation
7. **Payment Integration**: Online consultation fees
8. **Multi-hospital Network**: Connect multiple healthcare facilities

## Development Setup

### Local Development
1. Clone or download the project files
2. Open `index.html` in a web browser
3. For development, use a local server (optional):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

### Making Changes
- **UI Changes**: Edit `index.html` and `styles.css`
- **Functionality**: Modify `app.js`
- **Translations**: Update `translations.js`
- **PWA Settings**: Configure `manifest.json`

## Data Storage
All data is stored locally in the browser using LocalStorage:
- **Patient Requests**: `nabha_patients`
- **Medicine Stock**: `nabha_medicines`
- **Consultations**: `nabha_consultations`
- **Language Preference**: `selectedLanguage`

## Security Notes
- This MVP stores data locally in the browser
- No server-side authentication implemented
- Suitable for development and testing only
- Production deployment requires proper security measures

## Contributing
This is an MVP (Minimum Viable Product) designed for the Government of Punjab's healthcare initiative. For production use, additional development is recommended focusing on:
- Server-side backend
- User authentication
- Data encryption
- Regulatory compliance (HIPAA equivalent)

## License
Developed for the Government of Punjab - Department of Higher Education MedTech/BioTech/HealthTech initiative.

---

## Contact Information
**Problem Statement ID**: 25018  
**Organization**: Government of Punjab  
**Department**: Department of Higher Education  
**Category**: Software - MedTech/BioTech/HealthTech

---

*This MVP addresses the healthcare challenges in Nabha and surrounding 173 villages by providing accessible telemedicine services optimized for rural connectivity and usage patterns.*