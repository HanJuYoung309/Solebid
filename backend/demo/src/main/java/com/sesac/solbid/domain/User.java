package com.sesac.solbid.domain;

import com.sesac.solbid.domain.baseentity.BaseEntity;
import com.sesac.solbid.domain.enums.UserStatus;
import com.sesac.solbid.domain.enums.UserType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="user")
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(length = 100, unique = true, nullable = false)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(length = 50, unique = true, nullable = false)
    private String nickname;

    @Column(length = 50)
    private String name;

    @Column(length = 20, unique = true, nullable = true)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserType userType;

    @Column(unique = true, nullable = false)
    private BigDecimal temperature;

    @Column(nullable = false)
    @ColumnDefault("0")
    private BigDecimal point;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private UserStatus userStatus;

    //== 연관관계 편의 메서드 ==//
    @OneToMany(mappedBy = "user")
    private List<SocialLogin> socialLogins = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<PointTransaction> pointTransactions = new ArrayList<>();
    @OneToMany(mappedBy = "seller")
    private List<Product> products = new ArrayList<>();
    @OneToMany(mappedBy = "bidder")
    private List<Bid> bids = new ArrayList<>();
    @OneToMany(mappedBy = "winner")
    private List<OrderInfo> winnerOrders = new ArrayList<>();
    @OneToMany(mappedBy = "seller")
    private List<OrderInfo> sellerOrders = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<WishList> wishlists = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Notification> notifications = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Carts> carts = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Payments> payments = new ArrayList<>();



}
