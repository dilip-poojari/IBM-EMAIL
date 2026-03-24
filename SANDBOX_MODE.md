# Sandbox Mode for Email Delivery Management

## Overview

Sandbox Mode provides a safe, isolated testing environment for developers to validate email configurations and test email delivery workflows without sending messages to real recipients. This feature is essential for development, testing, and CI/CD pipelines.

## What is Sandbox Mode?

Sandbox Mode is a testing environment that:

- **Captures emails** instead of delivering them to real recipients
- **Provides a Test Inbox** where captured messages can be viewed and inspected
- **Bypasses production requirements** like domain verification, DKIM, and SPF
- **Simulates real delivery** with realistic response codes and timing
- **Prevents accidental sends** to customer email addresses during development

### Key Benefits

1. **Safe Testing**: Test email templates, configurations, and workflows without risk
2. **Faster Development**: No need to verify domains or configure DNS records
3. **Cost Effective**: No charges for sandbox email sends
4. **Debugging**: Inspect full email content, headers, and metadata
5. **CI/CD Integration**: Automated testing in deployment pipelines

---

## SMTP Sandbox Mode

### Configuration

When Sandbox Mode is enabled for SMTP, you receive sandbox-specific credentials:

```
Hostname: sandbox.smtp.ibmcloud.com
Port: 587 (STARTTLS) or 465 (SSL/TLS)
Username: sandbox_user_<instance_id>
Password: <generated_sandbox_password>
API Key: sandbox_key_<instance_id>
```

### How It Works

1. **Enable Sandbox Mode** in the SMTP Configuration page
2. **Use sandbox credentials** to connect to the SMTP server
3. **Send emails** to any address (they won't be delivered externally)
4. **View captured emails** in the Test Inbox
5. **Switch to Production Mode** when ready to send real emails

### SMTP Code Example

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Sandbox SMTP Configuration
SMTP_HOST = "sandbox.smtp.ibmcloud.com"
SMTP_PORT = 587
SMTP_USERNAME = "sandbox_user_abc123"
SMTP_PASSWORD = "sandbox_pass_xyz789"

# Create message
msg = MIMEMultipart()
msg['From'] = "test@example.com"
msg['To'] = "recipient@example.com"
msg['Subject'] = "Test Email from Sandbox"

body = "This is a test email sent via Sandbox Mode."
msg.attach(MIMEText(body, 'plain'))

# Send email
try:
    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    server.send_message(msg)
    server.quit()
    print("✓ Email captured in sandbox")
except Exception as e:
    print(f"✗ Error: {e}")
```

### Node.js Example

```javascript
const nodemailer = require('nodemailer');

// Sandbox SMTP Configuration
const transporter = nodemailer.createTransporter({
  host: 'sandbox.smtp.ibmcloud.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'sandbox_user_abc123',
    pass: 'sandbox_pass_xyz789'
  }
});

// Send email
const mailOptions = {
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test Email from Sandbox',
  text: 'This is a test email sent via Sandbox Mode.',
  html: '<p>This is a test email sent via <strong>Sandbox Mode</strong>.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('✗ Error:', error);
  } else {
    console.log('✓ Email captured in sandbox:', info.messageId);
  }
});
```

### cURL Example

```bash
# Using SMTP via curl (requires curl with SMTP support)
curl --url 'smtp://sandbox.smtp.ibmcloud.com:587' \
  --ssl-reqd \
  --mail-from 'test@example.com' \
  --mail-rcpt 'recipient@example.com' \
  --user 'sandbox_user_abc123:sandbox_pass_xyz789' \
  --upload-file - << EOF
From: test@example.com
To: recipient@example.com
Subject: Test Email from Sandbox

This is a test email sent via Sandbox Mode.
EOF
```

---

## API Email Sandbox Mode

### Configuration

When Sandbox Mode is enabled for API Email:

```
Sandbox Domain: sandbox.mail.ibmcloud.com
API Endpoint: https://api.ibmcloud.com/event-notifications/v1/instances/{instance_id}/notifications
Mode: sandbox
```

### API Request Example

```bash
curl -X POST \
  'https://api.ibmcloud.com/event-notifications/v1/instances/{instance_id}/notifications' \
  -H 'Authorization: Bearer {iam_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "specversion": "1.0",
    "id": "test-email-001",
    "source": "my-app/testing",
    "type": "com.ibm.cloud.email.test",
    "time": "2026-03-24T12:00:00Z",
    "ibmensandbox": true,
    "data": {
      "to": ["user@example.com", "admin@example.com"],
      "from": "noreply@sandbox.mail.ibmcloud.com",
      "subject": "Test Email from Sandbox",
      "body": "This is a test email sent via API Sandbox Mode.",
      "html": "<p>This is a test email sent via <strong>API Sandbox Mode</strong>.</p>"
    }
  }'
