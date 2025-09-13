# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Open directly in browser
# Double-click index.html or open in browser

# For development server (optional)
python -m http.server 8000
# Or with Node.js
npx serve .
# Or with PHP
php -S localhost:8000
```

### Testing the Application
```bash
# No formal test suite - this is an MVP
# Test by opening index.html and verifying:
# - Patient portal form submission
# - Doctor dashboard displays requests  
# - Pharmacy search (try "paracetamol")
# - Language switching (English/Hindi/Telugu)
# - Offline functionality
```

### Development Tools
```bash
# For linting/formatting (if adding development tools)
# This project currently uses vanilla HTML/CSS/JS without build tools

# To add development server with live reload:
npx live-server .
# Or
npx http-server -p 8000 -c-1
```

## Architecture Overview

### Application Structure
This is a **client-side Progressive Web Application (PWA)** built with vanilla web technologies:

- **Single Page Application**: All functionality contained in one HTML file with section-based navigation
- **Offline-First Design**: Uses LocalStorage for data persistence, works without internet
- **Multi-language Support**: Comprehensive translation system for English, Hindi, and Telugu
- **Enhanced Doctor Dashboard**: Comprehensive medical features including patient history, digital prescriptions, and analytics
- **Advanced Symptom Checker**: Multi-mode symptom assessment with emergency detection and quick category checks
- **Mobile-First PWA**: Responsive design with web app manifest for mobile installation

### Key Components

**Core Files:**
- `index.html` - Main application with all UI sections
- `app.js` - Core application logic, data management, offline handling
- `translations.js` - Complete multilingual translation system
- `styles.css` - Responsive styling and mobile-first design
- `manifest.json` - PWA configuration for mobile installation

### Data Architecture

**LocalStorage Schema:**
```javascript
// Storage keys used throughout the application
STORAGE_KEYS = {
    PATIENTS: 'nabha_patients',      // Patient consultation requests
    MEDICINES: 'nabha_medicines',    // Medicine availability data
    CONSULTATIONS: 'nabha_consultations', // Doctor responses
    OFFLINE_MODE: 'nabha_offline_mode'     // Offline status
}
```

**Data Flow:**
1. **Patient Portal** → Submit requests → LocalStorage (`nabha_patients`)
2. **Doctor Portal** → View requests → Add responses → Update patient status
3. **Pharmacy Portal** → Update medicine stock → LocalStorage (`nabha_medicines`)
4. **Symptom Checker** → Decision tree logic → Health recommendations

### Application Sections

**Patient Portal (`showSection('patient')`):**
- Form-based patient registration with village-specific fields
- Urgency-based prioritization (Emergency > High > Medium > Low)
- Offline-capable data submission to LocalStorage

**Doctor Dashboard (`showSection('doctor')`):**
- **Multi-tab Interface**: Patient requests, history, prescriptions, and analytics
- **Advanced Filtering**: Filter by urgency level and search by patient details
- **Patient History**: Comprehensive consultation history tracking
- **Digital Prescriptions**: Generate and manage digital prescriptions with medicine details
- **Medical Analytics**: Real-time analytics including consultation stats, emergency cases, and common symptoms
- **Enhanced Response System**: Inline consultation notes with patient history access

**Pharmacy Portal (`showSection('pharmacy')`):**
- Two-tab interface: medicine search and stock updates
- Multi-pharmacy support with availability status
- Real-time search functionality

**Symptom Checker (`showSection('symptoms')`):**
- **Multi-Mode Interface**: Guided assessment, quick check, and emergency signs
- **Comprehensive Symptom Tree**: Covers respiratory, digestive, neurological, cardiovascular, musculoskeletal, skin, mental health, and general symptoms
- **Emergency Detection**: Immediate identification of life-threatening symptoms
- **Quick Category Check**: Instant advice for specific symptom categories
- **Enhanced Decision Tree**: 60+ symptom pathways with detailed medical advice
- **Urgency Classification**: Emergency, high, medium, and low priority recommendations

### Translation System

**Language Support:**
- English (`en`), Hindi (`hi`), Telugu (`te`)
- Runtime language switching with persistent storage
- Comprehensive translation coverage for all UI elements including enhanced features
- Special handling for form placeholders, medical terminology, and dynamic content
- Support for complex medical translations and emergency terminology

**Key Translation Functions:**
- `t(key)` - Get translated text for current language
- `changeLanguage(lang)` - Switch language and update UI
- `updatePageTexts()` - Re-render all translatable elements

### Offline Functionality

**Offline Strategy:**
- Full offline operation using LocalStorage
- Real-time online/offline status detection
- Visual offline indicator
- Automatic data sync when connection restored

**Implementation Details:**
- Uses `navigator.onLine` for connectivity detection
- Event listeners for `online`/`offline` events
- All data operations work independently of network status

## Rural Healthcare Context

This application is specifically designed for **rural healthcare access in Punjab, India**:

### Design Constraints
- **Low Bandwidth Optimization**: Minimal external dependencies
- **Offline-First**: Works without internet connectivity
- **Multi-lingual**: English, Hindi, and Telugu support
- **Village-Centric**: Specific fields for village location data
- **Emergency Handling**: Priority system for urgent medical cases

### Target Users
- **Patients**: Residents from 173 villages around Nabha seeking medical consultation
- **Doctors**: Healthcare providers at Civil Hospital with limited staff
- **Pharmacies**: Local medicine suppliers tracking stock availability

### Sample Data
The application includes sample medicines for testing:
- Paracetamol (Available)
- Amoxicillin (Limited stock)
- Omeprazole (Out of stock)
- Cough Syrup (Available)

## Enhanced Features (Latest Updates)

### Advanced Doctor Dashboard
- **Patient History Tab**: Search and view comprehensive patient consultation history
- **Digital Prescriptions Tab**: Generate detailed prescriptions with medicine names, dosages, and instructions
- **Analytics Tab**: Real-time medical analytics including consultation statistics, emergency cases tracking, and common symptoms analysis
- **Advanced Filtering**: Filter patient requests by urgency level and search by name, village, or symptoms

### Comprehensive Symptom Checker
- **Guided Assessment Mode**: Interactive decision tree with 60+ symptom pathways covering all major medical categories
- **Quick Check Mode**: Instant advice for specific symptom categories (respiratory, digestive, neurological, etc.)
- **Emergency Signs Mode**: Immediate identification of life-threatening symptoms with emergency contact information
- **Enhanced Medical Coverage**: Covers mental health, skin conditions, cardiovascular issues, and complex symptom combinations

### Key Functions for Developers
```javascript
// Doctor Dashboard Functions
showDoctorTab(tabName)           // Switch between doctor dashboard tabs
filterRequests()                 // Filter patient requests by criteria
searchPatientHistory()           // Search patient consultation history
viewPatientHistory(phoneNumber)  // View specific patient's history
addMedicineToPrescription()      // Add medicine to prescription form
handlePrescriptionSubmission()   // Generate digital prescription
updateAnalytics()               // Update medical analytics display

