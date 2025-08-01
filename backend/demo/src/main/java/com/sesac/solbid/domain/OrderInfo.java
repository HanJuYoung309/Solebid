package com.sesac.solbid.domain;

import com.sesac.solbid.domain.enums.DeliveryStatus;
import com.sesac.solbid.domain.enums.PaymentStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_info")
public class OrderInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    // private Long auctionEventId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_event_id")
    private AuctionEvent auctionEventId;

    // private Long winnerId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id")
    private User winner;

    // private Long sellerId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @Column(name = "final_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 50)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status", nullable = false, length = 50)
    private DeliveryStatus deliveryStatus;

    @Lob
    @Column(name = "delivery_address", nullable = false, length = 65535)
    private String deliveryAddress;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;
}
