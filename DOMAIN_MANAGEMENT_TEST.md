# Domain Management Module - Test Guide

## 🔗 Test Links

### Option 1: GitHub Pages (Recommended)
The test branch has been deployed. You can access it at:
**https://dilip-poojari.github.io/IBM-EMAIL/?branch=test**

> Note: GitHub Pages deploys from the main branch by default. To test this feature, you have two options:

### Option 2: Local Testing
1. Clone the repository and checkout the test branch:
   ```bash
   git clone https://github.com/dilip-poojari/IBM-EMAIL.git
   cd IBM-EMAIL
   git checkout feature/domain-management-test
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

### Option 3: View Raw Files on GitHub
- View the branch on GitHub: https://github.com/dilip-poojari/IBM-EMAIL/tree/feature/domain-management-test
- Download the branch as ZIP and open locally

---

## ✅ Testing Checklist

### 1. Domain List View (Default View)
- [ ] Navigate to **Email Services > Domains** tab
- [ ] Verify the page shows existing domains in a table with columns:
  - Domain Name
  - Description
  - Status (Ready / Partially Ready / Unverified)
  - Created Date
  - Actions (overflow menu ⋮)
- [ ] Check that "Add Domain" button is visible in the top-right
- [ ] Verify empty state appears when no domains exist (delete all domains to test)

### 2. Domain Creation Flow
- [ ] Click "+ Add Domain" button
- [ ] Verify modal/slide-over opens with form fields:
  - Name (text input) - Required
  - Description (text input) - Optional
  - Domain (e.g., mail.yourcompany.com) - Required
- [ ] Test validation: Try submitting without required fields
- [ ] Fill in all fields and click "Create"
- [ ] Verify modal closes and new domain appears in the table with status "Unverified"
- [ ] Test "Cancel" button closes modal without saving

### 3. Domain Verification Flow - Step 1: DKIM & SPF
- [ ] Click overflow menu (⋮) on any domain row
- [ ] Click "Verify" option
- [ ] Verify full verification page/drawer opens with 3-step stepper UI
- [ ] Check Step 1 is expanded by default
- [ ] Verify DKIM Record card displays:
  - Type: TXT
  - Hostname: ibmcloud._domainkey.[domain]
  - Value: v=DKIM1; k=rsa; p=...
  - Copy button with icon
- [ ] Verify SPF Record card displays:
  - Type: TXT
  - Hostname: @
  - Value: v=spf1 include:_spf.ibmcloud.com ~all
  - Copy button with icon
- [ ] Test copy functionality for both records
- [ ] Click "Verify DNS Records" button
- [ ] Verify status updates to ✅ Verified
- [ ] Check that Step 1 shows completed status (green checkmark)

### 4. Domain Verification Flow - Step 2: SMTP Authorization
- [ ] Expand Step 2 (click on step header)
- [ ] Verify section header shows "SMTP Authorization"
- [ ] Check status badge shows "Not Verified" initially
- [ ] Verify info message: "Required only for sending emails via SMTP"
- [ ] Click "Raise Support Ticket" button
- [ ] Verify confirmation dialog appears
- [ ] Confirm ticket creation
- [ ] Check status updates to "Approved" (simulated)
- [ ] Verify success message appears
- [ ] Test skipping this step - verify warning banner appears:
  - ⚠️ "SMTP email sending will not work until authorization is approved..."
  - "View Steps" link present

### 5. Domain Verification Flow - Step 3: CBR Configuration
- [ ] Expand Step 3
- [ ] Verify section header shows "Context-Based Restrictions (CBR)"
- [ ] Check status badge shows "Not Configured" initially
- [ ] Verify info message about secure SMTP access
- [ ] Click "Setup CBR" button
- [ ] Verify confirmation dialog appears
- [ ] Confirm CBR setup
- [ ] Check status updates to "Configured"
- [ ] Verify "Manage CBR Settings" button appears after configuration
- [ ] Test "View Setup Guide" button navigates to Security page
- [ ] Test skipping - verify warning banner appears if SMTP is authorized

### 6. Domain Status Logic
Test the following status combinations:

| Condition | Expected Domain Status |
|-----------|----------------------|
| Only DKIM/SPF verified | Partially Ready |
| DKIM/SPF + CBR configured | Ready (API enabled) |
| All 3 steps complete | Ready (Full SMTP + API) |
| Nothing verified | Unverified |

- [ ] Verify status badge colors:
  - Ready: Green
  - Partially Ready: Yellow/Amber
  - Unverified: Red/Error

### 7. UI/UX Elements
- [ ] Verify vertical stepper shows all 3 steps
- [ ] Check step icons: ✅ (completed), number (pending), ⏳ (in progress)
- [ ] Verify each step is expandable/collapsible
- [ ] Test copyable DNS values use monospace font
- [ ] Check clipboard icon appears on copy buttons
- [ ] Verify warning banners use amber/yellow tone
- [ ] Check info banners use blue tone
- [ ] Verify domain name and status always visible in page header during verification
- [ ] Test overflow menu (⋮) functionality:
  - Click opens menu
  - Click outside closes menu
  - Only one menu open at a time

### 8. Additional Features
- [ ] Test "View Details" option in overflow menu
- [ ] Test "Delete" option in overflow menu with confirmation
- [ ] Verify responsive design on mobile/tablet
- [ ] Test all buttons and interactions
- [ ] Check for any console errors

### 9. Edge Cases
- [ ] Try creating a domain that already exists
- [ ] Test with very long domain names
- [ ] Test with special characters in domain names
- [ ] Verify behavior when all domains are deleted (empty state)
- [ ] Test rapid clicking on buttons

---

## 🐛 Bug Reporting

If you find any issues, please note:
1. **What you were doing** (steps to reproduce)
2. **What you expected to happen**
3. **What actually happened**
4. **Browser and version** (Chrome, Firefox, Safari, etc.)
5. **Screenshots** (if applicable)

---

## ✨ Key Features Implemented

### Domain List
- ✅ Table view with Domain Name, Description, Status, Created Date, Actions
- ✅ Empty state with "Add Domain" CTA
- ✅ Overflow menu (⋮) with Verify, View Details, Delete options
- ✅ Status badges with color coding

### Domain Creation
- ✅ Modal with Name, Description, Domain fields
- ✅ Form validation
- ✅ Cancel and Create actions

### Multi-Step Verification
- ✅ Vertical stepper UI with 3 sequential steps
- ✅ Step 1: DKIM & SPF (mandatory)
  - DNS record cards with copyable values
  - Verify button with status update
- ✅ Step 2: SMTP Authorization (optional)
  - Support ticket flow
  - Status tracking (Pending → Approved)
  - Warning banner if skipped
- ✅ Step 3: CBR Configuration (mandatory for SMTP)
  - Setup flow
  - Link to Security page
  - Warning banner if skipped

### Status Logic
- ✅ Unverified → Partially Ready → Ready
- ✅ Context-aware status based on verification steps
- ✅ Visual indicators throughout UI

### Styling
- ✅ IBM Carbon Design System inspired
- ✅ Responsive design
- ✅ Monospace font for DNS values
- ✅ Color-coded alerts and badges
- ✅ Smooth animations and transitions

---

## 📝 Notes for Review

1. **Status Calculation**: The domain status automatically updates based on which verification steps are completed
2. **SMTP vs API**: The system distinguishes between API-only (DKIM/SPF + CBR) and full SMTP support (all 3 steps)
3. **User Flow**: Users can skip SMTP steps if they only need API email sending
4. **Warnings**: Clear warnings appear when SMTP-required steps are skipped
5. **Expandable Steps**: All verification steps are expandable for better UX

---

## 🚀 Next Steps After Approval

Once you've reviewed and approved the changes:
1. I'll merge the `feature/domain-management-test` branch into `main`
2. The changes will automatically deploy to https://dilip-poojari.github.io/IBM-EMAIL/
3. The Domain Management module will be live on the production site

---

## 📞 Questions?

If you have any questions or need clarification on any feature, please let me know!