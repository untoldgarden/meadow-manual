---
layout: default
title: Public API
toc: true
permalink: /public-api/
order: 32
---

# Meadow Public API

The Meadow API provides third-party developers with secure, RESTful access to experience data, real-time information, and webhooks for event notifications. All API access is scoped to individual experiences using API keys.

### Key Features

- **Experience-Scoped API Keys:** Each API key is tied to a specific experience
- **Role-Based Access Control:** Read and Write permissions
- **Real-time Data Streaming:** Server-Sent Events (SSE) for live updates
- **Webhooks:** Event-driven notifications for user presence and other triggers
- **Comprehensive CRUD Operations:** Full control over experience data

### Base URL

```
https://api.meadow.space/v1
```

All API endpoints are prefixed with `/v1`.

<br>

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Third-Party Client                      │
│                   (Your Application)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ API Key Authentication
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloud Functions (API Layer)                │
├─────────────────────────────────────────────────────────────┤
│  • API Key Validation                                       │
│  • Experience Authorization                                 │
│  • Permission Checking (Read/Write)                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Firebase Realtime Database                     │
├─────────────────────────────────────────────────────────────┤
│  • Experience Metadata                                      │
│  • Realtime Data                                            │
│  • User Presence                                            │
│  • API Keys & Webhooks                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Database Triggers
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Webhook System                          │
│              (Calls Your Endpoints)                         │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Client Request** → Includes API key in `x-api-key` header
2. **API Key Validation** → Verifies key exists and is active
3. **Experience Authorization** → Ensures API key is scoped to requested experience
4. **Permission Check** → Validates key has required permission (read/write)
5. **Database Operation** → Executes read/write operation
6. **Response** → Returns data or confirmation

### Security Layers

1. **API Key Authentication:** All requests require valid API key
2. **Experience Isolation:** Keys only access their assigned experience
3. **Permission-Based Access:** Operations restricted by key permissions
4. **Database Rules:** Firebase security rules provide additional validation
5. **HTTPS Only:** All traffic encrypted in transit

<br>

## Authentication

### API Key Management

API keys are experience-specific and must be created through the Meadow platform.

### Creating an API Key

**Via Web Interface:**
1. Navigate to your experience in the Meadow dashboard
2. Go to the "Networking" tab
3. Click "Add API Key"
4. Enter a descriptive name
5. Select permissions (Read and/or Write)
6. Copy and securely store the generated key

**Via Callable Function (Programmatic):**

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app, 'europe-west1');
const createApiKey = httpsCallable(functions, 'apikeys-createApiKey');

const result = await createApiKey({
  experienceId: 'your-experience-id',
  name: 'Production Server',
  permissions: ['read', 'write'] // Optional, defaults to ['read', 'write']
});

console.log('API Key:', result.data.apiKey);
// Store this securely - it won't be shown again!
```

### Using an API Key

Include the API key in the `x-api-key` header of all API requests:

```bash
curl -X GET "https://api.meadow.space/v1/experiences/abc123" \
  -H "x-api-key: exp_your-api-key-here"
