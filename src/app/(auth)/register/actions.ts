"use server";

import { SignUpDTO, SignUpSchema, SignUpMapper } from "@/shared/domain/user/dto/SignUpDTO";
import { SignUpUserService } from "@/server/domain/user/appliation/SignUpUserService";
import { FireBaseUserRepository } from "@/server/domain/user/infra/persistence/FireBaseUserRepository";
import { redirect } from "next/navigation";

const userRepository = FireBaseUserRepository;
const signUpUserService = SignUpUserService(userRepository);

export async function signUp(formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    agreeTerms: formData.get("agreeTerms") === "on"
  };

  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || "Invalid data");
  }

  try {
    const user = await signUpUserService.createUser(SignUpMapper.toEntity(result.data));
    redirect("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign up");
  }
}
