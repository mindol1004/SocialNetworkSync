"use server";

import { SignInSchema } from "@/shared/domain/user/dto/SignInDTO";
import { SignInUserService } from "@/server/domain/user/appliation/SignInUserService";
import { FireBaseUserRepository } from "@/server/domain/user/infra/persistence/FireBaseUserRepository";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const userRepository = FireBaseUserRepository;
const signInUserService = SignInUserService(userRepository);

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  };

  const result = SignInSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message,
      success: false
    };
  }

  try {
    
    const user = await signInUserService.loginWithEmail(result.data.email, result.data.password);
    useAuthStore.getState().setUser(user);
    
  } catch (error: any) {
    return {
      error: error.message || "Failed to sign in",
      success: false
    };
  }

  redirect("/dashboard");
}
