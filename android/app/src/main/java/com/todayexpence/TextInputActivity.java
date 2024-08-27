package com.todayexpence;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class TextInputActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_text_input);

        EditText editText = findViewById(R.id.edit_text);
        Button button = findViewById(R.id.submit_button);

        button.setOnClickListener(v -> {
            String inputText = editText.getText().toString();
            Toast.makeText(this, "Input: " + inputText, Toast.LENGTH_SHORT).show();
            // Handle the input text as needed
            finish(); // Close the activity
        });
    }
}
