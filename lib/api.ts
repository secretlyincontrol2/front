// BUPT AI Tutor — Frontend API Service

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cyntigdggdg.onrender.com";

interface ChatResponse {
  from: string;
  text: string;
  timestamp: string;
}

export const apiService = {
  /**
   * Send a chat message to the RAG backend
   */
  async sendChatMessage(message: string, department: string = "Computer Science", course: string = "General"): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader()
      } as HeadersInit,
      body: JSON.stringify({
        message,
        department,
        course,
        conversationHistory: []
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Login student
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async login(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" } as HeadersInit,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    const result = await response.json();
    if (result.token) {
        localStorage.setItem("bupt_token", result.token);
    }
    return result;
  },

  /**
   * Register student
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async register(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" } as HeadersInit,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    const result = await response.json();
    if (result.token) {
        localStorage.setItem("bupt_token", result.token);
    }
    return result;
  },

  /**
   * Get available courses and departments
   */
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/api/ai/courses`, {
        headers: this.getAuthHeader() as HeadersInit
    });
    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }
    return response.json();
  },

  /**
   * Helper to get auth header
   */
  getAuthHeader(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("bupt_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
