package com.todayexpence;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ExpenseBroadcastReceiver extends BroadcastReceiver {

    @SuppressLint("LongLogTag")
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && intent.getAction().equals("com.todayexpence.EXPENSE_ADDED")) {
            ReactContext reactContext = getReactContext(context);

            if (reactContext != null) {
                String expense = intent.getStringExtra("expense");
                String description = intent.getStringExtra("description");
                WritableMap params = Arguments.createMap();
                params.putString("expense", expense);
                params.putString("description", description);

                sendEventToReactNative(reactContext, "ExpenseAdded", params); // Optional: pass data if needed
                Log.d("ExpenseBroadcastReceiver", "Expense added event broadcasted to React Native.");
            } else {
                Log.e("ExpenseBroadcastReceiver", "ReactContext is null, unable to send event.");
            }
        }
    }

    // Method to get ReactContext
    private ReactContext getReactContext(Context context) {
        if (context.getApplicationContext() instanceof ReactApplication) {
            ReactApplication reactApplication = (ReactApplication) context.getApplicationContext();
            return reactApplication.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
        }
        return null;
    }

    // Method to send events to React Native JavaScript
    private void sendEventToReactNative(ReactContext reactContext, String eventName, Object data) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }
}
