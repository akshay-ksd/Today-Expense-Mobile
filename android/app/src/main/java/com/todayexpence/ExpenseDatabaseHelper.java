package com.todayexpence;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

public class ExpenseDatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "expenses.db";
    private static final int DATABASE_VERSION = 2; // Incremented the database version

    // Table name
    public static final String TABLE_EXPENSES = "expenses";

    // Table columns
    public static final String COLUMN_ID = "_id";
    public static final String COLUMN_EXPENSE = "expense";
    public static final String COLUMN_DESCRIPTION = "description";
    public static final String COLUMN_DATE = "date"; // Added date column

    // SQL to create table
    private static final String TABLE_CREATE =
            "CREATE TABLE " + TABLE_EXPENSES + " (" +
                    COLUMN_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    COLUMN_EXPENSE + " TEXT, " +
                    COLUMN_DESCRIPTION + " TEXT, " +
                    COLUMN_DATE + " TEXT);"; // Updated table creation SQL

    public ExpenseDatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(TABLE_CREATE);
        Log.d("ExpenseDatabaseHelper", "Table created with query: " + TABLE_CREATE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if (oldVersion < 2) {
            db.execSQL("ALTER TABLE " + TABLE_EXPENSES + " ADD COLUMN " + COLUMN_DATE + " TEXT");
            Log.d("ExpenseDatabaseHelper", "Table upgraded with query: ALTER TABLE " + TABLE_EXPENSES + " ADD COLUMN " + COLUMN_DATE + " TEXT");
        }
    }
}
