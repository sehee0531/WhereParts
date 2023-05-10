package com.whereparts.payment;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;

import com.whereparts.R;
import com.whereparts.util.WidgetUtils;

import java.util.ArrayList;
import java.util.List;

import kr.co.bootpay.android.Bootpay;
import kr.co.bootpay.android.BootpayBuilder;
import kr.co.bootpay.android.events.BootpayEventListener;
import kr.co.bootpay.android.models.BootExtra;
import kr.co.bootpay.android.models.BootItem;
import kr.co.bootpay.android.models.BootUser;
import kr.co.bootpay.android.models.Payload;

public class PaymentMainActivity extends AppCompatActivity {
    private PayloadEntity entity;
    private boolean isCancel=false;

    private final String testData="{\"event\":\"done\"," +
            "\"data\":{\"receipt_id\":\"63db4799d01c7e00234e5cf0\"," +
            "\"order_id\":\"1234\"," +
            "\"price\":1000," +
            "\"tax_free\":0," +
            "\"cancelled_price\":0," +
            "\"cancelled_tax_free\":0," +
            "\"order_name\":\"부트페이 결제테스트\"," +
            "\"company_name\":\"굿정보기술\"," +
            "\"gateway_url\":\"https://gw.bootpay.co.kr\"," +
            "\"metadata\":{}," +
            "\"sandbox\":true," +
            "\"pg\":\"이니시스\"," +
            "\"method\":\"카드\"," +
            "\"method_symbol\":\"card\"," +
            "\"method_origin\":\"카드\"," +
            "\"method_origin_symbol\":\"card\"," +
            "\"purchased_at\":\"2023-02-02T14:20:15+09:00\"," +
            "\"requested_at\":\"2023-02-02T14:18:17+09:00\"," +
            "\"status_locale\":\"결제완료\"," +
            "\"receipt_url\":\"https://door.bootpay.co.kr/receipt/Y0hyWFRIU0pBOGRnTFNuUG44Q3FUSGloc3RyYUVTNHZTc25uSmxucEs3eFFs%0Adz09LS1GUW8xMlpLd0IyNng3SFVZLS04aURYT1dKQU5LdG5uZkVsRW43eThB%0APT0%3D%0A\"," +
            "\"status\":1," +
            "\"card_data\":{\"tid\":\"INIMX_CARDINIpayTest20230202142015465510\"," +
            "\"card_approve_no\":\"34094548\"," +
            "\"card_no\":\"625840*********0\"," +
            "\"card_interest\":\"0\"," +
            "\"card_quota\":\"00\"," +
            "\"card_company_code\":\"14\"," +
            "\"card_company\":\"신한카드\"," +
            "\"card_type\":\"신용\"}}," +
            "\"bootpay_event\":true}";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_payment_main);
        Intent intent = getIntent();
        this.entity = (PayloadEntity) intent.getSerializableExtra("data");
        paymentTest();
    }

    private void paymentTest() {
        //구매자 전화번호
        BootUser user = new BootUser().setPhone(this.entity.tel);

        //카드할부정보 등
        BootExtra extra = new BootExtra();
        extra.setCardQuota("0,2,3");
        extra.isDisplayErrorResult();

        //결제 방식 목록(PG사에서 제공하는 방식에 의존)
        ArrayList<String> payMethods= new ArrayList<>();
        payMethods.add("card");
        payMethods.add("phone");
        payMethods.add("bank");
        payMethods.add("kakaopay");

        //구매 물품에 대한 정보 추가
        List<BootItem> items = new ArrayList<>();
        BootItem item1 = new BootItem();
        item1.setName(this.entity.goodsName)
                .setId(String.valueOf(this.entity.goodsID))
                .setQty(this.entity.quantity)
                .setPrice((double)this.entity.price);

        //BootItem item2 = new BootItem().setName("키보드").setId("ITEM_KEYBOARD_MOUSE").setQty(1).setPrice(500d);
        items.add(item1);
        //items.add(item2);

        Payload payload = new Payload();
        payload.setApplicationId("63bf9b7c755e27001c5fd566")
                .setOrderName("결제테스트 상품")
                .setPg("inicis")
                .setMethods(payMethods)
                .setOrderId(this.entity.orderNo)
                .setPrice((double)(this.entity.price*this.entity.quantity))
                .setUser(user)
                .setExtra(extra)
                .setItems(items);

        /* 현재 필요없는 항목인듯 (여기서 작성한 데이터는 결제 완료시에 그대로 넘어옴)
        Map<String,Object> map = new HashMap<>();
        map.put("1", "abcdef");
        map.put("2", "abcdef55");
        map.put("3", 1234);
        payload.setMetadata(map);
        */

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
                    //setResult(Activity.RESULT_CANCELED);
                    Intent intent = new Intent();
                    intent.putExtra("result",testData);
                    setResult(Activity.RESULT_OK,intent);
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