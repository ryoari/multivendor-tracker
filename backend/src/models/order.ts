import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  vendorId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  deliveryPartnerId: mongoose.Types.ObjectId | null;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    }
  };
}

const orderSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'in_transit', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);