```

### API Key Format

All API keys use a prefix to indicate their scope:
- `exp_xxxxx` - Experience-scoped keys (current)
- `org_xxxxx` - Organization-scoped keys (future)
- `exh_xxxxx` - Exhibition-scoped keys (future)

Example: `exp_abc123def456ghi789jk`

### API Key Properties

```javascript
{
  experienceId: "experience-id",
  name: "Production Server",
  createdAt: "2025-11-16T10:00:00.000Z",
  expiresAt: "2026-11-16T10:00:00.000Z",  // 1 year validity
  permissions: ["read", "write"],  // Granted permissions
  isActive: true
}
```

### Permission Types

| Permission | Description | Grants Access To |
|------------|-------------|------------------|
| **read** | Read-only access | Get experience metadata, read realtime data, view presence counts, stream data updates |
| **write** | Write access (includes read) | All read operations plus create/update/delete realtime data |

<b><font color="red">Please note:</font></b> Write permission automatically includes read access. You can create keys with read only (`["read"]`) or read + write (`["read", "write"]`).

<br>

## Data Path Structure

Realtime data is organized using a hierarchical path structure:

```
realtimeData/{experienceId}/{locationId}/{userId}/{key}
```

**Path Components:**
- **experienceId**: The unique identifier for your experience (e.g., `-Oe9QMA9qTdjy7UMSr_S`)
- **locationId**: Unique location ID or `'global'` for experience-wide data (e.g., `-NfK8pL2mQxY9wZ1VbN4`)
- **userId**: Unique user ID or `'all'` for shared data (e.g., `I9bRV70dVvcvpUVAjeTjFLqWU232`)
- **key**: The data field name

**Special Values:**
- `locationId: 'global'` - Data accessible across all physical locations (not location-specific)
- `userId: 'all'` - Data shared among all users (not user-specific)

**Common Use Cases:**

| Use Case | locationId | userId | Example |
|----------|------------|--------|---------|
| Global leaderboard | `'global'` | `'all'` | High scores visible everywhere |
| Location statistics | `-NfK8pL2mQxY9wZ1VbN4` | `'all'` | Visitor count at specific location |
| User progress (global) | `'global'` | `I9bRV70dVvcvpUVAjeTjFLqWU232` | User's overall progress |
| User progress (location) | `-NfK8pL2mQxY9wZ1VbN4` | `I9bRV70dVvcvpUVAjeTjFLqWU232` | User's progress in specific location |
| Location state | `-MpQ3rT5nUvW7xY8ZaB1` | `'all'` | Shared state for specific location |

**Example Paths:**
```
/realtimeData/-Oe9QMA9qTdjy7UMSr_S/global/all/totalScore
/realtimeData/-Oe9QMA9qTdjy7UMSr_S/-NfK8pL2mQxY9wZ1VbN4/all/visitorCount
/realtimeData/-Oe9QMA9qTdjy7UMSr_S/-NfK8pL2mQxY9wZ1VbN4/I9bRV70dVvcvpUVAjeTjFLqWU232/progress
/realtimeData/-Oe9QMA9qTdjy7UMSr_S/global/I9bRV70dVvcvpUVAjeTjFLqWU232/achievements
```

<br>

## REST API Endpoints

All REST API endpoints use the API key authentication method described above. The v1 API follows RESTful conventions with resource-based URLs and proper HTTP verb usage.

<br>

### Get Experience Metadata

Retrieve basic information about an experience.

**Endpoint:** `GET /v1/experiences/{experienceId}`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID

**Example Request:**

```bash
curl -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "metadata": {
    "titles": {
      "en": "My AR Experience"
    },
    "descriptions": {
      "en": "An interactive augmented reality experience"
    },
    "authorUid": "uid-123",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "category": "Art"
  }
}
```

**Error Responses:**
- `400`: Missing or invalid parameters
- `401`: Invalid or expired API key
- `403`: API key not authorized for this experience
- `404`: Experience not found
- `500`: Internal server error

<br>

### Get All Realtime Data

Retrieve all real-time data for a specific location and user scope.

**Endpoint:** `GET /v1/experiences/{experienceId}/data/{locationId}/{userId}`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID (e.g., `-Oe9QMA9qTdjy7UMSr_S`)
- **locationId** (required): Unique location ID (e.g., `-NfK8pL2mQxY9wZ1VbN4`) or `'global'` for experience-wide data
- **userId** (required): Unique user ID (e.g., `I9bRV70dVvcvpUVAjeTjFLqWU232`) or `'all'` for non-user-specific data

**Example Request:**

```bash
curl -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "global",
  "userId": "all",
  "key": null,
  "data": {
    "playerCount": 42,
    "level": 5,
    "status": "active"
  }
}
```

<br>

### Get Specific Realtime Data

Retrieve a specific real-time data value by key.

**Endpoint:** `GET /v1/experiences/{experienceId}/data/{locationId}/{userId}/{key}`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): Unique location ID or `'global'`
- **userId** (required): Unique user ID or `'all'`
- **key** (required): The data key to retrieve

**Example Request:**

```bash
curl -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all/playerCount" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "global",
  "userId": "all",
  "key": "playerCount",
  "data": 42
}
```

<br>

### Batch Update Realtime Data

Update multiple real-time data values atomically.

**Endpoint:** `POST /v1/experiences/{experienceId}/data/{locationId}/{userId}`

**Required Permission:** write

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): Unique location ID or `'global'`
- **userId** (required): Unique user ID or `'all'`

**Request Body:**
```json
{
  "playerCount": 43,
  "level": 6,
  "lastUpdated": "2025-11-16T12:00:00.000Z"
}
```

**Example Request:**

```bash
curl -X POST "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all" \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "playerCount": 43,
    "level": 6,
    "lastUpdated": "2025-11-16T12:00:00.000Z"
  }'
