const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to write incident
function writeIncident(id, data) {
  const dir = path.join(DATA_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(data.meta, null, 2));
  fs.writeFileSync(path.join(dir, 'timeline.json'), JSON.stringify(data.timeline, null, 2));
  fs.writeFileSync(path.join(dir, 'metrics.json'), JSON.stringify(data.metrics, null, 2));
  fs.writeFileSync(path.join(dir, 'logs.txt'), data.logs);
  
  console.log(`Generated incident: ${id}`);
}

// 1. Database CPU Spike (Traffic Amplification)
const incident1 = {
  meta: {
    id: 'inc-001',
    title: 'Database CPU Spike & Query Timeouts',
    severity: 'critical',
    service: 'payment-service',
    status: 'resolved',
    primary_metric: 'cpu_usage',
    timestamp: '2023-10-27T10:00:00Z'
  },
  timeline: [
    { timestamp: '10:00:00', event: 'Marketing push notification sent (Campaign: Fall Sale)', type: 'trigger' },
    { timestamp: '10:02:00', event: 'Traffic spikes to 3x normal load', type: 'info' },
    { timestamp: '10:05:00', event: 'Alert: Database CPU > 90%', type: 'alert' },
    { timestamp: '10:06:30', event: 'Payment API latency p99 > 3s', type: 'alert' },
    { timestamp: '10:08:00', event: 'On-call engineer ack', type: 'human' },
    { timestamp: '10:12:00', event: 'Enabled read-replica routing', type: 'mitigation' },
    { timestamp: '10:15:00', event: 'CPU normalized', type: 'resolution' }
  ],
  metrics: {
    cpu: [45, 48, 50, 85, 92, 98, 99, 95, 80, 60, 50],
    latency: [200, 210, 300, 1500, 3200, 4500, 5000, 2800, 1200, 300, 220],
    requests_per_sec: [100, 120, 350, 400, 420, 410, 380, 350, 300, 250, 200]
  },
  logs: `
[INFO] 10:00:01 Sending batch push notifications (id: campaign_fall_sale)
[INFO] 10:01:45 Incoming request rate increasing check_payments
[WARN] 10:04:12 Database connection pool utilization at 85%
[ERROR] 10:05:22 Query execution timeout (UserTable) - duration: 5002ms
[ERROR] 10:05:23 Query execution timeout (UserTable) - duration: 5100ms
[ERROR] 10:05:25 Connection reset by peer (DB_PRIMARY)
[ERROR] 10:05:45 PaymentTransaction failed: DB_TIMEOUT
[WARN] 10:06:00 High latency detected in POST /checkout
[ERROR] 10:07:11 Query execution timeout (UserTable) - duration: 5500ms
[INFO] 10:08:30 User 'admin' logged in
[INFO] 10:12:15 Switching read-heavy traffic to replica-02
[INFO] 10:14:00 Connection pool utilization dropping to 60%
  `.trim()
};

// 2. Memory Leak (Slow Burn OOM)
const incident2 = {
  meta: {
    id: 'inc-002',
    title: 'Image Processor OOM Crash Loop',
    severity: 'high',
    service: 'media-processor',
    status: 'resolved',
    primary_metric: 'memory_usage',
    timestamp: '2023-11-15T14:00:00Z'
  },
  timeline: [
    { timestamp: '14:00:00', event: 'New version v2.4.0 deployed', type: 'trigger' },
    { timestamp: '16:30:00', event: 'Memory usage trend line deviation detected', type: 'info' },
    { timestamp: '18:15:00', event: 'Pod restart count > 5 (Loop)', type: 'alert' },
    { timestamp: '18:20:00', event: 'Rolled back to v2.3.9', type: 'mitigation' },
    { timestamp: '18:25:00', event: 'Service stable', type: 'resolution' }
  ],
  metrics: {
    memory_mb: [512, 520, 600, 800, 1200, 1800, 2048, 512, 600, 850, 1500, 2048, 512],
    restarts: [0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 3, 4]
  },
  logs: `
[INFO] 14:00:05 Deploying image-processor:v2.4.0
[INFO] 14:00:15 Service started successfully
[INFO] 14:30:00 Processed 500 images
[WARN] 16:45:00 Heap usage approaching limit (85%)
[WARN] 17:30:00 Garbage collection taking > 500ms
[ERROR] 18:00:00 FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
[INFO] 18:00:05 Service restarting...
[INFO] 18:00:10 Service started successfully
[ERROR] 18:14:00 FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
[INFO] 18:14:05 Service restarting...
[INFO] 18:20:10 Rollback initiated to v2.3.9
  `.trim()
};

