package com.whereparts.reactclass;

import android.app.Activity;
import android.content.Intent;

import androidx.activity.result.ActivityResult;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;
import com.whereparts.MainActivity;
import com.whereparts.payment.PaymentMainActivity;
import com.whereparts.payment.PayloadEntity;
import com.whereparts.payment.PaymentMainActivity2;

public class ActivityStartModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext context;
    private Callback failedCallback;
    private Callback successCallback;

    public ActivityStartModule(ReactApplicationContext context) {
        super(context);
        this.context=context;
    }
    @Override
    public String getName() {
        return "ActivityStartModule";
    }


    @ReactMethod
    public void startPayment(String payload, Callback failedCallback, Callback successCallback) {
        this.failedCallback=failedCallback;
        this.successCallback=successCallback;
        try {
            this.context.addActivityEventListener(paymentEventListener);
            Activity currentActivity = getCurrentActivity();
            Intent intent = new Intent(context, PaymentMainActivity2.class);
            Gson gson = new Gson();
            PayloadEntity entity = gson.fromJson(payload,PayloadEntity.class);
            intent.putExtra("data",entity);
            currentActivity.startActivityForResult(intent,1);
        }catch(Exception e) {
            failedCallback.invoke(e.getMessage());
        }
    }

    //반드시 클래스 속성으로 변수를 선언해야.. 따라서 ReactMethod에서 가져온 Callback들도 클래스 속성으로 해야....
    //그렇지 않으면 2번째 startPayment를 호출하고 back 버튼 누르면 앱이 다운되는 현상...
    private final ActivityEventListener paymentEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == 1) {
                if (resultCode == Activity.RESULT_CANCELED) {
                    failedCallback.invoke("pay cancel");
                } else if (resultCode == Activity.RESULT_OK) {
                    successCallback.invoke(intent.getStringExtra("result"));
                }
            }
        }
    };
}
