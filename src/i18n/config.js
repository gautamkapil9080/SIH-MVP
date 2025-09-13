import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "login": "Login",
      "register": "Register",
      "dashboard": "Dashboard",
      "consultation": "Video Consultation",
      "symptoms": "Symptom Checker",
      "medicines": "Medicine Availability",
      "records": "Health Records",
      
      // Home Page
      "welcome": "Welcome to Nabha Telemedicine",
      "subtitle": "Bringing quality healthcare to rural communities",
      "getStarted": "Get Started",
      "patientLogin": "Patient Login",
      "doctorLogin": "Doctor Login",
      "newPatient": "New Patient? Register Here",
      
      // Common
      "email": "Email",
      "password": "Password",
      "name": "Full Name",
      "phone": "Phone Number",
      "village": "Village",
      "age": "Age",
      "gender": "Gender",
      "male": "Male",
      "female": "Female",
      "submit": "Submit",
      "cancel": "Cancel",
      "back": "Back",
      "next": "Next",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      
      // Symptoms
      "symptomChecker": "AI Symptom Checker",
      "selectSymptoms": "Select your symptoms:",
      "fever": "Fever",
      "cough": "Cough",
      "headache": "Headache",
      "bodyache": "Body ache",
      "nausea": "Nausea",
      "checkSymptoms": "Check Symptoms",
      "recommendation": "Recommendation",
      
      // Medicine
      "medicineAvailability": "Medicine Availability",
      "searchMedicine": "Search Medicine",
      "pharmacy": "Pharmacy",
      "available": "Available",
      "outOfStock": "Out of Stock",
      
      // Video Call
      "startConsultation": "Start Consultation",
      "endCall": "End Call",
      "muteAudio": "Mute",
      "muteVideo": "Turn off Video",
      
      // Health Records
      "healthRecords": "Health Records",
      "addRecord": "Add Record",
      "dateOfVisit": "Date of Visit",
      "diagnosis": "Diagnosis",
      "prescription": "Prescription",
      "notes": "Notes"
    }
  },
  hi: {
    translation: {
      // Navigation
      "home": "होम",
      "login": "लॉगिन",
      "register": "रजिस्टर",
      "dashboard": "डैशबोर्ड",
      "consultation": "वीडियो परामर्श",
      "symptoms": "लक्षण जांच",
      "medicines": "दवा उपलब्धता",
      "records": "स्वास्थ्य रिकॉर्ड",
      
      // Home Page
      "welcome": "नाभा टेलीमेडिसिन में आपका स्वागत है",
      "subtitle": "ग्रामीण समुदायों के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा",
      "getStarted": "शुरू करें",
      "patientLogin": "मरीज़ लॉगिन",
      "doctorLogin": "डॉक्टर लॉगिन",
      "newPatient": "नए मरीज़? यहाँ रजिस्टर करें",
      
      // Common
      "email": "ईमेल",
      "password": "पासवर्ड",
      "name": "पूरा नाम",
      "phone": "फोन नंबर",
      "village": "गांव",
      "age": "उम्र",
      "gender": "लिंग",
      "male": "पुरुष",
      "female": "महिला",
      "submit": "जमा करें",
      "cancel": "रद्द करें",
      "back": "वापस",
      "next": "आगे",
      "loading": "लोड हो रहा है...",
      "error": "त्रुटि",
      "success": "सफलता",
      
      // Symptoms
      "symptomChecker": "AI लक्षण जांच",
      "selectSymptoms": "अपने लक्षण चुनें:",
      "fever": "बुखार",
      "cough": "खांसी",
      "headache": "सिर दर्द",
      "bodyache": "शरीर में दर्द",
      "nausea": "मतली",
      "checkSymptoms": "लक्षण जांचें",
      "recommendation": "सिफारिश",
      
      // Medicine
      "medicineAvailability": "दवा उपलब्धता",
      "searchMedicine": "दवा खोजें",
      "pharmacy": "फार्मेसी",
      "available": "उपलब्ध",
      "outOfStock": "स्टॉक में नहीं",
      
      // Video Call
      "startConsultation": "परामर्श शुरू करें",
      "endCall": "कॉल समाप्त करें",
      "muteAudio": "मौन",
      "muteVideo": "वीडियो बंद करें",
      
      // Health Records
      "healthRecords": "स्वास्थ्य रिकॉर्ड",
      "addRecord": "रिकॉर्ड जोड़ें",
      "dateOfVisit": "यात्रा की तारीख",
      "diagnosis": "निदान",
      "prescription": "नुस्खा",
      "notes": "नोट्स"
    }
  },
  pa: {
    translation: {
      // Navigation
      "home": "ਘਰ",
      "login": "ਲਾਗਇਨ",
      "register": "ਰਜਿਸਟਰ",
      "dashboard": "ਡੈਸ਼ਬੋਰਡ",
      "consultation": "ਵੀਡੀਓ ਸਲਾਹ",
      "symptoms": "ਲੱਛਣ ਜਾਂਚ",
      "medicines": "ਦਵਾਈ ਉਪਲਬਧਤਾ",
      "records": "ਸਿਹਤ ਰਿਕਾਰਡ",
      
      // Home Page
      "welcome": "ਨਾਭਾ ਟੈਲੀਮੈਡਿਸਿਨ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      "subtitle": "ਪਿੰਡਾਂ ਦੇ ਭਾਈਚਾਰਿਆਂ ਲਈ ਗੁਣਵੱਤਾ ਵਾਲੀ ਸਿਹਤ ਸੇਵਾ",
      "getStarted": "ਸ਼ੁਰੂ ਕਰੋ",
      "patientLogin": "ਮਰੀਜ਼ ਲਾਗਇਨ",
      "doctorLogin": "ਡਾਕਟਰ ਲਾਗਇਨ",
      "newPatient": "ਨਵਾਂ ਮਰੀਜ਼? ਇੱਥੇ ਰਜਿਸਟਰ ਕਰੋ",
      
      // Common
      "email": "ਈਮੇਲ",
      "password": "ਪਾਸਵਰਡ",
      "name": "ਪੂਰਾ ਨਾਮ",
      "phone": "ਫ਼ੋਨ ਨੰਬਰ",
      "village": "ਪਿੰਡ",
      "age": "ਉਮਰ",
      "gender": "ਲਿੰਗ",
      "male": "ਮਰਦ",
      "female": "ਔਰਤ",
      "submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
      "cancel": "ਰੱਦ ਕਰੋ",
      "back": "ਪਿੱਛੇ",
      "next": "ਅੱਗੇ",
      "loading": "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      "error": "ਗਲਤੀ",
      "success": "ਕਾਮਯਾਬੀ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;