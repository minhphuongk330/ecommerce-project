export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  customer: {
    id: number;
    email: string;
    fullName: string;
  };
}
