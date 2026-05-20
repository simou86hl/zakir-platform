'use server';

import { signIn, signOut } from '@/lib/auth';
import { registerSchema, forgotPasswordSchema } from '@/lib/validations/auth';
import { generateToken } from '@/lib/utils';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { z } from 'zod';

// ==================== تسجيل مستخدم جديد ====================
export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validated = registerSchema.parse(data);
    const { default: prisma } = await import('@/lib/prisma');

    const existing = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return { error: 'البريد الإلكتروني مسجل مسبقاً' };
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);
    const verificationToken = generateToken();

    const user = await prisma.user.create({
      data: {
        email: validated.email.toLowerCase(),
        passwordHash,
        firstName: validated.firstName,
        lastName: validated.lastName,
        gender: validated.gender as any,
        verificationToken,
        role: 'STUDENT',
      },
    });

    // TODO: Send verification email
    console.log(`[Auth] New user registered: ${user.email}`);

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('[Auth] Register error:', error);
    return { error: 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.' };
  }
}

// ==================== نسيت كلمة المرور ====================
export async function forgotPassword(email: string) {
  try {
    const { default: prisma } = await import('@/lib/prisma');

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Don't reveal if email exists (security)
    if (!user) return { success: true };

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3_600_000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    // TODO: Send reset email via nodemailer
    console.log(`[Auth] Reset token for ${email}: ${resetToken}`);

    return { success: true };
  } catch (error) {
    console.error('[Auth] Forgot password error:', error);
    return { error: 'حدث خطأ. حاول مرة أخرى.' };
  }
}

// ==================== إعادة تعيين كلمة المرور ====================
export async function resetPassword(token: string, newPassword: string) {
  try {
    const { default: prisma } = await import('@/lib/prisma');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return { error: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    return { success: true };
  } catch (error) {
    console.error('[Auth] Reset password error:', error);
    return { error: 'حدث خطأ أثناء إعادة تعيين كلمة المرور' };
  }
}

// ==================== تسجيل الخروج ====================
export async function logout() {
  await signOut({ redirectTo: '/login' });
}

// ==================== التحقق من البريد ====================
export async function verifyEmail(token: string) {
  try {
    const { default: prisma } = await import('@/lib/prisma');

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) return { error: 'رابط التحقق غير صالح' };

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verificationToken: null },
    });

    return { success: true };
  } catch (error) {
    return { error: 'حدث خطأ أثناء التحقق من البريد الإلكتروني' };
  }
}
