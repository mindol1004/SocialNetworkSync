import { User } from '../model/User';
import { z } from 'zod';
import { useTranslation } from "@/lib/i18n";

const { t } = useTranslation();

export const SignUpSchema = z.object({
  username: z.string({
    required_error: t('username.required')
  }).min(2, t('username.minLength')),
  email: z.string({
    required_error: t('email.required')
  }).email(t('email.invalid')),
  password: z.string({
    required_error: t('password.required)')
  }).min(6, t('password.minLength')),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: t("terms.required"),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpDTO = z.infer<typeof SignUpSchema>;

export class SignUpMapper {
  static toEntity(dto: SignUpDTO): User {
    return {
      id: '',
      email: dto.email,
      password: dto.password,
      username: dto.username,
      role: 'user' as const,
      createdAt: new Date(),
      photoURL: null,
      followers: {},
      following: {},
    };
  }
}