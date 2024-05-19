package com.java.bookstore.services;

import java.util.List;

import com.java.bookstore.dtos.CouponDTO;
import com.java.bookstore.responses.PaginationResult;

public interface ICouponService {

	String save(CouponDTO coupon);
	String update(CouponDTO coupon);
	String updateQuantityCoupon(String name);
	CouponDTO getOneCoupon(String name);
	PaginationResult<CouponDTO> getAllCoupons(int pageNo, int pageSize);
	Integer checkValidCoupon(String coupon, String token, double totalPriceOrder);
	List<CouponDTO> findCouponsValid();
}
