# IBM Event Notifications Integration Guide

## Overview

This guide explains how to integrate the Email Management UI with IBM Event Notifications service to create a fully functional email delivery system.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     IBM Event Notifications                      │
│  ┌────────────────┐    ┌──────────────┐    ┌─────────────────┐ │
│  │   Sources      │───▶│   Topics     │───▶│  Subscriptions  │ │
│  │ (Your Apps)    │    │  (Routing)   │    │  (Email Dest.)  │ │
│  └────────────────┘    └──────────────┘    └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Email Service UI    │
                    │  (This Application)   │
                    └───────────────────────┘
```

## Integration Components

### 1. Backend API Layer

You need to create a backend service that bridges the UI with IBM Event Notifications APIs.

#### Required Backend Endpoints

```javascript
// Backend API Structure (Node.js/Express Example)

// 1. Domain Management
POST   /api/domains                    // Add new domain
GET    /api/domains                    // List all domains
GET    /api/domains/:id/verify         // Verify domain DNS
DELETE /api/domains/:id                // Remove domain

// 2. SMTP Configuration
POST   /api/smtp/authorize             // Request SMTP authorization
GET    /api/smtp/credentials           // Get SMTP credentials
POST   /api/smtp/credentials/rotate    // Rotate credentials

// 3. Email Destinations (Event Notifications)
POST   /api/destinations/email         // Create email destination
GET    /api/destinations/email         // List email destinations
PUT    /api/destinations/email/:id     // Update email destination
DELETE /api/destinations/email/:id     // Delete email destination

// 4. Topics & Subscriptions
POST   /api/topics                     // Create topic
GET    /api/topics                     // List topics
POST   /api/subscriptions              // Create subscription
GET    /api/subscriptions              // List subscriptions

// 5. Metrics
GET    /api/metrics/email              // Get email metrics
GET    /api/metrics/smtp               // Get SMTP metrics

// 6. Security (CBR)
POST   /api/security/rules             // Create CBR rule
GET    /api/security/rules             // List CBR rules
PUT    /api/security/rules/:id         // Update CBR rule
DELETE /api/security/rules/:id         // Delete CBR rule
```

### 2. IBM Event Notifications SDK Integration

#### Installation

```bash
npm install @ibm-cloud/event-notifications-node-admin-sdk
npm install ibm-cloud-sdk-core
```

#### Backend Service Implementation

```javascript
// backend/services/eventNotifications.js

const EventNotificationsV1 = require('@ibm-cloud/event-notifications-node-admin-sdk/event-notifications/v1');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

class EventNotificationsService {
  constructor() {
    this.client = EventNotificationsV1.newInstance({
      authenticator: new IamAuthenticator({
        apikey: process.env.IBM_EVENT_NOTIFICATIONS_API_KEY,
      }),
      serviceUrl: process.env.IBM_EVENT_NOTIFICATIONS_URL,
    });
    this.instanceId = process.env.IBM_EVENT_NOTIFICATIONS_INSTANCE_ID;
  }

  // Create Email Destination
  async createEmailDestination(config) {
    const params = {
      instanceId: this.instanceId,
      name: config.name,
      type: 'smtp_ibm',
      description: config.description,
      config: {
        params: {
          domain: config.domain,
          dkim: {
            public_key: config.dkimPublicKey,
            selector: config.dkimSelector,
          },
        },
      },
    };

    try {
      const response = await this.client.createDestination(params);
      return response.result;
    } catch (error) {
      console.error('Error creating email destination:', error);
      throw error;
    }
  }

