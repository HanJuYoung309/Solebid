package com.sesac.solbid.domain;

import com.sesac.solbid.domain.baseentity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bid")
@Data
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bidId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_event_id", nullable = false)
    private AuctionEvent auctionEvent; // 경매 이벤트 ID

    @Column(unique = true, nullable = false)
    private Long bidderId;

    @Column(unique = true, nullable = false)
    private BigDecimal bidAmount;

    @ColumnDefault("false")
    @Column(unique = true, nullable = false)
    private Boolean isWinning;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder; // 입찰자 ID

    private LocalDateTime bidTime;

}
