package com.todayexpence;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;

public class BackgroundServiceModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    BackgroundServiceModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BackgroundService";
    }

    @ReactMethod
    public void startService() {
        Intent serviceIntent = new Intent(reactContext, MyBackgroundService.class);
        reactContext.startService(serviceIntent);
    }

    @ReactMethod
    public void stopService() {
        Intent serviceIntent = new Intent(reactContext, MyBackgroundService.class);
        reactContext.stopService(serviceIntent);
    }
}