```

**Example Response:**

```json
{
  "message": "Data updated successfully",
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "global",
  "userId": "all",
  "keysUpdated": 3
}
```

**Supported Value Types:**
- `string`: Text values
- `number`: Integer or float
- `boolean`: true/false
- `object`: Nested data structures
- `array`: Lists of values

**Limits:**
- Maximum request size: 1MB
- Maximum keys per batch: 100

<br>

### Update Single Realtime Data Value

Update a specific real-time data value.

**Endpoint:** `PUT /v1/experiences/{experienceId}/data/{locationId}/{userId}/{key}`

**Required Permission:** write

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): Unique location ID or `'global'`
- **userId** (required): Unique user ID or `'all'`
- **key** (required): The data key to update

**Request Body:**
```json
{
  "value": 43
}
```

**Example Request:**

```bash
curl -X PUT "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all/playerCount" \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"value": 43}'
```

**Example Response:**

```json
{
  "message": "Data updated successfully",
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "global",
  "userId": "all",
  "key": "playerCount",
  "value": 43
}
```

<br>

### Delete Realtime Data

Remove a specific real-time data key.

**Endpoint:** `DELETE /v1/experiences/{experienceId}/data/{locationId}/{userId}/{key}`

**Required Permission:** write

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): Unique location ID or `'global'`
- **userId** (required): Unique user ID or `'all'`
- **key** (required): The data key to delete

**Example Request:**

```bash
curl -X DELETE "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all/temporaryData" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "message": "Data deleted successfully",
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "global",
  "userId": "all",
  "key": "temporaryData"
}
```

<br>

### Stream Realtime Data (SSE)

Open a Server-Sent Events connection for real-time updates.

**Endpoint:** `GET /v1/experiences/{experienceId}/data/{locationId}/{userId}/stream`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): Unique location ID or `'global'`
- **userId** (required): Unique user ID or `'all'`

**Example Request:**

```bash
curl -N -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all/stream" \
  -H "x-api-key: your-api-key"
```

**Event Stream Format:**

```
event: data
data: {"type":"initial","experienceId":"-Oe9QMA9qTdjy7UMSr_S","locationId":"global","userId":"all","data":{"playerCount":42},"timestamp":"2025-11-20T12:00:00.000Z"}

event: data
data: {"type":"update","experienceId":"-Oe9QMA9qTdjy7UMSr_S","locationId":"global","userId":"all","data":{"playerCount":43},"timestamp":"2025-11-20T12:00:05.000Z"}

event: heartbeat
data: {"timestamp":"2025-11-20T12:00:30.000Z"}
```

**Client Implementation (JavaScript):**

```javascript
const eventSource = new EventSource(
  'https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/data/global/all/stream',
  {
    headers: {
      'x-api-key': 'your-api-key'
    }
  }
);

eventSource.addEventListener('data', (event) => {
  const update = JSON.parse(event.data);
  console.log('Data update:', update);
  console.log('Location:', update.locationId, 'User:', update.userId);
});

eventSource.addEventListener('heartbeat', (event) => {
  console.log('Heartbeat:', event.data);
});

