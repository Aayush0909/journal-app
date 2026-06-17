export interface LoginRequest {
  username: string;     // Spring Security's default field name for login forms
  password: string;
}

export interface RegisterRequest {
  userName: string;     // matches your entity field name
  password: string;
  
}

// What your Spring Boot returns after successful login
export interface AuthResponse {
  token: string;
  // add whatever your JWT response DTO contains
  userName?: string;
  roles?: string[];
}