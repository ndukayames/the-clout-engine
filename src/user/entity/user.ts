export class User {
  email: string;
  username: string;
  isEmailVerified: boolean;
  isUserEnabled: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(
    email: string,
    username: string,
    isEmailVerified: boolean,
    isUserEnabled: boolean,
    created_at: Date,
    updated_at: Date,
  ) {
    this.email = email;
    this.username = username;
    this.isEmailVerified = isEmailVerified;
    this.isUserEnabled = isUserEnabled;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
