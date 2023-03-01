package com.whereparts.payment;

import java.io.Serializable;

public class PayloadEntity implements Serializable {
    public String name;
    public String number;
    public int price;
    public int quantity;
    public String spec;
}