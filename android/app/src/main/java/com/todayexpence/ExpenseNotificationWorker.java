package com.todayexpence;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import androidx.core.app.NotificationCompat;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class ExpenseNotificationWorker extends Worker {

    public ExpenseNotificationWorker(Context context, WorkerParameters params) {
        super(context, params);
    }

    @Override
    public Result doWork() {
        // Get today's total expenses (replace with your logic)
        double totalExpense = getTodayTotalExpense();

        // Send the notification
        sendNotification(totalExpense);

        return Result.success();
    }

    private double getTodayTotalExpense() {
        // Mock logic for calculating total expense, replace with your actual logic
        return 200.0;
    }

    private void sendNotification(double totalExpense) {
        NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        // Create a notification channel for Android O and above
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel("daily_report", "Expense Notifications", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        // Build and send the notification
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(getApplicationContext(), "daily_report")
                .setSmallIcon(R.drawable.ic_notification)  // Replace with your app icon
                .setContentTitle("Today's Total Expense")
                .setContentText("You've spent ₹" + totalExpense + " today.")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        notificationManager.notify(2, notificationBuilder.build());
    }
}