  // Create Topic
  async createTopic(name, description) {
    const params = {
      instanceId: this.instanceId,
      name: name,
      description: description,
    };

    try {
      const response = await this.client.createTopic(params);
      return response.result;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  // Create Subscription
  async createSubscription(topicId, destinationId, attributes) {
    const params = {
      instanceId: this.instanceId,
      name: attributes.name,
      description: attributes.description,
      destinationId: destinationId,
      topicId: topicId,
      attributes: {
        to: attributes.recipients,
        add_notification_payload: attributes.includePayload || false,
        reply_to: attributes.replyTo,
        from: attributes.fromEmail,
        template_id_notification: attributes.templateId,
      },
    };

    try {
      const response = await this.client.createSubscription(params);
      return response.result;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  // Send Test Email
  async sendTestEmail(topicId, payload) {
    const params = {
      instanceId: this.instanceId,
      body: {
        specversion: '1.0',
        id: `test-${Date.now()}`,
        source: 'email-management-ui',
        type: 'test.email',
        time: new Date().toISOString(),
        data: payload,
      },
    };

    try {
      const response = await this.client.sendNotifications(params);
      return response.result;
    } catch (error) {
      console.error('Error sending test email:', error);
      throw error;
    }
  }

  // Get Metrics
  async getMetrics(destinationId, startDate, endDate) {
    // IBM Event Notifications provides metrics through the API
    // Implement based on your specific metrics requirements
    const params = {
      instanceId: this.instanceId,
      destinationId: destinationId,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      // Note: Adjust based on actual IBM EN metrics API
      const response = await this.client.getMetrics(params);
      return response.result;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }
}

module.exports = EventNotificationsService;
```

### 3. Frontend Integration Updates

Update the `js/app.js` file to connect with your backend API:

```javascript
// Add to js/app.js

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// API Client
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  getAuthToken() {
    // Implement your authentication logic
    return localStorage.getItem('auth_token') || '';
  }

  // Domain Management
  async addDomain(domain) {
    return this.request('/domains', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    });
  }

  async verifyDomain(domainId) {
    return this.request(`/domains/${domainId}/verify`, {
      method: 'GET',
    });
  }

  async listDomains() {
    return this.request('/domains', {
      method: 'GET',
    });
  }

  // SMTP Configuration
  async authorizeSMTP(domainId) {
    return this.request('/smtp/authorize', {
      method: 'POST',
      body: JSON.stringify({ domainId }),
    });
  }

  async getSMTPCredentials(domainId) {
    return this.request(`/smtp/credentials?domainId=${domainId}`, {
      method: 'GET',
    });
  }

  // Email Destinations
  async createEmailDestination(config) {
    return this.request('/destinations/email', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async listEmailDestinations() {
    return this.request('/destinations/email', {
      method: 'GET',
    });
  }

  // Topics & Subscriptions
  async createTopic(name, description) {
    return this.request('/topics', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  }

  async createSubscription(topicId, destinationId, attributes) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ topicId, destinationId, attributes }),
    });
  }

  // Metrics
  async getEmailMetrics(startDate, endDate) {
    return this.request(`/metrics/email?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    });
  }

  async getSMTPMetrics(startDate, endDate) {
    return this.request(`/metrics/smtp?start=${startDate}&end=${endDate}`, {
      method: 'GET',
    });
  }
}

// Initialize API client
const apiClient = new APIClient(API_BASE_URL);
```

### 4. Environment Configuration

Create a `.env` file for your backend:

```bash
# IBM Cloud Configuration
IBM_EVENT_NOTIFICATIONS_API_KEY=your_api_key_here
IBM_EVENT_NOTIFICATIONS_URL=https://us-south.event-notifications.cloud.ibm.com/event-notifications
IBM_EVENT_NOTIFICATIONS_INSTANCE_ID=your_instance_id_here

# IBM Cloud IAM
IBM_CLOUD_API_KEY=your_cloud_api_key_here

# Application Configuration
PORT=3000
NODE_ENV=production
API_BASE_URL=https://your-backend-api.com

# Database (for storing UI state, metrics cache, etc.)
DATABASE_URL=postgresql://user:password@localhost:5432/email_management

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# CORS Configuration
ALLOWED_ORIGINS=https://dilip-poojari.github.io,http://localhost:8000
```

### 5. Complete Backend Example (Express.js)

```javascript
// backend/server.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const EventNotificationsService = require('./services/eventNotifications');
const domainRoutes = require('./routes/domains');
const smtpRoutes = require('./routes/smtp');
const destinationRoutes = require('./routes/destinations');
const topicRoutes = require('./routes/topics');
const metricsRoutes = require('./routes/metrics');
const securityRoutes = require('./routes/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
}));
app.use(express.json());

// Initialize Event Notifications Service
const enService = new EventNotificationsService();
app.locals.enService = enService;

// Routes
app.use('/api/domains', domainRoutes);
app.use('/api/smtp', smtpRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/security', securityRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Email Management API running on port ${PORT}`);
});
```

### 6. Example Route Implementation

```javascript
// backend/routes/destinations.js

const express = require('express');
const router = express.Router();

// Create Email Destination
router.post('/email', async (req, res) => {
  try {
    const { name, description, domain, dkimPublicKey, dkimSelector } = req.body;
    
    const enService = req.app.locals.enService;
    const destination = await enService.createEmailDestination({
      name,
      description,
      domain,
      dkimPublicKey,
      dkimSelector,
    });

    res.status(201).json({
      success: true,
      data: destination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// List Email Destinations
router.get('/email', async (req, res) => {
  try {
    const enService = req.app.locals.enService;
    const destinations = await enService.client.listDestinations({
      instanceId: enService.instanceId,
    });

    res.json({
      success: true,
      data: destinations.result.destinations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

## Deployment Architecture

### Option 1: IBM Cloud Code Engine

```yaml
# deploy.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: email-management-api
spec:
  template:
    spec:
      containers:
      - image: us.icr.io/namespace/email-management-api:latest
        env:
        - name: IBM_EVENT_NOTIFICATIONS_API_KEY
          valueFrom:
            secretKeyRef:
              name: en-credentials
              key: api-key
        - name: IBM_EVENT_NOTIFICATIONS_INSTANCE_ID
          value: "your-instance-id"
        resources:
          limits:
            memory: 512Mi
            cpu: 1000m
```

### Option 2: IBM Cloud Functions

```javascript
// functions/email-destination.js

const EventNotificationsV1 = require('@ibm-cloud/event-notifications-node-admin-sdk/event-notifications/v1');
const { IamAuthenticator } = require('ibm-cloud-sdk-core');

async function main(params) {
  const client = EventNotificationsV1.newInstance({
    authenticator: new IamAuthenticator({
      apikey: params.IBM_EVENT_NOTIFICATIONS_API_KEY,
    }),
    serviceUrl: params.IBM_EVENT_NOTIFICATIONS_URL,
  });

  try {
    const response = await client.createDestination({
      instanceId: params.instanceId,
      name: params.name,
      type: 'smtp_ibm',
      config: params.config,
    });

    return {
      statusCode: 200,
      body: response.result,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { error: error.message },
    };
  }
}

exports.main = main;
```

## Security Considerations

### 1. Authentication & Authorization

```javascript
// middleware/auth.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', apiLimiter);
```

### 3. Input Validation

```javascript
const { body, validationResult } = require('express-validator');

router.post('/domains',
  body('domain').isURL().withMessage('Invalid domain format'),
  body('name').notEmpty().withMessage('Name is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

## Testing

### Unit Tests

```javascript
// tests/eventNotifications.test.js

const EventNotificationsService = require('../services/eventNotifications');

describe('EventNotificationsService', () => {
  let service;

  beforeEach(() => {
    service = new EventNotificationsService();
  });

  test('should create email destination', async () => {
    const config = {
      name: 'Test Destination',
      description: 'Test',
      domain: 'test.com',
      dkimPublicKey: 'test-key',
      dkimSelector: 'test-selector',
    };

    const result = await service.createEmailDestination(config);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe(config.name);
  });
});
```

## Monitoring & Logging

```javascript
// middleware/logging.js

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

function logRequest(req, res, next) {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
  next();
}

module.exports = { logger, logRequest };
```

## Next Steps

1. **Set up IBM Event Notifications instance** in IBM Cloud
2. **Create backend API** using the provided examples
3. **Update frontend** to use real API endpoints
4. **Configure authentication** and security
5. **Deploy backend** to IBM Cloud (Code Engine or Functions)
6. **Update frontend environment** variables
7. **Test end-to-end** email flow
8. **Monitor and optimize** performance

## Resources

- [IBM Event Notifications Documentation](https://cloud.ibm.com/docs/event-notifications)
- [IBM Event Notifications Node.js SDK](https://github.com/IBM/event-notifications-node-admin-sdk)
- [IBM Cloud API Documentation](https://cloud.ibm.com/apidocs/event-notifications)
- [IBM Cloud Code Engine](https://cloud.ibm.com/docs/codeengine)

## Support

For questions or issues with integration:
- IBM Cloud Support: https://cloud.ibm.com/unifiedsupport
- GitHub Issues: https://github.com/dilip-poojari/IBM-EMAIL/issues