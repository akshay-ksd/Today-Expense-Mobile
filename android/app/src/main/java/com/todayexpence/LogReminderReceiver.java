package com.todayexpence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.app.Notification;
import android.util.Log;

public class LogReminderReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "log_reminder_channel";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("LogReminderReceiver", "Log reminder received");

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Log Reminder Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        String notificationBody = "⏰ Time to Log Your Spending!\n" +
                "Tracking your spending helps you stay on budget. Let's do it! 💪";

        Notification notification = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            notification = new Notification.Builder(context, CHANNEL_ID)
                    .setContentTitle("Daily Log Reminder")
                    .setContentText("Don't forget to log your expenses!")
                    .setStyle(new Notification.BigTextStyle().bigText(notificationBody))
                    .setSmallIcon(R.drawable.ic_notification) // Replace with your notification icon
                    .build();
        }

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(3, notification);
    }
}
