const { z } = require('zod');

// Returns middleware that validates req.body (or another key) against a
// zod schema. On success the parsed/coerced value replaces the original.
const validate = (schema, key = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[key]);
  if (!result.success) {
    const details = result.error.issues.map(
      (i) => `${i.path.join('.') || key}: ${i.message}`
    );
    return res.status(400).json({ message: 'Validation failed', details });
  }
  req[key] = result.data;
  next();
};

const pincode = z.string().regex(/^[1-9][0-9]{5}$/, 'must be a valid 6-digit pincode');
const phone = z.string().regex(/^[6-9][0-9]{9}$/, 'must be a valid 10-digit Indian mobile number');
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'must be a valid id');

const address = z.object({
  name: z.string().trim().min(2).max(100),
  phone,
  address: z.string().trim().min(5).max(300),
  pincode,
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100)
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  phone,
  password: z.string().min(8, 'password must be at least 8 characters').max(128)
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128)
});

const quoteSchema = z.object({
  senderPincode: pincode,
  receiverPincode: pincode,
  weight: z.coerce.number().positive().max(1000)
});

const createOrderSchema = z.object({
  sender: address,
  receiver: address,
  weight: z.coerce.number().positive().max(1000)
});

const paymentCreateSchema = z.object({
  orderId: objectId
});

const paymentVerifySchema = z.object({
  orderId: objectId,
  razorpay_order_id: z.string().max(100).optional(),
  razorpay_payment_id: z.string().max(100).optional(),
  razorpay_signature: z.string().max(200).optional()
});

const orderStatusSchema = z.object({
  status: z.enum(['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'])
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  quoteSchema,
  createOrderSchema,
  paymentCreateSchema,
  paymentVerifySchema,
  orderStatusSchema
};
