package com.whereparts.payment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.whereparts.R;

public class StartOrderFragment extends Fragment {
    private OnClickListener listener;
    //private TextView txtName, txtNo, txtPrice, txtQuantity, txtTotal, txtSpec;

    public static StartOrderFragment getInstance(PayloadEntity entity) {
        StartOrderFragment fragment = new StartOrderFragment();
        Bundle args = new Bundle();
        args.putSerializable("data",entity);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_start_order, null, false);
        TextView txtName, txtNo, txtPrice, txtQuantity, txtTotal, txtSpec;
        txtNo = view.findViewById(R.id.txtNo);
        txtSpec = view.findViewById(R.id.txtSpec);
        txtName = view.findViewById(R.id.txtName);
        txtPrice = view.findViewById(R.id.txtPrice);
        txtQuantity = view.findViewById(R.id.txtQuantity);
        txtTotal = view.findViewById(R.id.txtTotal);

        view.findViewById(R.id.buttonOK).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listener.onClick();
            }
        });

        Bundle args = getArguments();
        PayloadEntity entity = (PayloadEntity)args.getSerializable("data");
        txtName.setText("품명 : "+entity.name);
        txtSpec.setText("상세 :"+entity.spec);
        txtNo.setText("품번 : "+entity.number);
        txtPrice.setText("가격 : "+entity.price+" 원");
        txtQuantity.setText("수량 : "+entity.quantity);
        txtTotal.setText("합계 : "+(entity.price*entity.quantity)+" 원");
        return view;
    }

    public void setClickListener(OnClickListener listener) {
        this.listener=listener;
    }
}
