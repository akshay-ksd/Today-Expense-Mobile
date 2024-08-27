package com.todayexpence;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.view.inputmethod.InputMethodManager;

import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;

public class DescriptionInputReceiver extends BroadcastReceiver {
    private static final String CHANNEL_ID = "MyBackgroundServiceChannel";
    private static final String KEY_TEXT_REPLY_DESCRIPTION = "key_text_reply_description";
    private static final String ACTION_REPLY_DESCRIPTION = "com.todayexpence.ACTION_REPLY_DESCRIPTION";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null && intent.getAction().equals("com.todayexpence.ACTION_AUTO_OPEN_DESCRIPTION")) {
            // Create intent for description action
            Intent replyDescriptionIntent = new Intent(context, MyBackgroundService.class);
            replyDescriptionIntent.setAction(ACTION_REPLY_DESCRIPTION);
            PendingIntent replyDescriptionPendingIntent = PendingIntent.getService(context, 0, replyDescriptionIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE);

            // Create remote input for description action
            RemoteInput remoteInputDescription = new RemoteInput.Builder(KEY_TEXT_REPLY_DESCRIPTION)
                    .setLabel("Add Description")
                    .build();

            // Create reply action for description
            NotificationCompat.Action replyDescriptionAction = new NotificationCompat.Action.Builder(
                    0, "Add Description", replyDescriptionPendingIntent)
                    .addRemoteInput(remoteInputDescription)
                    .build();

            // Update the existing notification with description action
            Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setContentTitle("Add Expense")
                    .setContentText("Add description for your expense")
                    .setSmallIcon(R.drawable.ic_notification) // replace with your icon
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .setCategory(NotificationCompat.CATEGORY_SERVICE)
                    .addAction(replyDescriptionAction)
                    .setOngoing(true) // Ensure the notification is not dismissible
                    .build();

            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.notify(1, notification); // Update the existing notification
            }

            // Open the keyboard
            InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
            if (imm != null) {
                imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY);
            }
        }
    }
}
