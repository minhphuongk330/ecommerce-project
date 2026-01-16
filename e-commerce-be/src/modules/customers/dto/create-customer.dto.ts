export class CreateCustomerDto {
  email: string;
  passwordHash: string;
  fullName?: string;
  isActive?: boolean;
}