eventSource.onerror = (error) => {
  console.error('SSE Error:', error);
  eventSource.close();
};
```

**Notes:**
- Heartbeat sent every 30 seconds
- Connection auto-closes on client disconnect
- Initial snapshot sent immediately upon connection
- Each stream is scoped to a specific `locationId` and `userId` combination

<br>

### Get User Presence Count (Total)

Retrieve the current number of users experiencing the content across all locations.

**Endpoint:** `GET /v1/experiences/{experienceId}/presence`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID

**Example Request:**

```bash
curl -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/presence" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": null,
  "count": 15,
  "details": {
    "location-1": 8,
    "location-2": 7
  }
}
```

<br>

### Get User Presence Count (Specific Location)

Retrieve the number of users at a specific location.

**Endpoint:** `GET /v1/experiences/{experienceId}/presence/{locationId}`

**Required Permission:** read

**Path Parameters:**
- **experienceId** (required): The experience ID
- **locationId** (required): The specific location ID

**Example Request:**

```bash
curl -X GET "https://api.meadow.space/v1/experiences/-Oe9QMA9qTdjy7UMSr_S/presence/location-1" \
  -H "x-api-key: your-api-key"
```

**Example Response:**

```json
{
  "experienceId": "-Oe9QMA9qTdjy7UMSr_S",
  "locationId": "location-1",
  "count": 8,
  "details": null
}
```

<br>

## Callable Functions

Callable functions require Firebase Authentication and are intended for use within authenticated client applications.

<br>

### Create API Key

Create a new API key for an experience.

**Function:** `apikeys-createApiKey`

**Required Permission:** Owner of the experience

**Parameters:**
- **experienceId**: `string` - The experience ID

**Example:**

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions(app, 'europe-west1');
const createApiKey = httpsCallable(functions, 'apikeys-createApiKey');

try {
  const result = await createApiKey({
    experienceId: 'exp-123'
  });

  console.log('API Key created:', result.data.apiKey);
  console.log('Expires:', result.data.apiKeyData.expiresAt);
} catch (error) {
  console.error('Error:', error.message);
}
```

**Response:**

```javascript
{
  apiKey: "abc123def456...",
  apiKeyData: {
    userId: "uid-123",
    experienceId: "exp-123",
    createdAt: "2025-11-14T12:00:00.000Z",
    expiresAt: "2026-11-14T12:00:00.000Z",
    permissions: ["read", "write"],
    isActive: true
  }
}
```

<br>

### Set Experience Webhook

Configure a webhook for an experience.

**Function:** `webhooks-setExperienceWebhook`

**Required Permission:** Owner of the experience

**Parameters:**
- **experienceId**: `string` - The experience ID
- **webhookType**: `string` - The webhook type (e.g., `"userPresenceUpdated"`)
- **config**: `object` - Webhook configuration containing:
  - **url**: `string` - Your webhook endpoint URL
  - **enabled**: `bool` - Whether the webhook is active
  - **method**: `string` - HTTP method (typically `"POST"`)
  - **authKey**: `string` - Optional bearer token for authentication

**Supported Webhook Types:**
- `userPresenceUpdated`: Triggered when user presence count changes

**Example:**

```javascript
const setWebhook = httpsCallable(functions, 'webhooks-setExperienceWebhook');

const result = await setWebhook({
  experienceId: 'exp-123',
  webhookType: 'userPresenceUpdated',
  config: {
    url: 'https://your-server.com/webhook/presence',
    enabled: true,
    method: 'POST',
    authKey: 'your-secret-token'
  }
});

console.log(result.data.message); // "Webhook configured successfully"
```

<br>

### Get Experience Webhook

Retrieve webhook configuration.

**Function:** `webhooks-getExperienceWebhook`

**Required Permission:** read

**Parameters:**
- **experienceId**: `string` - The experience ID
- **webhookType**: `string` - The webhook type

**Example:**

```javascript
const getWebhook = httpsCallable(functions, 'webhooks-getExperienceWebhook');

const result = await getWebhook({
  experienceId: 'exp-123',
  webhookType: 'userPresenceUpdated'
});

if (result.data.exists) {
  console.log('Webhook URL:', result.data.config.url);
  console.log('Enabled:', result.data.config.enabled);
}
```

