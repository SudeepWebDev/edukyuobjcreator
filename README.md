# EduKyu Course Page Data Creator

A comprehensive web-based tool for creating structured course data for universities and their programs. This tool allows users to build complex course page data through an intuitive form interface and export it as JSON that matches the required data structure.

## Features

### 🏫 University & Program Management

- Support for 20+ predefined universities across different categories:
  - Top Private Universities (Manipal, Amity, LPU, etc.)
  - State Universities (Noida International, Chandigarh, etc.)
  - Open Universities (IGNOU, Kerala Digital Sciences, etc.)
  - Technical Universities (BITS Pilani, VIT, SRM, etc.)
  - Management Institutes (IIM Kashipur, XLRI, etc.)
- Support for 40+ program types organized by category:
  - Business & Management (MBA, BBA, PGDM, Executive MBA)
  - Computer Science & IT (MCA, BCA, M.Sc IT, MS CS)
  - Commerce & Finance (M.Com, B.Com, MBA Finance, CFA)
  - Arts & Humanities (M.A, B.A, Psychology, English)
  - Science & Engineering (M.Sc, B.Sc, M.Tech, B.Tech)
  - Education & Teaching (B.Ed, M.Ed, Diploma in Education)

### 💰 Comprehensive Fee Management

- **Basic Fee Structure**: Total fees, duration, installments, currency
- **Detailed Fee Structure**: Categorized fee breakdown with multiple items per category
- **Financial Options**: Scholarships, loans, EMI plans, and payment assistance
  - Healthcare & Medicine (MPH, MHA, Nursing)
  - Law & Legal Studies (LLB, LLM, Diploma in Law)
- **🆕 Custom University & Program Support**: Add any university or program with custom keys
- Dynamic form generation based on selections
- Real-time validation for custom entries

### 📄 Comprehensive Data Fields

- **Basic Information**: Title, description, logo, university details
- **Duration & Timing**: Course length, weekly hours, work experience requirements
- **Fee Structure**: Total fees, per semester, EMI options, additional benefits
- **Specializations**: Dynamic addition of specialization options with icons and links
- **Accreditations**: University accreditations with descriptions and icons
- **Program Benefits**: Key program advantages with detailed descriptions and images

### 📚 Academic Details

- **Curriculum**: Semester-wise course structure with descriptions
- **Faculty**: Faculty member profiles with qualifications and images
- **Eligibility**: Separate criteria for domestic and international students
- **Admission Process**: Step-by-step admission procedures

### 💼 Career & Support

- **Career Opportunities**: Job roles and industries
- **Placement Assistance**: Services offered for job placement with descriptions
- **Additional Tools**: Categorized learning tools and resources with links
- **Contact Information**: Complete contact details (email, phone, address, website)
- **FAQ Section**: Frequently asked questions and answers

### 🔧 Advanced Features

- **Autofill Testing**: 🚀 One-click autofill with sample data from `1.json` for quick testing
- **Real-time Validation**: Form validation with error messages
- **Auto-save**: Automatically saves work in local storage
- **Data Preview**: Preview generated JSON before export
- **Export Options**: Copy to clipboard or download as JSON file
- **Responsive Design**: Works on desktop and mobile devices

## Usage Instructions

### Getting Started

1. Open `index.html` in your web browser
2. Select your university and program type from the dropdowns
3. Fill in the basic page information

### 🚀 Quick Testing with Autofill

For rapid testing and demonstration purposes:

1. Click the **🚀 Autofill (Test)** button in the form
2. The form will automatically populate with sample data from Manipal University's Online MBA program
3. All sections will be filled including:
   - Basic course information
   - Fee structure and financial options
   - Specializations and accreditations
   - Faculty and curriculum details
   - Contact information and placement assistance
4. Use **👁️ Preview Data** or **📄 Generate JSON** to see the complete output

### Adding Dynamic Content

- **Specializations**: Click "Add Specialization" to add multiple program tracks
- **Accreditations**: Add university certifications and recognitions
- **Benefits**: Add program advantages and benefits
- **Faculty**: Add faculty member profiles
- **Semesters**: Define curriculum for each semester
- **Admission Steps**: Create step-by-step admission process
- **FAQs**: Add frequently asked questions

### Adding Custom Universities and Programs

1. **Custom University**: Select "🆕 Add Custom University" from the dropdown
   - Enter a unique university key (e.g., `your_university_name`)
   - Use only lowercase letters and underscores
   - Key must be at least 3 characters long
   - Preview shows real-time validation

