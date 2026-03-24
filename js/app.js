// Application State Management
const AppState = {
    currentPage: 'home',
    domainStatus: 'unverified', // unverified, pending, verified, failed
    smtpStatus: 'not-enabled', // not-enabled, pending, enabled
    spamStatus: 'normal', // normal, warning, blocked
    keyManagementStatus: 'not-configured', // not-configured, configured
    wizardStep: 1,
    selectedDomain: '',
    sandboxMode: false, // Sandbox Mode toggle
    apiSandboxMode: false, // API Email Sandbox Mode
    domains: [
        { name: 'example.com', status: 'verified', addedDate: '2026-03-10' },
        { name: 'test.com', status: 'pending', addedDate: '2026-03-15' }
    ],
    smtpCredentials: {
        apiKey: 'demo_api_key_xxxxxxxxxxxxxxxxxxxxx',
        username: 'smtp_user_12345',
        password: 'P@ssw0rd!2024',
        endpoint: 'smtp.ibmcloud.com',
        port: '587'
    },
    sandboxCredentials: {
        apiKey: 'sandbox_key_demo_instance_abc123',
        username: 'sandbox_user_abc123',
        password: 'sandbox_pass_xyz789',
        endpoint: 'sandbox.smtp.ibmcloud.com',
        port: '587'
    },
    metrics: {
        api: {
            sent: 12543,
            delivered: 12234,
            failed: 89,
            bounced: 220,
            opened: 8456
        },
        smtp: {
            sent: 8932,
            delivered: 8721,
            failed: 45,
            bounced: 166
        },
        sandbox: {
            sent: 45,
            captured: 45,
            testInboxCount: 12
        }
    },
    testInbox: [
        {
            id: 'msg_001',
            from: 'test@example.com',
            to: 'user@example.com',
            subject: 'Test Email 1',
            timestamp: '2026-03-24T10:30:00Z',
            preview: 'This is a test email sent via Sandbox Mode...',
            status: 'captured'
        },
        {
            id: 'msg_002',
            from: 'test@example.com',
            to: 'admin@example.com',
            subject: 'Test Email 2',
            timestamp: '2026-03-24T11:15:00Z',
            preview: 'Another test email for validation...',
            status: 'captured'
        }
    ]
};

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPage('home');
    setupNavigation();
});

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

// Navigate to page
function navigateTo(page) {
    AppState.currentPage = page;
    loadPage(page);
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
}

// Load page content
function loadPage(page) {
    const content = document.getElementById('main-content');
    const template = PageTemplates[page];
    
    if (template) {
        content.innerHTML = template();
    } else {
        content.innerHTML = '<div class="empty-state"><h2>Page not found</h2></div>';
    }
}

// Copy to clipboard
function copyToClipboard(text, iconId) {
    navigator.clipboard.writeText(text).then(() => {
        const icon = document.getElementById(iconId);
        if (icon) {
            icon.className = 'fas fa-check';
            setTimeout(() => {
                icon.className = 'fas fa-copy';
            }, 2000);
        }
    });
}

// Toggle credential visibility
function toggleCredential(type) {
    const valueEl = document.getElementById(`${type}-value`);
    const iconEl = document.getElementById(`${type}-icon`);
    
    if (valueEl.classList.contains('credential-hidden')) {
        valueEl.classList.remove('credential-hidden');
        valueEl.textContent = AppState.smtpCredentials[type === 'api-key' ? 'apiKey' : type];
        iconEl.className = 'fas fa-eye-slash';
    } else {
        valueEl.classList.add('credential-hidden');
        valueEl.textContent = '••••••••••••••••';
        iconEl.className = 'fas fa-eye';
    }
}

// Domain Setup Functions
function startDomainSetup() {
    AppState.wizardStep = 1;
    AppState.selectedDomain = '';
    navigateTo('domains');
    setTimeout(() => {
        document.getElementById('domain-wizard').classList.remove('hidden');
    }, 100);
}

function nextWizardStep() {
    if (AppState.wizardStep === 1) {
        const domainInput = document.getElementById('domain-input');
        if (domainInput && domainInput.value) {
            AppState.selectedDomain = domainInput.value;
            AppState.wizardStep = 2;
            loadPage('domains');
            setTimeout(() => {
                document.getElementById('domain-wizard').classList.remove('hidden');
            }, 100);
        }
    } else if (AppState.wizardStep === 2) {
        AppState.wizardStep = 3;
        AppState.domainStatus = 'pending';
        loadPage('domains');
        setTimeout(() => {
            document.getElementById('domain-wizard').classList.remove('hidden');
            // Simulate verification after 3 seconds
            setTimeout(() => {
                AppState.domainStatus = 'verified';
                AppState.domains.push({
                    name: AppState.selectedDomain,
                    status: 'verified',
                    addedDate: new Date().toISOString().split('T')[0]
                });
                loadPage('domains');
                setTimeout(() => {
                    document.getElementById('domain-wizard').classList.remove('hidden');
                }, 100);
            }, 3000);
        }, 100);
    }
}

function previousWizardStep() {
    if (AppState.wizardStep > 1) {
        AppState.wizardStep--;
        loadPage('domains');
        setTimeout(() => {
            document.getElementById('domain-wizard').classList.remove('hidden');
        }, 100);
    }
}

