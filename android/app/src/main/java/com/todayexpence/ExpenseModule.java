package com.todayexpence;

import android.annotation.SuppressLint;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class ExpenseModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "ExpenseModule";
    private ExpenseDatabaseHelper dbHelper;

    public ExpenseModule(ReactApplicationContext reactContext) {
        super(reactContext);
        dbHelper = new ExpenseDatabaseHelper(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @SuppressLint("Range")
    @ReactMethod
    public void getAllExpenses(Promise promise) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.query(ExpenseDatabaseHelper.TABLE_EXPENSES,
                null, null, null, null, null, null);

        WritableArray expenses = Arguments.createArray();

        if (cursor.moveToFirst()) {
            do {
                WritableMap expense = Arguments.createMap();
                expense.putInt("id", cursor.getInt(cursor.getColumnIndex(ExpenseDatabaseHelper.COLUMN_ID)));
                expense.putString("expense", cursor.getString(cursor.getColumnIndex(ExpenseDatabaseHelper.COLUMN_EXPENSE)));
                expense.putString("description", cursor.getString(cursor.getColumnIndex(ExpenseDatabaseHelper.COLUMN_DESCRIPTION)));
                expense.putString("date", cursor.getString(cursor.getColumnIndex(ExpenseDatabaseHelper.COLUMN_DATE)));
                expenses.pushMap(expense);
            } while (cursor.moveToNext());
        }

        cursor.close();
        db.close();

        promise.resolve(expenses);
    }

    @ReactMethod
    public void addExpense(String expense, String description, String date, Promise promise) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(ExpenseDatabaseHelper.COLUMN_EXPENSE, expense);
        values.put(ExpenseDatabaseHelper.COLUMN_DESCRIPTION, description);
        values.put(ExpenseDatabaseHelper.COLUMN_DATE, date);

        long newRowId = db.insert(ExpenseDatabaseHelper.TABLE_EXPENSES, null, values);

        if (newRowId == -1) {
            promise.reject("Error", "Failed to add expense");
        } else {
            Context context = getReactApplicationContext();
            Intent serviceIntent = new Intent(context, NotificationUpdateService.class);
            context.startService(serviceIntent);

            promise.resolve("Expense added successfully with ID: " + newRowId);
        }

        db.close();
    }

    @ReactMethod
    public void getTotalExpense(Promise promise) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT SUM(" + ExpenseDatabaseHelper.COLUMN_EXPENSE + ") AS total FROM " + ExpenseDatabaseHelper.TABLE_EXPENSES, null);

        if (cursor.moveToFirst()) {
            @SuppressLint("Range") double totalExpense = cursor.getDouble(cursor.getColumnIndex("total"));
            promise.resolve(totalExpense);
        } else {
            promise.resolve(0);
        }

        cursor.close();
        db.close();
    }

    @ReactMethod
    public void updateExpense(int id, String expense, String description, String date, Promise promise) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        ContentValues values = new ContentValues();
        values.put(ExpenseDatabaseHelper.COLUMN_EXPENSE, expense);
        values.put(ExpenseDatabaseHelper.COLUMN_DESCRIPTION, description);
        values.put(ExpenseDatabaseHelper.COLUMN_DATE, date);

        int rowsAffected = db.update(ExpenseDatabaseHelper.TABLE_EXPENSES, values, ExpenseDatabaseHelper.COLUMN_ID + " = ?", new String[]{String.valueOf(id)});

        if (rowsAffected > 0) {
            promise.resolve("Expense updated successfully");
        } else {
            promise.reject("Error", "Failed to update expense");
        }

        db.close();
    }

    @ReactMethod
    public void deleteExpense(int id, Promise promise) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // Delete the expense by its ID
        int rowsAffected = db.delete(ExpenseDatabaseHelper.TABLE_EXPENSES,
                ExpenseDatabaseHelper.COLUMN_ID + " = ?",
                new String[]{String.valueOf(id)});

        db.close();

        // Check if the deletion was successful
        if (rowsAffected > 0) {
            promise.resolve("Expense deleted successfully");
        } else {
            promise.reject("Error", "Failed to delete expense");
        }
    }
}