<br>

### Delete Experience Webhook

Remove a webhook configuration.

**Function:** `webhooks-deleteExperienceWebhook`

**Required Permission:** Owner of the experience

**Parameters:**
- **experienceId**: `string` - The experience ID
- **webhookType**: `string` - The webhook type

**Example:**

```javascript
const deleteWebhook = httpsCallable(functions, 'webhooks-deleteExperienceWebhook');

const result = await deleteWebhook({
  experienceId: 'exp-123',
  webhookType: 'userPresenceUpdated'
});

console.log(result.data.message); // "Webhook deleted successfully"
```

<br>

### Test Experience Webhook

Send a test payload to your webhook endpoint.

**Function:** `webhooks-testExperienceWebhook`

**Required Permission:** Owner of the experience

**Parameters:**
- **experienceId**: `string` - The experience ID
- **webhookType**: `string` - The webhook type

**Example:**

```javascript
const testWebhook = httpsCallable(functions, 'webhooks-testExperienceWebhook');

const result = await testWebhook({
  experienceId: 'exp-123',
  webhookType: 'userPresenceUpdated'
});

console.log('Status:', result.data.status);
console.log('Response:', result.data.responseBody);
```

**Test Payload Sent:**

```json
{
  "test": true,
  "experienceId": "exp-123",
  "webhookType": "userPresenceUpdated",
  "count": 42,
  "locationCounts": { "test-location": 42 },
  "timestamp": "2025-11-14T12:00:00.000Z",
  "message": "This is a test webhook call from Meadow"
}
```

<br>

## Webhooks

Webhooks allow you to receive real-time notifications when events occur in your experience.

### User Presence Updated Webhook

Triggered whenever the user presence count changes for an experience.

**Webhook Type:** `userPresenceUpdated`

**Trigger:** Changes to `/userPresenceCount/{experienceId}`

**Payload Format:**

```json
{
  "experienceId": "exp-123",
  "count": 15,
  "locationCounts": {
    "location-1": 8,
    "location-2": 7
  },
  "timestamp": "2025-11-14T12:00:00.000Z"
}
```

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {authKey}` (if configured)

**Your Endpoint Requirements:**
- Must accept POST requests (or configured method)
- Should respond with 2xx status code for success
- Timeout: 10 seconds recommended
- Must be HTTPS in production

**Example Endpoint (Node.js/Express):**

```javascript
app.post('/webhook/presence', (req, res) => {
  const { experienceId, count, locationCounts, timestamp } = req.body;

  // Verify auth key if configured
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
    return res.status(401).send('Unauthorized');
  }

  console.log(`Experience ${experienceId} has ${count} users`);
  console.log('Location breakdown:', locationCounts);

  // Process the data...

  res.status(200).send('OK');
});
```

**Example Endpoint (Python/Flask):**

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook/presence', methods=['POST'])
def presence_webhook():
    # Verify auth key
    auth_header = request.headers.get('Authorization')
    if auth_header != f'Bearer {WEBHOOK_SECRET}':
        return 'Unauthorized', 401

    data = request.json
    experience_id = data['experienceId']
    count = data['count']
    location_counts = data['locationCounts']

    print(f'Experience {experience_id} has {count} users')
    print(f'Location breakdown: {location_counts}')

    # Process the data...

    return 'OK', 200
```

<br>

## Code Examples

### Complete Integration Example (Node.js)

