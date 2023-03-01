package com.whereparts.payment;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.whereparts.R;
import com.whereparts.util.WidgetUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import kr.co.bootpay.android.Bootpay;
import kr.co.bootpay.android.BootpayBuilder;
import kr.co.bootpay.android.events.BootpayEventListener;
import kr.co.bootpay.android.models.BootExtra;
import kr.co.bootpay.android.models.BootItem;
import kr.co.bootpay.android.models.BootUser;
import kr.co.bootpay.android.models.Payload;

public class PaymentMainActivity2 extends AppCompatActivity {
    private PayloadEntity entity;
    private boolean isCancel=false;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment_main);
        Intent intent = getIntent();
        this.entity = (PayloadEntity) intent.getSerializableExtra("data");
        paymentTest();
    }

    private void paymentTest() {
        BootUser user = new BootUser().setPhone("010-1234-5678");

        BootExtra extra = new BootExtra();
        extra.setCardQuota("0,2,3");
        extra.isDisplayErrorResult();

        List<BootItem> items = new ArrayList<>();
        BootItem item1 = new BootItem().setName("마우스").setId("ITEM_CODE_MOUSE").setQty(1).setPrice((double)this.entity.price);
        //BootItem item2 = new BootItem().setName("키보드").setId("ITEM_KEYBOARD_MOUSE").setQty(1).setPrice(500d);
        items.add(item1);
        //items.add(item2);

        Payload payload = new Payload();
        payload.setApplicationId("63bf9b7c755e27001c5fd566")
                .setOrderName("부트페이 결제테스트")
                .setPg("inicis")
                .setMethod("카드")
                .setOrderId("1234")
                .setPrice((double)this.entity.price)
                .setUser(user)
                .setExtra(extra)
                .setItems(items);

        Map<String,Object> map = new HashMap<>();
        map.put("1", "abcdef");
        map.put("2", "abcdef55");
        map.put("3", 1234);
        payload.setMetadata(map);

        BootpayBuilder bootPayBuilder = Bootpay.init(getSupportFragmentManager(), getApplicationContext());
        bootPayBuilder.setPayload(payload);
        bootPayBuilder.setEventListener(bootpayEventListener);
        bootPayBuilder.requestPayment();
    }

    private BootpayEventListener bootpayEventListener = new BootpayEventListener() {
        @Override
        public void onCancel(String data) {
            isCancel=true;
            Log.d("bootpay", "cancel: " + data);
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    //CompleteOrderFragment fragment = new CompleteOrderFragment();
                    //getSupportFragmentManager().beginTransaction().replace(R.id.fragmentView,fragment).commit();
                    //react-native로 돌려주기 위한 값. ActivityStartModule로 돌려주고 여기서 successCallback로 최종적으로 react-native로 돌려줌
                    setResult(Activity.RESULT_CANCELED);
                    finish();
                }
            });
        }

        @Override
        public void onError(String data) {
            Log.d("bootpay", "error: " + data);
        }

        @Override
        public void onClose() {
            //Log.d("bootpay", "close: " + data);
            if(!isCancel)
                onBackPressed();
            //Bootpay.removePaymentWindow();
        }

        @Override
        public void onIssued(String data) {
            Log.d("bootpay", "issued: " +data);
        }

        @Override
        public boolean onConfirm(String data) {
            Log.d("bootpay", "confirm: " + data);
//                        Bootpay.transactionConfirm(data); //재고가 있어서 결제를 진행하려 할때 true (방법 1)
            return true; //재고가 있어서 결제를 진행하려 할때 true (방법 2)
//                        return false; //결제를 진행하지 않을때 false
        }

        @Override
        public void onDone(String data) {
            Log.d("done", data);
            //CompleteOrderFragment fragment = new CompleteOrderFragment();
            //getSupportFragmentManager().beginTransaction().replace(R.id.fragmentView,fragment).commit();
            Intent intent = new Intent();
            intent.putExtra("result",data);
            setResult(Activity.RESULT_OK,intent);
            finish();
        }
    };

    @Override
    public void finish() {
        super.finish();
    }

    @Override
    public void onBackPressed() {
        WidgetUtils.createAlertDialog(this, "구매취소","구매를 취소 하시겠습니까?",(dialog1, which) -> {
            super.onBackPressed();
            Bootpay.removePaymentWindow();
        }, (dialog1, which)-> {

        }).show();
    }
}