// 3. Bad Deployment (Syntax/Startup Error)
const incident3 = {
  meta: {
    id: 'inc-003',
    title: 'Auth Service 500s after Canary Deploy',
    severity: 'critical',
    service: 'auth-service',
    status: 'resolved',
    primary_metric: 'error_rate',
    timestamp: '2023-12-05T09:00:00Z'
  },
  timeline: [
    { timestamp: '09:00:00', event: 'Canary deploy started (10% traffic)', type: 'trigger' },
    { timestamp: '09:00:15', event: 'Error rate spikes to 100% on canary nodes', type: 'alert' },
    { timestamp: '09:00:45', event: 'Automated circuit breaker tripped', type: 'info' },
    { timestamp: '09:01:30', event: 'Canary aborted / Rolled back', type: 'mitigation' }
  ],
  metrics: {
    error_rate_percent: [0.1, 0.1, 0.2, 12.0, 15.0, 4.0, 0.1],
    latency: [45, 45, 40, 42, 45, 43, 44]
  },
  logs: `
[INFO] 09:00:01 Starting pod auth-canary-78d
[INFO] 09:00:05 Listening on port 8080
[ERROR] 09:00:06 ReferenceError: jwt_secret is not defined at /app/src/auth.js:45:12
[ERROR] 09:00:06 Process exited with code 1
[INFO] 09:00:08 Restarting pod...
[ERROR] 09:00:12 ReferenceError: jwt_secret is not defined at /app/src/auth.js:45:12
[ERROR] 09:00:15 Health check failed: 503 Service Unavailable
[WARN] 09:00:20 Load balancer removing unhealthy backend
  `.trim()
};

// 4. Cache Stampede (Redis Failure)
const incident4 = {
  meta: {
    id: 'inc-004',
    title: 'Product Catalog Latency (Cache Miss Storm)',
    severity: 'high',
    service: 'catalog-service',
    status: 'resolved',
    primary_metric: 'latency',
    timestamp: '2024-01-10T15:00:00Z'
  },
  timeline: [
    { timestamp: '15:00:00', event: 'Redis cluster restart (Maintenance)', type: 'trigger' },
    { timestamp: '15:01:00', event: 'Cache hit rate drops to 0%', type: 'info' },
    { timestamp: '15:01:30', event: 'Database connection count maxed out', type: 'alert' },
    { timestamp: '15:05:00', event: 'Rate limiting applied to non-critical paths', type: 'mitigation' },
    { timestamp: '15:10:00', event: 'Cache warmed up', type: 'resolution' }
  ],
  metrics: {
    cache_hit_rate: [95, 94, 0, 5, 15, 40, 80, 92],
    db_connections: [50, 55, 450, 500, 500, 300, 100, 60],
    latency: [120, 115, 800, 1200, 900, 400, 150, 125]
  },
  logs: `
[INFO] 15:00:01 Redis connection lost. Reconnecting...
[WARN] 15:00:05 Cache unavailable. Falling back to DB.
[WARN] 15:00:06 Cache unavailable. Falling back to DB.
[WARN] 15:00:08 High DB contention detected on table 'Products'
[ERROR] 15:01:45 Postgres error: remaining connection slots are reserved for non-replication superuser
[ERROR] 15:02:00 GetProductById failed: DB_Connection_Refused
[INFO] 15:03:00 Redis connection restored.
[INFO] 15:04:00 Populating cache...
  `.trim()
};

// 5. Dependency Failure (Timeout Cascades)
const incident5 = {
  meta: {
    id: 'inc-005',
    title: 'Checkout Failure (Payment Gateway Timeout)',
    severity: 'critical',
    service: 'checkout-service',
    status: 'resolved',
    primary_metric: 'error_rate',
    timestamp: '2024-02-20T20:00:00Z'
  },
  timeline: [
    { timestamp: '20:00:00', event: 'External Payment Vendor outage reported', type: 'trigger' },
    { timestamp: '20:02:00', event: 'Checkout requests hanging (30s)', type: 'info' },
    { timestamp: '20:05:00', event: 'Thread pool exhaustion', type: 'alert' },
    { timestamp: '20:08:00', event: 'Circuit breaker opened for PaymentVendor', type: 'mitigation' },
    { timestamp: '20:30:00', event: 'Vendor resolved status', type: 'resolution' }
  ],
  metrics: {
    external_latency: [200, 210, 15000, 30000, 30000, 0, 0, 250],
    active_threads: [50, 60, 400, 1000, 1000, 200, 60, 50],
    error_rate: [0, 0, 20, 80, 100, 15, 0, 0]
  },
  logs: `
[INFO] 20:00:15 Requesting transaction via StripeGateway
[WARN] 20:00:45 Invoice 88231 timeout waiting for StripeGateway
[WARN] 20:01:15 Invoice 88232 timeout waiting for StripeGateway
[ERROR] 20:05:00 Failed to spawn new thread: Resource temporarily unavailable
[ERROR] 20:05:05 CheckoutController crashed
[INFO] 20:08:00 CircuitBreaker: Opening circuit for StripeGateway
[INFO] 20:08:01 Rejecting transactions immediately (Fail Fast)
[INFO] 20:30:05 CircuitBreaker: Half-open probing...
[INFO] 20:30:10 Successful transaction. Closing circuit.
  `.trim()
};

writeIncident('inc-001', incident1);
writeIncident('inc-002', incident2);
writeIncident('inc-003', incident3);
writeIncident('inc-004', incident4);
writeIncident('inc-005', incident5);