2. **Custom Program**: Select "🆕 Add Custom Program" from the dropdown
   - Enter a unique program key (e.g., `online_custom_program`)
   - Follow same naming conventions as university keys
   - Real-time validation and preview available

### Data Management

- **Preview**: Click "Preview Data" to see the generated JSON structure
- **Generate**: Click "Generate JSON" to create the final data structure
- **Copy**: Use "Copy to Clipboard" to copy the JSON data
- **Download**: Click "Download JSON" to save as a file
- **Reset**: Use "Reset Form" to clear all data and start over

### Auto-save Feature

The tool automatically saves your work every 2 seconds to local storage. If you refresh the page, you'll be prompted to restore your saved data.

## Data Structure

The tool generates data that matches this structure:

```json
{
  "university_key": {
    "program_key": {
      "page": {
        "title": "Program Title",
        "university": "University Name",
        "description": "Program description",
        "duration": { "length": "24 Months", "weeklyHours": "15-20 hours/week" },
        "fees": { "total": "INR 1,75,000", "perSemester": "INR 43,750" },
        "accreditations": [...]
      },
      "specializations": [...],
      "programBenefits": [...],
      "curriculum": { "semesters": [...] },
      "faculty": [...],
      "eligibility": { "domestic": {...}, "international": {...} },
      "admissionProcess": [...],
      "careerOpportunities": { "jobRoles": [...], "industries": [...] },
      "faqs": [...]
    }
  }
}
```

## Supported Universities

- **Manipal University** (`manipal_university`)
- **Noida International University** (`noida_international_university`)
- **Amity University** (`amity_university`)
- **NMIMS University** (`nmims_university`)
- **Sikkim Manipal University** (`sikkim_manipal_university`)

## Supported Programs

- **Online MBA** (`online_mba`)
- **Online MCA** (`online_mca`)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
edukyuobjcreator/
├── index.html          # Main HTML file with form structure
├── style.css           # Comprehensive styling and responsive design
├── script.js           # JavaScript logic for form handling and data generation
└── README.md           # This documentation file
```

## Technical Features

### Form Validation

- Required field validation
- URL format validation
- Real-time error feedback
- Field-specific error messages

### Data Export

- JSON format with proper structure
- Copy to clipboard functionality
- Download as file option
- Pretty-formatted JSON output

### User Experience

- Intuitive form layout
- Responsive design for all devices
- Visual feedback for actions
- Progress indicators
- Auto-save functionality

## Customization

### Adding New Universities

1. Add the university option to the dropdown in `index.html`
2. Update the university key format in `script.js`

### Adding New Programs

1. Add the program option to the dropdown in `index.html`
2. Ensure the data structure supports the new program type

### Extending Data Fields

1. Add new form fields to `index.html`
2. Update the `collectFormData()` function in `script.js`
3. Add appropriate styling in `style.css`

## Tips for Best Results

1. **Complete Basic Information First**: Fill in university, program, title, and description before adding detailed sections
2. **Use Consistent Naming**: Keep university and program names consistent with existing data
3. **Add Images**: Include relevant image URLs for better visual appeal
4. **Validate URLs**: Ensure all URL fields contain valid links
5. **Review Before Export**: Use the preview function to check your data structure
6. **Save Regularly**: The auto-save feature helps, but you can also manually generate JSON to save your work

## Troubleshooting

### Common Issues

- **Form Not Submitting**: Check for required fields marked in red
- **Invalid URLs**: Ensure all URL fields start with `http://` or `https://`
- **Missing Data**: Some sections may be optional but add value to the final structure
- **Browser Issues**: Try refreshing the page or clearing browser cache

### Data Recovery

If you lose your work:

1. The tool automatically saves to local storage
2. Refresh the page and look for the "load saved data" prompt
3. Click "Yes" to restore your previous session

## Support

For issues or questions about using this tool:

1. Check the browser console for any error messages
2. Ensure all required fields are completed
3. Verify that your browser supports modern JavaScript features
4. Try using the tool in an incognito/private browsing window

## Updates and Maintenance

This tool is designed to be easily maintainable and extensible. Future updates may include:

- Additional university and program support
- More sophisticated validation rules
- Enhanced export formats
- Improved user interface elements

---

Created for EduKyu course data management. This tool helps streamline the process of creating structured course information for educational institutions.