```

### API Response Example

```json
{
  "id": "test-email-001",
  "status": "accepted",
  "mode": "sandbox",
  "captured": true,
  "message": "Email captured in sandbox. View in Test Inbox.",
  "test_inbox_url": "https://console.ibmcloud.com/event-notifications/instances/{instance_id}/test-inbox/{message_id}",
  "recipients": [
    {
      "email": "user@example.com",
      "status": "captured"
    },
    {
      "email": "admin@example.com",
      "status": "captured"
    }
  ],
  "timestamp": "2026-03-24T12:00:01Z"
}
```

### Node.js SDK Example

```javascript
const EventNotificationsV1 = require('@ibm-cloud/event-notifications-node-admin-sdk/event-notifications/v1');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

// Initialize client
const eventNotifications = EventNotificationsV1.newInstance({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_EVENT_NOTIFICATIONS_API_KEY,
  }),
  serviceUrl: process.env.IBM_EVENT_NOTIFICATIONS_URL,
});

// Send email in Sandbox Mode
const params = {
  instanceId: process.env.IBM_EVENT_NOTIFICATIONS_INSTANCE_ID,
  body: {
    specversion: '1.0',
    id: 'test-email-001',
    source: 'my-app/testing',
    type: 'com.ibm.cloud.email.test',
    time: new Date().toISOString(),
    ibmensandbox: true, // Enable Sandbox Mode
    data: {
      to: ['user@example.com'],
      from: 'noreply@sandbox.mail.ibmcloud.com',
      subject: 'Test Email from Sandbox',
      body: 'This is a test email sent via API Sandbox Mode.',
    },
  },
};

eventNotifications.sendNotifications(params)
  .then(response => {
    console.log('✓ Email captured in sandbox');
    console.log('Message ID:', response.result.id);
    console.log('Test Inbox URL:', response.result.test_inbox_url);
  })
  .catch(err => {
    console.error('✗ Error:', err);
  });
```

### Python SDK Example

```python
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_event_notifications import EventNotificationsV1
import os
from datetime import datetime

# Initialize client
authenticator = IAMAuthenticator(os.environ['IBM_EVENT_NOTIFICATIONS_API_KEY'])
event_notifications = EventNotificationsV1(authenticator=authenticator)
event_notifications.set_service_url(os.environ['IBM_EVENT_NOTIFICATIONS_URL'])

# Send email in Sandbox Mode
response = event_notifications.send_notifications(
    instance_id=os.environ['IBM_EVENT_NOTIFICATIONS_INSTANCE_ID'],
    body={
        'specversion': '1.0',
        'id': 'test-email-001',
        'source': 'my-app/testing',
        'type': 'com.ibm.cloud.email.test',
        'time': datetime.utcnow().isoformat() + 'Z',
        'ibmensandbox': True,  # Enable Sandbox Mode
        'data': {
            'to': ['user@example.com'],
            'from': 'noreply@sandbox.mail.ibmcloud.com',
            'subject': 'Test Email from Sandbox',
            'body': 'This is a test email sent via API Sandbox Mode.',
        }
    }
).get_result()

print('✓ Email captured in sandbox')
print('Message ID:', response['id'])
print('Test Inbox URL:', response['test_inbox_url'])
```

---

## UI/UX Copy

### Enabling Sandbox Mode

**Toggle Label**: Enable Sandbox Mode

**Description**: 
> Test your email configuration safely without sending to real recipients. Emails sent in Sandbox Mode are captured and available in the Test Inbox for inspection.

**Warning Message** (when enabling):
> ⚠️ **Sandbox Mode Enabled**
> 
> Emails will NOT be delivered to real recipients. All messages are captured in the Test Inbox. Switch to Production Mode before sending to customers.

**Success Message** (after enabling):
> ✓ **Sandbox Mode Active**
> 
> You can now test email sending safely. Use the sandbox credentials below to connect. View captured emails in the Test Inbox.

### Switching to Production Mode

**Confirmation Dialog**:
> **Switch to Production Mode?**
> 
> Emails will be sent to real recipients. Ensure you have:
> - ✓ Verified your domain
> - ✓ Configured DKIM and SPF records
> - ✓ Tested your email templates
> 
> [Cancel] [Switch to Production]

**Warning Message** (in Production Mode):
> 🔴 **Production Mode Active**
> 
> Emails are being sent to real recipients. Use Sandbox Mode for testing.

---

## Backend Requirements

### 1. Safe Routing Rules

```javascript
// Backend routing logic
function routeEmail(email, mode) {
  if (mode === 'sandbox') {
    // Route to sandbox capture system
    return {
      destination: 'sandbox-capture-queue',
      deliver: false,
      capture: true,
      testInboxId: generateTestInboxId(email)
    };
  } else {
    // Route to production delivery system
    return {
      destination: 'production-delivery-queue',
      deliver: true,
      capture: false,
      requireDomainVerification: true,
      requireDKIM: true,
      requireSPF: true
    };
  }
}
```

### 2. DKIM/SPF Bypass for Sandbox

```yaml
# Configuration
sandbox_mode:
  bypass_domain_verification: true
  bypass_dkim_check: true
  bypass_spf_check: true
  use_sandbox_domain: sandbox.mail.ibmcloud.com
  
