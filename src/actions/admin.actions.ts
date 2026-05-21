'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserActive(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
    if (!user) throw new Error('User not found');
    await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