// Enhanced Symptom Checker Functions
showSymptomMode(mode)           // Switch between symptom checker modes
selectSymptomOption(nextStep)   // Navigate enhanced symptom tree
quickSymptomCheck(category)     // Quick assessment by medical category
restartSymptomChecker()         // Reset symptom assessment
```

## Important Development Notes

### No Build Process
- Pure vanilla HTML/CSS/JavaScript - no frameworks or build tools
- Direct file editing and browser refresh for development
- Maximum compatibility with older browsers and low-end devices

### Data Persistence
- All data stored in browser LocalStorage
- No server-side backend in this MVP
- Data persists between browser sessions
- Consider data backup/export for production use

### Security Considerations
- This MVP stores data locally only
- No authentication system implemented
- Not production-ready for sensitive medical data
- Requires proper backend integration for production deployment

### Browser Compatibility
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Designed for mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement approach for older browsers

## Future Development Areas

When extending this codebase, consider:

1. **Backend Integration**: Server database with proper user authentication
2. **Real-time Features**: WebRTC for video consultations
3. **Data Security**: Encryption and HIPAA compliance
4. **SMS Integration**: Notifications for areas with limited internet
5. **AI Enhancement**: Machine learning-based symptom analysis
6. **Multi-hospital**: Network connectivity between healthcare facilities

## Common Issues

### LocalStorage Limitations
- 5-10MB storage limit per origin
- Data cleared when browser storage is cleared
- Consider implementing data export/backup features

### Language Switching
- Ensure all new UI elements include `data-translate` attributes
- Add new translation keys to all three language objects (English, Hindi, Telugu)
- Test with longer text strings and complex medical terminology
- Verify enhanced features work correctly in all supported languages

### Offline Functionality
- Always test offline scenarios during development
- Ensure new features work without network connectivity
- Consider data synchronization strategies for production