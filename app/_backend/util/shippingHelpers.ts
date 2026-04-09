// app/_backend/utils/shippingHelpers.ts
import { Shipping } from "../models/shipping.model";
import mongoose from "mongoose";

export async function setDefaultAddress(userId: mongoose.Types.ObjectId, addressId: mongoose.Types.ObjectId) {
  // Remove default flag from all other addresses of this user
  await Shipping.updateMany(
    { user: userId, _id: { $ne: addressId } },
    { $set: { isDefault: false } }
  );
  // Set the selected address as default
  await Shipping.updateOne(
    { _id: addressId, user: userId },
    { $set: { isDefault: true } }
  );
}