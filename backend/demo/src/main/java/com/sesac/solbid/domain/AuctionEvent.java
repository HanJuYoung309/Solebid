package com.sesac.solbid.domain;

import com.sesac.solbid.domain.baseentity.BaseEntity;
import com.sesac.solbid.domain.enums.EventEnum;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;

@Entity
@Table(name="auctionevent")
@Data
public class AuctionEvent  extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  auctionEventId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // 상품 ID

    @Column(name = "start_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal startPrice; // 시작가

    @Column(name = "buyout_price", precision = 15, scale = 2)
    private BigDecimal buyoutPrice; // 즉시 구매가

    @Enumerated(EnumType.STRING)
    private EventEnum eventType;

    @Column(name = "view_count", nullable = false)
    @ColumnDefault("0") // 기본값 0
    private Integer viewCount; // 조회수


    @Column(name = "is_blind", nullable = false)
    @ColumnDefault("false") // 기본값 FALSE
    private Boolean isBlind; // 블라인드 여부


}
