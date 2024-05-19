package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.dtos.CouponDTO;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.CouponServiceImpl;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class CouponController {

	@Autowired
	private CouponServiceImpl couponService;

	@PostMapping("/admin/create-new-coupon")
	public ResponseData<?> createNewCoupon(@Valid @RequestBody CouponDTO coupon) {
		try {
			log.info("Create new coupon");
			return new ResponseData<>(HttpStatus.CREATED.value(), "Create new coupon success.",
					couponService.save(coupon));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}
	
	@PostMapping("/admin/update-coupon")
	public ResponseData<?> updateCoupon(@Valid @RequestBody CouponDTO coupon) {
		try {
			log.info("Update coupon");
			return new ResponseData<>(HttpStatus.OK.value(), "Update coupon success.",
					couponService.update(coupon));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}

	@GetMapping("/admin/get-all-coupons")
	public ResponseData<?> getAllCoupons(@RequestParam(value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
		try {
			log.info("Get all coupons page {}", pageNo);
			return new ResponseData<>(HttpStatus.OK.value(), "Get all coupons page " + pageNo,
					couponService.getAllCoupons(pageNo, pageSize));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}

	@GetMapping("/admin/get-one-coupon/{name}")
	public ResponseData<?> getOneCoupon(@PathVariable("name") String name) {
		try {
			log.info("Get coupon {}", name);
			return new ResponseData<>(HttpStatus.OK.value(), "Get coupon " + name, couponService.getOneCoupon(name));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}

	@GetMapping("/book/get-coupon-valid")
	public ResponseData<?> getValidCoupon() {
		try {
			log.info("Get valid coupon");
			return new ResponseData<>(HttpStatus.OK.value(), "Get valid coupon", couponService.findCouponsValid());
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}
	
	@GetMapping("/user/check-used-coupon")
	public ResponseData<?> checkUsedCoupon(
			@RequestHeader("Authorization") String token, 
			@RequestParam("coupon") String coupon,
			@RequestParam("totalPrice") double totalPrice) {
		try {
			log.info("Check used coupon.");
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Check used coupon.",
					couponService.checkValidCoupon(coupon, jwtToken, totalPrice));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.toString());
		}
	}
}
