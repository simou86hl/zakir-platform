import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        try {
          // Dynamic import لتجنب مشاكل البناء
          const { default: prisma } = await import('./prisma');

          const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
              studentProfile: { select: { id: true } },
            },
          });

          if (!user || !user.passwordHash || !user.isActive) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.avatar ?? null,
            // Custom fields
            role: user.role as string,
            hasProfile: !!(user as any).studentProfile,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar ?? null,
          };
        } catch (error) {
          console.error('[Auth] Login error:', error);
          return null;
        }
      },
    }),
  ],
});
