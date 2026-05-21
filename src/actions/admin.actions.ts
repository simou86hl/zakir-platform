'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ===== User Actions =====

export async function toggleUserActive(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } });
    if (!user) throw new Error('المستخدم غير موجود');
    await prisma.user.update({ where: { id: userId }, data: { isActive: !user.isActive } });
    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateUser(userId: string, data: { firstName: string; lastName: string; role: string }) {
  try {
    if (!data.firstName.trim() || !data.lastName.trim()) throw new Error('الاسم مطلوب');
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role as any,
      },
    });
    revalidatePath('/admin/users');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ===== Subscription Actions =====

export async function extendSubscription(subscriptionId: string, days: number) {
  try {
    const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId }, select: { endDate: true } });
    if (!sub) throw new Error('الاشتراك غير موجود');
    const newEndDate = new Date(sub.endDate);
    newEndDate.setDate(newEndDate.getDate() + days);
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { endDate: newEndDate, status: 'ACTIVE' },
    });
    revalidatePath('/admin/subscriptions');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED', autoRenew: false },
    });
    revalidatePath('/admin/subscriptions');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ===== Country Actions =====

export async function toggleCountryActive(countryId: string) {
  try {
    const country = await prisma.country.findUnique({ where: { id: countryId }, select: { isActive: true } });
    if (!country) throw new Error('الدولة غير موجودة');
    await prisma.country.update({ where: { id: countryId }, data: { isActive: !country.isActive } });
    revalidatePath('/admin/countries');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteCountry(countryId: string) {
  try {
    // Check if country has students
    const count = await prisma.studentProfile.count({ where: { countryId } });
    if (count > 0) throw new Error(`لا يمكن حذف هذه الدولة - يوجد ${count} طالب مسجل فيها`);
    await prisma.country.delete({ where: { id: countryId } });
    revalidatePath('/admin/countries');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ===== Subject Actions =====

export async function toggleSubjectActive(subjectId: string) {
  try {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId }, select: { isActive: true } });
    if (!subject) throw new Error('المادة غير موجودة');
    await prisma.subject.update({ where: { id: subjectId }, data: { isActive: !subject.isActive } });
    revalidatePath('/admin/subjects');
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
