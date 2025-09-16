// EduKyu Course Page Data Creator JavaScript

// Global data object to store the course information
let courseData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    setupEventListeners();
    initializeNavigation();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navigationPane = document.getElementById('navigationPane');
    const navContent = document.getElementById('navContent');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle navigation on mobile
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navigationPane.classList.toggle('open');

            // Update toggle icon
            if (navigationPane.classList.contains('open')) {
                navToggle.textContent = '✕';
            } else {
                navToggle.textContent = '☰';
            }
        });
    }

    // Close navigation when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (!navigationPane.contains(e.target) && navigationPane.classList.contains('open')) {
                navigationPane.classList.remove('open');
                navToggle.textContent = '☰';
            }
        }
    });

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Get target section
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile navigation
                if (window.innerWidth <= 768) {
                    navigationPane.classList.remove('open');
                    navToggle.textContent = '☰';
                }
            }
        });
    });

    // Update active section on scroll
    window.addEventListener('scroll', throttle(function () {
        updateActiveSection();
        updateProgressBar();
    }, 100));

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            navigationPane.classList.remove('open');
            navToggle.textContent = '☰';
        }
    });

    // Initial active section
    updateActiveSection();
    updateProgressBar();
}

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function updateActiveSection() {
    const sections = document.querySelectorAll('.section, .action-buttons');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        // Check if section is in viewport (considering navigation height)
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.id;
        }
    });

    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    if (!progressFill) return;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / documentHeight) * 100;

    progressFill.style.width = Math.min(scrollPercent, 100) + '%';
}

function initializeForm() {
    // Add initial items for dynamic sections
    if (document.getElementById('accreditations-container').children.length === 0) {
        addAccreditation();
    }
    if (document.getElementById('benefits-container').children.length === 0) {
        addBenefit();
    }
    if (document.getElementById('semesters-container').children.length === 0) {
        addSemester();
    }
    if (document.getElementById('faculty-container').children.length === 0) {
        addFaculty();
    }
    if (document.getElementById('admission-container').children.length === 0) {
        addAdmissionStep();
    }
    if (document.getElementById('faq-container').children.length === 0) {
        addFAQ();
    }
    if (document.getElementById('fee-categories-container').children.length === 0) {
        addFeeCategory();
    }
    if (document.getElementById('financial-options-container').children.length === 0) {
        addFinancialOption();
    }
    if (document.getElementById('tool-categories-container').children.length === 0) {
        addToolCategory();
    }
    if (document.getElementById('placement-assistance-container').children.length === 0) {
        addPlacementService();
    }
    // Initialize course selection with first course pre-filled
    const firstCourseSelect = document.querySelector('select[name="courseName[]"]');
    if (firstCourseSelect) {
        firstCourseSelect.value = 'MCA';
        autofillCourseData(firstCourseSelect, 'MCA');
    }
}

function setupEventListeners() {
    // Form validation on input
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });

    // Form reset handler
    document.getElementById('resetBtn').addEventListener('click', function () {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            resetForm();
        }
    });
}

// Custom University and Program Functions
function toggleCustomUniversity() {
    const universitySelect = document.getElementById('university');
    const customGroup = document.getElementById('custom-university-group');
    const customInput = document.getElementById('customUniversityKey');

    if (universitySelect.value === 'custom') {
        customGroup.style.display = 'block';
        customInput.required = true;
        showMessage('Please enter a unique university key using lowercase letters and underscores only.', 'info');
    } else {
        customGroup.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
    }
}

function toggleCustomProgram() {
    const programSelect = document.getElementById('program');
    const customGroup = document.getElementById('custom-program-group');
    const customInput = document.getElementById('customProgramKey');

    if (programSelect.value === 'custom') {
        customGroup.style.display = 'block';
        customInput.required = true;
        showMessage('Please enter a unique program key using lowercase letters and underscores only.', 'info');
    } else {
        customGroup.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
    }
}

function validateCustomKey(input) {
    const value = input.value.trim();
    const pattern = /^[a-z_]+$/;

    if (value && !pattern.test(value)) {
        showFieldError(input, 'Use only lowercase letters and underscores');
        return false;
    }

    if (value && value.length < 3) {
        showFieldError(input, 'Key must be at least 3 characters long');
        return false;
    }

    return true;
}

function updateKeyPreview(type) {
    const input = document.getElementById(`custom${type.charAt(0).toUpperCase() + type.slice(1)}Key`);
    const preview = document.getElementById(`${type}-key-preview`);
    const value = input.value.trim();

    if (value) {
        const isValid = /^[a-z_]+$/.test(value);
        preview.innerHTML = `
            <strong>Preview:</strong> 
            <code style="color: ${isValid ? '#22543d' : '#e53e3e'}">"${value}"</code>
            ${isValid ? '✓' : '✗ Invalid format'}
        `;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

// Validation Functions
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();

    // Remove existing validation
    clearValidation(event);

    // Basic validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    if (field.type === 'url' && value && !isValidUrl(value)) {
        showFieldError(field, 'Please enter a valid URL');
        return false;
    }

    // Custom key validation
    if (field.id === 'customUniversityKey' || field.id === 'customProgramKey') {
        return validateCustomKey(field);
    }

    return true;
}

function clearValidation(event) {
    const field = event.target;
    field.classList.remove('invalid');
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
    }
}

