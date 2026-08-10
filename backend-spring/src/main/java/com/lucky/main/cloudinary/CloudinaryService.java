package com.lucky.main.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.lucky.main.exception.CloudinaryImageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    // Upload Image
    public Map<String, String> uploadImage(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new CloudinaryImageException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();

        String fileNameWithoutExtension = (originalFilename != null)
                ? originalFilename.replaceAll("\\.[^.]+$", "")
                : "image";

        String cleanFileName = fileNameWithoutExtension.replaceAll("[^a-zA-Z0-9]", "_");

        String uniqueFileName = cleanFileName + "_" + System.currentTimeMillis();

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "ecommerce/photos",
                            "resource_type", "image",
                            "public_id", uniqueFileName,
                            "quality", "auto",
                            "fetch_format", "auto"
                    )
            );

            return Map.of(
                    "url", (String) uploadResult.get("secure_url"),
                    "publicId", (String) uploadResult.get("public_id")
            );

        } catch (Exception e) {
            throw new CloudinaryImageException("Upload failed: " + e.getMessage());
        }
    }

    public void deleteImage(String publicId) {

        if (publicId == null || publicId.isBlank()) {
            throw new CloudinaryImageException("Public ID is required");
        }

        try {
            Map result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", "image")
            );

            String status = (String) result.get("result");

            if ("not found".equals(status)) {
                return; // already deleted
            }

            if (!"ok".equals(status)) {
                throw new CloudinaryImageException("Delete failed: " + status);
            }

        } catch (Exception e) {
            throw new CloudinaryImageException("Error deleting image: " + e.getMessage());
        }
    }
}