function closeWizard() {
    document.getElementById('domain-wizard').classList.add('hidden');
    AppState.wizardStep = 1;
    loadPage('domains');
}

function copyDNSRecord(type) {
    const records = {
        spf: 'v=spf1 include:_spf.ibmcloud.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...'
    };
    
    copyToClipboard(records[type], 'copy-btn');
}

function verifyDomain(domainName) {
    const domain = AppState.domains.find(d => d.name === domainName);
    if (domain) {
        domain.status = 'pending';
        loadPage('domains');
        
        // Simulate verification
        setTimeout(() => {
            domain.status = 'verified';
            loadPage('domains');
        }, 2000);
    }
}

function viewDomainDetails(domainName) {
    alert(`Viewing details for ${domainName}`);
}

// SMTP Functions
function selectSMTPDomain(domain) {
    AppState.selectedDomain = domain;
    loadPage('smtp');
}

function requestSMTPAccess() {
    AppState.smtpStatus = 'pending';
    loadPage('smtp');
    
    // Simulate authorization after 3 seconds
    setTimeout(() => {
        AppState.smtpStatus = 'enabled';
        loadPage('smtp');
    }, 3000);

// Sandbox Mode Functions
function toggleSandboxMode() {
    AppState.sandboxMode = !AppState.sandboxMode;
    loadPage('smtp');
}

function toggleAPISandboxMode() {
    AppState.apiSandboxMode = !AppState.apiSandboxMode;
    loadPage('api-email');
}

function viewTestInbox() {
    alert('Test Inbox: ' + AppState.testInbox.length + ' messages captured');
}

function viewTestMessage(messageId) {
    const message = AppState.testInbox.find(m => m.id === messageId);
    if (message) {
        alert(`Message: ${message.subject}\nFrom: ${message.from}\nTo: ${message.to}\n\n${message.preview}`);
    }
}
}

// Metrics Functions
function switchMetricsTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`metrics-${tab}`).classList.add('active');
}

// API Email Functions
function showCreateDestination() {
    alert('Create Email Destination dialog would open here');
}

function showCreateTopic() {
    alert('Create Topic dialog would open here');
}

// Security Functions
function showCreateNetworkZone() {
    alert('Create Network Zone dialog would open here');
}

// Made with Bob