function showFieldError(field, message) {
    field.classList.add('invalid');
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('has-error');
        let errorDiv = formGroup.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Dynamic Form Element Functions
function addAccreditation() {
    const container = document.getElementById('accreditations-container');
    const div = document.createElement('div');
    div.className = 'accreditation-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Accreditation Name:</label>
                <input type="text" name="accreditationName[]" placeholder="e.g., UGC Entitled" required>
            </div>
            <div class="form-group">
                <label>Icon URL:</label>
                <input type="url" name="accreditationIcon[]" placeholder="Icon URL">
            </div>
        </div>
        <div class="form-group">
            <label>Description (optional):</label>
            <input type="text" name="accreditationDescription[]" placeholder="e.g., Entitled Online Degrees Equivalent to Campus Degree">
        </div>
        <button type="button" class="remove-btn" onclick="removeAccreditation(this)">Remove</button>
    `;

    container.appendChild(div);
}

function removeAccreditation(button) {
    const container = document.getElementById('accreditations-container');
    if (container.children.length > 1) {
        button.closest('.accreditation-item').remove();
    } else {
        showMessage('At least one accreditation must remain', 'error');
    }
}

function addBenefit() {
    const container = document.getElementById('benefits-container');
    const div = document.createElement('div');
    div.className = 'benefit-item';

    div.innerHTML = `
        <div class="form-group">
            <label>Benefit Title:</label>
            <input type="text" name="benefitTitle[]" placeholder="e.g., Enhanced Earning Potential" required>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea name="benefitDescription[]" rows="3" placeholder="Benefit description..." required></textarea>
        </div>
        <div class="form-group">
            <label>Image URL:</label>
            <input type="url" name="benefitImage[]" placeholder="Image URL">
        </div>
        <button type="button" class="remove-btn" onclick="removeBenefit(this)">Remove</button>
    `;

    container.appendChild(div);
}

function removeBenefit(button) {
    const container = document.getElementById('benefits-container');
    if (container.children.length > 1) {
        button.closest('.benefit-item').remove();
    } else {
        showMessage('At least one benefit must remain', 'error');
    }
}

function addSemester() {
    const container = document.getElementById('semesters-container');
    const div = document.createElement('div');
    div.className = 'semester-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Semester Number:</label>
                <input type="number" name="semesterNumber[]" placeholder="1" min="1" max="8">
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input type="text" name="semesterDescription[]" placeholder="Semester description...">
            </div>
        </div>
        <div class="form-group">
            <label>Courses (one per line):</label>
            <textarea name="semesterCourses[]" rows="4" placeholder="Enter courses, one per line..."></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeSemester(this)">Remove Semester</button>
    `;

    container.appendChild(div);
}

function removeSemester(button) {
    button.closest('.semester-item').remove();
}

function addFaculty() {
    const container = document.getElementById('faculty-container');
    const div = document.createElement('div');
    div.className = 'faculty-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Faculty Name:</label>
                <input type="text" name="facultyName[]" placeholder="e.g., Dr. John Smith">
            </div>
            <div class="form-group">
                <label>Position:</label>
                <input type="text" name="facultyPosition[]" placeholder="e.g., Professor">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Qualifications:</label>
                <input type="text" name="facultyQualifications[]" placeholder="e.g., Ph.D., M.Phil., MBA">
            </div>
            <div class="form-group">
                <label>Image URL:</label>
                <input type="url" name="facultyImage[]" placeholder="Faculty image URL">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeFaculty(this)">Remove Faculty</button>
    `;

    container.appendChild(div);
}

function removeFaculty(button) {
    button.closest('.faculty-item').remove();
}

function addAdmissionStep() {
    const container = document.getElementById('admission-container');
    const div = document.createElement('div');
    div.className = 'admission-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Step Number:</label>
                <input type="number" name="admissionStep[]" placeholder="1" min="1" max="10">
            </div>
            <div class="form-group">
                <label>Step Title:</label>
                <input type="text" name="admissionTitle[]" placeholder="e.g., Program registration">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Description:</label>
                <textarea name="admissionDescription[]" rows="2" placeholder="Step description..."></textarea>
            </div>
            <div class="form-group">
                <label>Icon URL:</label>
                <input type="url" name="admissionIcon[]" placeholder="Icon URL">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeAdmissionStep(this)">Remove Step</button>
    `;

    container.appendChild(div);
}

function removeAdmissionStep(button) {
    button.closest('.admission-item').remove();
}

function addFAQ() {
    const container = document.getElementById('faq-container');
    const div = document.createElement('div');
    div.className = 'faq-item';

    div.innerHTML = `
        <div class="form-group">
            <label>Question:</label>
            <input type="text" name="faqQuestion[]" placeholder="e.g., What is the cost of an online MBA?">
        </div>
        <div class="form-group">
            <label>Answer:</label>
            <textarea name="faqAnswer[]" rows="3" placeholder="Answer to the question..."></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeFAQ(this)">Remove FAQ</button>
    `;

    container.appendChild(div);
}

function removeFAQ(button) {
    button.closest('.faq-item').remove();
}

function addFeeCategory() {
    const container = document.getElementById('fee-categories-container');
    const div = document.createElement('div');
    div.className = 'fee-category-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Category Name:</label>
                <input type="text" name="feeCategoryName[]" placeholder="e.g., Indian Students">
            </div>
            <div class="form-group">
                <label>Full Course Fee:</label>
                <input type="text" name="feeCategoryFullFee[]" placeholder="e.g., INR 1,75,000">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Per Semester Fee:</label>
                <input type="text" name="feeCategoryPerSemester[]" placeholder="e.g., INR 43,750">
            </div>
            <div class="form-group">
                <label>EMI Option:</label>
                <input type="text" name="feeCategoryEMI[]" placeholder="e.g., INR 7,292/month*">
            </div>
        </div>
        <div class="form-group">
            <label>Note (optional):</label>
            <textarea name="feeCategoryNote[]" rows="2" placeholder="Additional notes for this fee category..."></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeFeeCategory(this)">Remove Category</button>
    `;

    container.appendChild(div);
}

function removeFeeCategory(button) {
    button.closest('.fee-category-item').remove();
}

function addFinancialOption() {
    const container = document.getElementById('financial-options-container');
    const div = document.createElement('div');
    div.className = 'financial-option-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Option Title:</label>
                <input type="text" name="financialOptionTitle[]" placeholder="e.g., Avail easy financing options">
            </div>
            <div class="form-group">
                <label>Icon URL:</label>
                <input type="url" name="financialOptionIcon[]" placeholder="Icon URL">
            </div>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea name="financialOptionDescription[]" rows="2" placeholder="Description of the financial option..."></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removeFinancialOption(this)">Remove Option</button>
    `;

    container.appendChild(div);
}

function removeFinancialOption(button) {
    button.closest('.financial-option-item').remove();
}

function addToolCategory() {
    const container = document.getElementById('tool-categories-container');
    const div = document.createElement('div');
    div.className = 'tool-category-item';

    div.innerHTML = `
        <div class="form-group">
            <label>Category Name:</label>
            <input type="text" name="toolCategoryName[]" placeholder="e.g., Future Tech For Emerging Leaders">
        </div>
        
        <div class="tool-input-methods">
            <div class="method-tabs">
                <button type="button" class="method-tab active" onclick="switchToolMethod(this, 'simple')">Simple List</button>
                <button type="button" class="method-tab" onclick="switchToolMethod(this, 'detailed')">Detailed Items</button>
            </div>
            
            <!-- Simple Method: Items per line -->
            <div class="tool-method simple-method active">
                <div class="form-group">
                    <label>Items (one per line):</label>
                    <textarea name="toolCategoryItems[]" rows="4"
                        placeholder="Enter items, one per line...&#10;e.g.,&#10;Data Analytics for Business Decisions&#10;Innovation&#10;Project Management Essentials"></textarea>
                </div>
            </div>
            
            <!-- Detailed Method: Individual items with links and icons -->
            <div class="tool-method detailed-method">
                <div class="tools-container">
                    <div class="tool-item">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Tool/Certification Name:</label>
                                <input type="text" name="toolItemName[]" placeholder="e.g., Data Analytics for Business Decisions">
                            </div>
                            <div class="form-group">
                                <label>Link (optional):</label>
                                <input type="url" name="toolItemLink[]" placeholder="https://example.com/course">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Icon URL (optional):</label>
                                <input type="url" name="toolItemIcon[]" placeholder="https://example.com/icon.png">
                            </div>
                            <div class="form-group">
                                <label>Description (optional):</label>
                                <input type="text" name="toolItemDescription[]" placeholder="Brief description">
                            </div>
                        </div>
                        <button type="button" class="remove-btn" onclick="removeToolItem(this)">Remove Tool</button>
                    </div>
                </div>
                <button type="button" class="add-btn" onclick="addToolItem(this)">+ Add Tool/Certification</button>
            </div>
        </div>
        
        <button type="button" class="remove-btn" onclick="removeToolCategory(this)">Remove Category</button>
    `;

    container.appendChild(div);
}

function removeToolCategory(button) {
    button.closest('.tool-category-item').remove();
}

function addPlacementService() {
    const container = document.getElementById('placement-assistance-container');
    const div = document.createElement('div');
    div.className = 'placement-item';

    div.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Service Title:</label>
                <input type="text" name="placementTitle[]" placeholder="e.g., Resume building">
            </div>
            <div class="form-group">
                <label>Image URL:</label>
                <input type="url" name="placementImage[]" placeholder="Service image URL">
            </div>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <textarea name="placementDescription[]" rows="3" 
                      placeholder="Description of the placement service..."></textarea>
        </div>
        <button type="button" class="remove-btn" onclick="removePlacementService(this)">Remove Service</button>
    `;

    container.appendChild(div);
}

function removePlacementService(button) {
    button.closest('.placement-item').remove();
}

// Tab Functions
function showEligibilityTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.eligibility-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-eligibility').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Data Collection Functions
function collectFormData() {
    const form = document.getElementById('courseDataForm');
    const formData = new FormData(form);

    // Get basic data with custom handling
    let university = formData.get('university');
    let program = formData.get('program');

    // Handle custom university
    if (university === 'custom') {
        const customUniversityKey = formData.get('customUniversityKey')?.trim();
        if (!customUniversityKey) {
            showMessage('Please enter a custom university key', 'error');
            return null;
        }
        if (!validateCustomKey(document.getElementById('customUniversityKey'))) {
            showMessage('Custom university key is invalid', 'error');
            return null;
        }
        university = customUniversityKey;
    }

    // Handle custom program
    if (program === 'custom') {
        const customProgramKey = formData.get('customProgramKey')?.trim();
        if (!customProgramKey) {
            showMessage('Please enter a custom program key', 'error');
            return null;
        }
        if (!validateCustomKey(document.getElementById('customProgramKey'))) {
            showMessage('Custom program key is invalid', 'error');
            return null;
        }
        program = customProgramKey;
    }

    if (!university || !program) {
        showMessage('Please select both university and program', 'error');
        return null;
    }

    // Build the data structure
    const data = {
        [university]: {
            [program]: {
                page: {
                    title: formData.get('pageTitle') || '',
                    university: formData.get('universityName') || '',
                    description: formData.get('description') || '',
                    logo: formData.get('logo') || '',
                    duration: {
                        length: formData.get('durationLength') || '',
                        weeklyHours: formData.get('weeklyHours') || '',
                        workExperience: formData.get('workExperience') || '',
                        semesters: formData.get('semesters') || ''
                    },
                    fees: {
                        total: formData.get('totalFees') || '',
                        perSemester: formData.get('perSemesterFees') || '',
                        emi: formData.get('emiFees') || '',
                        additionalBenefits: formData.get('additionalBenefits') || '',
                        original_price: formData.get('originalPrice') || '',
                        yearly: formData.get('yearlyFees') || ''
                    },
                    courses: getSelectedCourses()
                }
            }
        }
    };

    // Clean up fees object (remove empty fields)
    Object.keys(data[university][program].page.fees).forEach(key => {
        if (!data[university][program].page.fees[key]) {
            delete data[university][program].page.fees[key];
        }
    });

    // Clean up duration object (remove empty fields)
    Object.keys(data[university][program].page.duration).forEach(key => {
        if (!data[university][program].page.duration[key]) {
            delete data[university][program].page.duration[key];
        }
    });

    // Add page-level accreditations
    const pageAccreditations = [];
    const accreditationNames = formData.getAll('accreditationName[]');
    const accreditationIcons = formData.getAll('accreditationIcon[]');

    for (let i = 0; i < accreditationNames.length; i++) {
        if (accreditationNames[i]) {
            const accreditation = {
                name: accreditationNames[i],
                icon: accreditationIcons[i] || ''
            };
            if (accreditation.icon) {
                pageAccreditations.push(accreditation);
            }
        }
    }

    if (pageAccreditations.length > 0) {
        data[university][program].page.accreditations = pageAccreditations;
    }

    // Add detailed accreditations
    const detailedAccreditations = [];
    const accreditationDescriptions = formData.getAll('accreditationDescription[]');

    for (let i = 0; i < accreditationNames.length; i++) {
        if (accreditationNames[i]) {
            const accreditation = {
                name: accreditationNames[i],
                icon: accreditationIcons[i] || ''
            };

            if (accreditationDescriptions[i]) {
                accreditation.description = accreditationDescriptions[i];
            }

            detailedAccreditations.push(accreditation);
        }
    }

    if (detailedAccreditations.length > 0) {
        data[university][program].accreditations = detailedAccreditations;
    }

    // Add program benefits
    const programBenefits = [];
    const benefitTitles = formData.getAll('benefitTitle[]');
    const benefitDescriptions = formData.getAll('benefitDescription[]');
    const benefitImages = formData.getAll('benefitImage[]');

    for (let i = 0; i < benefitTitles.length; i++) {
        if (benefitTitles[i] && benefitDescriptions[i]) {
            const benefit = {
                title: benefitTitles[i],
                description: benefitDescriptions[i]
            };

            if (benefitImages[i]) {
                benefit.image = benefitImages[i];
            }

            programBenefits.push(benefit);
        }
    }

    if (programBenefits.length > 0) {
        data[university][program].programBenefits = programBenefits;
    }

    // Add eligibility
    const eligibility = {};

    // Domestic eligibility
    const domesticEducation = formData.get('domesticEducation');
    const domesticGrades = formData.get('domesticGrades');
    const domesticAptitudeTest = formData.get('domesticAptitudeTest');
    const domesticWorkExperience = formData.get('domesticWorkExperience');

    if (domesticEducation || domesticGrades || domesticAptitudeTest || domesticWorkExperience) {
        eligibility.domestic = {};
        if (domesticEducation) eligibility.domestic.educationalQualification = domesticEducation;
        if (domesticGrades) eligibility.domestic.grades = domesticGrades;
        if (domesticAptitudeTest) eligibility.domestic.aptitudeTest = domesticAptitudeTest;
        if (domesticWorkExperience) eligibility.domestic.workExperience = domesticWorkExperience;
    }

    // International eligibility
    const internationalEducation = formData.get('internationalEducation');
    const internationalGrades = formData.get('internationalGrades');
    const internationalAptitudeTest = formData.get('internationalAptitudeTest');
    const internationalOtherRequirements = formData.get('internationalOtherRequirements');
    const internationalEnglishProficiency = formData.get('internationalEnglishProficiency');
    const internationalEquivalenceCertificate = formData.get('internationalEquivalenceCertificate');

    if (internationalEducation || internationalGrades || internationalAptitudeTest ||
        internationalOtherRequirements || internationalEnglishProficiency || internationalEquivalenceCertificate) {
        eligibility.international = {};
        if (internationalEducation) eligibility.international.educationalQualification = internationalEducation;
        if (internationalGrades) eligibility.international.grades = internationalGrades;
        if (internationalAptitudeTest) eligibility.international.aptitudeTest = internationalAptitudeTest;
        if (internationalOtherRequirements) eligibility.international.otherRequirements = internationalOtherRequirements;
        if (internationalEnglishProficiency) eligibility.international.englishProficiency = internationalEnglishProficiency;
        if (internationalEquivalenceCertificate) eligibility.international.equivalenceCertificate = internationalEquivalenceCertificate;
    }

    // If there's no separate domestic/international, just use description
    if (Object.keys(eligibility).length === 0) {
        const generalEligibility = domesticEducation || internationalEducation;
        if (generalEligibility) {
            eligibility.description = generalEligibility;
        }
    }

    if (Object.keys(eligibility).length > 0) {
        data[university][program].eligibility = eligibility;
    }

    // Add curriculum
    const curriculum = {};
    const curriculumDuration = formData.get('curriculumDuration');
    const curriculumStructure = formData.get('curriculumStructure');
    const weeklyCommitment = formData.get('weeklyCommitment');
    const totalCredits = formData.get('totalCredits');

    if (curriculumDuration) curriculum.duration = curriculumDuration;
    if (curriculumStructure) curriculum.structure = curriculumStructure;
    if (weeklyCommitment) curriculum.weeklyCommitment = weeklyCommitment;
    if (totalCredits) curriculum.credits = totalCredits;

    // Add semesters
    const semesterNumbers = formData.getAll('semesterNumber[]');
    const semesterDescriptions = formData.getAll('semesterDescription[]');
    const semesterCourses = formData.getAll('semesterCourses[]');

    if (semesterNumbers.length > 0) {
        curriculum.semesters = [];
        for (let i = 0; i < semesterNumbers.length; i++) {
            if (semesterNumbers[i]) {
                const semester = {
                    number: parseInt(semesterNumbers[i])
                };

                if (semesterDescriptions[i]) {
                    semester.description = semesterDescriptions[i];
                }

                if (semesterCourses[i]) {
                    semester.courses = semesterCourses[i].split('\n').filter(course => course.trim());
                }

                curriculum.semesters.push(semester);
            }
        }

        // Sort semesters by number
        curriculum.semesters.sort((a, b) => a.number - b.number);
    }

    if (Object.keys(curriculum).length > 0) {
        data[university][program].curriculum = curriculum;
    }

    // Add faculty
    const faculty = [];
    const facultyNames = formData.getAll('facultyName[]');
    const facultyPositions = formData.getAll('facultyPosition[]');
    const facultyQualifications = formData.getAll('facultyQualifications[]');
    const facultyImages = formData.getAll('facultyImage[]');

    for (let i = 0; i < facultyNames.length; i++) {
        if (facultyNames[i]) {
            const facultyMember = {
                name: facultyNames[i]
            };

            if (facultyPositions[i]) facultyMember.position = facultyPositions[i];
            if (facultyQualifications[i]) facultyMember.qualifications = facultyQualifications[i];
            if (facultyImages[i]) facultyMember.image = facultyImages[i];

            faculty.push(facultyMember);
        }
    }

    if (faculty.length > 0) {
        data[university][program].faculty = faculty;
    }

    // Add admission process
    const admissionProcess = [];
    const admissionSteps = formData.getAll('admissionStep[]');
    const admissionTitles = formData.getAll('admissionTitle[]');
    const admissionDescriptions = formData.getAll('admissionDescription[]');
    const admissionIcons = formData.getAll('admissionIcon[]');

    for (let i = 0; i < admissionSteps.length; i++) {
        if (admissionSteps[i] && admissionTitles[i]) {
            const step = {
                step: parseInt(admissionSteps[i]),
                title: admissionTitles[i]
            };

            if (admissionDescriptions[i]) step.description = admissionDescriptions[i];
            if (admissionIcons[i]) step.icon = admissionIcons[i];

            admissionProcess.push(step);
        }
    }

    if (admissionProcess.length > 0) {
        // Sort by step number
        admissionProcess.sort((a, b) => a.step - b.step);
        data[university][program].admissionProcess = admissionProcess;
    }

    // Add career opportunities
    const jobRoles = formData.get('jobRoles');
    const industries = formData.get('industries');

    if (jobRoles || industries) {
        const careerOpportunities = {};

        if (jobRoles) {
            careerOpportunities.jobRoles = jobRoles.split('\n').filter(role => role.trim()).map(role => role.trim());
        }

        if (industries) {
            careerOpportunities.industries = industries.split('\n').filter(industry => industry.trim()).map(industry => industry.trim());
        }

        if (Object.keys(careerOpportunities).length > 0) {
            data[university][program].careerOpportunities = careerOpportunities;
        }
    }

    // Add FAQs
    const faqQuestions = formData.getAll('faqQuestion[]');
    const faqAnswers = formData.getAll('faqAnswer[]');

    const faqs = [];
    for (let i = 0; i < faqQuestions.length; i++) {
        if (faqQuestions[i] && faqAnswers[i]) {
            faqs.push({
                question: faqQuestions[i],
                answer: faqAnswers[i]
            });
        }
    }

    if (faqs.length > 0) {
        data[university][program].faqs = faqs;
    }

    // Detailed Fee Structure
    const detailedFees = {
        categories: []
    };

    document.querySelectorAll('.fee-category').forEach((categoryDiv) => {
        const categoryName = categoryDiv.querySelector('.fee-category-name').value.trim();
        const categoryDesc = categoryDiv.querySelector('.fee-category-description').value.trim();

        const feeItems = [];
        categoryDiv.querySelectorAll('.fee-item').forEach((itemDiv) => {
            const name = itemDiv.querySelector('.fee-item-name').value.trim();
            const amount = itemDiv.querySelector('.fee-item-amount').value.trim();
            const description = itemDiv.querySelector('.fee-item-description').value.trim();

            if (name && amount) {
                feeItems.push({ name, amount, description });
            }
        });

        if (categoryName && feeItems.length > 0) {
            detailedFees.categories.push({
                category: categoryName,
                description: categoryDesc,
                items: feeItems
            });
        }
    });

    if (detailedFees.categories.length > 0) {
        data[university][program].detailed_fee_structure = detailedFees;
    }

    // Financial Options
    const financialOptions = [];
    document.querySelectorAll('.financial-option').forEach((optionDiv) => {
        const type = optionDiv.querySelector('.financial-option-type').value.trim();
        const description = optionDiv.querySelector('.financial-option-description').value.trim();
        const details = optionDiv.querySelector('.financial-option-details').value.trim();

        if (type) {
            financialOptions.push({ type, description, details });
        }
    });

    if (financialOptions.length > 0) {
        data[university][program].financial_options = financialOptions;
    }

    // Additional Tools
    const additionalTools = {};
    const additionalToolsTitle = formData.get('additionalToolsTitle');
    const additionalToolsDescription = formData.get('additionalToolsDescription');

    if (additionalToolsTitle) additionalTools.title = additionalToolsTitle;
    if (additionalToolsDescription) additionalTools.description = additionalToolsDescription;

    const toolCategories = [];
    const toolCategoryNames = formData.getAll('toolCategoryName[]');
    const toolCategoryItems = formData.getAll('toolCategoryItems[]');

    // Get detailed tool items
    const toolItemNames = formData.getAll('toolItemName[]');
    const toolItemLinks = formData.getAll('toolItemLink[]');
    const toolItemIcons = formData.getAll('toolItemIcon[]');
    const toolItemDescriptions = formData.getAll('toolItemDescription[]');

    for (let i = 0; i < toolCategoryNames.length; i++) {
        if (toolCategoryNames[i]) {
            const category = {
                name: toolCategoryNames[i]
            };

            // Check if this category uses simple method (items per line)
            if (toolCategoryItems[i] && toolCategoryItems[i].trim()) {
                // Simple method: items per line
                category.items = toolCategoryItems[i].split('\n').filter(item => item.trim());
            } else {
                // Detailed method: check for individual tool items
                const categoryItems = [];

                // This is a simplified approach - in practice, you'd need to track which items belong to which category
                toolItemNames.forEach((name, index) => {
                    if (name && name.trim()) {
                        const item = {
                            name: name.trim()
                        };

                        if (toolItemLinks[index] && toolItemLinks[index].trim()) {
                            item.link = toolItemLinks[index].trim();
                        }

                        if (toolItemIcons[index] && toolItemIcons[index].trim()) {
                            item.icon = toolItemIcons[index].trim();
                        }

                        if (toolItemDescriptions[index] && toolItemDescriptions[index].trim()) {
                            item.description = toolItemDescriptions[index].trim();
                        }

                        categoryItems.push(item);
                    }
                });

                if (categoryItems.length > 0) {
                    category.items = categoryItems;
                }
            }

            if (category.items && category.items.length > 0) {
                toolCategories.push(category);
            }
        }
    }

    if (toolCategories.length > 0) {
        additionalTools.categories = toolCategories;
    }

    if (Object.keys(additionalTools).length > 0) {
        data[university][program].additionalTools = additionalTools;
    }

    // Placement Assistance
    const placementServices = [];
    document.querySelectorAll('.placement-service').forEach((serviceDiv) => {
        const service = serviceDiv.querySelector('.placement-service-name').value.trim();
        const description = serviceDiv.querySelector('.placement-service-description').value.trim();

        if (service) {
            placementServices.push({ service, description });
        }
    });

    if (placementServices.length > 0) {
        data[university][program].placement_assistance = {
            services: placementServices
        };
    }

    return data;
}

// Preview and Generate Functions
function previewData() {
    const data = collectFormData();
    if (!data) return;

    courseData = data;

    const outputSection = document.getElementById('output-section');
    const outputContent = document.getElementById('output-content');

    outputContent.textContent = JSON.stringify(data, null, 2);
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });

    showMessage('Data preview generated successfully!', 'success');
}

function generateJSON() {
    const data = collectFormData();
    if (!data) return;

    courseData = data;

    // Validate required fields
    const university = Object.keys(data)[0];
    const program = Object.keys(data[university])[0];
    const pageData = data[university][program].page;

    if (!pageData.title || !pageData.university) {
        showMessage('Please fill in at least the page title and university name', 'error');
        return;
    }

    const outputSection = document.getElementById('output-section');
    const outputContent = document.getElementById('output-content');

    outputContent.textContent = JSON.stringify(data, null, 2);
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });

    showMessage('JSON generated successfully! You can now copy or download it.', 'success');
}

// Output Functions
function copyToClipboard() {
    const outputContent = document.getElementById('output-content');
    const text = outputContent.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showMessage('JSON copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showMessage('JSON copied to clipboard!', 'success');
    });
}

function downloadJSON() {
    const outputContent = document.getElementById('output-content');
    const text = outputContent.textContent;

    if (!text) {
        showMessage('No data to download', 'error');
        return;
    }

    const university = document.getElementById('university').value;
    const program = document.getElementById('program').value;
    const filename = `${university}_${program}_data.json`;

    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showMessage('JSON file downloaded successfully!', 'success');
}

function closeOutput() {
    document.getElementById('output-section').style.display = 'none';
}

// Utility Functions
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.form-container');
    container.insertBefore(messageDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function resetForm() {
    document.getElementById('courseDataForm').reset();
    document.getElementById('output-section').style.display = 'none';

    // Reset custom fields
    document.getElementById('custom-university-group').style.display = 'none';
    document.getElementById('custom-program-group').style.display = 'none';
    document.getElementById('customUniversityKey').required = false;
    document.getElementById('customProgramKey').required = false;

    // Clear dynamic sections and re-initialize
    document.getElementById('specializations-container').innerHTML = '';
    document.getElementById('accreditations-container').innerHTML = '';
    document.getElementById('benefits-container').innerHTML = '';
    document.getElementById('semesters-container').innerHTML = '';
    document.getElementById('faculty-container').innerHTML = '';
    document.getElementById('admission-container').innerHTML = '';
    document.getElementById('faq-container').innerHTML = '';
    document.getElementById('fee-categories-container').innerHTML = '';
    document.getElementById('financial-options-container').innerHTML = '';
    document.getElementById('tool-categories-container').innerHTML = '';
    document.getElementById('placement-assistance-container').innerHTML = '';

    initializeForm();

    // Clear validation states
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    document.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());

    showMessage('Form has been reset', 'success');
}

// Enhanced form validation
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    return isValid;
}

// Auto-save functionality (optional)
function autoSave() {
    const formData = collectFormData();
    if (formData) {
        localStorage.setItem('edukyuCourseData', JSON.stringify(formData));
    }
}

// Load saved data (optional)
function loadSavedData() {
    const savedData = localStorage.getItem('edukyuCourseData');
    if (savedData && confirm('Found saved data. Would you like to load it?')) {
        try {
            const data = JSON.parse(savedData);
            // Populate form with saved data
            populateForm(data);
            showMessage('Saved data loaded successfully!', 'success');
        } catch (e) {
            showMessage('Error loading saved data', 'error');
        }
    }
}

function populateForm(data) {
    // This would be a complex function to populate the form
    // with existing data - implementation depends on specific needs
    console.log('Populate form with:', data);
}

// Set up auto-save on form changes
document.addEventListener('DOMContentLoaded', function () {
    let autoSaveTimeout;

    document.addEventListener('input', function () {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(autoSave, 2000); // Auto-save after 2 seconds of inactivity
    });

    // Load saved data on page load
    setTimeout(loadSavedData, 1000);
});

// Autofill function for quick testing
function autofillForm() {
    console.log("Autofill function called!");

    // Sample data from 1.json
    const sampleData = {
        university: "manipal_university",
        program: "online_mba",
        title: "Master of Business Administration (Online MBA)",
        description: "Manipal University Online Jaipur offers a 2-year online MBA program tailored for both experienced professionals and fresh graduates. This program combines the flexibility of online learning with high-quality education, ensuring students gain valuable skills to excel in today's competitive business environment.",
        logo: "https://Edukyu.com/assets/cxp-assets/imgs/collage/manipal-university/mba/first-section-logo.png",
        duration: "24 Months",
        weeklyHours: "15-20 hours/week",
        workExperience: "No experience required",
        totalFees: "INR 1,75,000",
        perSemester: "INR 43,750",
        emi: "INR 7,292/month*",
        additionalBenefits: "Free access to paid Coursera content"
    };

    // Clear form first
    console.log("Calling resetForm...");
    resetForm();

    // Wait a bit for reset to complete
    setTimeout(() => {
        console.log("Starting to fill form fields...");

        try {
            // Fill basic information
            const universityField = document.getElementById('university');
            const programField = document.getElementById('program');
            const titleField = document.getElementById('title');
            const descriptionField = document.getElementById('description');
            const logoField = document.getElementById('logo');

            if (universityField) universityField.value = sampleData.university;
            if (programField) programField.value = sampleData.program;
            if (titleField) titleField.value = sampleData.title;
            if (descriptionField) descriptionField.value = sampleData.description;
            if (logoField) logoField.value = sampleData.logo;

            // Fill duration and timing
            const durationField = document.getElementById('duration');
            const weeklyHoursField = document.getElementById('weeklyHours');
            const workExperienceField = document.getElementById('workExperience');

            if (durationField) durationField.value = sampleData.duration;
            if (weeklyHoursField) weeklyHoursField.value = sampleData.weeklyHours;
            if (workExperienceField) workExperienceField.value = sampleData.workExperience;

            // Fill fee structure
            const totalFeesField = document.getElementById('totalFees');
            const perSemesterField = document.getElementById('perSemester');
            const emiField = document.getElementById('emi');
            const additionalBenefitsField = document.getElementById('additionalBenefits');

            if (totalFeesField) totalFeesField.value = sampleData.totalFees;
            if (perSemesterField) perSemesterField.value = sampleData.perSemester;
            if (emiField) emiField.value = sampleData.emi;
            if (additionalBenefitsField) additionalBenefitsField.value = sampleData.additionalBenefits;

            // Fill contact information
            // Fill sample accreditations
            const accredNameField = document.querySelector('.accreditation-name');
            const accredDescField = document.querySelector('.accreditation-description');
            const accredIconField = document.querySelector('.accreditation-icon');

            if (accredNameField) accredNameField.value = "NAAC A+ Accredited University";
            if (accredDescField) accredDescField.value = "Rajasthan's 1st NAAC A+ Accredited University";
            if (accredIconField) accredIconField.value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/naac.jpg";

            // Add more accreditations
            addAccreditation();
            setTimeout(() => {
                const accreds = document.querySelectorAll('.accreditation');
                if (accreds[1]) {
                    accreds[1].querySelector('.accreditation-name').value = "UGC Entitled";
                    accreds[1].querySelector('.accreditation-description').value = "Entitled Online Degrees Equivalent to Campus Degree";
                    accreds[1].querySelector('.accreditation-icon').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/ugc.jpg";
                }
            }, 100);

            addAccreditation();
            setTimeout(() => {
                const accreds = document.querySelectorAll('.accreditation');
                if (accreds[2]) {
                    accreds[2].querySelector('.accreditation-name').value = "AICTE Approved";
                    accreds[2].querySelector('.accreditation-description').value = "AICTE Approved Programs";
                    accreds[2].querySelector('.accreditation-icon').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/aicte.jpg";
                }
            }, 200);

            // Fill sample benefits
            const benefitTitleField = document.querySelector('.benefit-title');
            const benefitDescField = document.querySelector('.benefit-description');
            const benefitImageField = document.querySelector('.benefit-image');

            if (benefitTitleField) benefitTitleField.value = "Enhanced Earning Potential";
            if (benefitDescField) benefitDescField.value = "Achieve leadership roles with competitive salary packages and excel as a dynamic leader across various industries.";
            if (benefitImageField) benefitImageField.value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/enhanced-capacity-for-higher-earnings.avif";

            // Add more benefits
            addBenefit();
            setTimeout(() => {
                const benefits = document.querySelectorAll('.benefit');
                if (benefits[1]) {
                    benefits[1].querySelector('.benefit-title').value = "Industry-Ready Skills";
                    benefits[1].querySelector('.benefit-description').value = "Develop critical business acumen, including strategic thinking, leadership, problem-solving, and cross-cultural proficiency.";
                    benefits[1].querySelector('.benefit-image').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/Get-skills-that-make-you-ready-for-jobs.avif";
                }
            }, 100);

            addBenefit();
            setTimeout(() => {
                const benefits = document.querySelectorAll('.benefit');
                if (benefits[2]) {
                    benefits[2].querySelector('.benefit-title').value = "Global Network";
                    benefits[2].querySelector('.benefit-description').value = "Connect globally and tap into alumni resources to gain insights into global market dynamics.";
                    benefits[2].querySelector('.benefit-image').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/Connect-globally-and-tap-into-alumni-resources.avif";
                }
            }, 200);

            // Fill eligibility criteria
            setTimeout(() => {
                const domesticEducation = document.getElementById('domesticEducationalQualification');
                const domesticGrades = document.getElementById('domesticGrades');
                const domesticAptitude = document.getElementById('domesticAptitudeTest');
                const domesticWork = document.getElementById('domesticWorkExperience');

                if (domesticEducation) domesticEducation.value = "10 + 2 + 3-year or 4 year bachelor's degree from a recognized university/institution";
                if (domesticGrades) domesticGrades.value = "A minimum of 50% marks in aggregate in graduation (45% for reserved categories)";
                if (domesticAptitude) domesticAptitude.value = "Candidates must clear Manipal University Jaipur's online aptitude test";
                if (domesticWork) domesticWork.value = "Not mandatory";

                const internationalEducation = document.getElementById('internationalEducationalQualification');
                const internationalGrades = document.getElementById('internationalGrades');
                const internationalAptitude = document.getElementById('internationalAptitudeTest');
                const internationalOther = document.getElementById('internationalOtherRequirements');

                if (internationalEducation) internationalEducation.value = "Candidates must have a 10 + 2 + 3-year bachelor's degree from a recognized university/institution";
                if (internationalGrades) internationalGrades.value = "Candidates must have a minimum of 50% marks in aggregate in graduation";
                if (internationalAptitude) internationalAptitude.value = "Candidates must clear Manipal University Jaipur's online aptitude test";
                if (internationalOther) internationalOther.value = "Valid visa, PR card & passport copy required";
            }, 400);

            // Fill curriculum/semesters
            setTimeout(() => {
                const semesterNumber = document.querySelector('.semester-number');
                const semesterDesc = document.querySelector('.semester-description');
                const semesterCourses = document.querySelector('.semester-courses');

                if (semesterNumber) semesterNumber.value = "1";
                if (semesterDesc) semesterDesc.value = "This semester is all about learning foundational management skills from organizational behavior statistics for management to managerial economics and HR management";
                if (semesterCourses) semesterCourses.value = "Management Process and Organizational Behaviour, Business Communication, Statistics for Management, Financial and Management Accounting, Managerial Economics, Human Resource Management";

                // Add more semesters
                addSemester();
                setTimeout(() => {
                    const semesters = document.querySelectorAll('.semester');
                    if (semesters[1]) {
                        semesters[1].querySelector('.semester-number').value = "2";
                        semesters[1].querySelector('.semester-description').value = "In your second semester, we equip you with analytical and decision making skills. You'll be immersed in new learning about production and financial management.";
                        semesters[1].querySelector('.semester-courses').value = "Production and Operations Management, Financial Management, Marketing Management, Management Information System, Operations Research, Project Management";
                    }
                }, 100);

                addSemester();
                setTimeout(() => {
                    const semesters = document.querySelectorAll('.semester');
                    if (semesters[2]) {
                        semesters[2].querySelector('.semester-number').value = "3";
                        semesters[2].querySelector('.semester-description').value = "Take a deep dive into research methodologies, the legal aspects of business and IP, and choose from strategic electives.";
                        semesters[2].querySelector('.semester-courses').value = "Research Methodology, Legal Aspects of Business, Elective Course";
                    }
                }, 200);

                addSemester();
                setTimeout(() => {
                    const semesters = document.querySelectorAll('.semester');
                    if (semesters[3]) {
                        semesters[3].querySelector('.semester-number').value = "4";
                        semesters[3].querySelector('.semester-description').value = "In your last semester, we help you understand strategic management & business policy, international business management, and inculcate entrepreneurial skills.";
                        semesters[3].querySelector('.semester-courses').value = "Strategic Management and Business Policy, International Business Management, Business Leadership, Elective Course";
                    }
                }, 300);
            }, 500);

            // Fill faculty information
            setTimeout(() => {
                const facultyName = document.querySelector('.faculty-name');
                const facultyPosition = document.querySelector('.faculty-position');
                const facultyQual = document.querySelector('.faculty-qualifications');
                const facultyImage = document.querySelector('.faculty-image');

                if (facultyName) facultyName.value = "Dr. Kasinathan S";
                if (facultyPosition) facultyPosition.value = "Deputy Director & Professor";
                if (facultyQual) facultyQual.value = "Ph.D., M.Phil., MBA";
                if (facultyImage) facultyImage.value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/1.png";

                // Add more faculty
                addFaculty();
                setTimeout(() => {
                    const faculty = document.querySelectorAll('.faculty');
                    if (faculty[1]) {
                        faculty[1].querySelector('.faculty-name').value = "Dr. D Pushpa Gowri";
                        faculty[1].querySelector('.faculty-position').value = "Assistant Professor (Senior Scale)";
                        faculty[1].querySelector('.faculty-qualifications').value = "Ph.D., BCom, MCom, MBA";
                        faculty[1].querySelector('.faculty-image').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/2.png";
                    }
                }, 100);

                addFaculty();
                setTimeout(() => {
                    const faculty = document.querySelectorAll('.faculty');
                    if (faculty[2]) {
                        faculty[2].querySelector('.faculty-name').value = "Dr. Mehak Gulati";
                        faculty[2].querySelector('.faculty-position').value = "Assistant Professor";
                        faculty[2].querySelector('.faculty-qualifications').value = "Ph.D., MCom";
                        faculty[2].querySelector('.faculty-image').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/3.png";
                    }
                }, 200);
            }, 600);

            // Fill admission process
            setTimeout(() => {
                const stepNumber = document.querySelector('.admission-step-number');
                const stepTitle = document.querySelector('.admission-step-title');
                const stepDesc = document.querySelector('.admission-step-description');
                const stepIcon = document.querySelector('.admission-step-icon');

                if (stepNumber) stepNumber.value = "1";
                if (stepTitle) stepTitle.value = "Program registration";
                if (stepDesc) stepDesc.value = "Fill in your basic, education & work experience-related details and pay the application fee to register.";
                if (stepIcon) stepIcon.value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/Group.png";

                // Add more admission steps
                addAdmissionStep();
                setTimeout(() => {
                    const steps = document.querySelectorAll('.admission-step');
                    if (steps[1]) {
                        steps[1].querySelector('.admission-step-number').value = "2";
                        steps[1].querySelector('.admission-step-title').value = "Fee payment";
                        steps[1].querySelector('.admission-step-description').value = "Pay the admission fee for the first semester/year or full program.";
                        steps[1].querySelector('.admission-step-icon').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/Fee-payment.png";
                    }
                }, 100);

                addAdmissionStep();
                setTimeout(() => {
                    const steps = document.querySelectorAll('.admission-step');
                    if (steps[2]) {
                        steps[2].querySelector('.admission-step-number').value = "3";
                        steps[2].querySelector('.admission-step-title').value = "Document Submission";
                        steps[2].querySelector('.admission-step-description').value = "Upload supporting documents & submit your application.";
                        steps[2].querySelector('.admission-step-icon').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/document-upload.png";
                    }
                }, 200);

                addAdmissionStep();
                setTimeout(() => {
                    const steps = document.querySelectorAll('.admission-step');
                    if (steps[3]) {
                        steps[3].querySelector('.admission-step-number').value = "4";
                        steps[3].querySelector('.admission-step-title').value = "Admission Confirmation";
                        steps[3].querySelector('.admission-step-description').value = "The university will evaluate your documents to confirm your admission.";
                        steps[3].querySelector('.admission-step-icon').value = "/assets/cxp-assets/imgs/collage/manipal-university/mba/University-Approval.png";
                    }
                }, 300);
            }, 700);

            // Fill career opportunities
            setTimeout(() => {
                const jobRoles = document.getElementById('jobRoles');
                const industries = document.getElementById('industries');
                if (jobRoles) {
                    jobRoles.value = "General Manager, Finance Manager, Operations Lead, HR Associate, Digital Marketer, Territory Manager, Supply Chain Manager, Quality Controller, Project Manager, Entrepreneur";
                }
                if (industries) {
                    industries.value = "Advertising, Consulting, Retail, FMCG, Media & Publication, Manufacturing, EdTech, Financial Services, Banking";
                }
            }, 800);

            // Fill sample FAQ
            const faqQuestionField = document.querySelector('.faq-question');
            const faqAnswerField = document.querySelector('.faq-answer');

            if (faqQuestionField) faqQuestionField.value = "What is the cost of an online MBA at Manipal University?";
            if (faqAnswerField) faqAnswerField.value = "The cost of an online MBA at Manipal University is Rs 1,75,000/-. The semester-wise fee for the university is Rs 43,750/-.";

            // Add more FAQs
            addFAQ();
            setTimeout(() => {
                const faqs = document.querySelectorAll('.faq');
                if (faqs[1]) {
                    faqs[1].querySelector('.faq-question').value = "Do companies accept online MBAs?";
                    faqs[1].querySelector('.faq-answer').value = "An online MBA from a recognized university is valid. Almost all the companies accept online MBA degrees from Infosys, Genpact, Tata Communications, Wipro, and KPMG.";
                }
            }, 100);

            // Fill detailed fee structure
            setTimeout(() => {
                const feeCategoryName = document.querySelector('.fee-category-name');
                const feeCategoryDesc = document.querySelector('.fee-category-description');
                const feeItemName = document.querySelector('.fee-item-name');
                const feeItemAmount = document.querySelector('.fee-item-amount');
                const feeItemDesc = document.querySelector('.fee-item-description');

                if (feeCategoryName) feeCategoryName.value = "Indian Students";
                if (feeCategoryDesc) feeCategoryDesc.value = "Fee structure for Indian nationals";
                if (feeItemName) feeItemName.value = "Full Course Fee";
                if (feeItemAmount) feeItemAmount.value = "INR 1,75,000";
                if (feeItemDesc) feeItemDesc.value = "Complete program fee for 24 months";

                // Add fee item
                const addFeeItemBtn = document.querySelector('.fee-category .add-btn');
                if (addFeeItemBtn) addFeeItemBtn.click();

                setTimeout(() => {
                    const feeItems = document.querySelectorAll('.fee-item');
                    if (feeItems[1]) {
                        feeItems[1].querySelector('.fee-item-name').value = "Per Semester Fee";
                        feeItems[1].querySelector('.fee-item-amount').value = "INR 43,750";
                        feeItems[1].querySelector('.fee-item-description').value = "Semester-wise payment option";
                    }
                }, 100);
            }, 900);

            // Fill financial options
            setTimeout(() => {
                const financialType = document.querySelector('.financial-option-type');
                const financialDesc = document.querySelector('.financial-option-description');
                const financialDetails = document.querySelector('.financial-option-details');

                if (financialType) financialType.value = "Easy EMI Options";
                if (financialDesc) financialDesc.value = "No-cost EMIs available";
                if (financialDetails) financialDetails.value = "Flexible payment plans to suit your budget";

                // Add more financial options
                addFinancialOption();
                setTimeout(() => {
                    const options = document.querySelectorAll('.financial-option');
                    if (options[1]) {
                        options[1].querySelector('.financial-option-type').value = "Scholarships";
                        options[1].querySelector('.financial-option-description').value = "Merit-based scholarships available";
                        options[1].querySelector('.financial-option-details').value = "Scholarships for defense personnel, government employees, sportspersons";
                    }
                }, 100);
            }, 1000);

            // Fill additional tools
            setTimeout(() => {
                const toolCategoryName = document.querySelector('.tool-category-name');
                const toolItemName = document.querySelector('.tool-item-name');
                const toolItemDesc = document.querySelector('.tool-item-description');
                const toolItemLink = document.querySelector('.tool-item-link');

                if (toolCategoryName) toolCategoryName.value = "Future Tech For Emerging Leaders";
                if (toolItemName) toolItemName.value = "Data Analytics for Business Decisions";
                if (toolItemDesc) toolItemDesc.value = "Learn data-driven decision making";
                if (toolItemLink) toolItemLink.value = "https://example.com/data-analytics";

                // Add tool item
                const addToolBtn = document.querySelector('.tool-category .add-btn');
                if (addToolBtn) addToolBtn.click();

                setTimeout(() => {
                    const toolItems = document.querySelectorAll('.tool-item');
                    if (toolItems[1]) {
                        toolItems[1].querySelector('.tool-item-name').value = "Innovation";
                        toolItems[1].querySelector('.tool-item-description').value = "Innovation frameworks and methodologies";
                        toolItems[1].querySelector('.tool-item-link').value = "https://example.com/innovation";
                    }
                }, 100);
            }, 1100);

            // Fill placement assistance
            setTimeout(() => {
                const placementService = document.querySelector('.placement-service-name');
                const placementDesc = document.querySelector('.placement-service-description');

                if (placementService) placementService.value = "Resume building";
                if (placementDesc) placementDesc.value = "Create impactful resumes with the help of our advanced placement portal";

                // Add more placement services
                addPlacementService();
                setTimeout(() => {
                    const services = document.querySelectorAll('.placement-service');
                    if (services[1]) {
                        services[1].querySelector('.placement-service-name').value = "Alumni interactions";
                        services[1].querySelector('.placement-service-description').value = "Interact with alumni and receive industry insights and career guidance";
                    }
                }, 100);

                addPlacementService();
                setTimeout(() => {
                    const services = document.querySelectorAll('.placement-service');
                    if (services[2]) {
                        services[2].querySelector('.placement-service-name').value = "Industry-readiness sessions";
                        services[2].querySelector('.placement-service-description').value = "Familiarize yourself with industry trends and organizational expectations";
                    }
                }, 200);

                addPlacementService();
                setTimeout(() => {
                    const services = document.querySelectorAll('.placement-service');
                    if (services[3]) {
                        services[3].querySelector('.placement-service-name').value = "Virtual placement drives";
                        services[3].querySelector('.placement-service-description').value = "E-connect with potential employers and explore job opportunities";
                    }
                }, 300);
            }, 1200);

            console.log("Form filled successfully!");
            showMessage('Form autofilled with sample data for testing! 🚀', 'success');

        } catch (error) {
            console.error("Error during autofill:", error);
            showMessage('Error during autofill: ' + error.message, 'error');
        }
    }, 500);
}

// Course Selection Functions
function addCourse() {
    const container = document.getElementById('courses-container');
    const newCourse = document.createElement('div');
    newCourse.className = 'course-item';
    newCourse.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Course Name:</label>
                <select name="courseName[]" onchange="toggleCustomCourse(this)">
                    <option value="">Select Course</option>
                    <optgroup label="Postgraduate (PG) Courses">
                        <option value="MCA">MCA - Master of Computer Applications (2 years, ₹88,500)</option>
                        <option value="MCom">MCom - Master of Commerce (2 years, ₹60,000)</option>
                        <option value="M.Sc">M.Sc - Master of Science (2 years, ₹81,000)</option>
                        <option value="MBA">MBA - Master of Business Administration (2 years, ₹88,500)</option>
                    </optgroup>
                    <optgroup label="Undergraduate (UG) Courses">
                        <option value="BBA">BBA - Bachelor of Business Administration (3 years, ₹81,000)</option>
                        <option value="BCA">BCA - Bachelor of Computer Applications (3 years, ₹56,250)</option>
                        <option value="B.Com">B.Com - Bachelor of Commerce (3 years, ₹56,250)</option>
                    </optgroup>
                    <option value="custom">🆕 Add Custom Course</option>
                </select>
            </div>
            <div class="form-group">
                <label>Course Type:</label>
                <select name="courseType[]">
                    <option value="">Select Type</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Certificate">Certificate</option>
                </select>
            </div>
        </div>
        
        <div class="custom-course-fields" style="display: none;">
            <div class="form-group">
                <label>Custom Course Name:</label>
                <input type="text" name="customCourseName[]" placeholder="e.g., MSW, B.Tech, etc.">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label>Duration:</label>
                <input type="text" name="courseDuration[]" placeholder="e.g., 2 years, 3 years">
            </div>
            <div class="form-group">
                <label>Source Section:</label>
                <input type="text" name="courseSourceSection[]" placeholder="e.g., 1_about_mba">
            </div>
        </div>

        <div class="form-group">
            <label>Course Fees:</label>
            <div class="fee-inputs">
                <input type="text" name="courseOriginalFees[]" placeholder="Original Fees (e.g., ₹118,000)">
                <input type="text" name="courseDiscountedFees[]" placeholder="Discounted Fees (e.g., ₹88,500)">
                <input type="text" name="courseDisplayFees[]" placeholder="Display Fees (e.g., ₹88,500)">
            </div>
        </div>

        <button type="button" class="remove-btn" onclick="removeCourse(this)">Remove Course</button>
    `;
    container.appendChild(newCourse);
}

function removeCourse(button) {
    const courseItem = button.closest('.course-item');
    const container = document.getElementById('courses-container');

    // Don't remove if it's the last course
    if (container.children.length > 1) {
        courseItem.remove();
    } else {
        showMessage('At least one course must be present', 'warning');
    }
}

function toggleCustomCourse(selectElement) {
    const courseItem = selectElement.closest('.course-item');
    const customFields = courseItem.querySelector('.custom-course-fields');
    const customInput = courseItem.querySelector('input[name="customCourseName[]"]');

    if (selectElement.value === 'custom') {
        customFields.style.display = 'block';
        customInput.required = true;
        autofillCourseData(selectElement, 'custom');
    } else {
        customFields.style.display = 'none';
        customInput.required = false;
        customInput.value = '';
        autofillCourseData(selectElement, selectElement.value);
    }
}

function autofillCourseData(selectElement, courseValue) {
    const courseItem = selectElement.closest('.course-item');
    const typeSelect = courseItem.querySelector('select[name="courseType[]"]');
    const durationInput = courseItem.querySelector('input[name="courseDuration[]"]');
    const sourceSectionInput = courseItem.querySelector('input[name="courseSourceSection[]"]');
    const originalFeesInput = courseItem.querySelector('input[name="courseOriginalFees[]"]');
    const discountedFeesInput = courseItem.querySelector('input[name="courseDiscountedFees[]"]');
    const displayFeesInput = courseItem.querySelector('input[name="courseDisplayFees[]"]');

    const courseData = {
        'MCA': {
            type: 'PG',
            duration: '2 years',
            sourceSection: '1_about_mba',
            originalFees: '₹118,000',
            discountedFees: '₹88,500',
            displayFees: '₹88,500'
        },
        'MCom': {
            type: 'PG',
            duration: '2 years',
            sourceSection: '1_about_mba',
            originalFees: '₹118,000',
            discountedFees: '₹60,000',
            displayFees: '₹60,000'
        },
        'M.Sc': {
            type: 'PG',
            duration: '2 years',
            sourceSection: '1_about_mba',
            originalFees: '₹108,000',
            discountedFees: '₹81,000',
            displayFees: '₹81,000'
        },
        'MBA': {
            type: 'PG',
            duration: '2 years',
            sourceSection: '2_about_mca',
            originalFees: '₹118,000',
            discountedFees: '₹88,500',
            displayFees: '₹88,500'
        },
        'BBA': {
            type: 'UG',
            duration: '3 years',
            sourceSection: '1_about_mba',
            originalFees: '₹108,000',
            discountedFees: '₹81,000',
            displayFees: '₹81,000'
        },
        'BCA': {
            type: 'UG',
            duration: '3 years',
            sourceSection: '1_about_mba',
            originalFees: '₹75,000',
            discountedFees: '₹56,250',
            displayFees: '₹56,250'
        },
        'B.Com': {
            type: 'UG',
            duration: '3 years',
            sourceSection: '4_about_msc_mathematics',
            originalFees: '₹75,000',
            discountedFees: '₹56,250',
            displayFees: '₹56,250'
        }
    };

    if (courseValue && courseValue !== 'custom' && courseData[courseValue]) {
        const data = courseData[courseValue];
        typeSelect.value = data.type;
        durationInput.value = data.duration;
        sourceSectionInput.value = data.sourceSection;
        originalFeesInput.value = data.originalFees;
        discountedFeesInput.value = data.discountedFees;
        displayFeesInput.value = data.displayFees;
    } else if (courseValue === 'custom') {
        // Clear all fields for custom course
        typeSelect.value = '';
        durationInput.value = '';
        sourceSectionInput.value = '';
        originalFeesInput.value = '';
        discountedFeesInput.value = '';
        displayFeesInput.value = '';
    }
}

function filterCoursesByCategory() {
    const category = document.getElementById('courseCategory').value;
    const courseSelects = document.querySelectorAll('select[name="courseName[]"]');

    courseSelects.forEach(select => {
        const options = select.querySelectorAll('option');
        const optgroups = select.querySelectorAll('optgroup');

        if (category === '') {
            // Show all
            optgroups.forEach(optgroup => optgroup.style.display = 'block');
        } else if (category === 'UG') {
            optgroups.forEach(optgroup => {
                if (optgroup.label.includes('Undergraduate')) {
                    optgroup.style.display = 'block';
                } else {
                    optgroup.style.display = 'none';
                }
            });
        } else if (category === 'PG') {
            optgroups.forEach(optgroup => {
                if (optgroup.label.includes('Postgraduate')) {
                    optgroup.style.display = 'block';
                } else {
                    optgroup.style.display = 'none';
                }
            });
        } else if (category === 'Certificate') {
            optgroups.forEach(optgroup => {
                if (optgroup.label.includes('Certificate') || optgroup.label.includes('Diploma')) {
                    optgroup.style.display = 'block';
                } else {
                    optgroup.style.display = 'none';
                }
            });
        }
    });
}

function getSelectedCourses() {
    const selectedCourses = [];
    const courseItems = document.querySelectorAll('.course-item');

    courseItems.forEach(item => {
        const nameSelect = item.querySelector('select[name="courseName[]"]');
        const typeSelect = item.querySelector('select[name="courseType[]"]');
        const customNameInput = item.querySelector('input[name="customCourseName[]"]');
        const durationInput = item.querySelector('input[name="courseDuration[]"]');
        const sourceSectionInput = item.querySelector('input[name="courseSourceSection[]"]');
        const originalFeesInput = item.querySelector('input[name="courseOriginalFees[]"]');
        const discountedFeesInput = item.querySelector('input[name="courseDiscountedFees[]"]');
        const displayFeesInput = item.querySelector('input[name="courseDisplayFees[]"]');

        let courseName = nameSelect.value;
        if (courseName === 'custom' && customNameInput.value) {
            courseName = customNameInput.value;
        }

        if (courseName && courseName !== '' && courseName !== 'custom') {
            const course = {
                name: courseName,
                duration: durationInput.value || '',
                type: typeSelect.value || '',
                fees: {
                    original: originalFeesInput.value || '',
                    discounted: discountedFeesInput.value || '',
                    display: displayFeesInput.value || ''
                },
                sourceSection: sourceSectionInput.value || ''
            };

            selectedCourses.push(course);
        }
    });

    return selectedCourses;
}

// Tool Methods Functions
function switchToolMethod(tabButton, method) {
    const categoryItem = tabButton.closest('.tool-category-item');
    const tabs = categoryItem.querySelectorAll('.method-tab');
    const methods = categoryItem.querySelectorAll('.tool-method');

    // Update tabs
    tabs.forEach(tab => tab.classList.remove('active'));
    tabButton.classList.add('active');

    // Update methods
    methods.forEach(methodDiv => methodDiv.classList.remove('active'));
    const targetMethod = categoryItem.querySelector(`.${method}-method`);
    if (targetMethod) {
        targetMethod.classList.add('active');
    }
}

function addToolItem(button) {
    const container = button.previousElementSibling;
    const newToolItem = document.createElement('div');
    newToolItem.className = 'tool-item';
    newToolItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Tool/Certification Name:</label>
                <input type="text" name="toolItemName[]" placeholder="e.g., Data Analytics for Business Decisions">
            </div>
            <div class="form-group">
                <label>Link (optional):</label>
                <input type="url" name="toolItemLink[]" placeholder="https://example.com/course">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Icon URL (optional):</label>
                <input type="url" name="toolItemIcon[]" placeholder="https://example.com/icon.png">
            </div>
            <div class="form-group">
                <label>Description (optional):</label>
                <input type="text" name="toolItemDescription[]" placeholder="Brief description">
            </div>
        </div>
        <button type="button" class="remove-btn" onclick="removeToolItem(this)">Remove Tool</button>
    `;
    container.appendChild(newToolItem);
}

function removeToolItem(button) {
    const toolItem = button.closest('.tool-item');
    const container = toolItem.parentElement;

    // Don't remove if it's the last tool item
    if (container.children.length > 1) {
        toolItem.remove();
    } else {
        showMessage('At least one tool item must be present', 'warning');
    }
}