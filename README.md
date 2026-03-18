# IBM Email Management System - Interactive Prototype

An interactive, multi-page enterprise UI prototype for an Email Management system within a cloud platform (similar to IBM Cloud Event Notifications).

## 🌐 Live Demo

**Public URL:** [https://dilip-poojari.github.io/IBM-EMAIL/](https://dilip-poojari.github.io/IBM-EMAIL/)

## 📋 Overview

This prototype demonstrates a complete email management dashboard designed for DevOps and platform engineers. It includes domain verification, SMTP configuration, API-based email setup, metrics monitoring, and security controls.

## ✨ Features

### 1. **Email Home (Dashboard)**
- Summary cards showing system status:
  - Domain verification status
  - SMTP authorization status
  - Spam/bounce rate monitoring
  - Key management status
- Quick action buttons for common tasks
- Recent activity log
- Contextual alerts and warnings

### 2. **Domain Management**
- Multi-step wizard for domain setup
- DNS record generation (SPF and DKIM)
- Real-time verification simulation
- Domain status tracking
- Support for multiple domains

### 3. **SMTP Configuration**
- Domain selection for SMTP
- Authorization request workflow
- Credential management (API Key, Username/Password)
- SMTP server details display
- Deprecated authentication warnings

### 4. **API Email (Custom Email)**
- Event-driven email architecture
- Visual flow diagram showing setup steps
- Email destination management
- Topic and subscription management
- Integration with Event Notifications

### 5. **Metrics Dashboard**
- Separate tabs for API Email and SMTP Email
- Key metrics:
  - Sent, Delivered, Failed, Bounced
  - Opened (API Email only)
- Trend visualization placeholders
- Bounce details table
- Comparative analytics

### 6. **Security (CBR)**
- Context-Based Restrictions management
- Network zone configuration
- IP-based access rules
- Visual rule management interface
- Security best practices guidance

## 🎨 Design Principles

- **Enterprise SaaS Aesthetic**: Clean, professional IBM Cloud-inspired design
- **Progressive Disclosure**: Advanced settings revealed when needed
- **Status Visibility**: Always-visible system state indicators
- **Guided Workflows**: Step-by-step wizards for complex tasks
- **Inline Guidance**: Contextual help instead of external documentation

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No framework dependencies
- **Font Awesome**: Icon library
- **IBM Plex**: Typography (via CDN)

## 📁 Project Structure

```
IBM-EMAIL/
├── index.html          # Main HTML file with navigation
├── css/
│   └── styles.css      # Complete styling (1000+ lines)
├── js/
│   └── app.js          # Application logic and state management
└── README.md           # This file
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/dilip-poojari/IBM-EMAIL.git
cd IBM-EMAIL
```

2. Open `index.html` in your browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or simply open the file
open index.html
```

3. Navigate through the different sections using the sidebar

### Deployment

The project is deployed on GitHub Pages. Any push to the `main` branch will automatically update the live site.

## 🎯 Interactive Features

### State Management
- Domain verification states (unverified → pending → verified/failed)
- SMTP authorization flow (not-enabled → pending → enabled)
- Spam status monitoring (normal → warning → blocked)
- Wizard step progression

### User Interactions
- **Copy to Clipboard**: DNS records, credentials
- **Toggle Visibility**: Show/hide sensitive credentials
- **Tab Switching**: Metrics dashboard tabs
- **Wizard Navigation**: Multi-step domain setup
- **Status Simulation**: Automatic state transitions

### Edge Cases Demonstrated
- Missing verified domains warning
- DNS verification failure state
- High bounce rate warnings
- Account blocking scenarios
- Empty state displays

## 📊 System States

The prototype demonstrates various system states:

| Component | States |
|-----------|--------|
| Domain | Unverified, Pending, Verified, Failed |
| SMTP | Not Enabled, Pending, Enabled |
| Spam Status | Normal, Warning, Blocked |
| Key Management | Not Configured, Configured |

## 🎨 Color Scheme

- **Primary Blue**: `#0f62fe` (IBM Blue)
- **Success Green**: `#24a148`
- **Warning Yellow**: `#f1c21b`
- **Error Red**: `#da1e28`
- **Pending Purple**: `#8a3ffc`
- **Dark Background**: `#161616`
- **Sidebar**: `#262626`

## 📱 Responsive Design

The prototype is responsive and works on:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Security Features

- Context-Based Restrictions (CBR) UI
- Network zone management
- IP-based access control
- Credential masking
- Security warnings and best practices

## 📈 Metrics Tracking

### API Email Metrics
- Sent: 12,543
- Delivered: 12,234
- Failed: 89
- Bounced: 220
- Opened: 8,456

### SMTP Email Metrics
- Sent: 8,932
- Delivered: 8,721
- Failed: 45
- Bounced: 166
- Note: Open tracking not available for SMTP

## 🎓 Learning Resources

This prototype demonstrates:
- Enterprise UI/UX patterns
- State management in vanilla JavaScript
- CSS Grid and Flexbox layouts
- Responsive design techniques
- Accessibility considerations
- Progressive disclosure patterns

## 🤝 Contributing

This is a prototype project. For improvements or suggestions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for demonstration purposes.

## 👤 Author

**Dilip Poojari**
- GitHub: [@dilip-poojari](https://github.com/dilip-poojari)

## 🙏 Acknowledgments

- Inspired by IBM Cloud Event Notifications
- Design patterns from enterprise SaaS platforms
- Icons by Font Awesome
- Typography by IBM Plex

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Note**: This is a prototype/demo application. It simulates backend interactions and does not connect to real services.