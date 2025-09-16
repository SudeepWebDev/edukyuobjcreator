# 🔧 Autofill Troubleshooting Guide

## Quick Fix Steps

### 1. **Open Browser Developer Tools**

- Press `F12` or right-click → "Inspect"
- Go to the **Console** tab
- Keep it open while testing

### 2. **Test the Autofill Button**

- Open `index.html` in your browser
- Click the **🚀 Autofill (Test)** button
- Watch the console for messages

### 3. **Check Console Output**

You should see these messages:

```
✅ "Autofill function called!"
✅ "Calling resetForm..."
✅ "Starting to fill form fields..."
✅ "Form filled successfully!"
```

## 🚨 Common Issues & Solutions

### Issue 1: Button doesn't respond at all

**Cause:** JavaScript error or function not found
**Solution:**

1. Check browser console for error messages
2. Refresh the page (Ctrl+F5)
3. Make sure `script.js` is loading properly

### Issue 2: "autofillForm is not defined"

**Cause:** Script file not loaded or function missing
**Solution:**

1. Check if `script.js` is in the same folder as `index.html`
2. Check if the `<script src="script.js"></script>` tag exists in HTML
3. Verify the autofillForm function exists in script.js

### Issue 3: Function runs but fields don't fill

**Cause:** Field IDs don't match or elements not found
**Solution:**

1. Check console for any error messages
2. Verify the setTimeout is working (should see "Starting to fill form fields...")
3. Check if resetForm() is interfering

### Issue 4: Some fields fill, others don't

**Cause:** Missing field IDs or incorrect selectors
**Solution:**

1. Check which specific fields are failing in console
2. Verify the field IDs exist in the HTML

## 🧪 Quick Test Commands

Open browser console and try these commands:

```javascript
// Test if function exists
typeof autofillForm

// Test if basic fields exist
document.getElementById('university')
document.getElementById('program')
document.getElementById('title')

// Test function manually
autofillForm()
```

## 📋 What Should Happen

1. **Reset:** Form clears all existing data
2. **Fill Basic Info:** University, program, title, description get filled
3. **Fill Details:** Duration, fees, contact info get filled
4. **Fill Samples:** Sample specializations, accreditations, etc.
5. **Success Message:** Green success message appears

## 🔍 Files to Check

1. **index.html** - Contains the autofill button and form fields
2. **script.js** - Contains the autofillForm() function
3. **Browser Console** - Shows any error messages

## 💡 If Still Not Working

1. Try refreshing the page (Ctrl+F5)
2. Check if any ad blockers are interfering
3. Try opening in a different browser
4. Check file permissions (make sure files are readable)

---

**Quick Debug:** Open `debug-autofill.html` for additional testing tools!
