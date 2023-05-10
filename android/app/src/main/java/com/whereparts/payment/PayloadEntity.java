package com.whereparts.payment;

import java.io.Serializable;

public class PayloadEntity implements Serializable {
    public String orderNo;
    public int goodsID;
    public String goodsName;
    public String goodsNo;
    public String tel;
    public int price;
    public int quantity;
    public int total;
}