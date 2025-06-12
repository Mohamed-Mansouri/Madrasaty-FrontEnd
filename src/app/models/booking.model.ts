export interface Booking {
  id: number;
  slotId: number;
  floorId: number;
  startTime: Date;
  endTime: Date;
  customerName?: string;
  vehicleNumber?: string;
  status: BookingStatus;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}