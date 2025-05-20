"use server";

import { SignUpSchema, SignUpMapper } from "@/shared/domain/user/dto/SignUpDTO";
import { SignUpUserService } from "@/server/domain/user/appliation/SignUpUserService";
import { FireBaseUserRepository } from "@/server/domain/user/infra/persistence/FireBaseUserRepository";
import { redirect } from "next/navigation";

const userRepository = FireBaseUserRepository;
const signUpUserService = SignUpUserService(userRepository);

export type ActionState = {
  error?: string;
  success?: boolean;
};

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    agreeTerms: formData.get("agreeTerms") === "on"
  };

  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    return {
      error: result.error.errors[0]?.message,
      success: false
    };
  }

  try {
    await signUpUserService.createUser(SignUpMapper.toEntity(result.data));
    redirect("/dashboard");
  } catch (error: any) {
    return {
      error: error.message || "Failed to sign up",
      success: false
    };
  }
}
