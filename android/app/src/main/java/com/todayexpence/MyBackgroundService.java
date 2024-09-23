package com.todayexpence;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MyBackgroundService extends Service {
    private static final String TAG = "MyBackgroundService";
    private static final String CHANNEL_ID = "MyBackgroundServiceChannel";
    private static final String KEY_TEXT_REPLY_EXPENSE = "key_text_reply_expense";
    private static final String KEY_TEXT_REPLY_DESCRIPTION = "key_text_reply_description";

    private ExpenseDatabaseHelper dbHelper;
    private String tempExpense; // Temporary variable to store the expense
    private String tempDescription; // Temporary variable to store the description
    private String warningMessage; // Warning message for invalid input

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Service created");
        createNotificationChannel();
        dbHelper = new ExpenseDatabaseHelper(this);
        showNotification(null);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        handleInput(intent);
        return START_STICKY;
    }

    private void handleInput(Intent intent) {
        Bundle remoteInput = RemoteInput.getResultsFromIntent(intent);
        if (remoteInput != null) {
            String expense = getReplyMessage(remoteInput, KEY_TEXT_REPLY_EXPENSE);
            String description = getReplyMessage(remoteInput, KEY_TEXT_REPLY_DESCRIPTION);

            if (expense != null) {
                if (isNumeric(expense)) {
                    tempExpense = expense;
                    warningMessage = null; // Clear any previous warning message
                } else {
                    tempExpense = null; // Clear tempExpense if the input is not valid
                    warningMessage = "Invalid expense: '" + expense + "'. Please enter a number.";
                    showNotification(warningMessage); // Show notification with warning message
                    return;
                }
            }

            if (description != null) {
                tempDescription = description;
            }

            if (tempExpense != null && tempDescription != null) {
                storeExpenseToDatabase(tempExpense, tempDescription);
//                sendBroadcastToReactNative(tempExpense, tempDescription);
                tempExpense = null; // Clear the temporary variable after storing
                tempDescription = null; // Clear the temporary variable after storing
                showNotification(null); // Refresh notification with updated total
            } else {
                showNotification(warningMessage); // Refresh notification if only one input is provided
            }
        }
    }

    private boolean isNumeric(String str) {
        try {
            Double.parseDouble(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private String getReplyMessage(Bundle remoteInput, String key) {
        CharSequence input = remoteInput.getCharSequence(key);
        return input != null ? input.toString() : null;
    }

    private void storeExpenseToDatabase(String expense, String description) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues values = new ContentValues();
        values.put(ExpenseDatabaseHelper.COLUMN_EXPENSE, Double.parseDouble(expense)); // Convert expense to double
        values.put(ExpenseDatabaseHelper.COLUMN_DESCRIPTION, description);
        values.put(ExpenseDatabaseHelper.COLUMN_DATE, getCurrentDate()); // Store current date

        long newRowId = db.insert(ExpenseDatabaseHelper.TABLE_EXPENSES, null, values);
        if (newRowId == -1) {
            Log.e(TAG, "Error storing to DB: Expense = " + expense + ", Description = " + description);
        } else {
            Log.d(TAG, "Stored to DB: Expense = " + expense + ", Description = " + description + ", Date = " + getCurrentDate());
        }
    }

    private void sendBroadcastToReactNative(String expense, String description) {
        Intent intent = new Intent("com.todayexpence.EXPENSE_ADDED");
        intent.putExtra("expense", expense);
        intent.putExtra("description", description);
        sendBroadcast(intent);
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
            // Return the total as a double
            return Math.round(total * 100.0) / 100.0; // Round to 2 decimal places
        }
        return 0.00;
    }



    private void showNotification(@Nullable String warningMessage) {
        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (notificationManager != null) {
            notificationManager.notify(1, buildNotification(warningMessage));
        }
    }

    private Notification buildNotification(@Nullable String warningMessage) {
        PendingIntent replyPendingIntent = PendingIntent.getService(
                this, 0, new Intent(this, MyBackgroundService.class), PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

        RemoteInput remoteInputExpense = new RemoteInput.Builder(KEY_TEXT_REPLY_EXPENSE)
                .setLabel("Add Expense")
                .build();
        RemoteInput remoteInputDescription = new RemoteInput.Builder(KEY_TEXT_REPLY_DESCRIPTION)
                .setLabel("Add Description")
                .build();

        NotificationCompat.Action expenseAction = new NotificationCompat.Action.Builder(0, "Add Expense", replyPendingIntent)
                .addRemoteInput(remoteInputExpense)
                .build();
        NotificationCompat.Action descriptionAction = new NotificationCompat.Action.Builder(0, "Add Description", replyPendingIntent)
                .addRemoteInput(remoteInputDescription)
                .build();

        double totalExpense = getTotalExpense(); // Get the total expense
        String notificationContent = warningMessage != null ? warningMessage : "Today Expense: ₹" + totalExpense;

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Track Your Expense")
                .setContentText(notificationContent) // Display total expense or warning message
                .setSmallIcon(R.drawable.ic_notification)
                .setOngoing(true)
                .addAction(expenseAction)
                .addAction(descriptionAction)
                .build();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "Service destroyed");
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Expense Tracking Service", NotificationManager.IMPORTANCE_HIGH);
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        return sdf.format(new Date());
    }
}
