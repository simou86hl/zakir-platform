export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';

export const metadata = { title: 'إدارة الاشتراك' };

async function getData(userId: string) {
  try {
    const [plans, subscription] = await Promise.all([
      prisma.plan.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.subscription.findUnique({
        where: { userId },
        include: { plan: true, payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
      }),
    ]);
    return { plans, subscription };
  } catch { return { plans: [], subscription: null }; }
}

export default async function SubscriptionPage() {
  const session = await auth();
  const { plans, subscription } = await getData((session?.user as any)?.id);
  return <SubscriptionManager plans={plans} currentSubscription={subscription} userId={(session?.user as any)?.id} />;
}
