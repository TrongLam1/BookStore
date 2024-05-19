package com.java.bookstore.entities;

import java.time.LocalDate;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class CouponEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Setter(value = AccessLevel.NONE)
	private Long id;
	
	@CreationTimestamp
	@Setter(value = AccessLevel.NONE)
	private Date createdDate;
	
	@LastModifiedDate
	@Setter(value = AccessLevel.NONE)
	private Date modifiedDate;
	
	private String name;
	
	@NotNull
	@Min(value = 0, message = "Số lượng không được < 0.")
	private int quantity;
	
	@NotNull
	@Min(value = 1000, message = "Giá trị coupon không được < 1000.")
	private int valueCoupon;
	
	@NotNull
	@Min(value = 1000, message = "Điều kiện đơn hàng áp dụng coupon không được < 1000.")
	private int conditionCoupon;
	
	@JsonFormat(pattern = "HH:mm yyyy-MM-dd")
	private LocalDate expiredDate;
	
	public boolean isValidCoupon() {
		if (expiredDate == null) {
			return true;
		}
		return LocalDate.now().isBefore(expiredDate);
	}
}
