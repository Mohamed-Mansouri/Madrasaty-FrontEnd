export interface ParkingSlot {
  id: number;
  floorId: number;
  name: string;
  isAvailable: boolean;
  type: SlotType;
  position: {
    row: number;
    col: number;
  };
}

export enum SlotType {
  STANDARD = 'standard',
  COMPACT = 'compact',
  HANDICAP = 'handicap',
  ELECTRIC = 'electric'
}