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

// Symptom checker logic
const symptomTree = {
    0: {
        question: "Do you have fever?",
        yes: 1,
        no: 2
    },
    1: {
        question: "Is your temperature above 102°F (39°C)?",
        yes: 'high_fever',
        no: 3
    },
    2: {
        question: "Do you have pain anywhere?",
        yes: 4,
        no: 5
    },
    3: {
        question: "Do you have cough or cold symptoms?",
        yes: 'fever_cold',
        no: 'fever_only'
    },
    4: {
        question: "Is the pain in your chest or difficulty breathing?",
        yes: 'chest_pain',
        no: 'general_pain'
    },
    5: {
        question: "Do you have stomach problems (nausea, vomiting, diarrhea)?",
        yes: 'stomach_issues',
        no: 'general_checkup'
    }
};

const symptomResults = {
    high_fever: {
        title: "High Fever",
        advice: "Your fever is high. Please visit the hospital immediately or contact emergency services. Take paracetamol and drink plenty of fluids.",
        urgency: "emergency"
    },
    fever_cold: {
        title: "Fever with Cold Symptoms",
        advice: "You likely have a viral infection. Rest, drink fluids, take paracetamol for fever. If symptoms worsen or persist beyond 3 days, consult a doctor.",
        urgency: "medium"
    },
    fever_only: {
        title: "Fever Only",
        advice: "Monitor your temperature. Take paracetamol, rest, and drink fluids. If fever persists beyond 2 days, consult a doctor.",
        urgency: "low"
    },
    chest_pain: {
        title: "Chest Pain / Breathing Difficulty",
        advice: "This could be serious. Please visit the hospital immediately or call emergency services.",
        urgency: "emergency"
    },
    general_pain: {
        title: "General Pain",
        advice: "Try rest and over-the-counter pain relief. If pain is severe or persistent, consult a doctor.",
        urgency: "low"
    },
    stomach_issues: {
        title: "Stomach Problems",
        advice: "Drink plenty of fluids, eat light foods (rice, bananas). If symptoms are severe or persist beyond 24 hours, consult a doctor.",
        urgency: "medium"
    },
    general_checkup: {
        title: "General Health Check",
        advice: "You may want a routine check-up with a doctor. No immediate concerns based on your responses.",
        urgency: "low"
    }
};

// Start symptom checker
function startSymptomChecker() {
    const questionsDiv = document.getElementById('symptomQuestions');
    const step = symptomTree[currentSymptomStep];
    
    if (!step) return;
    
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

// Answer symptom question
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

// Export functions for global use
window.showSection = showSection;
window.showPharmacyTab = showPharmacyTab;
window.searchMedicine = searchMedicine;
window.respondToPatient = respondToPatient;
window.answerSymptomQuestion = answerSymptomQuestion;
window.initializeSymptomChecker = initializeSymptomChecker;