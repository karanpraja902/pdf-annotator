export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface PDF {
    id: string;
    filename: string;
    originalName: string;
    uploadDate: string;
    fileSize: number;
    userId: string;
  }
  
  export interface Highlight {
    id: string;
    pdfId: string;
    userId: string;
    pageNumber: number;
    text: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    color: string;
    createdAt: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
  }
  