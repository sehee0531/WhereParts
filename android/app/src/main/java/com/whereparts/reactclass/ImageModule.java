package com.whereparts.reactclass;

import android.graphics.Bitmap;
import android.net.Uri;
import android.nfc.cardemulation.CardEmulation;
import android.util.Base64;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.whereparts.util.CameraXImageUtil;
import com.whereparts.util.MediaUtil;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;

public class ImageModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private WritableArray imageURIs;

    public ImageModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext=reactContext;
    }

    @Override
    public String getName() {
        return "ImageModule";
    }

    @ReactMethod
    public void getImageBase64(String uri, Callback failedCallback, Callback successCallback) {
        try{
            String imageString=Base64.encodeToString(this.getBinaryImage(uri),Base64.DEFAULT);
            successCallback.invoke(imageString);
        }catch(Exception e) {
            failedCallback.invoke("error");
        }
    }

    @ReactMethod
    public void getCutImageBase64(String uri, ReadableMap source, ReadableMap target,Callback failedCallback, Callback successCallback) {
        try{
            int heightSource = source.getInt("height");
            int widthSource = source.getInt("width");
            int heightTarget = target.getInt("height");
            int widthTarget = target.getInt("width");
            int leftTarget = target.getInt("left");
            int topTarget = target.getInt("top");

            byte [] byteImage=this.getCutImage(uri,heightSource,widthSource,heightTarget,widthTarget,leftTarget,topTarget);
            String imageString=Base64.encodeToString(byteImage,Base64.DEFAULT);
            successCallback.invoke(imageString);
        }catch(Exception e) {
            failedCallback.invoke("error");
        }
    }

    @ReactMethod
    public void getCutImageUri(String uri, ReadableMap source, ReadableMap target,Callback failedCallback, Callback successCallback) {
        try {
            int heightSource = source.getInt("height");
            int widthSource = source.getInt("width");
            int heightTarget = target.getInt("height");
            int widthTarget = target.getInt("width");
            int leftTarget = target.getInt("left");
            int topTarget = target.getInt("top");

            byte[] byteImage = this.getCutImage(uri, heightSource, widthSource, heightTarget, widthTarget, leftTarget, topTarget);
            successCallback.invoke(this.getStoredImageUri(byteImage).toString());
        }catch(Exception e) {
            failedCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    public void deleteImage(String uri, Callback failedCallback, Callback successCallback) {
        try {
            MediaUtil mediaUtil = new MediaUtil(this.reactContext);
            mediaUtil.deleteImageFromGallery(Uri.parse(uri));
            successCallback.invoke(uri);
        }catch(Exception e) {
            failedCallback.invoke("error");
        }
    }

    //sampleSize에 따라 사진 축소...1/size 로..
    @ReactMethod
    public void getReduceImageUri(String uri, int size, Callback failedCallback, Callback successCallback) {
        try {
            Bitmap bitmap = CameraXImageUtil.getBitmap(this.getBinaryImage(uri));
            Bitmap reducedBitmap = CameraXImageUtil.resizeBitmap(bitmap,size);
            byte[] byteImage = CameraXImageUtil.getBytesImage(reducedBitmap);
            successCallback.invoke(this.getStoredImageUri(byteImage).toString());
        }catch(Exception e) {
            failedCallback.invoke("error");
        }
    }




    //
    private Uri getStoredImageUri(byte[] data) throws Exception {
        MediaUtil mediaUtil = new MediaUtil(this.reactContext);
        Uri targetUri = mediaUtil.storeToGallery("parts");
        FileOutputStream out = mediaUtil.getFileOutputStream(targetUri);
        out.write(data);
        out.flush();
        return targetUri;
    }


    private byte[] getCutImage(String uri,int sourceHeight, int sourceWidth, int targetHeight, int targetWidth, int targetLeft, int targetTop) throws Exception {
        Bitmap bitmap = CameraXImageUtil.getBitmap(this.getBinaryImage(uri));
        int heightBitmap = bitmap.getHeight();
        int widthBitmap = bitmap.getWidth();

        int widthFinal = targetWidth*widthBitmap/sourceWidth;
        int heightFinal = targetHeight*heightBitmap/sourceHeight;
        int leftFinal = targetLeft*widthBitmap/sourceWidth;
        int topFinal = targetTop*heightBitmap/sourceHeight;

        Bitmap bitmapFinal = Bitmap.createBitmap(bitmap,leftFinal,topFinal,widthFinal,heightFinal);

        return CameraXImageUtil.getBytesImage(bitmapFinal);
    }

    private byte[] getBinaryImage(String uri) throws Exception {
        MediaUtil media = new MediaUtil(reactContext);
        FileInputStream in = media.getFileInputStream(Uri.parse(uri));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] data = new byte[1024*8];
        int size;
        while((size=in.read(data))!=-1) {
            out.write(data,0,size);
            out.flush();
        }
        return out.toByteArray();
    }
}