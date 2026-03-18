# IBM Email Management System - User Guide

## 📖 Table of Contents
1. [Getting Started](#getting-started)
2. [Navigation Overview](#navigation-overview)
3. [Email Home Dashboard](#email-home-dashboard)
4. [Domain Setup Walkthrough](#domain-setup-walkthrough)
5. [SMTP Configuration Guide](#smtp-configuration-guide)
6. [API Email Setup](#api-email-setup)
7. [Monitoring Metrics](#monitoring-metrics)
8. [Security Configuration](#security-configuration)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Accessing the Application

**Option 1: Local Access**
1. Open the `index.html` file in your web browser
2. Or run a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

**Option 2: GitHub Pages (Once Enabled)**
1. Go to GitHub repository: https://github.com/dilip-poojari/IBM-EMAIL
2. Click on **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
4. Wait 1-2 minutes for deployment
5. Visit: https://dilip-poojari.github.io/IBM-EMAIL/

### First Time Setup
When you first open the application, you'll see:
- A clean dashboard with status cards
- Left sidebar navigation
- Quick action buttons
- System status indicators

---

## 🧭 Navigation Overview

### Sidebar Menu
The left sidebar contains six main sections:

| Section | Icon | Purpose |
|---------|------|---------|
| **Email Home** | 🏠 | Dashboard overview and quick actions |
| **Domains** | 🌐 | Add and verify email domains |
| **SMTP Configuration** | 🖥️ | Configure SMTP for direct sending |
| **API Email** | 💻 | Set up event-driven email |
| **Metrics** | 📊 | Monitor email performance |
| **Security (CBR)** | 🔒 | Configure access restrictions |

**How to Navigate:**
- Click any menu item in the sidebar
- The active page is highlighted in blue
- Content updates instantly without page reload

---

## 📊 Email Home Dashboard

### Overview
The dashboard provides a quick snapshot of your email system status.

### Status Cards

#### 1. Domain Status Card
- **Shows:** Number of domains and verification status
- **States:**
  - 🔴 **Unverified** - No domains verified yet
  - 🟡 **Pending** - Verification in progress
  - 🟢 **Verified** - Domain ready to use
- **Action:** Click "Manage" to go to Domains page

#### 2. SMTP Authorization Card
- **Shows:** SMTP access status
- **States:**
  - 🔴 **Not Enabled** - SMTP not configured
  - 🟡 **Pending** - Authorization in progress
  - 🟢 **Enabled** - SMTP ready to use
- **Action:** Click "Configure" to set up SMTP

#### 3. Spam Status Card
- **Shows:** Email reputation health
- **States:**
  - 🟢 **Normal** - Good sending reputation
  - 🟡 **Warning** - High bounce rate detected
  - 🔴 **Blocked** - Sending temporarily blocked
- **Action:** Click "View Details" to see metrics

#### 4. Key Management Card
- **Shows:** Security configuration status
- **States:**
  - 🔴 **Not Configured** - No security rules
  - 🟢 **Configured** - Security active
- **Action:** Click "Setup" to configure

### Quick Actions
Four primary buttons for common tasks:
1. **Set up Domain** - Start domain verification wizard
2. **Configure SMTP** - Set up SMTP sending
3. **Create Email Destination** - Configure API email
4. **View Metrics** - See performance data

### Recent Activity
- Shows last 3 activities
- Includes date, action, and status
- Updates automatically as you use the system

---

## 🌐 Domain Setup Walkthrough

### Why Verify a Domain?
Before sending emails, you must verify domain ownership by adding DNS records.

### Step-by-Step Process

#### **Step 1: Start Domain Setup**
1. Click **"Set up Domain"** button on dashboard
2. Or navigate to **Domains** → Click **"Add Domain"**
3. The domain wizard opens

#### **Step 2: Enter Your Domain**
1. Type your domain name (e.g., `example.com`)
2. **Important:** Don't include `http://` or `www`
3. Click **"Next"** button

#### **Step 3: Add DNS Records**
You'll see two DNS records to add:

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.ibmcloud.com ~all
```

**DKIM Record:**
```
Type: TXT
Name: ibmcloud._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

**How to Add:**
1. Click the **"Copy"** button next to each record
2. Log in to your DNS provider (GoDaddy, Cloudflare, etc.)
3. Add these TXT records to your domain
4. Wait 5-10 minutes for DNS propagation
5. Click **"Next"** in the wizard

#### **Step 4: Verification**
1. The system checks your DNS records
2. You'll see a loading spinner (simulated - takes 3 seconds)
3. **Success:** Green checkmark appears
4. **Failure:** Red X with error message
5. Click **"Close"** to finish

### Managing Existing Domains
- View all domains in the **Domains** page
- See status badges (Verified, Pending, Failed)
- Click **"Verify"** to retry failed domains
- Click **"View"** to see domain details

---

## 🖥️ SMTP Configuration Guide

### What is SMTP?
SMTP allows direct email sending from your applications using standard email protocols.

### Prerequisites
✅ At least one verified domain

### Configuration Steps

#### **Step 1: Navigate to SMTP Configuration**
1. Click **"SMTP Configuration"** in sidebar
2. Or click **"Configure SMTP"** on dashboard

#### **Step 2: Select Domain**
1. Choose a verified domain from dropdown
2. If no domains available, you'll see a warning
3. Click the warning link to add a domain first

#### **Step 3: Request Authorization**
1. Click **"Request SMTP Access"** button
2. Status changes to **"Pending"** (yellow badge)
3. Wait 3 seconds (simulated authorization)
4. Status changes to **"Enabled"** (green badge)

#### **Step 4: Get Credentials**
Once authorized, you'll see three credential types:

**1. API Key (Recommended)** ⭐
- Modern authentication method
- More secure than username/password
- Click 👁️ icon to show/hide
- Click 📋 icon to copy

**2. Username (Deprecated)** ⚠️
- Legacy authentication
- Will be removed in future
- Same show/hide and copy options

**3. Password (Deprecated)** ⚠️
- Legacy authentication
- Will be removed in future
- Same show/hide and copy options

#### **Step 5: SMTP Server Details**
Use these settings in your email client:
- **Host:** smtp.ibmcloud.com
- **Port:** 587 (TLS)
- **Encryption:** STARTTLS

### Using SMTP Credentials
Example configuration in your application:
```python
# Python example
import smtplib

smtp_server = "smtp.ibmcloud.com"
port = 587
api_key = "your_api_key_here"

server = smtplib.SMTP(smtp_server, port)
server.starttls()
server.login("apikey", api_key)
```

---

## 💻 API Email Setup

### What is API Email?
Event-driven email system using topics and subscriptions (similar to pub/sub pattern).

### Architecture Overview
```
Email Destination → Topic → Subscription → Users
```

### Setup Flow

#### **Step 1: Create Email Destination**
1. Navigate to **"API Email"** page
2. Click **"Create Destination"** button
3. Enter destination details:
   - Name (e.g., "Marketing Emails")
   - Select verified domain
   - Configure email templates
4. Click **"Create"**

#### **Step 2: Create Topic**
1. Click **"Create Topic"** button
2. Enter topic name (e.g., "user-signup")
3. Add description
4. Click **"Create"**

#### **Step 3: Add Subscription**
1. Select a topic
2. Click **"Add Subscription"**
3. Link topic to email destination
4. Configure subscription settings
5. Click **"Save"**

#### **Step 4: Invite Users**
1. Go to subscription details
2. Click **"Invite Users"**
3. Add email addresses
4. Users receive invitation emails
5. They confirm subscription

### Managing API Email
- View all destinations in table
- See active topics and subscription counts
- Edit or delete destinations
- Monitor topic activity

---

## 📊 Monitoring Metrics

### Accessing Metrics
1. Click **"Metrics"** in sidebar
2. Or click **"View Metrics"** on dashboard

### Two Tabs Available

#### **API Email Tab** (Default)
Shows 5 key metrics:

1. **Sent** (12,543)
   - Total emails sent via API
   - +12% vs last week

2. **Delivered** (12,234)
   - Successfully delivered emails
   - +8% vs last week

3. **Failed** (89)
   - Delivery failures
   - -3% vs last week

4. **Bounced** (220)
   - Hard and soft bounces
   - -5% vs last week

5. **Opened** (8,456) ⭐
   - Email open tracking
   - Only available for API Email
   - +15% vs last week

#### **SMTP Email Tab**
Shows 4 metrics (no open tracking):

1. **Sent** (8,932)
2. **Delivered** (8,721)
3. **Failed** (45)
4. **Bounced** (166)

**Why no open tracking?**
SMTP doesn't support open tracking because it requires embedding tracking pixels, which is only possible with API Email where the service controls the email HTML.

### Understanding Bounce Details
Scroll down to see bounce details table:

| Email | Reason | Type | Date |
|-------|--------|------|------|
| user@invalid-domain.com | Domain does not exist | Hard Bounce | 2026-03-18 |
| mailbox-full@example.com | Mailbox full | Soft Bounce | 2026-03-17 |

**Bounce Types:**
- 🔴 **Hard Bounce** - Permanent failure (invalid email)
- 🟡 **Soft Bounce** - Temporary failure (mailbox full)

### Chart Visualization
- Placeholder shows where charts would render
- In production, would show trend lines
- Use charting library like Chart.js or D3.js

---

## 🔒 Security Configuration

### What is CBR?
Context-Based Restrictions (CBR) control access based on network context (IP addresses).

### Why Use CBR?
- Prevent unauthorized access
- Restrict sending to specific networks
- Add extra security layer
- Comply with security policies

### Configuration Steps

#### **Step 1: Create Network Zone**
1. Navigate to **"Security (CBR)"** page
2. Click **"Create Network Zone"**
3. Enter zone details:
   - Name (e.g., "Corporate Network")
   - Description
4. Add IP addresses or CIDR ranges:
   - Single IP: `192.168.1.100`
   - CIDR range: `192.168.1.0/24`
5. Click **"Create"**

#### **Step 2: View Existing Zones**
Two example zones are shown:

**Corporate Network:**
- 192.168.1.0/24
- 10.0.0.0/16

**Cloud Services:**
- 52.12.34.0/24

#### **Step 3: Configure Access Rules**
Rules link network zones to services:

| Rule | Network Zone | Service | Status |
|------|--------------|---------|--------|
| Allow Corporate SMTP | Corporate Network | SMTP Email | Enabled |
| Allow Cloud API | Cloud Services | API Email | Enabled |

### Best Practices
⚠️ **Important Security Notes:**
- Test rules before production
- Don't lock yourself out
- Keep backup access method
- Document all rules
- Review rules regularly

---

## 🔧 Troubleshooting

### Common Issues

#### **1. Domain Verification Failed**
**Problem:** Red X appears in verification step

**Solutions:**
- Wait 10-15 minutes for DNS propagation
- Check DNS records are added correctly
- Verify no typos in DNS values
- Use DNS checker tool (whatsmydns.net)
- Try verification again

#### **2. SMTP Not Authorized**
**Problem:** Can't request SMTP access

**Solutions:**
- Ensure domain is verified first
- Check domain is selected in dropdown
- Refresh page and try again
- Contact support if persists

#### **3. High Bounce Rate Warning**
**Problem:** Yellow warning on dashboard

**Solutions:**
- Review email list quality
- Remove invalid addresses
- Use double opt-in for signups
- Check email content for spam triggers
- Monitor bounce details table

#### **4. Account Blocked**
**Problem:** Red alert showing blocked status

**Solutions:**
- Stop sending immediately
- Review bounce reasons
- Clean email list
- Contact support for unblock
- Implement better list hygiene

#### **5. Metrics Not Loading**
**Problem:** Empty metrics or charts

**Solutions:**
- Ensure emails have been sent
- Wait for data to populate
- Switch between tabs
- Refresh browser
- Check console for errors

### Getting Help

**In the Prototype:**
- Look for ℹ️ info icons
- Read inline guidance text
- Check alert messages
- Review tooltips

**For Real Implementation:**
- Contact IBM Cloud support
- Check documentation
- Open support ticket
- Visit community forums

---

## 🎯 Quick Reference

### Common Tasks

| Task | Steps |
|------|-------|
| Add domain | Domains → Add Domain → Enter domain → Add DNS → Verify |
| Setup SMTP | SMTP Config → Select domain → Request access → Get credentials |
| View metrics | Metrics → Select tab → Review data |
| Add security | Security → Create zone → Add IPs → Create rule |

### Keyboard Shortcuts
- **Tab** - Navigate between fields
- **Enter** - Submit forms
- **Esc** - Close modals/wizards
- **Ctrl/Cmd + C** - Copy (when text selected)

### Status Badge Colors
- 🟢 **Green** - Success, Active, Verified
- 🟡 **Yellow** - Warning, Pending, In Progress
- 🔴 **Red** - Error, Failed, Blocked
- ⚪ **Gray** - Neutral, Not Configured

---

## 📝 Notes

### This is a Prototype
- Simulates backend interactions
- No real emails are sent
- State changes are temporary
- Data resets on page reload
- For demonstration purposes only

### For Production Use
- Connect to real backend API
- Implement actual DNS verification
- Add real SMTP server
- Integrate with email service
- Add user authentication
- Implement data persistence
- Add error handling
- Include logging and monitoring

---

## 🎓 Learning Resources

### Understanding Email Concepts
- **SPF** - Sender Policy Framework (prevents spoofing)
- **DKIM** - DomainKeys Identified Mail (email authentication)
- **SMTP** - Simple Mail Transfer Protocol (email sending)
- **Bounce** - Failed email delivery
- **Open Rate** - Percentage of emails opened

### Related Technologies
- DNS management
- Email authentication
- API design
- Event-driven architecture
- Security best practices

---

## 📞 Support

For questions about this prototype:
- GitHub Issues: https://github.com/dilip-poojari/IBM-EMAIL/issues
- Email: dilip.poojari@example.com

---

**Last Updated:** March 18, 2026
**Version:** 1.0.0