// Page Templates
const PageTemplates = {
    home: () => `
        <div class="page-header">
            <h1>Email Delivery Management</h1>
            <p>Manage your email domains, SMTP configuration, and monitor email delivery metrics</p>
        </div>

        <div class="status-cards">
            <div class="status-card ${AppState.domainStatus === 'verified' ? 'verified' : AppState.domainStatus === 'pending' ? 'pending' : ''}">
                <div class="status-card-header">
                    <span class="status-card-title">Domain Status</span>
                    <i class="fas fa-globe" style="font-size: 1.5rem; color: var(--text-light);"></i>
                </div>
                <div class="status-card-value">${AppState.domains.length}</div>
                <div class="status-card-footer">
                    <span class="badge ${AppState.domainStatus === 'verified' ? 'badge-success' : AppState.domainStatus === 'pending' ? 'badge-pending' : 'badge-neutral'}">
                        ${AppState.domainStatus === 'verified' ? 'Verified' : AppState.domainStatus === 'pending' ? 'Pending' : 'Unverified'}
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="navigateTo('domains')">Manage</button>
                </div>
            </div>

            <div class="status-card ${AppState.smtpStatus === 'enabled' ? 'verified' : AppState.smtpStatus === 'pending' ? 'pending' : ''}">
                <div class="status-card-header">
                    <span class="status-card-title">SMTP Authorization</span>
                    <i class="fas fa-server" style="font-size: 1.5rem; color: var(--text-light);"></i>
                </div>
                <div class="status-card-value">${AppState.smtpStatus === 'enabled' ? 'Active' : 'Inactive'}</div>
                <div class="status-card-footer">
                    <span class="badge ${AppState.smtpStatus === 'enabled' ? 'badge-success' : AppState.smtpStatus === 'pending' ? 'badge-pending' : 'badge-neutral'}">
                        ${AppState.smtpStatus === 'enabled' ? 'Enabled' : AppState.smtpStatus === 'pending' ? 'Pending' : 'Not Enabled'}
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="navigateTo('smtp')">Configure</button>
                </div>
            </div>

            <div class="status-card ${AppState.spamStatus === 'blocked' ? 'error' : AppState.spamStatus === 'warning' ? 'warning' : 'verified'}">
                <div class="status-card-header">
                    <span class="status-card-title">Spam Status</span>
                    <i class="fas fa-shield-alt" style="font-size: 1.5rem; color: var(--text-light);"></i>
                </div>
                <div class="status-card-value">${AppState.spamStatus === 'normal' ? 'Good' : AppState.spamStatus === 'warning' ? 'Warning' : 'Blocked'}</div>
                <div class="status-card-footer">
                    <span class="badge ${AppState.spamStatus === 'normal' ? 'badge-success' : AppState.spamStatus === 'warning' ? 'badge-warning' : 'badge-error'}">
                        ${AppState.spamStatus.charAt(0).toUpperCase() + AppState.spamStatus.slice(1)}
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="navigateTo('metrics')">View Details</button>
                </div>
            </div>

            <div class="status-card ${AppState.keyManagementStatus === 'configured' ? 'verified' : ''}">
                <div class="status-card-header">
                    <span class="status-card-title">Key Management</span>
                    <i class="fas fa-key" style="font-size: 1.5rem; color: var(--text-light);"></i>
                </div>
                <div class="status-card-value">${AppState.keyManagementStatus === 'configured' ? 'Active' : 'Inactive'}</div>
                <div class="status-card-footer">
                    <span class="badge ${AppState.keyManagementStatus === 'configured' ? 'badge-success' : 'badge-neutral'}">
                        ${AppState.keyManagementStatus === 'configured' ? 'Configured' : 'Not Configured'}
                    </span>
                    <button class="btn btn-sm btn-secondary" onclick="navigateTo('security')">Setup</button>
                </div>
            </div>
        </div>

        ${AppState.domainStatus === 'unverified' ? `
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div class="alert-content">
                <h4>Get Started with Email Management</h4>
                <p>To start sending emails, you need to verify your domain and configure your sending method (SMTP or API).</p>
            </div>
        </div>
        ` : ''}

        ${AppState.spamStatus === 'warning' ? `
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="alert-content">
                <h4>High Bounce Rate Detected</h4>
                <p>Your bounce rate is above 5%. Please review your email list quality to avoid being blocked.</p>
            </div>
        </div>
        ` : ''}

        ${AppState.spamStatus === 'blocked' ? `
        <div class="alert alert-error">
            <i class="fas fa-ban"></i>
            <div class="alert-content">
                <h4>Email Sending Blocked</h4>
                <p>Your account has been temporarily blocked due to high bounce rates. Contact support to resolve this issue.</p>
            </div>
        </div>
        ` : ''}

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Quick Actions</h2>
            </div>
            <div class="card-body">
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="startDomainSetup()">
                        <i class="fas fa-plus"></i>
                        Set up Domain
                    </button>
                    <button class="btn btn-primary" onclick="navigateTo('smtp')">
                        <i class="fas fa-cog"></i>
                        Configure SMTP
                    </button>
                    <button class="btn btn-primary" onclick="navigateTo('api-email')">
                        <i class="fas fa-envelope"></i>
                        Setup API Email
                    </button>
                    <button class="btn btn-secondary" onclick="navigateTo('metrics')">
                        <i class="fas fa-chart-bar"></i>
                        View Metrics
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Recent Activity</h2>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Activity</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2026-03-18</td>
                                <td>SMTP credentials generated</td>
                                <td><span class="badge badge-success">Completed</span></td>
                            </tr>
                            <tr>
                                <td>2026-03-15</td>
                                <td>Domain test.com added</td>
                                <td><span class="badge badge-pending">Pending Verification</span></td>
                            </tr>
                            <tr>
                                <td>2026-03-10</td>
                                <td>Domain example.com verified</td>
                                <td><span class="badge badge-success">Verified</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    domains: () => `
        <div class="page-header">
            <h1>Domain Management</h1>
            <p>Add and verify domains for sending emails</p>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="navigateTo('security')">
                    <i class="fas fa-shield-alt"></i>
                    Manage Context Based Restrictions
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Your Domains</h2>
                <button class="btn btn-primary" onclick="startDomainSetup()">
                    <i class="fas fa-plus"></i>
                    Add Domain
                </button>
            </div>
            <div class="card-body">
                ${AppState.domains.length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Added Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.domains.map(domain => `
                            <tr>
                                <td><strong>${domain.name}</strong></td>
                                <td>
                                    <span class="badge ${domain.status === 'verified' ? 'badge-success' : domain.status === 'pending' ? 'badge-pending' : 'badge-error'}">
                                        ${domain.status.charAt(0).toUpperCase() + domain.status.slice(1)}
                                    </span>
                                </td>
                                <td>${domain.addedDate}</td>
                                <td>
                                    ${domain.status === 'pending' ? `
                                    <button class="btn btn-sm btn-secondary" onclick="verifyDomain('${domain.name}')">
                                        <i class="fas fa-check"></i>
                                        Verify
                                    </button>
                                    ` : ''}
                                    <button class="btn btn-sm btn-ghost" onclick="viewDomainDetails('${domain.name}')">
                                        <i class="fas fa-eye"></i>
                                        View
                                    </button>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <h3 class="empty-state-title">No domains added yet</h3>
                    <p class="empty-state-description">Add your first domain to start sending emails</p>
                    <button class="btn btn-primary" onclick="startDomainSetup()">
                        <i class="fas fa-plus"></i>
                        Add Domain
                    </button>
                </div>
                `}
            </div>
        </div>

        <div id="domain-wizard" class="hidden">
            ${getDomainWizardHTML()}
        </div>
    `,

    smtp: () => `
        <div class="page-header">
            <h1>SMTP Configuration</h1>
            <p>Configure SMTP for direct email sending</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Sandbox Mode</h2>
                <label class="toggle-switch">
                    <input type="checkbox" ${AppState.sandboxMode ? 'checked' : ''} onchange="toggleSandboxMode()">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="card-body">
                ${AppState.sandboxMode ? `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="alert-content">
                        <h4>Sandbox Mode Enabled</h4>
                        <p>Emails will NOT be delivered to real recipients. All messages are captured in the Test Inbox. Switch to Production Mode before sending to customers.</p>
                    </div>
                </div>
                <p style="margin-bottom: 1rem;">Test your email configuration safely without sending to real recipients. Emails sent in Sandbox Mode are captured and available in the Test Inbox for inspection.</p>
                
                <div class="credentials-section">
                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Sandbox Hostname</div>
                            <div class="credential-value">
                                <span>${AppState.sandboxCredentials.endpoint}</span>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.sandboxCredentials.endpoint}', 'sandbox-host-copy')">
                                    <i class="fas fa-copy" id="sandbox-host-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Port</div>
                            <div class="credential-value">
                                <span>${AppState.sandboxCredentials.port} (STARTTLS)</span>
                            </div>
                        </div>
                    </div>
                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Sandbox API Key</div>
                            <div class="credential-value">
                                <span id="sandbox-api-key-value" class="credential-hidden">••••••••••••••••</span>
                                <button class="btn btn-sm btn-ghost" onclick="toggleCredential('sandbox-api-key')">
                                    <i class="fas fa-eye" id="sandbox-api-key-icon"></i>
                                </button>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.sandboxCredentials.apiKey}', 'sandbox-api-key-copy')">
                                    <i class="fas fa-copy" id="sandbox-api-key-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Sandbox Username</div>
                            <div class="credential-value">
                                <span>${AppState.sandboxCredentials.username}</span>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.sandboxCredentials.username}', 'sandbox-user-copy')">
                                    <i class="fas fa-copy" id="sandbox-user-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="viewTestInbox()">
                        <i class="fas fa-inbox"></i>
                        View Test Inbox (${AppState.testInbox.length} messages)
                    </button>
                    <a href="SANDBOX_MODE.md" target="_blank" class="btn btn-secondary" style="margin-left: 0.5rem;">
                        <i class="fas fa-book"></i>
                        View Documentation
                    </a>
                </div>

                <div class="alert alert-info mt-3">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>Sandbox Metrics</h4>
                        <p>Sent: ${AppState.metrics.sandbox.sent} | Captured: ${AppState.metrics.sandbox.captured} | Test Inbox: ${AppState.metrics.sandbox.testInboxCount} messages</p>
                    </div>
                </div>
                ` : `
                <p style="margin-bottom: 1rem;">Enable Sandbox Mode to test your email configuration safely without sending to real recipients. Emails sent in Sandbox Mode are captured and available in the Test Inbox for inspection.</p>
                
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>What is Sandbox Mode?</h4>
                        <ul style="margin: 0.5rem 0 0 1.5rem;">
                            <li>Test email templates and configurations safely</li>
                            <li>No domain verification or DNS configuration required</li>
                            <li>Emails are captured, not delivered externally</li>
                            <li>View captured emails in the Test Inbox</li>
                            <li>Free - no charges for sandbox sends</li>
                        </ul>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="toggleSandboxMode()" style="margin-top: 1rem;">
                    <i class="fas fa-flask"></i>
                    Enable Sandbox Mode
                </button>
                `}
            </div>
        </div>

        ${AppState.domains.filter(d => d.status === 'verified').length === 0 && !AppState.sandboxMode ? `
        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="alert-content">
                <h4>No Verified Domains</h4>
                <p>You need to verify at least one domain before configuring SMTP. <a href="#" onclick="navigateTo('domains'); return false;" style="color: inherit; text-decoration: underline;">Add a domain now</a></p>
            </div>
        </div>
        ` : ''}

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Select Domain</h2>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label class="form-label">Choose a verified domain</label>
                    <select class="form-input" id="smtp-domain-select" onchange="selectSMTPDomain(this.value)">
                        <option value="">Select a domain...</option>
                        ${AppState.domains.filter(d => d.status === 'verified').map(domain => `
                        <option value="${domain.name}" ${AppState.selectedDomain === domain.name ? 'selected' : ''}>${domain.name}</option>
                        `).join('')}
                    </select>
                </div>
            </div>
        </div>

        ${AppState.selectedDomain ? `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">SMTP Authorization</h2>
            </div>
            <div class="card-body">
                ${AppState.smtpStatus === 'not-enabled' ? `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>Authorization Required</h4>
                        <p>SMTP access requires authorization. Click the button below to request access for your domain.</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="requestSMTPAccess()">
                    <i class="fas fa-key"></i>
                    Request SMTP Access
                </button>
                ` : AppState.smtpStatus === 'pending' ? `
                <div class="alert alert-warning">
                    <i class="fas fa-clock"></i>
                    <div class="alert-content">
                        <h4>Authorization Pending</h4>
                        <p>Your SMTP access request is being processed. This usually takes a few minutes.</p>
                    </div>
                </div>
                <div class="flex-center">
                    <div class="spinner"></div>
                </div>
                ` : `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle"></i>
                    <div class="alert-content">
                        <h4>SMTP Authorized</h4>
                        <p>Your SMTP access has been approved. Use the credentials below to send emails.</p>
                    </div>
                </div>
                `}
            </div>
        </div>

        ${AppState.smtpStatus === 'enabled' ? `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">SMTP Credentials</h2>
            </div>
            <div class="card-body">
                <div class="credentials-section">
                    <div class="credential-item">
                        <div>
                            <div class="credential-label">API Key (Recommended)</div>
                            <div class="credential-value">
                                <span id="api-key-value" class="credential-hidden">••••••••••••••••</span>
                                <button class="btn btn-sm btn-ghost" onclick="toggleCredential('api-key')">
                                    <i class="fas fa-eye" id="api-key-icon"></i>
                                </button>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.smtpCredentials.apiKey}', 'api-key-copy')">
                                    <i class="fas fa-copy" id="api-key-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Username <span class="badge badge-warning" style="font-size: 0.65rem;">Deprecated</span></div>
                            <div class="credential-value">
                                <span id="username-value" class="credential-hidden">••••••••••••••••</span>
                                <button class="btn btn-sm btn-ghost" onclick="toggleCredential('username')">
                                    <i class="fas fa-eye" id="username-icon"></i>
                                </button>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.smtpCredentials.username}', 'username-copy')">
                                    <i class="fas fa-copy" id="username-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="credential-item">
                        <div>
                            <div class="credential-label">Password <span class="badge badge-warning" style="font-size: 0.65rem;">Deprecated</span></div>
                            <div class="credential-value">
                                <span id="password-value" class="credential-hidden">••••••••••••••••</span>
                                <button class="btn btn-sm btn-ghost" onclick="toggleCredential('password')">
                                    <i class="fas fa-eye" id="password-icon"></i>
                                </button>
                                <button class="btn btn-sm btn-ghost" onclick="copyToClipboard('${AppState.smtpCredentials.password}', 'password-copy')">
                                    <i class="fas fa-copy" id="password-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="alert alert-info mt-3">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>Authentication Method</h4>
                        <p>We recommend using API Key authentication. Username/Password authentication is deprecated and will be removed in a future release.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">SMTP Server Details</h2>
            </div>
            <div class="card-body">
                <div class="dns-records">
                    <div class="dns-record">
                        <div class="dns-record-content">
                            <div class="dns-field">
                                <span class="dns-field-label">Host:</span>
                                <span class="dns-field-value">${AppState.smtpCredentials.endpoint}</span>
                            </div>
                            <div class="dns-field">
                                <span class="dns-field-label">Port:</span>
                                <span class="dns-field-value">${AppState.smtpCredentials.port} (TLS)</span>
                            </div>
                            <div class="dns-field">
                                <span class="dns-field-label">Encryption:</span>
                                <span class="dns-field-value">STARTTLS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
        ` : ''}
    `,

    'api-email': () => `
        <div class="page-header">
            <h1>API Email (Custom Email)</h1>
            <p>Event-driven email sending through topics and subscriptions</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Sandbox Mode</h2>
                <label class="toggle-switch">
                    <input type="checkbox" ${AppState.apiSandboxMode ? 'checked' : ''} onchange="toggleAPISandboxMode()">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="card-body">
                ${AppState.apiSandboxMode ? `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="alert-content">
                        <h4>API Sandbox Mode Enabled</h4>
                        <p>Emails will NOT be delivered to real recipients. Set <code>ibmensandbox: true</code> in your API requests. All messages are captured in the Test Inbox.</p>
                    </div>
                </div>
                <p style="margin-bottom: 1rem;">Test your API email integration safely. Use the sandbox domain <code>sandbox.mail.ibmcloud.com</code> for all API requests.</p>
                
                <div class="dns-records">
                    <div class="dns-record">
                        <div class="dns-record-content">
                            <div class="dns-field">
                                <span class="dns-field-label">Sandbox Domain:</span>
                                <span class="dns-field-value">sandbox.mail.ibmcloud.com</span>
                            </div>
                            <div class="dns-field">
                                <span class="dns-field-label">API Parameter:</span>
                                <span class="dns-field-value">ibmensandbox: true</span>
                            </div>
                            <div class="dns-field">
                                <span class="dns-field-label">From Address:</span>
                                <span class="dns-field-value">noreply@sandbox.mail.ibmcloud.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 1.5rem;">
                    <button class="btn btn-primary" onclick="viewTestInbox()">
                        <i class="fas fa-inbox"></i>
                        View Test Inbox (${AppState.testInbox.length} messages)
                    </button>
                    <a href="SANDBOX_MODE.md#api-email-sandbox-mode" target="_blank" class="btn btn-secondary" style="margin-left: 0.5rem;">
                        <i class="fas fa-book"></i>
                        API Documentation
                    </a>
                </div>

                <div class="alert alert-info mt-3">
                    <i class="fas fa-lightbulb"></i>
                    <div class="alert-content">
                        <h4>Example API Request</h4>
                        <pre style="background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; margin-top: 0.5rem;"><code>{
  "specversion": "1.0",
  "id": "test-001",
  "source": "my-app/testing",
  "type": "com.ibm.cloud.email.test",
  "ibmensandbox": true,
  "data": {
    "to": ["user@example.com"],
    "from": "noreply@sandbox.mail.ibmcloud.com",
    "subject": "Test Email",
    "body": "This is a test email."
  }
}</code></pre>
                    </div>
                </div>
                ` : `
                <p style="margin-bottom: 1rem;">Enable Sandbox Mode to test your API email integration safely without sending to real recipients. Perfect for development and CI/CD pipelines.</p>
                
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>API Sandbox Benefits</h4>
                        <ul style="margin: 0.5rem 0 0 1.5rem;">
                            <li>Test API integration without domain verification</li>
                            <li>No DKIM or SPF configuration required</li>
                            <li>Inspect full email content and headers</li>
                            <li>Validate email templates and data</li>
                            <li>Free testing - no charges for sandbox API calls</li>
                        </ul>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="toggleAPISandboxMode()" style="margin-top: 1rem;">
                    <i class="fas fa-flask"></i>
                    Enable API Sandbox Mode
                </button>
                `}
            </div>
        </div>

        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div class="alert-content">
                <h4>How API Email Works</h4>
                <p>API Email uses an event-driven architecture. You add domains, create topics with subscriptions, and invite users to receive notifications.</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Setup Flow</h2>
            </div>
            <div class="card-body">
                <div class="flow-diagram">
                    <div class="flow-step">
                        <div class="flow-step-icon"><i class="fas fa-globe"></i></div>
                        <div class="flow-step-title">1. Add Domain</div>
                        <div class="flow-step-description">Verify your domain</div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
                    <div class="flow-step">
                        <div class="flow-step-icon"><i class="fas fa-bullhorn"></i></div>
                        <div class="flow-step-title">2. Create Topic</div>
                        <div class="flow-step-description">With subscriptions & filters</div>
                    </div>
                    <div class="flow-arrow"><i class="fas fa-arrow-right"></i></div>
                    <div class="flow-step">
                        <div class="flow-step-icon"><i class="fas fa-paper-plane"></i></div>
                        <div class="flow-step-title">3. Send Events</div>
                        <div class="flow-step-description">Trigger email delivery</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Email Domains</h2>
                <button class="btn btn-primary" onclick="navigateTo('domains')">
                    <i class="fas fa-plus"></i>
                    Add Domain
                </button>
            </div>
            <div class="card-body">
                ${AppState.domains.filter(d => d.status === 'verified').length > 0 ? `
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Added Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${AppState.domains.filter(d => d.status === 'verified').map(domain => `
                            <tr>
                                <td><strong>${domain.name}</strong></td>
                                <td><span class="badge badge-success">Verified</span></td>
                                <td>${domain.addedDate}</td>
                                <td>
                                    <button class="btn btn-sm btn-ghost" onclick="viewDomainDetails('${domain.name}')">
                                        <i class="fas fa-eye"></i>
                                        View
                                    </button>
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                ` : `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <h3 class="empty-state-title">No verified domains</h3>
                    <p class="empty-state-description">Add and verify a domain to use API Email</p>
                    <button class="btn btn-primary" onclick="navigateTo('domains')">
                        <i class="fas fa-plus"></i>
                        Add Domain
                    </button>
                </div>
                `}
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Topics & Subscriptions</h2>
                <button class="btn btn-primary" onclick="showCreateTopic()">
                    <i class="fas fa-plus"></i>
                    Create Topic
                </button>
            </div>
            <div class="card-body">
                <div class="alert alert-info" style="margin-bottom: 1.5rem;">
                    <i class="fas fa-info-circle"></i>
                    <div class="alert-content">
                        <h4>Consolidated Topic Management</h4>
                        <p>When creating a topic, you can configure subscriptions, invite users, and set up filters all in one place.</p>
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Topic Name</th>
                                <th>Domain</th>
                                <th>Subscriptions</th>
                                <th>Recipients</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>user-signup</strong></td>
                                <td>example.com</td>
                                <td><span class="badge badge-success">3 active</span></td>
                                <td>15 users</td>
                                <td>2026-03-10</td>
                                <td>
                                    <button class="btn btn-sm btn-ghost">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>password-reset</strong></td>
                                <td>example.com</td>
                                <td><span class="badge badge-success">1 active</span></td>
                                <td>8 users</td>
                                <td>2026-03-12</td>
                                <td>
                                    <button class="btn btn-sm btn-ghost">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>order-confirmation</strong></td>
                                <td>example.com</td>
                                <td><span class="badge badge-success">2 active</span></td>
                                <td>25 users</td>
                                <td>2026-03-15</td>
                                <td>
                                    <button class="btn btn-sm btn-ghost">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    metrics: () => `
        <div class="page-header">
            <h1>Email Metrics</h1>
            <p>Monitor email delivery performance and engagement</p>
        </div>

        <div class="tabs">
            <button class="tab active" onclick="switchMetricsTab('api')">API Email</button>
            <button class="tab" onclick="switchMetricsTab('smtp')">SMTP Email</button>
        </div>

        <div id="metrics-api" class="tab-content active">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.api.sent.toLocaleString()}</div>
                    <div class="metric-label">Sent</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 12% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.api.delivered.toLocaleString()}</div>
                    <div class="metric-label">Delivered</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 8% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.api.failed}</div>
                    <div class="metric-label">Failed</div>
                    <div class="metric-change negative">
                        <i class="fas fa-arrow-down"></i> 3% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.api.bounced}</div>
                    <div class="metric-label">Bounced</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-down"></i> 5% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.api.opened.toLocaleString()}</div>
                    <div class="metric-label">Opened</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 15% vs last week
                    </div>
                </div>
            </div>

            <div class="chart-container">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Email Delivery Trend Chart</p>
                <p style="font-size: 0.875rem; color: var(--text-light);">(Chart visualization would be rendered here using a charting library)</p>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">Bounce Details</h2>
                </div>
                <div class="card-body">
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Reason</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>user@invalid-domain.com</td>
                                    <td>Domain does not exist</td>
                                    <td><span class="badge badge-error">Hard Bounce</span></td>
                                    <td>2026-03-18</td>
                                </tr>
                                <tr>
                                    <td>mailbox-full@example.com</td>
                                    <td>Mailbox full</td>
                                    <td><span class="badge badge-warning">Soft Bounce</span></td>
                                    <td>2026-03-17</td>
                                </tr>
                                <tr>
                                    <td>no-reply@blocked.com</td>
                                    <td>Recipient blocked sender</td>
                                    <td><span class="badge badge-error">Hard Bounce</span></td>
                                    <td>2026-03-16</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div id="metrics-smtp" class="tab-content">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.smtp.sent.toLocaleString()}</div>
                    <div class="metric-label">Sent</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 5% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.smtp.delivered.toLocaleString()}</div>
                    <div class="metric-label">Delivered</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-up"></i> 4% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.smtp.failed}</div>
                    <div class="metric-label">Failed</div>
                    <div class="metric-change negative">
                        <i class="fas fa-arrow-down"></i> 2% vs last week
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-value">${AppState.metrics.smtp.bounced}</div>
                    <div class="metric-label">Bounced</div>
                    <div class="metric-change positive">
                        <i class="fas fa-arrow-down"></i> 3% vs last week
                    </div>
                </div>
            </div>

            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i>
                <div class="alert-content">
                    <h4>Open Tracking Not Available</h4>
                    <p>SMTP email does not support open tracking. Open tracking is only available for API Email because it requires embedding tracking pixels in the email HTML, which is controlled by the Event Notifications service.</p>
                </div>
            </div>

            <div class="chart-container">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>SMTP Delivery Trend Chart</p>
                <p style="font-size: 0.875rem; color: var(--text-light);">(Chart visualization would be rendered here using a charting library)</p>
            </div>
        </div>
    `,

    security: () => `
        <div class="page-header">
            <h1>Security (Context-Based Restrictions)</h1>
            <p>Control access to your email service using IP-based restrictions</p>
        </div>

        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i>
            <div class="alert-content">
                <h4>What are Context-Based Restrictions?</h4>
                <p>Context-Based Restrictions (CBR) allow you to restrict access to your email service based on network context, such as IP addresses. This adds an extra layer of security by ensuring only authorized networks can send emails.</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Network Zones</h2>
                <button class="btn btn-primary" onclick="showCreateNetworkZone()">
                    <i class="fas fa-plus"></i>
                    Create Network Zone
                </button>
            </div>
            <div class="card-body">
                <div class="network-zone">
                    <div class="network-zone-header">
                        <div>
                            <div class="network-zone-title">Corporate Network</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                Allowed IP addresses for corporate office
                            </div>
                        </div>
                        <button class="btn btn-sm btn-ghost">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                    </div>
                    <div class="rule-list">
                        <div class="rule-item">
                            <span class="rule-ip">192.168.1.0/24</span>
                            <span class="badge badge-success">Active</span>
                        </div>
                        <div class="rule-item">
                            <span class="rule-ip">10.0.0.0/16</span>
                            <span class="badge badge-success">Active</span>
                        </div>
                    </div>
                </div>

                <div class="network-zone">
                    <div class="network-zone-header">
                        <div>
                            <div class="network-zone-title">Cloud Services</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                                Allowed IP addresses for cloud infrastructure
                            </div>
                        </div>
                        <button class="btn btn-sm btn-ghost">
                            <i class="fas fa-edit"></i>
                            Edit
                        </button>
                    </div>
                    <div class="rule-list">
                        <div class="rule-item">
                            <span class="rule-ip">52.12.34.0/24</span>
                            <span class="badge badge-success">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Access Rules</h2>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Rule Name</th>
                                <th>Network Zone</th>
                                <th>Service</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Allow Corporate SMTP</strong></td>
                                <td>Corporate Network</td>
                                <td>SMTP Email</td>
                                <td><span class="badge badge-success">Enabled</span></td>
                                <td>
                                    <button class="btn btn-sm btn-ghost">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Allow Cloud API</strong></td>
                                <td>Cloud Services</td>
                                <td>API Email</td>
                                <td><span class="badge badge-success">Enabled</span></td>
                                <td>
                                    <button class="btn btn-sm btn-ghost">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <div class="alert-content">
                <h4>Important Security Note</h4>
                <p>Be careful when configuring network restrictions. Incorrect rules may block legitimate access to your email service. Always test rules before applying them to production.</p>
            </div>
        </div>
    `
};

// Domain Wizard HTML Generator
function getDomainWizardHTML() {
    const step = AppState.wizardStep;
    
    return `
        <div class="wizard">
            <div class="wizard-header">
                <h2>Add Domain</h2>
                <div class="wizard-steps">
                    <div class="wizard-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}">
                        <div class="wizard-step-number">${step > 1 ? '✓' : '1'}</div>
                        <div class="wizard-step-label">Enter Domain</div>
                    </div>
                    <div class="wizard-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}">
                        <div class="wizard-step-number">${step > 2 ? '✓' : '2'}</div>
                        <div class="wizard-step-label">DNS Records</div>
                    </div>
                    <div class="wizard-step ${step >= 3 ? 'active' : ''}">
                        <div class="wizard-step-number">3</div>
                        <div class="wizard-step-label">Verify</div>
                    </div>
                </div>
            </div>
            <div class="wizard-body">
                ${step === 1 ? `
                    <h3>Enter Your Domain</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Enter the domain you want to use for sending emails.</p>
                    
                    <div class="form-group">
                        <label class="form-label">Domain Name</label>
                        <input type="text" class="form-input" id="domain-input" placeholder="example.com" value="${AppState.selectedDomain}">
                        <div class="form-helper">Enter your domain without http:// or www</div>
                    </div>
                ` : step === 2 ? `
                    <h3>Add DNS Records</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Add the following DNS records to your domain to verify ownership and enable email sending.</p>
                    
                    <div class="dns-records">
                        <div class="dns-record">
                            <div class="dns-record-header">
                                <span class="dns-record-type">SPF Record</span>
                                <button class="copy-btn" onclick="copyDNSRecord('spf')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                            <div class="dns-record-content">
                                <div class="dns-field">
                                    <span class="dns-field-label">Type:</span>
                                    <span class="dns-field-value">TXT</span>
                                </div>
                                <div class="dns-field">
                                    <span class="dns-field-label">Name:</span>
                                    <span class="dns-field-value">@</span>
                                </div>
                                <div class="dns-field">
                                    <span class="dns-field-label">Value:</span>
                                    <span class="dns-field-value">v=spf1 include:_spf.ibmcloud.com ~all</span>
                                </div>
                            </div>
                        </div>

                        <div class="dns-record">
                            <div class="dns-record-header">
                                <span class="dns-record-type">DKIM Record</span>
                                <button class="copy-btn" onclick="copyDNSRecord('dkim')">
                                    <i class="fas fa-copy"></i> Copy
                                </button>
                            </div>
                            <div class="dns-record-content">
                                <div class="dns-field">
                                    <span class="dns-field-label">Type:</span>
                                    <span class="dns-field-value">TXT</span>
                                </div>
                                <div class="dns-field">
                                    <span class="dns-field-label">Name:</span>
                                    <span class="dns-field-value">ibmcloud._domainkey</span>
                                </div>
                                <div class="dns-field">
                                    <span class="dns-field-label">Value:</span>
                                    <span class="dns-field-value">v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info mt-3">
                        <i class="fas fa-info-circle"></i>
                        <div class="alert-content">
                            <h4>DNS Propagation</h4>
                            <p>After adding these records to your DNS provider, it may take up to 48 hours for the changes to propagate. However, verification usually succeeds within a few minutes.</p>
                        </div>
                    </div>
                ` : `
                    ${AppState.domainStatus === 'pending' ? `
                        <div class="flex-center" style="flex-direction: column; padding: 2rem;">
                            <div class="spinner"></div>
                            <h3 style="margin-top: 2rem;">Verifying Domain...</h3>
                            <p style="color: var(--text-secondary); text-align: center; margin-top: 1rem;">
                                We're checking your DNS records. This may take a few moments.
                            </p>
                        </div>
                    ` : AppState.domainStatus === 'verified' ? `
                        <div class="flex-center" style="flex-direction: column; padding: 2rem;">
                            <i class="fas fa-check-circle" style="font-size: 5rem; color: var(--success);"></i>
                            <h3 style="margin-top: 2rem;">Domain Verified Successfully!</h3>
                            <p style="color: var(--text-secondary); text-align: center; margin-top: 1rem;">
                                Your domain <strong>${AppState.selectedDomain}</strong> has been verified and is ready to send emails.
                            </p>
                        </div>
                    ` : `
                        <div class="flex-center" style="flex-direction: column; padding: 2rem;">
                            <i class="fas fa-times-circle" style="font-size: 5rem; color: var(--error);"></i>
                            <h3 style="margin-top: 2rem;">Verification Failed</h3>
                            <p style="color: var(--text-secondary); text-align: center; margin-top: 1rem;">
                                We couldn't verify your domain. Please check that you've added the DNS records correctly.
                            </p>
                        </div>
                    `}
                `}
            </div>
            <div class="wizard-footer">
                <button class="btn btn-ghost" onclick="closeWizard()">
                    ${AppState.domainStatus === 'verified' ? 'Close' : 'Cancel'}
                </button>
                <div class="flex gap-2">
                    ${step > 1 && AppState.domainStatus !== 'verified' ? `
                    <button class="btn btn-secondary" onclick="previousWizardStep()">
                        <i class="fas fa-arrow-left"></i>
                        Previous
                    </button>
                    ` : ''}
                    ${step < 3 ? `
                    <button class="btn btn-primary" onclick="nextWizardStep()">
                        Next
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}
