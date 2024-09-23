package com.todayexpence;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
  private static final int REQUEST_NOTIFICATION_PERMISSION = 123;
  private static final String TAG = "MainActivity";

  private ExpenseBroadcastReceiver expenseBroadcastReceiver;

  @SuppressLint("LongLogTag")
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    try {
      AlarmUtils.scheduleDailyNotification(this);
    } catch (Exception e) {
      Log.e("AlarmError", "Error scheduling notification", e);
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      requestNotificationPermission();
    }

    // Register the broadcast receiver
    expenseBroadcastReceiver = new ExpenseBroadcastReceiver();
    registerReceiver(expenseBroadcastReceiver, new IntentFilter(Intent.ACTION_TIME_TICK)); // Example filter, adjust as needed
  }

  @Override
  protected String getMainComponentName() {
    return "TodayExpence";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }

  // Request Notification permission for Android 13+ (TIRAMISU)
  private void requestNotificationPermission() {
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
            != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(
              this,
              new String[]{Manifest.permission.POST_NOTIFICATIONS},
              REQUEST_NOTIFICATION_PERMISSION);
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    if (requestCode == REQUEST_NOTIFICATION_PERMISSION) {
      if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        Log.d(TAG, "Notification permission granted");
      } else {
        Log.d(TAG, "Notification permission denied");
      }
    }
  }
//
//  @Override
//  protected void onPause() {
//    super.onPause();
//    // Unregister the receiver when the activity is paused
//    if (expenseBroadcastReceiver != null) {
//      unregisterReceiver(expenseBroadcastReceiver);
//    }
//  }
//
//  @Override
//  protected void onResume() {
//    super.onResume();
//    // Register the receiver again when the activity is resumed
//    if (expenseBroadcastReceiver != null) {
//      registerReceiver(expenseBroadcastReceiver, new IntentFilter(Intent.ACTION_TIME_TICK)); // Adjust filter as needed
//    }
//  }
}
