package com.todayexpence;


import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;
import java.util.Calendar;
import java.util.concurrent.TimeUnit;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ExpenseWorkManagerModule extends ReactContextBaseJavaModule {

    public ExpenseWorkManagerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ExpenseWorkManager";
    }

    @ReactMethod
    public void scheduleDailyWork() {
        Log.d("scheduleDailyWork", "scheduleDailyWork " );

        // Get the current time
        Calendar now = Calendar.getInstance();
        // Set the time for 11:15 PM
        Calendar notificationTime = Calendar.getInstance();
        notificationTime.set(Calendar.HOUR_OF_DAY, 17);
        notificationTime.set(Calendar.MINUTE, 20);
        notificationTime.set(Calendar.SECOND, 0);

        // If it's already past 11:15 PM today, schedule for tomorrow
        if (now.after(notificationTime)) {
            notificationTime.add(Calendar.DAY_OF_YEAR, 1);
        }

        // Calculate the delay in milliseconds until 11:15 PM
        long delay = notificationTime.getTimeInMillis() - now.getTimeInMillis();

        // Schedule the task with WorkManager
        WorkRequest workRequest = new OneTimeWorkRequest.Builder(ExpenseNotificationWorker.class)
                .setInitialDelay(delay, TimeUnit.MILLISECONDS)
                .build();

        WorkManager.getInstance(getReactApplicationContext()).enqueue(workRequest);
    }
}
