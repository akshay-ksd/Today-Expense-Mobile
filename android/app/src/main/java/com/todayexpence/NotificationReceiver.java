package com.todayexpence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.app.Notification;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "daily_notification_channel";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("AlarmUtils", "Notification received");

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Daily Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }

        ExpenseReport report = getExpenseReport(context); // Get the daily expense report

        // Construct the notification body
        String notificationBody = String.format(
                "Daily Expense Summary:\n" +
                        "1) Total Expenses for Today: ₹ %.2f\n" +
                        "2) Most Money Spent on: %s (₹ %.2f)\n" +
                        "3) Least Money Spent on: %s (₹ %.2f)",
                report.totalExpense, report.mostSpentDescription, report.mostSpentAmount,
                report.leastSpentDescription, report.leastSpentAmount
        );

        Notification notification = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            notification = new Notification.Builder(context, CHANNEL_ID)
                    .setContentTitle("Daily Expense Report")
                    .setContentText("Your daily expense report is ready!")
                    .setStyle(new Notification.BigTextStyle().bigText(notificationBody)) // Use BigTextStyle for more text
                    .setSmallIcon(R.drawable.ic_notification) // Replace with your notification icon
                    .build();
        }

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(1, notification);
    }

    private ExpenseReport getExpenseReport(Context context) {
        ExpenseDatabaseHelper dbHelper = new ExpenseDatabaseHelper(context);
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        String currentDate = getCurrentDate(); // Ensure this method is implemented

        Cursor cursor = db.rawQuery(
                "SELECT " + ExpenseDatabaseHelper.COLUMN_EXPENSE + ", " + ExpenseDatabaseHelper.COLUMN_DESCRIPTION +
                        " FROM " + ExpenseDatabaseHelper.TABLE_EXPENSES +
                        " WHERE " + ExpenseDatabaseHelper.COLUMN_DATE + " = ?", new String[]{currentDate}
        );

        double totalExpense = 0.00;
        String mostSpentDescription = "";
        double mostSpentAmount = 0.00;
        String leastSpentDescription = "";
        double leastSpentAmount = Double.MAX_VALUE; // Start with max value to find the least spent

        while (cursor.moveToNext()) {
            double expense = cursor.getDouble(0);
            String description = cursor.getString(1);
            totalExpense += expense;

            if (expense > mostSpentAmount) {
                mostSpentAmount = expense;
                mostSpentDescription = description;
            }
            if (expense < leastSpentAmount) {
                leastSpentAmount = expense;
                leastSpentDescription = description;
            }
        }
        cursor.close();

        // If there were no expenses, set default values
        if (totalExpense == 0) {
            leastSpentAmount = 0.00;
            leastSpentDescription = "N/A";
        }

        return new ExpenseReport(totalExpense, mostSpentDescription, mostSpentAmount, leastSpentDescription, leastSpentAmount);
    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return sdf.format(new Date());
    }

    private static class ExpenseReport {
        double totalExpense;
        String mostSpentDescription;
        double mostSpentAmount;
        String leastSpentDescription;
        double leastSpentAmount;

        ExpenseReport(double totalExpense, String mostSpentDescription, double mostSpentAmount,
                      String leastSpentDescription, double leastSpentAmount) {
            this.totalExpense = totalExpense;
            this.mostSpentDescription = mostSpentDescription;
            this.mostSpentAmount = mostSpentAmount;
            this.leastSpentDescription = leastSpentDescription;
            this.leastSpentAmount = leastSpentAmount;
        }
    }
}