```javascript
import fetch from 'node-fetch';

class MeadowAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.meadow.space/v1';
  }

  async getMetadata(experienceId) {
    const response = await fetch(
      `${this.baseUrl}/experiences/${experienceId}`,
      {
        headers: { 'x-api-key': this.apiKey }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async setData(experienceId, locationId, userId, key, value) {
    const response = await fetch(
      `${this.baseUrl}/experiences/${experienceId}/data/${locationId}/${userId}/${key}`,
      {
        method: 'PUT',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async batchSetData(experienceId, locationId, userId, data) {
    const response = await fetch(
      `${this.baseUrl}/experiences/${experienceId}/data/${locationId}/${userId}`,
      {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async getData(experienceId, locationId, userId, key = null) {
    const url = key
      ? `${this.baseUrl}/experiences/${experienceId}/data/${locationId}/${userId}/${key}`
      : `${this.baseUrl}/experiences/${experienceId}/data/${locationId}/${userId}`;

    const response = await fetch(url, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async deleteData(experienceId, locationId, userId, key) {
    const response = await fetch(
      `${this.baseUrl}/experiences/${experienceId}/data/${locationId}/${userId}/${key}`,
      {
        method: 'DELETE',
        headers: { 'x-api-key': this.apiKey }
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }

  async getPresenceCount(experienceId, locationId = null) {
    const url = locationId
      ? `${this.baseUrl}/experiences/${experienceId}/presence/${locationId}`
      : `${this.baseUrl}/experiences/${experienceId}/presence`;

    const response = await fetch(url, {
      headers: { 'x-api-key': this.apiKey }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }
}

// Usage
const api = new MeadowAPI('your-api-key');

// Get experience metadata
const metadata = await api.getMetadata('-Oe9QMA9qTdjy7UMSr_S');
console.log('Title:', metadata.metadata.titles.en);

// Set single data value (global, all users)
await api.setData('-Oe9QMA9qTdjy7UMSr_S', 'global', 'all', 'score', 100);

// Set location-specific data (all users at a location)
const locationId = '-NfK8pL2mQxY9wZ1VbN4';
await api.setData('-Oe9QMA9qTdjy7UMSr_S', locationId, 'all', 'visitorCount', 42);

// Set user-specific data at a location
const userId = 'I9bRV70dVvcvpUVAjeTjFLqWU232';
await api.setData('-Oe9QMA9qTdjy7UMSr_S', locationId, userId, 'progress', 75);

// Batch set data (global, all users)
await api.batchSetData('-Oe9QMA9qTdjy7UMSr_S', 'global', 'all', {
  score: 100,
  level: 5,
  lastUpdated: new Date().toISOString()
});

// Get specific data value
const scoreData = await api.getData('-Oe9QMA9qTdjy7UMSr_S', 'global', 'all', 'score');
console.log('Score:', scoreData.data);

// Get all data for location/user combination
const allData = await api.getData('-Oe9QMA9qTdjy7UMSr_S', 'global', 'all');
console.log('All data:', allData.data);

// Delete data
await api.deleteData('-Oe9QMA9qTdjy7UMSr_S', 'global', 'all', 'temporaryKey');

// Get presence count
const presence = await api.getPresenceCount('-Oe9QMA9qTdjy7UMSr_S');
console.log('Active users:', presence.count);
```

<br>

### Streaming Data Example (Browser)

```javascript
class MeadowStream {
  constructor(apiKey, experienceId, locationId, userId) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.meadow.space/v1';
    this.experienceId = experienceId;
    this.locationId = locationId;
    this.userId = userId;
    this.eventSource = null;
  }

  connect(onData, onError) {
    const url = `${this.baseUrl}/experiences/${this.experienceId}/data/${this.locationId}/${this.userId}/stream`;

    this.eventSource = new EventSource(url, {
      headers: { 'x-api-key': this.apiKey }
    });

    this.eventSource.addEventListener('data', (event) => {
      const update = JSON.parse(event.data);
      onData(update);
    });

    this.eventSource.addEventListener('heartbeat', (event) => {
      console.log('Heartbeat received');
    });

    this.eventSource.onerror = (error) => {
      console.error('Stream error:', error);
      onError(error);
      this.disconnect();
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Usage - Global data stream (all locations, all users)
const globalStream = new MeadowStream('your-api-key', '-Oe9QMA9qTdjy7UMSr_S', 'global', 'all');

globalStream.connect(
  (update) => {
    console.log('Data update:', update);
    console.log('Location:', update.locationId, 'User:', update.userId);
    if (update.type === 'initial') {
      console.log('Initial data loaded:', update.data);
    } else if (update.type === 'update') {
      console.log('Data changed:', update.data);
    }
  },
  (error) => {
    console.error('Stream error:', error);
  }
);

// Usage - Location-specific stream (all users at location)
const locationId = '-NfK8pL2mQxY9wZ1VbN4';
const locationStream = new MeadowStream('your-api-key', '-Oe9QMA9qTdjy7UMSr_S', locationId, 'all');
locationStream.connect(
  (update) => console.log('Location data:', update.data),
  (error) => console.error('Error:', error)
);

// Later, to disconnect:
// globalStream.disconnect();
// locationStream.disconnect();
```

