package com.todayexpence;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class NotificationUpdateService extends IntentService {
    private static final String CHANNEL_ID = "MyBackgroundServiceChannel";
    private static final String TAG = "NotificationUpdateService";
    private ExpenseDatabaseHelper dbHelper;

    public NotificationUpdateService() {
        super("NotificationUpdateService");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        dbHelper = new ExpenseDatabaseHelper(this);
        createNotificationChannel();
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        if (intent != null) {
            updateNotification();
        }
    }

    private void updateNotification() {
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (notificationManager != null) {
            notificationManager.notify(1, buildNotification());
        }
    }

    private Notification buildNotification() {
        double totalExpense = getTotalExpense(); // Get the total expense
        String notificationContent = "Today Expense: ₹" + totalExpense;

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Track Your Expense")
                .setContentText(notificationContent) // Display total expense
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .build();
    }

    private double getTotalExpense() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        String currentDate = getCurrentDate();
        Cursor cursor = db.rawQuery(
                "SELECT SUM(" + ExpenseDatabaseHelper.COLUMN_EXPENSE + ") FROM " + ExpenseDatabaseHelper.TABLE_EXPENSES +
                        " WHERE " + ExpenseDatabaseHelper.COLUMN_DATE + " = ?", new String[]{currentDate}
        );
        if (cursor.moveToFirst()) {
            double total = cursor.getDouble(0);
            cursor.close();
            return total;
        }
        cursor.close();
        return 0;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Expense Tracking Service", NotificationManager.IMPORTANCE_HIGH);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return sdf.format(new Date());
    }
}
