import mongoose, { Schema } from 'mongoose';
import { IUser } from './user';

export interface IVendor extends IUser {
  businessName: string;
  businessAddress: string;
}

const vendorSchema = new Schema({
  businessName: { type: String, required: true },
  businessAddress: { type: String, required: true }
});

// Create a discriminator based on the User model
export default mongoose.model<IVendor>('Vendor', vendorSchema);