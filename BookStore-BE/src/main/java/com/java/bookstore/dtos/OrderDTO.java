package com.java.bookstore.dtos;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.java.bookstore.entities.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7706734629845945551L;

	private Long id;

	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
	private Date createdDate;

	private OrderStatus status;

	private String username;

	private String phone;

	private String address;

	private int orderAmt;

	private double totalPricesOrder;
	
	private String coupon;
	
	private int valueCoupon;

	private String paymentMethod;

	private String paymentStatus;

	private String paymentCode;

	@JsonFormat(pattern="yyyy-MM-dd HH:mm")
	private LocalDateTime paymentDate;
	
	private Set<OrderItemDTO> orderItems;
}
