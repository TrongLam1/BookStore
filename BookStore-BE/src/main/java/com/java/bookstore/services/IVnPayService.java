package com.java.bookstore.services;

import java.io.UnsupportedEncodingException;

import jakarta.servlet.http.HttpServletRequest;

public interface IVnPayService {

	String paymentVnPay(Long orderId, String orderInfo, HttpServletRequest req) throws UnsupportedEncodingException;
	int paymentReturn(HttpServletRequest request);
}
