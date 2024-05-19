package com.java.bookstore.controllers;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.java.bookstore.services.impl.VnPayServiceImpl;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/payment")
public class VnPayController {

	@Autowired
	private VnPayServiceImpl vnPayService;

	@GetMapping("/create_payment")
	public String createPayment(@RequestParam("orderId") long orderId, @RequestParam("orderInfo") String orderInfo,
			HttpServletRequest req) throws UnsupportedEncodingException {
		String url = vnPayService.paymentVnPay(orderId, orderInfo, req);
		return url;
	}

	@GetMapping("/confirm-payment")
	public RedirectView paymentReturn(HttpServletRequest req) {
		int paymentStatus = vnPayService.paymentReturn(req);
		if (paymentStatus == 1) {
			return new RedirectView("http://localhost:3000/payment/success");
		}
		return null;
	}
}
