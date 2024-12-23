package com.todayexpence;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import java.util.Calendar;

public class AlarmUtils {

    // Schedule the daily notification for expense report
    public static void scheduleDailyNotification(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, NotificationReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // Set the alarm time (e.g., 8:30 PM)
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 20);  // 22 hours = 10 PM
        calendar.set(Calendar.MINUTE, 00);        // 50 minutes
        calendar.set(Calendar.SECOND, 0);         // Set seconds to 0

        // If the time has already passed today, schedule it for tomorrow
        if (calendar.getTimeInMillis() < System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        // Schedule the alarm
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        }

        Log.d("AlarmUtils", "Scheduled daily notification for " + calendar.getTime());
    }

    // Schedule the daily reminder for logging expenses at the start of the day
    public static void scheduleDailyLogReminder(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        Intent intent = new Intent(context, LogReminderReceiver.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 1, intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // Set the reminder time (e.g., 8:00 AM)
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 8);   // 8 hours = 8 AM
        calendar.set(Calendar.MINUTE, 00);         // 0 minutes
        calendar.set(Calendar.SECOND, 0);         // Set seconds to 0

        // If the time has already passed today, schedule it for tomorrow
        if (calendar.getTimeInMillis() < System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_MONTH, 1);
        }

        // Schedule the alarm
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
        }

        Log.d("AlarmUtils", "Scheduled daily log reminder for " + calendar.getTime());
    }

    // Reschedule the alarm for the next day after notification is triggered
    public static void rescheduleNextDay(Context context) {
        scheduleDailyNotification(context);
        scheduleDailyLogReminder(context); // Schedule the log reminder as well
    }
}
