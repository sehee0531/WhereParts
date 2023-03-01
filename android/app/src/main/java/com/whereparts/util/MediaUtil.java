package com.whereparts.util;

import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.ImageDecoder;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.UUID;

public class MediaUtil {
    private Context context;

    public MediaUtil(Context context) {
        this.context=context;
    }

    //카메라 Activity 호출 후 저장된 이미지의 Uri를 리턴
    public Uri goCamera(ActivityResultLauncher<Intent> launcher) {
        Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        File imageFile = null;
        Uri imageUri=null;
        try {
            imageFile = File.createTempFile("IMAGE_",".jpg");
        }catch(Exception e) {}
        if(imageFile!=null){
            String[] filenames = imageFile.getAbsolutePath().split("/");
            imageUri = this.storeToGallery("my_album",filenames[filenames.length-1]);
            cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT,imageUri);
            launcher.launch(cameraIntent);
        }
        return imageUri;
    }

    //Gallery 액티비티 호출 후 결과를 launcher에 돌려줌 (파라메터 launcher는 이 메소드를 호출하는 곳에 정의되어 있음)
    public void goGallery(ActivityResultLauncher<Intent> launcher) {
        Intent galleryIntent = new Intent(Intent.ACTION_PICK);
        galleryIntent.setType(MediaStore.Images.Media.CONTENT_TYPE);
        launcher.launch(galleryIntent);
    }

    //Uri로부터 비트맵 이미지 얻기
    public Bitmap getBitmap(Uri uri) {
        Bitmap bitmap = null;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                bitmap=ImageDecoder.decodeBitmap(ImageDecoder.createSource(context.getContentResolver(), uri));
            }
            else
                bitmap = MediaStore.Images.Media.getBitmap(context.getContentResolver(),uri);
        }catch (Exception e) {}
        return bitmap;
    }

    //지정한 이미지 Uri로부터 FileInputStream 가져옴
    public FileInputStream getFileInputStream(Uri uri) {
        FileInputStream in = null;
        try {
            ParcelFileDescriptor fileDescriptor = context.getContentResolver().openFileDescriptor(uri, "r");
            in = new FileInputStream(fileDescriptor.getFileDescriptor());
        }catch(Exception e) {return null;}
        return in;
    }

    //지정한 이미지 Uri로 FileOutputStream 가져옴. 여기서 uri는 갤러리에 저장할 이미지의 uri, 이 클래스의 storeToGallery()메서드를 호출하고 난 후 리턴받는 값.
    public FileOutputStream getFileOutputStream(Uri uri) {
        FileOutputStream out = null;
        try {
            ParcelFileDescriptor fileDescriptor = context.getContentResolver().openFileDescriptor(uri, "w");
            out = new FileOutputStream(fileDescriptor.getFileDescriptor());
        }catch(Exception e) {return null;}
        return out;
    }

    //갤러리에 저장된 모든 이미지에 대한 URI 얻어옴
    public ArrayList<Uri> getImageContentUris() {
        Uri sourceUris=MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL);

        String[] photoProjection = {MediaStore.Images.Media._ID,MediaStore.Images.Media.DISPLAY_NAME,MediaStore.Images.Media.DATA};
        Cursor cursor = context.getContentResolver().query(sourceUris,photoProjection,null,null,null);

        ArrayList<Uri> albumList = new ArrayList<Uri>(); // Files에서 가져온 모든 데이터들의 content uri를 저장
        while(cursor.moveToNext()) {
            Uri photoUri = Uri.withAppendedPath(sourceUris,cursor.getString(0));
            //Log.d("Media Util", "files-content-uri : " + photoUri+":::::"+cursor.getString(1)+"::::"+cursor.getString(2));
            albumList.add(photoUri);
        }
        return albumList;
    }

    //카메라로 찍은 사진을 공용 갤러리의 지정한 폴더와 지정한 파일이름으로 저장
    public Uri storeToGallery(String folder, String filename) {
        Uri targetUri= MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL); // 갤러리에 복사하기 위한 content uri

        ContentValues values=new ContentValues();
        values.put(MediaStore.Images.Media.DISPLAY_NAME,filename);
        values.put(MediaStore.Images.Media.MIME_TYPE,"image/jpeg");

        if(Build.VERSION.SDK_INT<29) {
            File newFolder = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES) + File.separator + folder);
            if (newFolder.exists() == false)
                newFolder.mkdir();

            String location = newFolder + File.separator + filename;
            values.put(MediaStore.Images.Media.DATA, location);
        }else {
            //api 29 이상
            values.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/"+folder);
            //values.put(MediaStore.Images.Media.IS_PENDING,0);
        }
        Uri insertedUri = context.getContentResolver().insert(targetUri, values);

        Log.d("CarCenter", "inserted -content-uri : " + insertedUri);
        return insertedUri;
    }

    public Uri storeToGallery(String folder) {
        String filename= UUID.randomUUID().toString();
        return this.storeToGallery(folder,filename);
    }

    public void deleteImageFromGallery(Uri targetUri) {
        this.context.getContentResolver().delete(targetUri,null,null);
    }

    //선택한 이미지를 갤러리 폴더로 복사. 복사할 이미지의 URI와 저장할 갤러리의 폴더이름
    public void copyToGallery(Uri sourceUri, String folder) {
        Cursor cursor=this.getImageContentCursor(sourceUri);

        String filename = cursor.getString(1);
        Uri targetUri=this.storeToGallery(folder,filename);

        try {
            FileInputStream sourceFile = this.getFileInputStream(sourceUri);
            FileOutputStream targetFile = this.getFileOutputStream(targetUri);

            byte[] data = new byte[1024];
            int size;

            while((size=sourceFile.read(data))>0) {
                targetFile.write(data,0,size);
                targetFile.flush();
            }
            sourceFile.close();
            targetFile.close();

        }catch(Exception e) {}
    }

    //앱별 내부저장소에 이미지 파일 저장(갤러리에서 Uri를 가져와서 같은 파일이름으로 앱별 내부저장소에 저장)
    public void copyToAppInternal(Uri sourceUri) {
        Cursor cursor=this.getImageContentCursor(sourceUri);
        String filename = cursor.getString(1);
        try {
            FileInputStream sourceFile = this.getFileInputStream(sourceUri);
            FileOutputStream targetFile = context.openFileOutput(filename, Context.MODE_PRIVATE); // 이 부분이 앱별 내장 메모리에 저장하는 스트림 얻어옴
            byte[] data = new byte[1024];
            int size;

            while((size=sourceFile.read(data))>0) {
                targetFile.write(data,0,size);
                targetFile.flush();
            }
            sourceFile.close();
            targetFile.close();

        }catch(Exception e) {}
    }

    //앱별 외부저장소에 이미지 파일 저장(갤러리에서 Uri를 가져와서 같은 파일이름으로 앱별 외부저장소에 저장)
    public void copyToAppExternal(Uri sourceUri) {
        if(Environment.getExternalStorageState()!=Environment.MEDIA_MOUNTED) //외부 저장소를 사용할 수 없으면...
            return;

        Cursor cursor=this.getImageContentCursor(sourceUri);
        String filename = cursor.getString(1);

        try {
            FileInputStream sourceFile = this.getFileInputStream(sourceUri);
            FileOutputStream targetFile = new FileOutputStream(new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES),filename)); // 이 부분이 앱별 외장 메모리에 저장하는 스트림 얻어옴

            byte[] data = new byte[1024];
            int size;

            while((size=sourceFile.read(data))>0) {
                targetFile.write(data,0,size);
                targetFile.flush();
            }
            sourceFile.close();
            targetFile.close();

        }catch(Exception e) {}
    }

    //앱별 내부저장소에 있는 모든 파일을 가져옴
    public ArrayList<File> getAppInternalFiles() {
        String [] filenames = context.fileList();
        ArrayList<File> list = new ArrayList<>();
        for(String filename : filenames) {
            list.add(new File(context.getFilesDir(),filename));
            Log.d("Media Util", "internal filename : " + filename);
        }
        return list;
    }

    //앱별 외부저장소에 있는 모든 사진 파일을 가져옴
    private ArrayList<File> getAppExternalFiles() {
        File [] files = context.getExternalFilesDirs(Environment.DIRECTORY_PICTURES);
        File imageFolder = files[0];
        ArrayList<File> list = new ArrayList<>();
        String[] filenames = imageFolder.list();
        for(String filename : filenames) {
            list.add(new File(context.getExternalFilesDir(Environment.DIRECTORY_PICTURES),filename));
            Log.d("Media Util", "extrenal filename : " + filename);
        }
        return list;
    }

    //선택한 이미지 파일에 대한 정보(ID, DISPLAY_NAME등)를 얻기위한 Cursor 얻어옴
    private Cursor getImageContentCursor(Uri uri) {
        String imageColumns[]={MediaStore.Images.Media._ID,MediaStore.Images.Media.DISPLAY_NAME,MediaStore.Images.Media.DATA};
        Cursor cursor = context.getContentResolver().query(uri,imageColumns,null,null,null);
        cursor.moveToNext();
        return cursor;
    }
}