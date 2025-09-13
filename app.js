// Nabha Telemedicine MVP Application

// Storage keys
const STORAGE_KEYS = {
    PATIENTS: 'nabha_patients',
    MEDICINES: 'nabha_medicines', 
    CONSULTATIONS: 'nabha_consultations',
    OFFLINE_MODE: 'nabha_offline_mode'
};

// Global state
let isOffline = !navigator.onLine;
let currentSymptomStep = 0;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupOfflineHandling();
    loadInitialData();
});

// Initialize application
function initializeApp() {
    // Show default section (patient)
    showSection('patient');
    
    // Initialize offline indicator
    updateOfflineStatus();
    
    // Load existing data
    loadDoctorRequests();
    loadSampleMedicines();
    
    console.log('Nabha Telemedicine MVP initialized');
}

// Setup event listeners
function setupEventListeners() {
    // Patient form
    const patientForm = document.getElementById('patientForm');
    if (patientForm) {
        patientForm.addEventListener('submit', handlePatientSubmission);
    }
    
    // Medicine form
    const medicineForm = document.getElementById('medicineForm');
    if (medicineForm) {
        medicineForm.addEventListener('submit', handleMedicineUpdate);
    }
    
    // Prescription form
    const prescriptionForm = document.getElementById('prescriptionForm');
    if (prescriptionForm) {
        prescriptionForm.addEventListener('submit', handlePrescriptionSubmission);
    }
    
    // Medicine search
    const medicineSearch = document.getElementById('medicineSearch');
    if (medicineSearch) {
        medicineSearch.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchMedicine();
            }
        });
    }
}

// Setup offline handling
function setupOfflineHandling() {
    window.addEventListener('online', function() {
        isOffline = false;
        updateOfflineStatus();
        syncOfflineData();
    });
    
    window.addEventListener('offline', function() {
        isOffline = true;
        updateOfflineStatus();
    });
}

// Update offline status indicator
function updateOfflineStatus() {
    let offlineIndicator = document.querySelector('.offline-indicator');
    
    if (isOffline) {
        if (!offlineIndicator) {
            offlineIndicator = document.createElement('div');
            offlineIndicator.className = 'offline-indicator';
            offlineIndicator.textContent = 'Working Offline';
            document.body.appendChild(offlineIndicator);
        }
        offlineIndicator.style.display = 'block';
    } else {
        if (offlineIndicator) {
            offlineIndicator.style.display = 'none';
        }
    }
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const activeSection = document.getElementById(sectionName + '-section');
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Special handling for doctor section
    if (sectionName === 'doctor') {
        loadDoctorRequests();
    }
    
    // Special handling for symptom checker
    if (sectionName === 'symptoms') {
        initializeSymptomChecker();
    }
}

