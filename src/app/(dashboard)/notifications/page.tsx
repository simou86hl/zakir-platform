export const dynamic = 'force-dynamic';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';

export const metadata = { title: 'الإشعارات' };

const typeIcons: Record<string, string> = {
  ACHIEVEMENT: '🏅', STREAK: '🔥', REMINDER: '⏰',
  SUBSCRIPTION: '💳', SYSTEM: '🔔', NEW_CONTENT: '📚',
};

async function getNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch { return []; }
}

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await getNotifications((session?.user as any)?.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            الإشعارات
          </h1>
          {unreadCount > 0 && <p className="text-muted-foreground mt-1">{unreadCount} إشعار غير مقروء</p>}
        </div>
        {unreadCount > 0 && (
          <button className="flex items-center gap-1.5 text-sm text-primary hover:underline">
            <CheckCheck className="h-4 w-4" />
            تعليم الكل كمقروء
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Bell className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold">لا توجد إشعارات</h2>
            <p className="text-muted-foreground">ستظهر إشعاراتك هنا عند بدء دراستك</p>
          </div>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0 divide-y">
            {notifications.map(notif => (
              <div key={notif.id} className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xl shrink-0">
                  {typeIcons[notif.type] || '🔔'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(notif.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
