export class AuthResponseDto {
  accessToken: string;
  customer: {
    id: number;
    email: string;
    fullName: string;
  };
}
