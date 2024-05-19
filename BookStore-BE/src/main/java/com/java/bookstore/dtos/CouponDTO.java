package com.java.bookstore.dtos;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6766198533876263757L;

	private Long id;

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
	private Date createdDate;

	@NotBlank(message = "Không được để trống.")
	private String name;

	@NotNull(message = "Không được để trống.")
	@Min(value = 0, message = "Số lượng không được < 0.")
	private int quantity;

	@NotNull(message = "Không được để trống.")
	@Min(value = 1000, message = "Giá trị coupon không được < 1000.")
	private int valueCoupon;
	
	@NotNull(message = "Không được để trống.")
	@Min(value = 1000, message = "Điều kiện đơn hàng áp dụng coupon không được < 1000.")
	private int conditionCoupon;

	@NotBlank(message = "Không được để trống.")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
	private String expiredDate;
}
