"use server";

import { SignUpDTO, SignUpSchema } from "@/shared/domain/user/dto/SignUpDTO";
import { api } from "@/lib/axios";

export async function signUp(formData: FormData) {
  // Validate data with Zod
  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || "Invalid data");
  }

  try {
    // Make request to your API
    const response = await api.post("/api/user/signup", data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign up");
    }

    const userData = await response.json();

    return userData;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
}