package com.sesac.solbid.service;

import com.sesac.solbid.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final ProductImageService productImageService;

//    @Transactional
//    public void registerProduct(ProductRegisterDto dto, List<MultipartFile> files) throws IOException {
//        // TODO : 더미 유저 생성
//        User user = new User();
//
//        // 상품 먼저 생성
//        Product product = dto.createEntity(user);
//
//        // 이후 이미지 저장 및 생성
//        int sort = 0;
//        for (MultipartFile file : files) {
//            String filePath = productImageService.upload(file);
//            String fileName = file.getOriginalFilename();
//
//            ProductImage productImage = ProductImage.builder()
//                    .filePath(filePath)
//                    .fileName(fileName)
//                    .sortOrder(sort)
//                    .isThumbnail(sort == 0)
//                    .product(product)
//                    .build();
//
//            // 이미지 저장
//            productImageService.save(productImage);
//            // product.getProductImages().add(productImage);
//
//            sort++;
//        }
//
//        // 상품 저장
//        productRepository.save(product);
//    }
}
