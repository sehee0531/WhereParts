package com.whereparts.util;

import android.content.Context;
import android.content.DialogInterface;

import androidx.appcompat.app.AlertDialog;

public class WidgetUtils {

    /* AlertDialog 생성 */
    public static AlertDialog createAlertDialog(Context context, String title, String message,
                                                DialogInterface.OnClickListener listener, boolean cancelButton) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setCancelable(false);
        builder.setPositiveButton("확인", listener);

        if (cancelButton) {
            builder.setNegativeButton("취소", null);
        }

        return builder.create();
    }

    /* AlertDialog 생성 */
    public static AlertDialog createAlertDialog(Context context, String title, String message,
                                                DialogInterface.OnClickListener listener1, DialogInterface.OnClickListener listener2) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(title);
        builder.setMessage(message);
        builder.setCancelable(false);
        builder.setPositiveButton("확인", listener1);
        builder.setNegativeButton("취소", listener2);

        return builder.create();
    }
}
