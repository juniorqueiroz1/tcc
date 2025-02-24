declare namespace Express {
  export interface Request {
    user: {
      id: number;
      name: string;
      email: string;
      crm?: string;
      isAdmin: boolean;
    };
  }
}
