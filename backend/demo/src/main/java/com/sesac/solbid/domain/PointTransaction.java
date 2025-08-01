package com.sesac.solbid.domain;
import com.sesac.solbid.domain.enums.TransEnum;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "point_transaction")
public class PointTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private TransEnum transEnum;

    @Column(unique = true, nullable = false)
    private BigDecimal balanceAfter;

    @Column(length = 225)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payments payments;

    @Column(unique = true, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "point", nullable = false)
    private int point;
}