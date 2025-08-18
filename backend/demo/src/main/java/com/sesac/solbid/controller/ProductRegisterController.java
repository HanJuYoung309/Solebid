package com.sesac.solbid.controller;

import com.sesac.solbid.dto.ProductRegisterDto;
import com.sesac.solbid.exception.CustomException;
import com.sesac.solbid.exception.ErrorCode;
import com.sesac.solbid.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProductRegisterController {
    private final ProductService productService;

    @PostMapping("/api/productRegister")
    public ResponseEntity<Map<String,Object>> productRegister(
            @RequestPart List<MultipartFile> files,
            @RequestPart ProductRegisterDto dto)
    {
        try {
            productService.registerProduct(dto, files);
            System.out.println("success");
            return ResponseEntity.ok(Map.of("success", true));
        } catch (IOException e) {
            throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}
