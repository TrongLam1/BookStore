package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.java.bookstore.requests.PlaceOrderRequest;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.OrderServiceImpl;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/user")
@Slf4j
public class OrderController {

	@Autowired
	private OrderServiceImpl orderService;

	@PostMapping("/place-order")
	public ResponseData<?> placeOrder(@RequestHeader("Authorization") String token,
			@RequestBody PlaceOrderRequest request,
			@RequestParam(value = "valueCoupon", defaultValue = "0") int valueCoupon) {
		try {
			log.info("New order");
			String jwtToken = token.substring(7);
			request.setUsername(HtmlUtils.htmlEscape(request.getUsername()));
			request.setPhone(HtmlUtils.htmlEscape(request.getPhone()));
			request.setAddress(HtmlUtils.htmlEscape(request.getAddress()));
			request.setPaymentMethod(HtmlUtils.htmlEscape(request.getPaymentMethod()));
			return new ResponseData<>(HttpStatus.CREATED.value(), "Place order success",
					orderService.placeOrder(jwtToken, request, valueCoupon));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PutMapping("/update-order-status/{orderId}/{status}")
	public ResponseData<?> updateStatus(@RequestHeader("Authorization") String token,
			@PathVariable("orderId") long orderId, @PathVariable("status") String status) {
		try {
			log.info("Update order status: {}, {}", orderId, status);
			String escapeStatus = HtmlUtils.htmlEscape(status);
			return new ResponseData<>(HttpStatus.OK.value(), "Update success: " + status,
					orderService.changeOrderStatus(orderId, escapeStatus));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-list-orders")
	public ResponseData<?> getListOrdersFromUser(@RequestHeader("Authorization") String token,
			@RequestParam("pageNo") int pageNo, @RequestParam("pageSize") int pageSize) {
		try {
			log.info("List orders, {}", pageNo);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success",
					orderService.getOrders(jwtToken, pageNo, pageSize));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-order/{orderId}")
	public ResponseData<?> getOrder(@RequestHeader("Authorization") String token, @PathVariable("orderId") long id) {
		try {
			log.info("Get order {}", id);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Order " + id,
					orderService.getOneOrderFromUser(jwtToken, id));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-latest-order")
	public ResponseData<?> getLatestOrder(@RequestHeader("Authorization") String token) {
		try {
			log.info("Latest order");
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success", orderService.getLatestOrder(jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
}