<br>

## Best Practices

### Security

1. **Never expose API keys in client-side code** - Use a backend proxy
2. **Store API keys securely** - Use environment variables, not hardcoded
3. **Rotate keys periodically** - Especially if compromised
4. **Use HTTPS only** - Never send keys over unencrypted connections
5. **Implement webhook authentication** - Always use authKey for webhooks

### Performance

1. **Use streaming for real-time updates** - More efficient than polling
2. **Batch updates when possible** - Use batch update endpoint
3. **Cache metadata** - Experience metadata changes infrequently
4. **Implement exponential backoff** - For retrying failed requests
5. **Close SSE connections** - When no longer needed

### Error Handling

1. **Check status codes** - Handle 4xx and 5xx errors appropriately
2. **Log errors** - For debugging and monitoring
3. **Implement retries** - For transient failures (5xx errors)
4. **Validate responses** - Don't assume successful responses have expected format
5. **Handle webhook failures gracefully** - Return 2xx even if processing fails

### Webhook Development

1. **Respond quickly** - Process asynchronously if needed
2. **Return 2xx status codes** - For successful receipt
3. **Implement idempotency** - Handle duplicate events
4. **Validate payloads** - Check signature/auth key
5. **Test thoroughly** - Use the test function before going live

<br>

## Error Handling

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | Continue normally |
| `400` | Bad Request | Check request parameters |
| `401` | Unauthorized | Verify API key is valid and not expired |
| `403` | Forbidden | Check API key matches experience, verify user permissions |
| `404` | Not Found | Experience or resource doesn't exist |
| `500` | Internal Server Error | Retry with exponential backoff |

### Common Errors

**API Key Invalid**

```json
{
  "error": "Invalid or expired API key"
}
```

Solution: Verify API key, check expiration date, regenerate if needed.

**Experience Mismatch**

```json
{
  "error": "API key is not authorized for this experience"
}
```

Solution: Ensure the experienceId in your request matches the experienceId the API key was created for.

**Permission Denied**

```json
{
  "error": "User does not have permission to write data"
}
```

Solution: Verify the user who created the API key has Editor or Owner permission for write operations.

### Error Handling Pattern

```javascript
async function makeAPIRequest(url, options) {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return await response.json();
      }

      // Client errors (4xx) - don't retry
      if (response.status >= 400 && response.status < 500) {
        const error = await response.json();
        throw new Error(`Client error: ${error.error}`);
      }

      // Server errors (5xx) - retry with backoff
      if (response.status >= 500) {
        retries++;
        const delay = Math.pow(2, retries) * 1000;
        console.warn(`Server error, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error;
      }
      retries++;
    }
  }

  throw new Error('Max retries exceeded');
}
```

<br>

## Rate Limits

**Request Size Limits:**
- **Maximum request body size:** 1MB per request
- **Maximum keys per batch update:** 100 keys
- **Maximum single value size:** 1MB

**Recommended Client-Side Limits:**
- **API Calls:** 100 requests per minute per API key
- **Streaming:** 5 concurrent SSE connections per API key
- **Webhooks:** No limit on incoming webhooks

**Error Responses:**
- `413 Payload Too Large`: Request exceeds 1MB size limit
- `400 Bad Request`: Batch update exceeds 100 keys

<b><font color="red">Please note:</font></b> Implement your own rate limiting to avoid overwhelming the system.
