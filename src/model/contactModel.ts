export interface Contact {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId: number | bigint;
  linkPrecedence: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
