package com.sesac.solbid.domain;

import com.sesac.solbid.domain.baseentity.BaseEntity;
import com.sesac.solbid.domain.enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name="product")
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    //이 상품을 등록한 판매자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    //이 상품과 join된 상품 이미지들
    @OneToMany(mappedBy = "product", orphanRemoval = true)
    private List<ProductImage> productImages = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    List<WishList> wishLists = new ArrayList<>();

    //상품 카테고리(운동화, 농구화...)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory productCategory;

    //상품 상태(경매중, 품절...)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus productStatus = ProductStatus.AVAILABLE;

    //상품 컨디션(새 상품, 중고)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition productCondition;

    //상품 브랜드(나이키, 퓨마...)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductBrand productBrand;

    //상품 사이즈
    @Column(nullable = false)
    @Min(230)
    @Max(300)
    private int size;

    //상품 등록명
    @Column(nullable = false, length = 100)
    private String name;

    //상품 상세설명
    @Column(nullable = false, length = 1000)
    private String description;

    //상품 시작가
    @Column(nullable = false)
    @Min(0)
    private int startPrice;

    //즉시 판매가
    @Column(nullable = false)
    @Min(0)
    private int confirmationPrice;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    //상품 현재 입찰가
    @Column(nullable = true)
    @Min(0)
    private int currentPrice;

    @Builder
    public Product(String name, String brand, String category, String size, int startPrice,
                   int confirmationPrice, String startDate, String endDate, String condition,
                   String description, User seller)
    {
        this.name = name;
        this.productBrand = ProductBrand.from(brand);
        this.productCategory = ProductCategory.from(category);
        this.size = Integer.parseInt(size);
        this.startPrice = startPrice;
        this.confirmationPrice = confirmationPrice;
        this.startDate = LocalDate.parse(startDate);
        this.endDate = LocalDate.parse(endDate);
        this.productCondition = ProductCondition.from(condition);
        this.description = description;
        this.seller = seller;
    }
}
