package com.whereparts.util;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.util.Log;
import android.view.View;

import androidx.camera.core.ImageProxy;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;

public class CameraXImageUtil {

    //카메라 Prewview에 표시된 전체 이미지에 대한 바이트 배열
    public static byte[] getBytesImage(ImageProxy image) {
        ImageProxy.PlaneProxy planeProxy = image.getPlanes()[0];
        ByteBuffer buffer = planeProxy.getBuffer();
        buffer.rewind();
        byte[] data = new byte[buffer.remaining()];
        buffer.get(data);
        return data;
    }

    //Bitmap을 바이트 배열로
    public static byte[] getBytesImage(Bitmap bitmap) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG,100,out);
        return out.toByteArray();
    }

    //카메라로 찍은 전체 이미지에 대한 Bitmap (사진 방향에 따라 rotate 바꾸고, 1/4사이즈로 줄여서 가져오는것 포함)
    public static Bitmap getBitmap(ImageProxy image, int sampleSize) {
        byte[] data = getBytesImage(image);
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize=sampleSize; // 비트맵에서 사진을 가져올 때 1/sampleSize 설정
        return rotateBitmap(BitmapFactory.decodeByteArray(data,0,data.length,options),image.getImageInfo().getRotationDegrees());
    }

    //오버로딩
    public static Bitmap getBitmap(ImageProxy image) {
        return getBitmap(image,1);
    }


    //카메라로 찍은 전체 이미지(source)에서 target 뷰 만큼 이미지 자르기
    public static Bitmap getBitmap(ImageProxy image, View source, View target, int sampleSize) {
        int heightSource = source.getHeight();
        int widthSource = source.getWidth();
        int heightTarget = target.getHeight();
        int widthTarget = target.getWidth();
        int leftTarget = target.getLeft();
        int topTarget = target.getTop();

        Log.d("CameraPreView","roate = "+image.getImageInfo().getRotationDegrees());

        Bitmap bitmap = getBitmap(image,sampleSize);
        //ByteArrayOutputStream out = new ByteArrayOutputStream();
        //bitmap.compress(Bitmap.CompressFormat.JPEG,100,out);
        //byte[] data = out.toByteArray();
        //Log.d("CameraPreView","origin size="+data.length);

        int heightBitmap = bitmap.getHeight();
        int widthBitmap = bitmap.getWidth();

        //target이 위치한 좌표(left,top,width,height)는 비트맵으로 보면 어디에 위치하느냐...
        //ex: 좌표 left 구하는 방법 : 1080:42=756:x --> (source의 가로 크기:target의 left좌표=비트맵의 가로길이:비트맵으로 볼때 어디에 위치하는가?)
        //ex: 세로길이 구하는 방법 : 1884:656=1008:x --> (source의 세로 길이:target의 세로길이=비트앱의 세로길이:비트맵으로 볼때 크기는 얼마인가?)
        int widthFinal = widthTarget*widthBitmap/widthSource;
        int heightFinal = heightTarget*heightBitmap/heightSource;
        int leftFinal = leftTarget*widthBitmap/widthSource;
        int topFinal = topTarget*heightBitmap/heightSource;

        Log.d("CameraPreView","bitmap width="+widthBitmap);
        Log.d("CameraPreView","bitmap height="+heightBitmap);

        Log.d("CameraPreView","source width="+widthSource);
        Log.d("CameraPreView","source height="+heightSource);

        Log.d("CameraPreView","target left="+leftTarget);
        Log.d("CameraPreView","target top="+topTarget);
        Log.d("CameraPreView","target width="+widthTarget);
        Log.d("CameraPreView","target height="+heightTarget);

        Bitmap bitmapFinal = Bitmap.createBitmap(bitmap,leftFinal,topFinal,widthFinal,heightFinal);
        return bitmapFinal;
    }

    //오버로딩
    public static Bitmap getBitmap(ImageProxy image, View source, View target) {
        return getBitmap(image,source,target,1);
    }

    //angle에 따라 사진 rotate angle는 90,180,270....
    public static Bitmap rotateBitmap(Bitmap source, int angle) {
        Matrix matrix = new Matrix();
        matrix.postRotate(angle);
        return Bitmap.createBitmap(source, 0, 0, source.getWidth(), source.getHeight(), matrix, true);
    }


    //sampleSize에 따라 사진 축소...1/sampleSize 로...
    public static Bitmap resizeBitmap(Bitmap source, int sampleSize) {
        byte[] data = getBytesImage(source);
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize=sampleSize;
        return BitmapFactory.decodeByteArray(data,0,data.length,options);
    }

    public static Bitmap getBitmap(byte[] data) {
        return BitmapFactory.decodeByteArray(data,0,data.length);
    }
}