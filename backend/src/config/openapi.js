// Hand-maintained OpenAPI 3.1 spec for the Bhavya Express API.
// Served at /api/docs (Swagger UI) and /api/docs.json (raw spec).
module.exports = {
  openapi: '3.1.0',
  info: {
    title: 'Bhavya Express API',
    version: '1.0.0',
    description:
      'Delivery/logistics API. Authentication uses an httpOnly JWT cookie set by ' +
      'register/login/Google OAuth. Rate limits apply: auth 10 req / 15 min, ' +
      'tracking 60 req / 15 min, global 500 req / 15 min.'
  },
  servers: [
    { url: '/', description: 'Same-origin as the deployed API' },
    { url: 'http://localhost:5000', description: 'Local development' }
  ],
  tags: [
    { name: 'health' },
    { name: 'auth' },
    { name: 'orders' },
    { name: 'payments' },
    { name: 'admin' },
    { name: 'pincodes' },
    { name: 'pricing-tiers' }
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token',
        description: 'httpOnly JWT cookie set on login/register/Google OAuth.'
      }
    },
    schemas: {
      Address: {
        type: 'object',
        required: ['name', 'phone', 'address', 'pincode', 'city', 'state'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          phone: { type: 'string', pattern: '^[6-9][0-9]{9}$', description: '10-digit Indian mobile number' },
          address: { type: 'string', minLength: 5, maxLength: 300 },
          pincode: { type: 'string', pattern: '^[1-9][0-9]{5}$', description: '6-digit Indian pincode' },
          city: { type: 'string' },
          state: { type: 'string' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          trackingId: { type: 'string', example: 'BHV12345678' },
          user: { type: 'string', description: 'User ObjectId (populated with {name,email} on admin list)' },
          sender: { $ref: '#/components/schemas/Address' },
          receiver: { $ref: '#/components/schemas/Address' },
          weight: { type: 'number', example: 2.5 },
          zone: { type: 'string', enum: ['local', 'regional', 'national'] },
          price: { type: 'number' },
          status: { type: 'string', enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'] },
          paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          razorpayOrderId: { type: 'string' },
          razorpayPaymentId: { type: 'string' },
          statusHistory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                location: { type: 'string' }
              }
            }
          },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      TrackResult: {
        type: 'object',
        description: 'Public tracking payload — deliberately excludes names, addresses, and phone numbers.',
        properties: {
          trackingId: { type: 'string' },
          status: { type: 'string' },
          statusHistory: { type: 'array', items: { type: 'object' } },
          createdAt: { type: 'string', format: 'date-time' },
          sender: { type: 'object', properties: { city: { type: 'string' }, state: { type: 'string' } } },
          receiver: { type: 'object', properties: { city: { type: 'string' }, state: { type: 'string' } } }
        }
      },
      Quote: {
        type: 'object',
        properties: {
          zone: { type: 'string', enum: ['local', 'regional', 'national'] },
          price: { type: 'number', example: 175 }
        }
      },
      PaymentOrder: {
        type: 'object',
        properties: {
          mock: { type: 'boolean', description: 'true only in development when Razorpay is not configured' },
          orderId: { type: 'string', description: 'Razorpay order id when mock is false' },
          amount: { type: 'number' },
          currency: { type: 'string', example: 'INR' },
          keyId: { type: 'string', description: 'Razorpay key id (present when mock is false)' }
        }
      },
      AdminStats: {
        type: 'object',
        properties: {
          totalOrders: { type: 'number' },
          revenue: { type: 'number' },
          activeDeliveries: { type: 'number' },
          revenueTrend: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', format: 'date' },
                name: { type: 'string', example: 'Mon' },
                revenue: { type: 'number' }
              }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'array', items: { type: 'string' }, description: 'Present on 400 validation errors' }
        }
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['health'],
        summary: 'Health check (used by Render and uptime monitors)',
        responses: {
          200: { description: 'Service healthy, DB connected' },
          503: { description: 'Service up but DB disconnected' }
        }
      }
    },
    '/api/auth/register': {
      post: {
        tags: ['auth'],
        summary: 'Register a user and set the session cookie',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'phone', 'password'],
                properties: {
                  name: { type: 'string', minLength: 2, maxLength: 100 },
                  email: { type: 'string', format: 'email' },
                  phone: { type: 'string', pattern: '^[6-9][0-9]{9}$' },
                  password: { type: 'string', minLength: 8, maxLength: 128 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          400: { $ref: '#/components/responses/ValidationOrConflict' },
          429: { description: 'Too many attempts' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['auth'],
        summary: 'Log in with email/password and set the session cookie',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Logged in' },
          401: { description: 'Invalid email or password' },
          429: { description: 'Too many attempts' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['auth'],
        summary: 'Clear the session cookie',
        responses: { 200: { description: 'Logged out' } }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['auth'],
        summary: 'Get the current authenticated user',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Current user' },
          401: { description: 'Not authenticated' }
        }
      }
    },
    '/api/auth/google/user': {
      get: {
        tags: ['auth'],
        summary: 'Start Google OAuth for regular users (redirects to Google)',
        security: [],
        responses: { 302: { description: 'Redirect to Google' } }
      }
    },
    '/api/auth/google/user/callback': {
      get: {
        tags: ['auth'],
        summary: 'Google OAuth callback for users — sets cookie, redirects to /dashboard',
        security: [],
        responses: { 302: { description: 'Redirect to frontend dashboard' } }
      }
    },
    '/api/auth/google/admin': {
      get: {
        tags: ['auth'],
        summary: 'Start Google OAuth for admins (redirects to Google)',
        security: [],
        responses: { 302: { description: 'Redirect to Google' } }
      }
    },
    '/api/auth/google/admin/callback': {
      get: {
        tags: ['auth'],
        summary: 'Google OAuth callback for admins — sets cookie, redirects to /admin',
        security: [],
        responses: { 302: { description: 'Redirect to frontend admin dashboard' } }
      }
    },
    '/api/orders/quote': {
      post: {
        tags: ['orders'],
        summary: 'Get a price quote (public, no login needed)',
        description: 'Zone is always derived server-side from the pincode database; client-supplied zone/price are ignored.',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['senderPincode', 'receiverPincode', 'weight'],
                properties: {
                  senderPincode: { type: 'string', pattern: '^[1-9][0-9]{5}$' },
                  receiverPincode: { type: 'string', pattern: '^[1-9][0-9]{5}$' },
                  weight: { type: 'number', exclusiveMinimum: 0, maximum: 1000 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Quote', content: { 'application/json': { schema: { $ref: '#/components/schemas/Quote' } } } },
          400: { $ref: '#/components/responses/Validation' }
        }
      }
    },
    '/api/orders': {
      post: {
        tags: ['orders'],
        summary: 'Create a shipment order (price computed server-side)',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['sender', 'receiver', 'weight'],
                properties: {
                  sender: { $ref: '#/components/schemas/Address' },
                  receiver: { $ref: '#/components/schemas/Address' },
                  weight: { type: 'number', exclusiveMinimum: 0, maximum: 1000 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created order', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          400: { $ref: '#/components/responses/Validation' },
          401: { description: 'Not authenticated' }
        }
      },
      get: {
        tags: ['orders'],
        summary: 'List the current user\'s orders (newest first)',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
          401: { description: 'Not authenticated' }
        }
      }
    },
    '/api/orders/track/{trackingId}': {
      get: {
        tags: ['orders'],
        summary: 'Public shipment tracking (no PII: names, addresses, phones are never returned)',
        security: [],
        parameters: [
          { name: 'trackingId', in: 'path', required: true, schema: { type: 'string', example: 'BHV12345678' } }
        ],
        responses: {
          200: { description: 'Tracking data', content: { 'application/json': { schema: { $ref: '#/components/schemas/TrackResult' } } } },
          404: { description: 'Order not found' },
          429: { description: 'Too many tracking requests' }
        }
      }
    },
    '/api/payments/create': {
      post: {
        tags: ['payments'],
        summary: 'Create a Razorpay order for a shipment (mock in dev when Razorpay is unconfigured)',
        security: [{ cookieAuth: [] }],
        description: 'Ownership is enforced: the order must belong to the authenticated user.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId'],
                properties: { orderId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' } }
              }
            }
          }
        },
        responses: {
          200: { description: 'Payment order', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaymentOrder' } } } },
          400: { description: 'Order already paid / invalid' },
          401: { description: 'Not authenticated' },
          404: { description: 'Order not found (or not yours)' },
          503: { description: 'Payments not configured in production' }
        }
      }
    },
    '/api/payments/verify': {
      post: {
        tags: ['payments'],
        summary: 'Verify a Razorpay payment and mark the order paid',
        security: [{ cookieAuth: [] }],
        description: 'Signature is verified server-side with the Razorpay secret. Mock verification is only honored outside production.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['orderId'],
                properties: {
                  orderId: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
                  razorpay_order_id: { type: 'string', maxLength: 100 },
                  razorpay_payment_id: { type: 'string', maxLength: 100 },
                  razorpay_signature: { type: 'string', maxLength: 200 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Payment verified' },
          400: { description: 'Verification failed or order already paid' },
          401: { description: 'Not authenticated' },
          404: { description: 'Order not found (or not yours)' },
          503: { description: 'Payments not configured in production' }
        }
      }
    },
    '/api/admin/orders': {
      get: {
        tags: ['admin'],
        summary: 'List all orders with pagination',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 } }
        ],
        responses: {
          200: {
            description: 'Paginated orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    orders: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    page: { type: 'integer' },
                    pages: { type: 'integer' },
                    total: { type: 'integer' }
                  }
                }
              }
            }
          },
          401: { description: 'Not authenticated' },
          403: { description: 'Not an admin' }
        }
      }
    },
    '/api/admin/orders/{id}/status': {
      put: {
        tags: ['admin'],
        summary: 'Update an order status and append to its history',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Updated order' },
          400: { $ref: '#/components/responses/Validation' },
          401: { description: 'Not authenticated' },
          403: { description: 'Not an admin' },
          404: { description: 'Order not found' }
        }
      }
    },
    '/api/admin/stats': {
      get: {
        tags: ['admin'],
        summary: 'Dashboard stats (aggregated server-side)',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Stats', content: { 'application/json': { schema: { $ref: '#/components/schemas/AdminStats' } } } },
          401: { description: 'Not authenticated' },
          403: { description: 'Not an admin' }
        }
      }
    },
    '/api/pincodes/{pincode}': {
      get: {
        tags: ['pincodes'],
        summary: 'Check serviceability for a pincode (public)',
        security: [],
        parameters: [{ name: 'pincode', in: 'path', required: true, schema: { type: 'string', pattern: '^[1-9][0-9]{5}$' } }],
        responses: {
          200: {
            description: 'Serviceability',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    serviceable: { type: 'boolean' },
                    zone: { type: 'string', enum: ['local', 'regional', 'national'] },
                    city: { type: 'string' },
                    state: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/pincodes': {
      get: {
        tags: ['pincodes'],
        summary: 'List all serviceable pincodes (admin)',
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: 'Pincodes' },
          401: { description: 'Not authenticated' },
          403: { description: 'Not an admin' }
        }
      }
    },
    '/api/pricing-tiers': {
      get: {
        tags: ['pricing-tiers'],
        summary: 'List pricing tiers (public)',
        security: [],
        responses: { 200: { description: 'Tiers' } }
      }
    },
    '/api/pricing-tiers/{id}': {
      put: {
        tags: ['pricing-tiers'],
        summary: 'Update a pricing tier (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  basePrice: { type: 'number' },
                  deliveryTime: { type: 'string' },
                  features: { type: 'array', items: { type: 'string' } },
                  isPopular: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Updated tier' },
          401: { description: 'Not authenticated' },
          403: { description: 'Not an admin' },
          404: { description: 'Tier not found' }
        }
      }
    }
  },
  responses: {
    Validation: {
      description: 'Validation failed',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
    },
    ValidationOrConflict: {
      description: 'Validation failed or user already exists',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
    }
  }
};