production_mode:
  bypass_domain_verification: false
  bypass_dkim_check: false
  bypass_spf_check: false
  require_verified_domain: true
```

### 3. Logging Expectations

```javascript
// Sandbox Mode Logging
{
  "timestamp": "2026-03-24T12:00:00Z",
  "mode": "sandbox",
  "event": "email_captured",
  "message_id": "msg_abc123",
  "from": "test@example.com",
  "to": ["user@example.com"],
  "subject": "Test Email",
  "size_bytes": 1024,
  "captured_at": "sandbox-inbox-001",
  "test_inbox_url": "https://console.ibmcloud.com/...",
  "ttl_hours": 24
}

// Production Mode Logging
{
  "timestamp": "2026-03-24T12:00:00Z",
  "mode": "production",
  "event": "email_sent",
  "message_id": "msg_xyz789",
  "from": "noreply@example.com",
  "to": ["customer@example.com"],
  "subject": "Order Confirmation",
  "size_bytes": 2048,
  "delivery_status": "delivered",
  "smtp_response": "250 OK",
  "domain": "example.com",
  "dkim_verified": true,
  "spf_verified": true
}
```

### 4. Rate Limits

```yaml
# Rate Limits Configuration
rate_limits:
  sandbox_mode:
    emails_per_minute: 100
    emails_per_hour: 1000
    emails_per_day: 10000
    concurrent_connections: 10
    
  production_mode:
    emails_per_minute: 1000
    emails_per_hour: 50000
    emails_per_day: 1000000
    concurrent_connections: 100
    
  # Shared limits
  test_inbox_retention_hours: 24
  max_email_size_mb: 10
  max_recipients_per_email: 50
```

### 5. Test Inbox API

```javascript
// Get Test Inbox Messages
GET /v1/instances/{instance_id}/test-inbox

Response:
{
  "messages": [
    {
      "id": "msg_abc123",
      "from": "test@example.com",
      "to": ["user@example.com"],
      "subject": "Test Email",
      "timestamp": "2026-03-24T12:00:00Z",
      "size_bytes": 1024,
      "preview": "This is a test email...",
      "status": "captured"
    }
  ],
  "total_count": 1,
  "retention_expires_at": "2026-03-25T12:00:00Z"
}

// Get Single Message
GET /v1/instances/{instance_id}/test-inbox/{message_id}

Response:
{
  "id": "msg_abc123",
  "from": "test@example.com",
  "to": ["user@example.com"],
  "cc": [],
  "bcc": [],
  "subject": "Test Email",
  "timestamp": "2026-03-24T12:00:00Z",
  "headers": {
    "Content-Type": "text/html; charset=UTF-8",
    "MIME-Version": "1.0"
  },
  "body_text": "This is a test email sent via Sandbox Mode.",
  "body_html": "<p>This is a test email sent via <strong>Sandbox Mode</strong>.</p>",
  "attachments": [],
  "size_bytes": 1024,
  "status": "captured",
  "retention_expires_at": "2026-03-25T12:00:00Z"
}

// Delete Test Inbox Message
DELETE /v1/instances/{instance_id}/test-inbox/{message_id}

