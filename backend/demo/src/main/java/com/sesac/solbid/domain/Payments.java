package com.sesac.solbid.domain;
import com.sesac.solbid.domain.User;
import com.sesac.solbid.domain.baseentity.BaseEntity;
import com.sesac.solbid.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payments")
public class Payments extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id", length = 50, nullable = false)
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "payments")
    private List<PointTransaction> pointTransaction = new ArrayList<>();

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "payment_method", length = 20, nullable = false)
    private String paymentMethod;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @ColumnDefault("0")
    @Column(name = "converted_point", nullable = false)
    private int convertedPoint;

    @Column(name = "is_charged", nullable = false)
    @ColumnDefault("false")
    private Boolean isCharged;

    private LocalDateTime requestedAt;

    private LocalDateTime confirmedAt;
}