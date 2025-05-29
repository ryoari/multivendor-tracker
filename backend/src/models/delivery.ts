import mongoose, { Schema } from 'mongoose';
import { IUser } from './user';

export interface IDeliveryPartner extends IUser {
  currentLocation: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  currentOrder: mongoose.Types.ObjectId | null;
}

const deliveryPartnerSchema = new Schema({
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  isAvailable: { type: Boolean, default: true },
  currentOrder: { type: Schema.Types.ObjectId, ref: 'Order', default: null }
});

// Create a discriminator based on the User model
export default mongoose.model<IDeliveryPartner>('DeliveryPartner', deliveryPartnerSchema);