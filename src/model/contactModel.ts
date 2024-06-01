export interface Contact {
  id: number;
  phoneNumber: string;
  email: string;
  linkedId: number;
  linkPrecedence: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