// Show pharmacy tab
function showPharmacyTab(tabName) {
    // Hide all pharmacy tabs
    const tabs = document.querySelectorAll('.pharmacy-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    const activeTab = document.getElementById('medicine-' + tabName);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Handle patient form submission
function handlePatientSubmission(event) {
    event.preventDefault();
    
    const patientData = {
        id: generateId(),
        name: document.getElementById('patientName').value,
        village: document.getElementById('patientVillage').value,
        phone: document.getElementById('patientPhone').value,
        age: document.getElementById('patientAge').value,
        symptoms: document.getElementById('patientSymptoms').value,
        urgency: document.getElementById('urgencyLevel').value,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save to local storage
    savePatientRequest(patientData);
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showStatusMessage(t('request_submitted'), 'success');
    
    console.log('Patient request submitted:', patientData);
}

// Save patient request to local storage
function savePatientRequest(patientData) {
    const existingRequests = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    existingRequests.push(patientData);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(existingRequests));
}

// Load doctor requests
function loadDoctorRequests() {
    const requests = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    const requestsList = document.getElementById('requestsList');
    
    if (!requestsList) return;
    
    if (requests.length === 0) {
        requestsList.innerHTML = `<p>${t('no_requests')}</p>`;
        return;
    }
    
    // Sort by urgency and timestamp
    requests.sort((a, b) => {
        const urgencyOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    requestsList.innerHTML = requests.map(request => `
        <div class="patient-request urgency-${request.urgency}">
            <h4>${request.name} (${request.age} years) - ${request.village}</h4>
            <p><strong>Phone:</strong> ${request.phone}</p>
            <p><strong>Urgency:</strong> ${t(request.urgency)}</p>
            <p><strong>Symptoms:</strong> ${request.symptoms}</p>
            <p><strong>Submitted:</strong> ${new Date(request.timestamp).toLocaleString()}</p>
            <div style="margin-top: 15px;">
                <textarea id="response-${request.id}" placeholder="${t('consultation_notes')}" rows="3" style="width: 100%; margin-bottom: 10px;"></textarea>
                <button onclick="respondToPatient('${request.id}')">${t('send_response')}</button>
            </div>
        </div>
    `).join('');
}

// Respond to patient
function respondToPatient(patientId) {
    const responseText = document.getElementById(`response-${patientId}`).value;
    
    if (!responseText.trim()) {
        showStatusMessage('Please enter consultation notes', 'error');
        return;
    }
    
    // Get consultation data
    const consultationData = {
        id: generateId(),
        patientId: patientId,
        response: responseText,
        timestamp: new Date().toISOString(),
        doctorName: 'Dr. Civil Hospital' // In a real app, this would be the logged-in doctor
    };
    
    // Save consultation
    const consultations = getStoredData(STORAGE_KEYS.CONSULTATIONS) || [];
    consultations.push(consultationData);
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
    
    // Update patient request status
    const patients = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        patients[patientIndex].status = 'responded';
        patients[patientIndex].response = responseText;
        localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    }
    
    showStatusMessage(t('response_sent'), 'success');
    loadDoctorRequests(); // Refresh the list
}

// Handle medicine update
function handleMedicineUpdate(event) {
    event.preventDefault();
    
    const medicineData = {
        id: generateId(),
        name: document.getElementById('medicineName').value.toLowerCase(),
        availability: document.getElementById('medicineAvailability').value,
        pharmacy: document.getElementById('pharmacyName').value,
        timestamp: new Date().toISOString()
    };
    
    // Save medicine data
    const medicines = getStoredData(STORAGE_KEYS.MEDICINES) || [];
    
    // Check if medicine already exists from this pharmacy
    const existingIndex = medicines.findIndex(m => 
        m.name === medicineData.name && m.pharmacy === medicineData.pharmacy
    );
    
    if (existingIndex !== -1) {
        medicines[existingIndex] = medicineData; // Update existing
    } else {
        medicines.push(medicineData); // Add new
    }
    
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    
    // Reset form
    event.target.reset();
    
    // Show success message
    showStatusMessage(t('medicine_updated'), 'success');
    
    console.log('Medicine updated:', medicineData);
}

// Search medicine
function searchMedicine() {
    const searchTerm = document.getElementById('medicineSearch').value.toLowerCase().trim();
    const resultsDiv = document.getElementById('medicineResults');
    
    if (!searchTerm) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    const medicines = getStoredData(STORAGE_KEYS.MEDICINES) || [];
    const matchingMedicines = medicines.filter(medicine => 
        medicine.name.includes(searchTerm)
    );
    
    if (matchingMedicines.length === 0) {
        resultsDiv.innerHTML = '<p>No medicines found with that name.</p>';
        return;
    }
    
    // Group by medicine name
    const groupedMedicines = {};
    matchingMedicines.forEach(med => {
        if (!groupedMedicines[med.name]) {
            groupedMedicines[med.name] = [];
        }
        groupedMedicines[med.name].push(med);
    });
    
    resultsDiv.innerHTML = Object.keys(groupedMedicines).map(medicineName => {
        const medicineGroup = groupedMedicines[medicineName];
        return `
            <div class="medicine-item">
                <h4 style="text-transform: capitalize;">${medicineName}</h4>
                ${medicineGroup.map(med => `
                    <div class="medicine-${med.availability}" style="margin: 10px 0; padding: 10px; background: #f9f9f9; border-radius: 4px;">
                        <p><strong>Pharmacy:</strong> ${med.pharmacy}</p>
                        <p><strong>Status:</strong> ${t(med.availability)}</p>
                        <p><strong>Updated:</strong> ${new Date(med.timestamp).toLocaleDateString()}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// Initialize symptom checker
function initializeSymptomChecker() {
    currentSymptomStep = 0;
    const questionsDiv = document.getElementById('symptomQuestions');
    const resultDiv = document.getElementById('symptomResult');
    
    if (!questionsDiv) return;
    
    resultDiv.innerHTML = '';
    startSymptomChecker();
}

// Simplified symptom checker logic - Maximum 6-7 questions
const symptomTree = {
    0: {
        question: "Do you have any of these EMERGENCY symptoms?",
        options: [
            { text: "Severe chest pain or difficulty breathing", next: 'emergency_chest' },
            { text: "Severe bleeding that won't stop", next: 'emergency_bleeding' },
            { text: "Unconsciousness or severe confusion", next: 'emergency_consciousness' },
            { text: "No, I don't have these symptoms", next: 1 }
        ]
    },
    1: {
        question: "What is your main problem today?",
        options: [
            { text: "Fever or feeling very hot", next: 2 },
            { text: "Pain somewhere in my body", next: 3 },
            { text: "Stomach problems (nausea, vomiting, diarrhea)", next: 4 },
            { text: "Cough, cold, or breathing issues", next: 5 },
            { text: "Other health concerns", next: 6 }
        ]
    },
    2: {
        question: "How high is your fever?",
        options: [
            { text: "Very high fever (above 103°F/39°C) with severe symptoms", next: 'high_fever_emergency' },
            { text: "High fever (101-103°F/38-39°C)", next: 'high_fever' },
            { text: "Low fever (below 101°F/38°C)", next: 'mild_fever' },
            { text: "Just feeling feverish, no thermometer", next: 'mild_fever' }
        ]
    },
    3: {
        question: "Where is your pain and how bad is it?",
        options: [
            { text: "Severe chest pain", next: 'emergency_chest' },
            { text: "Severe abdominal pain with vomiting", next: 'severe_abdominal_pain' },
            { text: "Bad headache with neck stiffness", next: 'severe_headache' },
            { text: "Moderate pain - bearable but uncomfortable", next: 'moderate_pain' },
            { text: "Mild pain - can manage daily activities", next: 'mild_pain' }
        ]
    },
    4: {
        question: "How severe are your stomach problems?",
        options: [
            { text: "Severe - can't keep any food or water down", next: 'severe_stomach' },
            { text: "Vomiting blood or severe abdominal pain", next: 'emergency_stomach' },
            { text: "Moderate - some vomiting or diarrhea", next: 'moderate_stomach' },
            { text: "Mild - just stomach upset", next: 'mild_stomach' }
        ]
    },
    5: {
        question: "How are your breathing or cold symptoms?",
        options: [
            { text: "Very difficult to breathe, can't speak properly", next: 'emergency_breathing' },
            { text: "Shortness of breath with chest pain", next: 'emergency_chest' },
            { text: "Bad cough with fever", next: 'respiratory_infection' },
            { text: "Common cold symptoms - runny nose, mild cough", next: 'common_cold' }
        ]
    },
    6: {
        question: "What other symptoms do you have?",
        options: [
            { text: "Sudden weakness, numbness, or can't speak properly", next: 'emergency_neurological' },
            { text: "Severe dizziness or fainting", next: 'severe_dizziness' },
            { text: "Skin problems or rash", next: 'skin_issues' },
            { text: "General tiredness or feeling unwell", next: 'general_unwell' }
        ]
    }
    // Physical Pain Branch (1-9)
    1: {
        question: "Where is the pain located?",
        options: [
            { text: "Head or neck", next: 2 },
            { text: "Chest", next: 3 },
            { text: "Abdomen", next: 4 },
            { text: "Back", next: 5 },
            { text: "Arms or legs", next: 6 },
            { text: "Multiple locations", next: 7 }
        ]
    },
    2: {
        question: "How would you describe your headache?",
        options: [
            { text: "Severe, sudden onset", next: 'severe_headache' },
            { text: "Throbbing, one-sided", next: 'migraine' },
            { text: "Tension, band-like pressure", next: 'tension_headache' },
            { text: "With fever and neck stiffness", next: 'serious_headache' }
        ]
    },
    3: {
        question: "Is the chest pain severe or accompanied by other symptoms?",
        options: [
            { text: "Severe pain, shortness of breath, sweating", next: 'chest_emergency' },
            { text: "Sharp pain when breathing", next: 'chest_breathing' },
            { text: "Burning sensation", next: 'chest_heartburn' },
            { text: "Mild, muscle-like pain", next: 'chest_muscle' }
        ]
    },
    4: {
        question: "What type of abdominal symptoms do you have?",
        options: [
            { text: "Severe pain, vomiting, fever", next: 'severe_abdominal' },
            { text: "Cramping with diarrhea", next: 'gastroenteritis' },
            { text: "Upper abdomen burning", next: 'acid_reflux' },
            { text: "Lower abdomen discomfort", next: 'mild_abdominal' }
        ]
    },
    5: {
        question: "How is your back pain?",
        options: [
            { text: "Sudden, severe lower back pain", next: 'acute_back_pain' },
            { text: "Chronic, ongoing pain", next: 'chronic_back_pain' },
            { text: "Pain radiating to leg", next: 'sciatica' },
            { text: "Upper back/neck pain", next: 'upper_back_pain' }
        ]
    },
    6: {
        question: "Describe your arm or leg symptoms:",
        options: [
            { text: "Sudden weakness or numbness", next: 'limb_emergency' },
            { text: "Joint pain and swelling", next: 'joint_pain' },
            { text: "Muscle soreness", next: 'muscle_pain' },
            { text: "Injury-related pain", next: 'injury_pain' }
        ]
    },
    7: {
        question: "Is this widespread pain associated with:",
        options: [
            { text: "Fatigue and sleep problems", next: 'fibromyalgia' },
            { text: "Morning stiffness", next: 'arthritis' },
            { text: "Recent illness", next: 'post_viral' },
            { text: "None of the above", next: 'general_pain' }
        ]
    },
    
    // Breathing Problems Branch (10-19)
    10: {
        question: "How severe is your breathing difficulty?",
        options: [
            { text: "Can't speak in full sentences", next: 'breathing_emergency' },
            { text: "Shortness of breath with mild activity", next: 11 },
            { text: "Cough with breathing issues", next: 12 },
            { text: "Wheezing or whistling sounds", next: 13 }
        ]
    },
    11: {
        question: "Is this breathing difficulty:",
        options: [
            { text: "New and sudden onset", next: 'acute_breathing' },
            { text: "Getting progressively worse", next: 'worsening_breathing' },
            { text: "Related to chest pain", next: 'chest_breathing' },
            { text: "With ankle swelling", next: 'heart_breathing' }
        ]
    },
    12: {
        question: "What type of cough do you have?",
        options: [
            { text: "Dry, persistent cough", next: 'dry_cough' },
            { text: "Cough with yellow/green mucus", next: 'productive_cough' },
            { text: "Cough with blood", next: 'blood_cough' },
            { text: "Barking cough", next: 'croup_cough' }
        ]
    },
    13: {
        question: "When do you experience wheezing?",
        options: [
            { text: "During physical activity", next: 'exercise_asthma' },
            { text: "At night or early morning", next: 'asthma' },
            { text: "Around allergens", next: 'allergic_asthma' },
            { text: "Constantly", next: 'severe_asthma' }
        ]
    },
    
    // Fever Branch (20-29)
    20: {
        question: "How high is your fever?",
        options: [
            { text: "Above 103°F (39.4°C)", next: 21 },
            { text: "101-103°F (38.3-39.4°C)", next: 22 },
            { text: "100-101°F (37.8-38.3°C)", next: 23 },
            { text: "Just feeling feverish", next: 24 }
        ]
    },
    21: {
        question: "With high fever, do you also have:",
        options: [
            { text: "Severe headache and neck stiffness", next: 'meningitis_concern' },
            { text: "Difficulty breathing", next: 'high_fever_breathing' },
            { text: "Abdominal pain", next: 'high_fever_abdominal' },
            { text: "Just high fever alone", next: 'high_fever_alone' }
        ]
    },
    22: {
        question: "Along with moderate fever, do you have:",
        options: [
            { text: "Cough and sore throat", next: 'respiratory_infection' },
            { text: "Body aches and fatigue", next: 'flu_like' },
            { text: "Stomach upset", next: 'gastric_fever' },
            { text: "No other symptoms", next: 'simple_fever' }
        ]
    },
    23: {
        question: "With low-grade fever, you also have:",
        options: [
            { text: "Runny nose and sneezing", next: 'common_cold' },
            { text: "Sore throat", next: 'throat_infection' },
            { text: "Tiredness", next: 'mild_viral' },
            { text: "No other symptoms", next: 'low_fever' }
        ]
    },
    24: {
        question: "When feeling feverish without confirmed fever:",
        options: [
            { text: "Chills and sweating", next: 'fever_symptoms' },
            { text: "General malaise", next: 'general_unwell' },
            { text: "Recent travel", next: 'travel_related' },
            { text: "Stress or lack of sleep", next: 'stress_related' }
        ]
    },
    
    // Digestive Problems Branch (30-39)
    30: {
        question: "What digestive symptoms are you experiencing?",
        options: [
            { text: "Severe abdominal pain", next: 4 }, // Links back to abdominal pain
            { text: "Nausea and vomiting", next: 31 },
            { text: "Diarrhea", next: 32 },
            { text: "Constipation", next: 33 }
        ]
    },
    31: {
        question: "How severe is your nausea/vomiting?",
        options: [
            { text: "Can't keep fluids down", next: 'severe_vomiting' },
            { text: "Vomiting with blood", next: 'blood_vomiting' },
            { text: "Morning sickness pattern", next: 'morning_sickness' },
            { text: "Mild nausea only", next: 'mild_nausea' }
        ]
    },
    32: {
        question: "What type of diarrhea do you have?",
        options: [
            { text: "Watery, frequent (>6 times/day)", next: 'severe_diarrhea' },
            { text: "With blood or mucus", next: 'bloody_diarrhea' },
            { text: "After eating certain foods", next: 'food_intolerance' },
            { text: "Mild, occasional", next: 'mild_diarrhea' }
        ]
    },
    33: {
        question: "How long have you been constipated?",
        options: [
            { text: "More than a week with pain", next: 'severe_constipation' },
            { text: "Few days, uncomfortable", next: 'moderate_constipation' },
            { text: "Chronic, ongoing issue", next: 'chronic_constipation' },
            { text: "Recent change in habits", next: 'situational_constipation' }
        ]
    },
    
    // Mental Health Branch (40-49)
    40: {
        question: "What mental health concerns are you experiencing?",
        options: [
            { text: "Thoughts of self-harm", next: 'mental_emergency' },
            { text: "Anxiety or panic attacks", next: 41 },
            { text: "Depression or sadness", next: 42 },
            { text: "Sleep problems", next: 43 }
        ]
    },
    41: {
        question: "How often do you experience anxiety?",
        options: [
            { text: "Panic attacks, can't function", next: 'severe_anxiety' },
            { text: "Daily anxiety affecting life", next: 'moderate_anxiety' },
            { text: "Situational anxiety", next: 'situational_anxiety' },
            { text: "General worry", next: 'mild_anxiety' }
        ]
    },
    42: {
        question: "How is depression affecting you?",
        options: [
            { text: "Can't perform daily activities", next: 'severe_depression' },
            { text: "Lost interest in activities", next: 'moderate_depression' },
            { text: "Feeling sad most days", next: 'mild_depression' },
            { text: "Seasonal or situational", next: 'situational_depression' }
        ]
    },
    43: {
        question: "What sleep problems are you having?",
        options: [
            { text: "Can't fall asleep for hours", next: 'insomnia' },
            { text: "Wake up frequently", next: 'interrupted_sleep' },
            { text: "Wake up too early", next: 'early_waking' },
            { text: "Sleeping too much", next: 'hypersomnia' }
        ]
    },
    
    // Skin Problems Branch (50-59)
    50: {
        question: "What type of skin problem do you have?",
        options: [
            { text: "Rash with fever", next: 'rash_fever' },
            { text: "Itchy rash or hives", next: 51 },
            { text: "Wound or injury", next: 52 },
            { text: "Skin growth or change", next: 53 }
        ]
    },
    51: {
        question: "Describe your itchy rash:",
        options: [
            { text: "Sudden onset, spreading quickly", next: 'acute_allergic_reaction' },
            { text: "Red, scaly patches", next: 'eczema' },
            { text: "Small blisters", next: 'contact_dermatitis' },
            { text: "Dry, itchy skin", next: 'dry_skin' }
        ]
    },
    52: {
        question: "What type of wound or injury?",
        options: [
            { text: "Deep cut, won't stop bleeding", next: 'serious_wound' },
            { text: "Infected looking (red, pus)", next: 'infected_wound' },
            { text: "Burn", next: 'burn_injury' },
            { text: "Minor cut or scrape", next: 'minor_wound' }
        ]
    },
    53: {
        question: "What changes have you noticed?",
        options: [
            { text: "New mole or changing mole", next: 'mole_concern' },
            { text: "Persistent sore that won't heal", next: 'persistent_sore' },
            { text: "Sudden skin growth", next: 'skin_growth' },
            { text: "Color changes in skin", next: 'skin_discoloration' }
        ]
    },
    
    // Other Symptoms Branch (60-69)
    60: {
        question: "What other symptoms are you experiencing?",
        options: [
            { text: "Vision or hearing problems", next: 61 },
            { text: "Dizziness or balance issues", next: 62 },
            { text: "Fatigue or weakness", next: 63 },
            { text: "Something else", next: 64 }
        ]
    },
    61: {
        question: "What vision or hearing issues?",
        options: [
            { text: "Sudden vision loss", next: 'vision_emergency' },
            { text: "Sudden hearing loss", next: 'hearing_emergency' },
            { text: "Gradual changes", next: 'gradual_sensory' },
            { text: "Eye pain or discharge", next: 'eye_infection' }
        ]
    },
    62: {
        question: "Describe your dizziness:",
        options: [
            { text: "Room spinning (vertigo)", next: 'vertigo' },
            { text: "Lightheaded when standing", next: 'orthostatic' },
            { text: "Balance problems, falling", next: 'balance_disorder' },
            { text: "General unsteadiness", next: 'general_dizziness' }
        ]
    },
    63: {
        question: "How long have you felt fatigued?",
        options: [
            { text: "Sudden, severe weakness", next: 'acute_weakness' },
            { text: "Weeks to months", next: 'chronic_fatigue' },
            { text: "After recent illness", next: 'post_illness_fatigue' },
            { text: "Related to poor sleep", next: 'sleep_fatigue' }
        ]
    },
    64: {
        question: "Please describe your main concern:",
        options: [
            { text: "Multiple concerning symptoms", next: 'multiple_symptoms' },
            { text: "Unusual symptoms", next: 'unusual_symptoms' },
            { text: "Preventive health concern", next: 'preventive_care' },
            { text: "Follow-up question", next: 'follow_up' }
        ]
    }
};

// Simplified symptom results for 6-7 question flow
const symptomResults = {
    // EMERGENCY CASES - Immediate medical attention needed
    emergency_chest: {
        title: "🚨 CHEST EMERGENCY",
        advice: "CALL AMBULANCE IMMEDIATELY! Severe chest pain or breathing difficulty can be a heart attack or serious condition. Call 108 or go to nearest hospital RIGHT NOW.",
        urgency: "emergency"
    },
    emergency_bleeding: {
        title: "🚨 SEVERE BLEEDING",
        advice: "CALL AMBULANCE IMMEDIATELY! Apply direct pressure to wound and call 108. Go to nearest hospital RIGHT NOW.",
        urgency: "emergency"
    },
    emergency_consciousness: {
        title: "🚨 NEUROLOGICAL EMERGENCY",
        advice: "CALL AMBULANCE IMMEDIATELY! Loss of consciousness or severe confusion needs immediate medical care. Call 108 RIGHT NOW.",
        urgency: "emergency"
    },
    emergency_breathing: {
        title: "🚨 BREATHING EMERGENCY",
        advice: "CALL AMBULANCE IMMEDIATELY! Severe breathing difficulty is life-threatening. Call 108 RIGHT NOW.",
        urgency: "emergency"
    },
    emergency_stomach: {
        title: "🚨 SEVERE STOMACH EMERGENCY",
        advice: "CALL AMBULANCE IMMEDIATELY! Vomiting blood or severe abdominal pain needs immediate care. Call 108 RIGHT NOW.",
        urgency: "emergency"
    },
    emergency_neurological: {
        title: "🚨 POSSIBLE STROKE",
        advice: "CALL AMBULANCE IMMEDIATELY! Sudden weakness, numbness, or speech problems could be stroke. Call 108 RIGHT NOW.",
        urgency: "emergency"
    },
    high_fever_emergency: {
        title: "🚨 HIGH FEVER EMERGENCY",
        advice: "CALL AMBULANCE IMMEDIATELY! Very high fever with severe symptoms can be dangerous. Call 108 or go to hospital RIGHT NOW.",
        urgency: "emergency"
    },
    
    // HIGH PRIORITY - See doctor today or within 24 hours
    severe_abdominal_pain: {
        title: "🔴 SEVERE ABDOMINAL PAIN",
        advice: "See a doctor TODAY. Severe abdominal pain with vomiting needs medical attention. Go to Civil Hospital or nearest clinic today.",
        urgency: "high"
    },
    severe_headache: {
        title: "🔴 SEVERE HEADACHE",
        advice: "See a doctor TODAY. Bad headache with neck stiffness can be serious. Go to Civil Hospital or nearest clinic today.",
        urgency: "high"
    },
    high_fever: {
        title: "🔴 HIGH FEVER",
        advice: "See a doctor TODAY. High fever (101-103°F) needs medical attention. Take paracetamol, drink fluids, and see doctor today.",
        urgency: "high"
    },
    severe_stomach: {
        title: "🔴 SEVERE STOMACH PROBLEMS",
        advice: "See a doctor TODAY. If you can't keep food or water down, you may get dehydrated. Go to hospital today.",
        urgency: "high"
    },
    respiratory_infection: {
        title: "🔴 RESPIRATORY INFECTION",
        advice: "See a doctor TODAY. Bad cough with fever could be pneumonia or serious infection. Go to Civil Hospital today.",
        urgency: "high"
    },
    severe_dizziness: {
        title: "🔴 SEVERE DIZZINESS",
        advice: "See a doctor TODAY. Severe dizziness or fainting episodes need medical evaluation. Avoid driving and see doctor.",
        urgency: "high"
    },
    
    // MODERATE PRIORITY - See doctor within 2-3 days
    moderate_pain: {
        title: "🟡 MODERATE PAIN",
        advice: "See a doctor within 2-3 days. Pain that interferes with daily activities should be checked. Take pain medicine and rest.",
        urgency: "medium"
    },
    moderate_stomach: {
        title: "🟡 STOMACH UPSET",
        advice: "Monitor for 1-2 days. Drink clear fluids, eat bland food (rice, bananas). If not better in 2 days, see doctor.",
        urgency: "medium"
    },
    mild_fever: {
        title: "🟡 MILD FEVER",
        advice: "Rest and monitor. Take paracetamol, drink plenty of fluids, rest. If fever persists beyond 3 days, see doctor.",
        urgency: "medium"
    },
    skin_issues: {
        title: "🟡 SKIN PROBLEMS",
        advice: "Monitor and keep clean. Most skin problems are not serious. Keep area clean and dry. If spreads or gets worse, see doctor.",
        urgency: "medium"
    },
    
    // MILD PRIORITY - Self-care and monitor
    mild_pain: {
        title: "🟢 MILD PAIN",
        advice: "Self-care is enough. Rest, apply hot/cold compress, take paracetamol if needed. If pain gets worse, see doctor.",
        urgency: "low"
    },
    mild_stomach: {
        title: "🟢 MILD STOMACH UPSET",
        advice: "Self-care is enough. Eat light foods, drink water, rest. Usually gets better in 1-2 days on its own.",
        urgency: "low"
    },
    common_cold: {
        title: "🟢 COMMON COLD",
        advice: "Self-care is enough. Rest, drink warm liquids, take steam. Cold symptoms usually improve in 7-10 days.",
        urgency: "low"
    },
    general_unwell: {
        title: "🟢 FEELING UNWELL",
        advice: "Self-care and monitor. Rest, eat well, drink fluids, get good sleep. If not better in 2-3 days, see doctor.",
        urgency: "low"
    }
};

// Initialize symptom checker
function initializeSymptomChecker() {
    currentSymptomStep = 0;
    const questionsDiv = document.getElementById('symptomQuestions');
    const resultDiv = document.getElementById('symptomResult');
    
    if (!questionsDiv) return;
    
    resultDiv.innerHTML = '';
    startSymptomChecker();
}

// Start simplified symptom checker
function startSymptomChecker() {
    const questionsDiv = document.getElementById('symptomQuestions');
    const step = symptomTree[currentSymptomStep];
    
    if (!step) return;
    
    // Simple interface with options
    questionsDiv.innerHTML = `
        <div class="symptom-question">
            <div class="question-header">
                <h3>Question ${currentSymptomStep + 1} of 7</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${((currentSymptomStep + 1) / 7) * 100}%"></div>
                </div>
            </div>
            <p class="question-text">${step.question}</p>
            <div class="symptom-options">
                ${step.options.map((option, index) => `
                    <button onclick="selectSymptomOption('${option.next}')" class="symptom-option-btn">
                        ${option.text}
                    </button>
                `).join('')}
            </div>
            <div class="navigation-buttons">
                ${currentSymptomStep > 0 ? '<button onclick="restartSymptomChecker()" class="restart-btn">Start Over</button>' : ''}
            </div>
        </div>
    `;
}

// Select symptom option
function selectSymptomOption(nextStep) {
    if (typeof nextStep === 'string') {
        // We've reached a result
        showSymptomResult(nextStep);
    } else {
        // Continue to next question
        currentSymptomStep = nextStep;
        startSymptomChecker();
    }
}

// Restart symptom checker
function restartSymptomChecker() {
    currentSymptomStep = 0;
    document.getElementById('symptomResult').innerHTML = '';
    startSymptomChecker();
}
    breathing_emergency: {
        title: "Severe Breathing Emergency",
        advice: "Inability to speak in full sentences indicates severe breathing difficulty. Call emergency services immediately (911).",
        urgency: "emergency"
    },
    meningitis_concern: {
        title: "Possible Meningitis",
        advice: "High fever with severe headache and neck stiffness could indicate meningitis. Seek immediate emergency medical care.",
        urgency: "emergency"
    },
    vision_emergency: {
        title: "Vision Emergency",
        advice: "Sudden vision loss requires immediate medical attention. Go to emergency room or call emergency services.",
        urgency: "emergency"
    },
    hearing_emergency: {
        title: "Hearing Emergency",
        advice: "Sudden hearing loss requires immediate medical attention. See an ENT specialist or go to emergency room today.",
        urgency: "emergency"
    },
    blood_vomiting: {
        title: "Vomiting Blood",
        advice: "Vomiting blood requires immediate medical attention. Go to emergency room immediately.",
        urgency: "emergency"
    },
    blood_cough: {
        title: "Coughing Blood",
        advice: "Coughing up blood requires immediate medical evaluation. Seek emergency medical care.",
        urgency: "emergency"
    },
    serious_wound: {
        title: "Serious Wound",
        advice: "A deep cut that won't stop bleeding requires immediate medical care. Apply direct pressure and seek emergency treatment.",
        urgency: "emergency"
    },
    limb_emergency: {
        title: "Neurological Emergency",
        advice: "Sudden weakness or numbness in limbs could indicate a stroke. Call emergency services immediately.",
        urgency: "emergency"
    },
    
    // High Priority Cases
    severe_headache: {
        title: "Severe Headache",
        advice: "Sudden, severe headache could be serious. If this is the 'worst headache of your life', seek immediate medical care. Otherwise, consult a doctor today.",
        urgency: "high"
    },
    serious_headache: {
        title: "Concerning Headache",
        advice: "Headache with fever and neck stiffness requires immediate medical evaluation. This could indicate a serious condition.",
        urgency: "high"
    },
    severe_abdominal: {
        title: "Severe Abdominal Pain",
        advice: "Severe abdominal pain with vomiting and fever requires prompt medical evaluation. Consider going to urgent care or emergency room.",
        urgency: "high"
    },
    bloody_diarrhea: {
        title: "Bloody Diarrhea",
        advice: "Diarrhea with blood or mucus could indicate a serious infection or condition. Consult a doctor today.",
        urgency: "high"
    },
    severe_vomiting: {
        title: "Severe Vomiting",
        advice: "If you can't keep fluids down, you risk dehydration. Seek medical care if this continues for more than 24 hours.",
        urgency: "high"
    },
    acute_breathing: {
        title: "Acute Breathing Difficulty",
        advice: "New, sudden breathing difficulty should be evaluated promptly. Consider urgent care or emergency room visit.",
        urgency: "high"
    },
    high_fever_breathing: {
        title: "High Fever with Breathing Issues",
        advice: "High fever with breathing difficulty could indicate pneumonia or other serious infection. Seek medical care today.",
        urgency: "high"
    },
    severe_anxiety: {
        title: "Severe Anxiety/Panic",
        advice: "Severe anxiety affecting your daily function needs professional help. Consider contacting a mental health professional or your doctor today.",
        urgency: "high"
    },
    severe_depression: {
        title: "Severe Depression",
        advice: "Depression preventing daily activities needs immediate professional help. Contact a mental health professional or your doctor today.",
        urgency: "high"
    },
    acute_allergic_reaction: {
        title: "Acute Allergic Reaction",
        advice: "Rapidly spreading rash could indicate an allergic reaction. If you have difficulty breathing or swelling, seek emergency care. Otherwise, take antihistamines and monitor closely.",
        urgency: "high"
    },
    
    // Moderate Priority Cases
    migraine: {
        title: "Migraine Headache",
        advice: "Throbbing, one-sided headaches are typical of migraines. Rest in a dark, quiet room, stay hydrated, and consider over-the-counter pain relievers. Consult a doctor if frequent.",
        urgency: "medium"
    },
    respiratory_infection: {
        title: "Respiratory Infection",
        advice: "Fever with cough and sore throat suggests a respiratory infection. Rest, drink fluids, and monitor symptoms. Consult a doctor if symptoms worsen or persist beyond 7-10 days.",
        urgency: "medium"
    },
    flu_like: {
        title: "Flu-like Illness",
        advice: "Body aches and fatigue with fever suggest flu or viral infection. Rest, stay hydrated, take fever reducers as needed. Consult a doctor if symptoms are severe or prolonged.",
        urgency: "medium"
    },
    gastroenteritis: {
        title: "Gastroenteritis",
        advice: "Cramping with diarrhea suggests stomach bug. Stay hydrated with clear fluids, eat bland foods (BRAT diet), and rest. Consult a doctor if severe or prolonged.",
        urgency: "medium"
    },
    joint_pain: {
        title: "Joint Pain and Swelling",
        advice: "Joint pain and swelling could indicate arthritis or injury. Apply ice, rest the joint, and consider anti-inflammatory medications. See a doctor if persistent.",
        urgency: "medium"
    },
    asthma: {
        title: "Asthma Symptoms",
        advice: "Wheezing at night or early morning suggests asthma. Use prescribed inhalers if available. If symptoms are new or worsening, consult a doctor.",
        urgency: "medium"
    },
    vertigo: {
        title: "Vertigo",
        advice: "Room-spinning dizziness (vertigo) can be caused by inner ear problems. Avoid sudden movements, stay hydrated. Consult a doctor if severe or persistent.",
        urgency: "medium"
    },
    eczema: {
        title: "Eczema",
        advice: "Red, scaly, itchy patches suggest eczema. Moisturize regularly, avoid irritants, consider over-the-counter corticosteroid creams. See a dermatologist if severe.",
        urgency: "medium"
    },
    infected_wound: {
        title: "Infected Wound",
        advice: "Redness, warmth, pus, or red streaks around a wound indicate infection. Clean gently, apply antibiotic ointment, and consult a doctor promptly.",
        urgency: "medium"
    },
    
    // Low Priority Cases
    tension_headache: {
        title: "Tension Headache",
        advice: "Band-like pressure headaches are usually tension headaches. Try relaxation techniques, over-the-counter pain relievers, adequate sleep, and stress management.",
        urgency: "low"
    },
    common_cold: {
        title: "Common Cold",
        advice: "Runny nose and sneezing with low fever suggests a cold. Rest, drink fluids, use saline nasal rinses. Symptoms typically resolve in 7-10 days.",
        urgency: "low"
    },
    muscle_pain: {
        title: "Muscle Soreness",
        advice: "Muscle soreness is often due to overuse or minor strain. Rest, apply ice or heat as comfortable, gentle stretching, and over-the-counter pain relievers can help.",
        urgency: "low"
    },
    mild_nausea: {
        title: "Mild Nausea",
        advice: "Mild nausea can be managed with ginger tea, small frequent meals, bland foods, and staying hydrated. Rest and avoid strong odors.",
        urgency: "low"
    },
    dry_skin: {
        title: "Dry Skin",
        advice: "Dry, itchy skin needs regular moisturizing, gentle soaps, shorter showers with lukewarm water, and a humidifier if possible.",
        urgency: "low"
    },
    minor_wound: {
        title: "Minor Cut or Scrape",
        advice: "Clean the wound with soap and water, apply antibiotic ointment, cover with bandage. Change dressing daily and keep clean and dry.",
        urgency: "low"
    },
    mild_anxiety: {
        title: "General Worry",
        advice: "General worry can be managed with relaxation techniques, regular exercise, good sleep habits, and talking to friends or family. Consider counseling if it persists.",
        urgency: "low"
    },
    sleep_fatigue: {
        title: "Sleep-Related Fatigue",
        advice: "Fatigue related to poor sleep can be improved with good sleep hygiene: regular sleep schedule, comfortable sleep environment, avoiding screens before bed.",
        urgency: "low"
    },
    
    // Chronic/Ongoing Conditions
    chronic_fatigue: {
        title: "Chronic Fatigue",
        advice: "Fatigue lasting weeks to months needs medical evaluation. Keep a symptom diary and schedule an appointment with your doctor for proper evaluation.",
        urgency: "medium"
    },
    chronic_back_pain: {
        title: "Chronic Back Pain",
        advice: "Ongoing back pain benefits from regular gentle exercise, proper posture, ergonomic workstation, and sometimes physical therapy. Consult a doctor for management plan.",
        urgency: "medium"
    },
    insomnia: {
        title: "Insomnia",
        advice: "Difficulty falling asleep can be improved with sleep hygiene, avoiding caffeine late in day, regular bedtime routine. Consider consulting a doctor if persistent.",
        urgency: "low"
    },
    
    // Preventive Care
    preventive_care: {
        title: "Preventive Health Concern",
        advice: "Regular check-ups are important for maintaining health. Schedule routine screenings and vaccinations as recommended by your doctor.",
        urgency: "low"
    },
    
    // General/Multiple Symptoms
    multiple_symptoms: {
        title: "Multiple Symptoms",
        advice: "Multiple concerning symptoms should be evaluated by a healthcare professional. Keep a symptom diary and schedule an appointment with your doctor.",
        urgency: "medium"
    },
    general_unwell: {
        title: "General Feeling Unwell",
        advice: "General malaise can have many causes. Ensure adequate rest, nutrition, hydration. If symptoms persist or worsen, consult your doctor.",
        urgency: "low"
    }
};

// Enhanced symptom checker functions

// Show symptom mode (guided, quick, emergency)
function showSymptomMode(mode) {
    // Hide all symptom modes
    const modes = document.querySelectorAll('.symptom-mode');
    modes.forEach(modeDiv => {
        modeDiv.classList.remove('active');
    });
    
    // Hide all mode buttons
    const modeButtons = document.querySelectorAll('.symptom-modes .mode-button');
    modeButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected mode
    const activeMode = document.getElementById(`symptom-${mode}`);
    if (activeMode) {
        activeMode.classList.add('active');
    }
    
    // Activate corresponding button
    const activeButton = document.querySelector(`[onclick="showSymptomMode('${mode}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Initialize mode-specific content
    if (mode === 'guided') {
        initializeSymptomChecker();
    }
}

// Start enhanced symptom checker (guided mode)
function startSymptomChecker() {
    const questionsDiv = document.getElementById('symptomQuestions');
    const step = symptomTree[currentSymptomStep];
    
    if (!step) return;
    
    // Enhanced interface with options
    if (step.options) {
        questionsDiv.innerHTML = `
            <div class="symptom-question enhanced">
                <h3>Question ${Object.keys(symptomTree).indexOf(currentSymptomStep.toString()) + 1}</h3>
                <p class="question-text">${step.question}</p>
                <div class="symptom-options">
                    ${step.options.map((option, index) => `
                        <button onclick="selectSymptomOption(${option.next})" class="symptom-option-btn" data-index="${index}">
                            ${option.text}
                        </button>
                    `).join('')}
                </div>
                <div class="navigation-buttons">
                    ${currentSymptomStep > 0 ? '<button onclick="goBackSymptom()" class="back-btn">← Go Back</button>' : ''}
                    <button onclick="restartSymptomChecker()" class="restart-btn">Start Over</button>
                </div>
            </div>
        `;
    } else {
        // Fallback for old yes/no format
        questionsDiv.innerHTML = `
            <div class="symptom-question">
                <h3>Question ${currentSymptomStep + 1}</h3>
                <p>${step.question}</p>
                <div style="margin-top: 20px;">
                    <button onclick="answerSymptomQuestion('yes')" style="margin-right: 10px;">Yes</button>
                    <button onclick="answerSymptomQuestion('no')">No</button>
                </div>
            </div>
        `;
    }
}

// Select symptom option (new enhanced function)
function selectSymptomOption(nextStep) {
    if (typeof nextStep === 'string') {
        // We've reached a result
        showSymptomResult(nextStep);
    } else {
        // Continue to next question
        currentSymptomStep = nextStep;
        startSymptomChecker();
    }
}

// Go back to previous symptom question
function goBackSymptom() {
    // Simple implementation - restart for now
    // In a full implementation, you'd maintain a history stack
    if (currentSymptomStep === 0) return;
    currentSymptomStep = 0;
    startSymptomChecker();
}

// Restart symptom checker
function restartSymptomChecker() {
    currentSymptomStep = 0;
    document.getElementById('symptomResult').innerHTML = '';
    startSymptomChecker();
}

// Answer symptom question (legacy function for old format)
function answerSymptomQuestion(answer) {
    const currentStep = symptomTree[currentSymptomStep];
    const nextStep = answer === 'yes' ? currentStep.yes : currentStep.no;
    
    if (typeof nextStep === 'string') {
        // We've reached a result
        showSymptomResult(nextStep);
    } else {
        // Continue to next question
        currentSymptomStep = nextStep;
        startSymptomChecker();
    }
}

// Quick symptom check by category
function quickSymptomCheck(category) {
    const quickResultDiv = document.getElementById('quickSymptomResult');
    
    const categoryResults = {
        respiratory: {
            title: "Respiratory Symptoms",
            advice: "Common respiratory symptoms include cough, shortness of breath, chest congestion, and wheezing. If severe or persistent, consult a healthcare provider. For emergency breathing problems, seek immediate medical care.",
            urgency: "medium",
            commonCauses: ["Common cold", "Flu", "Allergies", "Asthma", "Bronchitis"]
        },
        digestive: {
            title: "Digestive Symptoms",
            advice: "Digestive issues like nausea, vomiting, diarrhea, or abdominal pain are often temporary. Stay hydrated and eat bland foods. Seek medical care if symptoms are severe or persistent.",
            urgency: "medium",
            commonCauses: ["Food poisoning", "Stomach bug", "Acid reflux", "Food intolerance"]
        },
        neurological: {
            title: "Neurological Symptoms",
            advice: "Headaches, dizziness, or numbness can have various causes. Severe, sudden onset symptoms require immediate medical attention. Persistent symptoms should be evaluated by a doctor.",
            urgency: "high",
            commonCauses: ["Tension headache", "Migraine", "Stress", "Dehydration"]
        },
        cardiovascular: {
            title: "Cardiovascular Symptoms",
            advice: "Chest pain, shortness of breath, or rapid heartbeat can be serious. Seek immediate medical care for severe symptoms. Even mild symptoms warrant medical evaluation.",
            urgency: "high",
            commonCauses: ["Anxiety", "Physical exertion", "Caffeine", "Heart conditions"]
        },
        musculoskeletal: {
            title: "Musculoskeletal Symptoms",
            advice: "Joint pain, muscle aches, or stiffness can often be managed with rest, ice/heat, and over-the-counter pain relievers. Persistent or severe pain should be evaluated.",
            urgency: "low",
            commonCauses: ["Muscle strain", "Arthritis", "Overuse", "Poor posture"]
        },
        skin: {
            title: "Skin Symptoms",
            advice: "Rashes, itching, or skin changes have many causes. Most are not serious, but rapidly spreading rashes or those with fever need prompt medical attention.",
            urgency: "medium",
            commonCauses: ["Allergic reaction", "Eczema", "Dry skin", "Contact dermatitis"]
        },
        mental_health: {
            title: "Mental Health Concerns",
            advice: "Mental health is as important as physical health. If you're experiencing persistent anxiety, depression, or thoughts of self-harm, please seek professional help immediately.",
            urgency: "high",
            commonCauses: ["Stress", "Life changes", "Chemical imbalances", "Trauma"]
        },
        general: {
            title: "General Symptoms",
            advice: "General symptoms like fatigue, fever, or malaise can indicate various conditions. Monitor your symptoms and consult a healthcare provider if they persist or worsen.",
            urgency: "medium",
            commonCauses: ["Viral infection", "Stress", "Poor sleep", "Dehydration"]
        }
    };
    
    const result = categoryResults[category];
    if (result) {
        const urgencyClass = `urgency-${result.urgency}`;
        quickResultDiv.innerHTML = `
            <div class="quick-symptom-result ${urgencyClass}">
                <h3>${result.title}</h3>
                <p><strong>General Advice:</strong> ${result.advice}</p>
                <p><strong>Urgency Level:</strong> ${t(result.urgency)}</p>
                <div class="common-causes">
                    <h4>Common Causes:</h4>
                    <ul>
                        ${result.commonCauses.map(cause => `<li>${cause}</li>`).join('')}
                    </ul>
                </div>
                <div class="quick-actions">
                    <button onclick="showSymptomMode('guided')" class="action-btn">Get Detailed Assessment</button>
                    <button onclick="showSection('patient')" class="action-btn">Book Consultation</button>
                </div>
            </div>
        `;
    }
}

// Show symptom result
function showSymptomResult(resultKey) {
    const result = symptomResults[resultKey];
    const questionsDiv = document.getElementById('symptomQuestions');
    const resultDiv = document.getElementById('symptomResult');
    
    questionsDiv.innerHTML = '';
    
    const urgencyClass = `urgency-${result.urgency}`;
    
    resultDiv.innerHTML = `
        <div class="symptom-result ${urgencyClass}">
            <h3>${result.title}</h3>
            <p><strong>Advice:</strong> ${result.advice}</p>
            <p><strong>Urgency Level:</strong> ${t(result.urgency)}</p>
            <div style="margin-top: 20px;">
                <button onclick="initializeSymptomChecker()">Start Again</button>
                <button onclick="showSection('patient')" style="margin-left: 10px;">Book Consultation</button>
            </div>
        </div>
    `;
}

// Load sample medicines for testing
function loadSampleMedicines() {
    const existingMedicines = getStoredData(STORAGE_KEYS.MEDICINES);
    if (existingMedicines && existingMedicines.length > 0) {
        return; // Already have data
    }
    
    const sampleMedicines = [
        { id: generateId(), name: 'paracetamol', availability: 'available', pharmacy: 'Nabha Medical Store', timestamp: new Date().toISOString() },
        { id: generateId(), name: 'amoxicillin', availability: 'limited', pharmacy: 'Nabha Medical Store', timestamp: new Date().toISOString() },
        { id: generateId(), name: 'omeprazole', availability: 'out_of_stock', pharmacy: 'Nabha Medical Store', timestamp: new Date().toISOString() },
        { id: generateId(), name: 'paracetamol', availability: 'available', pharmacy: 'Civil Hospital Pharmacy', timestamp: new Date().toISOString() },
        { id: generateId(), name: 'cough syrup', availability: 'available', pharmacy: 'Village Medical Center', timestamp: new Date().toISOString() }
    ];
    
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(sampleMedicines));
}

// Load initial data
function loadInitialData() {
    // This function can be used to load any initial setup data
    console.log('Initial data loaded');
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getStoredData(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting stored data:', error);
        return null;
    }
}

function showStatusMessage(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    if (!statusDiv) return;
    
    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Sync offline data (placeholder for future implementation)
function syncOfflineData() {
    console.log('Syncing offline data...');
    // In a real implementation, this would sync with a server
    showStatusMessage('Back online - data synced!', 'info');
}

// Enhanced Doctor Dashboard Functions

// Show doctor dashboard tabs
function showDoctorTab(tabName) {
    // Hide all doctor tabs
    const tabs = document.querySelectorAll('.doctor-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hide all tab buttons
    const tabButtons = document.querySelectorAll('.doctor-tabs .tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    const activeTab = document.getElementById(`doctor-${tabName}`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Activate corresponding button
    const activeButton = document.querySelector(`[onclick="showDoctorTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Special handling for different tabs
    if (tabName === 'requests') {
        loadDoctorRequests();
    } else if (tabName === 'analytics') {
        updateAnalytics();
    } else if (tabName === 'history') {
        // Initialize patient history search
    }
}

// Filter patient requests
function filterRequests() {
    const urgencyFilter = document.getElementById('urgencyFilter')?.value;
    const searchFilter = document.getElementById('patientSearchFilter')?.value.toLowerCase();
    
    const requests = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    let filteredRequests = requests;
    
    // Filter by urgency
    if (urgencyFilter && urgencyFilter !== 'all') {
        filteredRequests = filteredRequests.filter(request => request.urgency === urgencyFilter);
    }
    
    // Filter by search term
    if (searchFilter) {
        filteredRequests = filteredRequests.filter(request => 
            request.name.toLowerCase().includes(searchFilter) ||
            request.village.toLowerCase().includes(searchFilter) ||
            request.symptoms.toLowerCase().includes(searchFilter)
        );
    }
    
    // Sort and display
    displayFilteredRequests(filteredRequests);
}

// Display filtered requests
function displayFilteredRequests(requests) {
    const requestsList = document.getElementById('requestsList');
    if (!requestsList) return;
    
    if (requests.length === 0) {
        requestsList.innerHTML = `<p>${t('no_requests')}</p>`;
        return;
    }
    
    // Sort by urgency and timestamp
    requests.sort((a, b) => {
        const urgencyOrder = { emergency: 4, high: 3, medium: 2, low: 1 };
        if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
            return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        }
        return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    requestsList.innerHTML = requests.map(request => `
        <div class="patient-request urgency-${request.urgency}">
            <h4>${request.name} (${request.age} years) - ${request.village}</h4>
            <p><strong>Phone:</strong> ${request.phone}</p>
            <p><strong>Urgency:</strong> ${t(request.urgency)}</p>
            <p><strong>Symptoms:</strong> ${request.symptoms}</p>
            <p><strong>Submitted:</strong> ${new Date(request.timestamp).toLocaleString()}</p>
            <div style="margin-top: 15px;">
                <textarea id="response-${request.id}" placeholder="${t('consultation_notes')}" rows="3" style="width: 100%; margin-bottom: 10px;"></textarea>
                <button onclick="respondToPatient('${request.id}')">${t('send_response')}</button>
                <button onclick="viewPatientHistory('${request.phone}')" style="margin-left: 10px;">View History</button>
            </div>
        </div>
    `).join('');
}

// Search patient history
function searchPatientHistory() {
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase();
    if (!searchTerm) return;
    
    const patients = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    const consultations = getStoredData(STORAGE_KEYS.CONSULTATIONS) || [];
    
    // Find patient by name or phone
    const matchingPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm)
    );
    
    displayPatientHistory(matchingPatients, consultations);
}

// View specific patient history
function viewPatientHistory(phoneNumber) {
    // Switch to history tab
    showDoctorTab('history');
    
    const patients = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    const consultations = getStoredData(STORAGE_KEYS.CONSULTATIONS) || [];
    
    const patientHistory = patients.filter(p => p.phone === phoneNumber);
    displayPatientHistory(patientHistory, consultations);
}

// Display patient history
function displayPatientHistory(patients, consultations) {
    const historyResults = document.getElementById('patientHistoryResults');
    if (!historyResults) return;
    
    if (patients.length === 0) {
        historyResults.innerHTML = '<p>No patient history found.</p>';
        return;
    }
    
    historyResults.innerHTML = patients.map(patient => {
        const patientConsultations = consultations.filter(c => c.patientId === patient.id);
        
        return `
            <div class="patient-history-card">
                <h4>${patient.name} - ${patient.phone}</h4>
                <p><strong>Village:</strong> ${patient.village} | <strong>Age:</strong> ${patient.age}</p>
                <div class="consultation-history">
                    <h5>Consultation History:</h5>
                    <div class="consultation-item">
                        <p><strong>Date:</strong> ${new Date(patient.timestamp).toLocaleDateString()}</p>
                        <p><strong>Symptoms:</strong> ${patient.symptoms}</p>
                        <p><strong>Urgency:</strong> ${t(patient.urgency)}</p>
                        ${patient.response ? `<p><strong>Response:</strong> ${patient.response}</p>` : '<p><em>No response yet</em></p>'}
                    </div>
                    ${patientConsultations.map(consultation => `
                        <div class="consultation-item">
                            <p><strong>Follow-up:</strong> ${new Date(consultation.timestamp).toLocaleDateString()}</p>
                            <p><strong>Notes:</strong> ${consultation.response}</p>
                            <p><strong>Doctor:</strong> ${consultation.doctorName}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Prescription Management
function addMedicineToPrescription() {
    const medicinesList = document.getElementById('medicinesList');
    if (!medicinesList) return;
    
    const newMedicine = document.createElement('div');
    newMedicine.className = 'medicine-prescription';
    newMedicine.innerHTML = `
        <div class="form-row">
            <div class="form-group third-width">
                <input type="text" placeholder="Medicine name" class="medicine-name" required>
            </div>
            <div class="form-group third-width">
                <input type="text" placeholder="Dosage (e.g., 500mg)" class="medicine-dosage" required>
            </div>
            <div class="form-group third-width">
                <input type="text" placeholder="Instructions (e.g., twice daily)" class="medicine-instructions" required>
                <button type="button" onclick="removeMedicine(this)" style="margin-left: 10px;">Remove</button>
            </div>
        </div>
    `;
    
    medicinesList.appendChild(newMedicine);
}

// Remove medicine from prescription
function removeMedicine(button) {
    button.closest('.medicine-prescription').remove();
}

// Handle prescription form submission
function handlePrescriptionSubmission(event) {
    event.preventDefault();
    
    const patientName = document.getElementById('prescriptionPatientName').value;
    const patientPhone = document.getElementById('prescriptionPatientPhone').value;
    const diagnosis = document.getElementById('prescriptionDiagnosis').value;
    const notes = document.getElementById('prescriptionNotes').value;
    
    // Collect all medicines
    const medicines = [];
    const medicineRows = document.querySelectorAll('.medicine-prescription');
    medicineRows.forEach(row => {
        const name = row.querySelector('.medicine-name').value;
        const dosage = row.querySelector('.medicine-dosage').value;
        const instructions = row.querySelector('.medicine-instructions').value;
        
        if (name && dosage && instructions) {
            medicines.push({ name, dosage, instructions });
        }
    });
    
    if (medicines.length === 0) {
        showStatusMessage('Please add at least one medicine', 'error');
        return;
    }
    
    const prescription = {
        id: generateId(),
        patientName,
        patientPhone,
        diagnosis,
        medicines,
        notes,
        timestamp: new Date().toISOString(),
        doctorName: 'Dr. Civil Hospital'
    };
    
    // Save prescription
    const prescriptions = getStoredData('nabha_prescriptions') || [];
    prescriptions.push(prescription);
    localStorage.setItem('nabha_prescriptions', JSON.stringify(prescriptions));
    
    // Display generated prescription
    displayGeneratedPrescription(prescription);
    
    // Reset form
    event.target.reset();
    // Reset medicines list to just one medicine row
    const medicinesList = document.getElementById('medicinesList');
    const allMedicines = medicinesList.querySelectorAll('.medicine-prescription');
    for (let i = 1; i < allMedicines.length; i++) {
        allMedicines[i].remove();
    }
    
    showStatusMessage(t('prescription_generated') || 'Prescription generated successfully!', 'success');
}

// Display generated prescription
function displayGeneratedPrescription(prescription) {
    const generatedDiv = document.getElementById('generatedPrescriptions');
    if (!generatedDiv) return;
    
    const prescriptionHTML = `
        <div class="generated-prescription">
            <div class="prescription-header">
                <h4>Digital Prescription</h4>
                <p><strong>Date:</strong> ${new Date(prescription.timestamp).toLocaleDateString()}</p>
                <p><strong>Doctor:</strong> ${prescription.doctorName}</p>
            </div>
            <div class="prescription-patient">
                <p><strong>Patient:</strong> ${prescription.patientName}</p>
                <p><strong>Phone:</strong> ${prescription.patientPhone}</p>
                <p><strong>Diagnosis:</strong> ${prescription.diagnosis}</p>
            </div>
            <div class="prescription-medicines">
                <h5>Prescribed Medicines:</h5>
                ${prescription.medicines.map(med => `
                    <div class="prescribed-medicine">
                        <p><strong>${med.name}</strong> - ${med.dosage}</p>
                        <p><em>${med.instructions}</em></p>
                    </div>
                `).join('')}
            </div>
            ${prescription.notes ? `<div class="prescription-notes">
                <p><strong>Additional Notes:</strong> ${prescription.notes}</p>
            </div>` : ''}
            <div class="prescription-actions">
                <button onclick="printPrescription('${prescription.id}')">Print</button>
                <button onclick="sharePrescription('${prescription.id}')">Share</button>
            </div>
        </div>
    `;
    
    generatedDiv.innerHTML = prescriptionHTML + generatedDiv.innerHTML;
}

// Update medical analytics
function updateAnalytics() {
    const patients = getStoredData(STORAGE_KEYS.PATIENTS) || [];
    const consultations = getStoredData(STORAGE_KEYS.CONSULTATIONS) || [];
    
    // Total consultations
    const totalConsultationsEl = document.getElementById('totalConsultations');
    if (totalConsultationsEl) {
        totalConsultationsEl.textContent = patients.length;
    }
    
    // Emergency cases
    const emergencyCases = patients.filter(p => p.urgency === 'emergency').length;
    const emergencyCasesEl = document.getElementById('emergencyCases');
    if (emergencyCasesEl) {
        emergencyCasesEl.textContent = emergencyCases;
    }
    
    // Common symptoms analysis
    const symptomsCount = {};
    patients.forEach(patient => {
        const symptoms = patient.symptoms.toLowerCase().split(/[\s,]+/);
        symptoms.forEach(symptom => {
            if (symptom.length > 3) { // Ignore short words
                symptomsCount[symptom] = (symptomsCount[symptom] || 0) + 1;
            }
        });
    });
    
    const commonSymptomsEl = document.getElementById('commonSymptoms');
    if (commonSymptomsEl) {
        const topSymptoms = Object.entries(symptomsCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([symptom, count]) => `${symptom} (${count})`)
            .join(', ');
        commonSymptomsEl.textContent = topSymptoms || 'No data yet';
    }
    
    // Average response time
    const respondedPatients = patients.filter(p => p.status === 'responded');
    if (respondedPatients.length > 0) {
        const avgTime = respondedPatients.reduce((sum, patient) => {
            const responseTime = consultations.find(c => c.patientId === patient.id);
            if (responseTime) {
                const timeDiff = new Date(responseTime.timestamp) - new Date(patient.timestamp);
                return sum + (timeDiff / (1000 * 60 * 60)); // Convert to hours
            }
            return sum;
        }, 0) / respondedPatients.length;
        
        const avgResponseTimeEl = document.getElementById('avgResponseTime');
        if (avgResponseTimeEl) {
            avgResponseTimeEl.textContent = avgTime.toFixed(1) + ' hours';
        }
    }
}

// Print prescription (placeholder)
function printPrescription(prescriptionId) {
    showStatusMessage('Print functionality would open print dialog', 'info');
}

// Share prescription (placeholder)
function sharePrescription(prescriptionId) {
    showStatusMessage('Share functionality would open share options', 'info');
}

// Emergency and Government Schemes Functions

// Emergency Functions
function callAmbulance() {
    if (confirm('Call 108 for Ambulance?')) {
        window.location.href = 'tel:108';
    }
}

function callPolice() {
    if (confirm('Call 100 for Police Emergency?')) {
        window.location.href = 'tel:100';
    }
}

function callFire() {
    if (confirm('Call 101 for Fire Emergency?')) {
        window.location.href = 'tel:101';
    }
}

function callWomenHelpline() {
    if (confirm('Call 1091 for Women Helpline?')) {
        window.location.href = 'tel:1091';
    }
}

function callEmergency() {
    callAmbulance();
}

// Location Functions
function getCurrentLocation() {
    const locationDisplay = document.getElementById('locationDisplay');
    
    if (navigator.geolocation) {
        locationDisplay.innerHTML = '<p>Getting your location...</p>';
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                locationDisplay.innerHTML = `
                    <div class="location-info">
                        <p><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
                        <p><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
                        <p><strong>Accuracy:</strong> ${position.coords.accuracy} meters</p>
                        <p class="location-text">Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                    </div>
                `;
                
                // Store location for sharing
                window.currentLocation = { lat, lng };
                
                showStatusMessage('Location found successfully!', 'success');
            },
            function(error) {
                let errorMsg = 'Could not get location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += 'Location access denied by user.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg += 'Location request timed out.';
                        break;
                    default:
                        errorMsg += 'Unknown location error.';
                        break;
                }
                locationDisplay.innerHTML = `<p class="error">${errorMsg}</p>`;
                showStatusMessage(errorMsg, 'error');
            }
        );
    } else {
        locationDisplay.innerHTML = '<p class="error">Geolocation not supported by this browser.</p>';
        showStatusMessage('Geolocation not supported', 'error');
    }
}

function shareLocation() {
    if (window.currentLocation) {
        const { lat, lng } = window.currentLocation;
        const locationText = `My emergency location: https://maps.google.com/?q=${lat},${lng}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Emergency Location',
                text: locationText
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(locationText).then(() => {
                showStatusMessage('Location copied to clipboard!', 'success');
            }).catch(() => {
                alert(`Share this location: ${locationText}`);
            });
        }
    } else {
        showStatusMessage('Please get your location first', 'error');
        getCurrentLocation();
    }
}

function sendLocationSMS() {
    if (window.currentLocation) {
        const { lat, lng } = window.currentLocation;
        const message = `EMERGENCY: I need help at location: ${lat.toFixed(6)}, ${lng.toFixed(6)}. Google Maps: https://maps.google.com/?q=${lat},${lng}`;
        window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    } else {
        showStatusMessage('Please get your location first', 'error');
        getCurrentLocation();
    }
}

// Government Schemes Functions
function checkEligibility(scheme) {
    let message = '';
    switch(scheme) {
        case 'ayushman':
            message = 'To check Ayushman Bharat eligibility:\n\n1. Visit: https://pmjay.gov.in/\n2. Enter your mobile number\n3. Verify with OTP\n4. Check your family eligibility';
            break;
        default:
            message = 'Please visit the nearest Civil Hospital or PHC for eligibility verification.';
    }
    alert(message);
}

function findNearbyCenter(scheme) {
    let message = 'Nearby Government Health Centers:\n\n';
    message += '1. Civil Hospital Nabha - 01762-230345\n';
    message += '2. PHC Nabha - Main Market\n';
    message += '3. CHC Rajpura - 15 km from Nabha\n';
    message += '4. District Hospital Patiala - 25 km';
    alert(message);
}

function findJanAushadhiStore() {
    let message = 'Jan Aushadhi Stores near Nabha:\n\n';
    message += '1. Civil Hospital Jan Aushadhi Store\n';
    message += '2. Main Market Jan Aushadhi Store\n';
    message += '3. Railway Station Jan Aushadhi Store\n\n';
    message += 'All stores offer 50-90% discount on generic medicines.';
    alert(message);
}

// Initialize location on Emergency section load
function initializeEmergencySection() {
    getCurrentLocation();
}

// Export functions for global use
window.showSection = showSection;
window.showPharmacyTab = showPharmacyTab;
window.searchMedicine = searchMedicine;
window.respondToPatient = respondToPatient;
window.answerSymptomQuestion = answerSymptomQuestion;
window.initializeSymptomChecker = initializeSymptomChecker;

// New enhanced functions
window.showDoctorTab = showDoctorTab;
window.filterRequests = filterRequests;
window.searchPatientHistory = searchPatientHistory;
window.viewPatientHistory = viewPatientHistory;
window.addMedicineToPrescription = addMedicineToPrescription;
window.removeMedicine = removeMedicine;

// New enhanced symptom checker functions
window.showSymptomMode = showSymptomMode;
window.selectSymptomOption = selectSymptomOption;
window.goBackSymptom = goBackSymptom;
window.restartSymptomChecker = restartSymptomChecker;
window.quickSymptomCheck = quickSymptomCheck;

// Emergency and Government Schemes functions
window.callAmbulance = callAmbulance;
window.callPolice = callPolice;
window.callFire = callFire;
window.callWomenHelpline = callWomenHelpline;
window.callEmergency = callEmergency;
window.getCurrentLocation = getCurrentLocation;
window.shareLocation = shareLocation;
window.sendLocationSMS = sendLocationSMS;
window.checkEligibility = checkEligibility;
window.findNearbyCenter = findNearbyCenter;
window.findJanAushadhiStore = findJanAushadhiStore;
