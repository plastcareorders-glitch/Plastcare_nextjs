// app/_backend/utils/cartHelpers.ts
import { ICart } from "../models/cart.model";

export async function recalculateCartTotals(cart: ICart): Promise<void> {
  let totalAmount = 0;
  let totalItems = 0;

  for (const item of cart.items) {
    totalAmount += item.price * item.quantity;
    totalItems += item.quantity;
  }

  cart.totalAmount = totalAmount;
  cart.totalItems = totalItems;
  await cart.save();
}