export interface State {
  name: string;
  is_accepting: boolean;
}

export interface Transition {
  current_state: string;
  next_state: string;
  read_symbol: string;
  write_symbol: string;
  move_direction: 'L' | 'R';
}

export interface Machine {
  id: string;
  name: string;
  states: State[];
  input_alphabet: string[];
  tape_alphabet: string[];
  transitions: Transition[];
  start_state: string;
  blank_symbol: string;
  user: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
} 

export interface ExecuteCodeRequest {
  code: string;
}

export interface ExecuteCodeResponse {
  output: string;
  error?: string;
}