Response:
{
  "message": "Message deleted successfully",
  "id": "msg_abc123"
}
```

---

## Validation Rules

### Sandbox Mode Restrictions

1. **Domain Restrictions**:
   - Only `sandbox.mail.ibmcloud.com` is allowed as the sender domain
   - Custom domains return validation error: `"Custom domains not allowed in Sandbox Mode"`

2. **Recipient Validation**:
   - Any email format is accepted (no real delivery validation)
   - Invalid formats still return error for proper testing

3. **Content Restrictions**:
   - Maximum email size: 10 MB
   - Maximum recipients: 50 per email
   - Attachments allowed (captured but not delivered)

### Production Mode Requirements

1. **Domain Verification**:
   - Domain must be verified before sending
   - DKIM and SPF records must be configured
   - Error: `"Domain not verified. Please verify your domain before sending."`

2. **Recipient Validation**:
   - Email addresses must be valid
   - Bounce handling enabled
   - Spam filtering active

3. **Compliance**:
   - Unsubscribe links required for marketing emails
   - CAN-SPAM compliance enforced
   - GDPR compliance features available

---

## Error Handling

### Sandbox Mode Errors

```json
{
  "error": "sandbox_rate_limit_exceeded",
  "message": "Sandbox rate limit exceeded. Maximum 100 emails per minute.",
  "code": 429,
  "retry_after": 60
}
```

```json
{
  "error": "invalid_sandbox_configuration",
  "message": "Custom domain not allowed in Sandbox Mode. Use sandbox.mail.ibmcloud.com",
  "code": 400
}
```

### Production Mode Errors

```json
{
  "error": "domain_not_verified",
  "message": "Domain example.com is not verified. Please verify your domain before sending.",
  "code": 403,
  "domain": "example.com",
  "verification_url": "https://console.ibmcloud.com/event-notifications/domains/verify"
}
```

```json
{
  "error": "dkim_not_configured",
  "message": "DKIM records not found for domain example.com. Configure DKIM before sending.",
  "code": 403,
  "domain": "example.com",
  "dkim_setup_url": "https://console.ibmcloud.com/event-notifications/domains/dkim"
}
```

---

## Best Practices

### Development Workflow

1. **Start with Sandbox Mode**
   - Test email templates and formatting
   - Validate SMTP/API integration
   - Debug delivery issues safely

2. **Use Test Inbox**
   - Inspect email content and headers
   - Verify HTML rendering
   - Check attachment handling

3. **Automated Testing**
   - Include sandbox tests in CI/CD pipelines
   - Validate email generation logic
   - Test error handling

4. **Switch to Production**
   - Verify domain and DNS records
   - Test with small recipient list first
   - Monitor delivery metrics

### Security Considerations

1. **Credential Management**
   - Sandbox credentials are separate from production
   - Rotate credentials regularly
   - Use API keys instead of username/password

2. **Access Control**
   - Limit sandbox access to development teams
   - Require approval for production mode
   - Audit mode switches

3. **Data Privacy**
   - Test Inbox messages expire after 24 hours
   - No PII should be used in sandbox testing
   - Messages are encrypted at rest

---

## Monitoring and Observability

### Metrics to Track

```yaml
sandbox_metrics:
  - emails_captured_total
  - emails_captured_per_minute
  - test_inbox_messages_count
  - sandbox_api_requests_total
  - sandbox_errors_total
  
production_metrics:
  - emails_sent_total
  - emails_delivered_total
  - emails_bounced_total
  - emails_failed_total
  - delivery_time_seconds
  - smtp_connection_errors
```

### Alerts

```yaml
alerts:
  - name: sandbox_rate_limit_approaching
    condition: sandbox_emails_per_minute > 80
    severity: warning
    
  - name: production_delivery_failure_rate_high
    condition: (emails_failed / emails_sent) > 0.05
    severity: critical
    
  - name: domain_verification_expired
    condition: domain_verification_expires_in_days < 7
    severity: warning
```

---

## Migration Path

### From Sandbox to Production

```bash
# Step 1: Test in Sandbox
curl -X POST ... -d '{"ibmensandbox": true, ...}'

# Step 2: Verify Domain
curl -X POST /v1/instances/{instance_id}/domains \
  -d '{"domain": "example.com"}'

# Step 3: Configure DNS
# Add DKIM and SPF records to DNS

# Step 4: Verify DNS
curl -X POST /v1/instances/{instance_id}/domains/{domain_id}/verify

# Step 5: Switch to Production
curl -X POST ... -d '{"ibmensandbox": false, ...}'
```

---

## FAQ

**Q: How long are Test Inbox messages retained?**  
A: Messages are retained for 24 hours and then automatically deleted.

**Q: Can I use Sandbox Mode in production?**  
A: No, Sandbox Mode is for testing only. Production traffic requires verified domains.

**Q: Are there costs for Sandbox Mode?**  
A: No, sandbox emails are free and do not count toward your billing quota.

**Q: Can I test with real email addresses in Sandbox Mode?**  
A: Yes, but emails won't be delivered. Use the Test Inbox to view captured messages.

**Q: What happens if I exceed sandbox rate limits?**  
A: Requests will be throttled with a 429 error. Wait and retry after the specified time.

**Q: Can I use attachments in Sandbox Mode?**  
A: Yes, attachments are captured and available in the Test Inbox.

**Q: How do I switch between Sandbox and Production modes?**  
A: Use the toggle in the UI or set `ibmensandbox: true/false` in API requests.

---

## Support

For questions or issues with Sandbox Mode:
- Documentation: https://cloud.ibm.com/docs/event-notifications
- Support: https://cloud.ibm.com/unifiedsupport
- Community: https://community.ibm.com/community/user/cloud

---

**Last Updated**: March 24, 2026  
**Version**: 1.0.0