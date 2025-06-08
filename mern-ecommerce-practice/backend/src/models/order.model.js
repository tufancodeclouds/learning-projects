import mongoose, {Schema} from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [
      {
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
      }
    ],

    amount: {
        type: Number,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        enum: ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'],
        default: 'Order Placed'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
