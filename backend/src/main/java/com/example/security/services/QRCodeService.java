package com.example.security.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QRCodeService {

    public String generateQRCodeImageBase64(String barcodeText) throws WriterException, IOException {
        QRCodeWriter barcodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 200, 200);

        BufferedImage image = MatrixToImageWriter.toBufferedImage(bitMatrix);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", pngOutputStream);

        return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngOutputStream.toByteArray());
    }
}
