package com.java.bookstore.services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.requests.PlaceOrderRequest;
import com.java.bookstore.responses.PaginationResult;

public interface IOrderService {

	OrderDTO findById(Long id);
	Long placeOrder(String token, PlaceOrderRequest request, String coupon, int valueCoupon);
	String changeOrderStatus(Long orderId, String status);
	PaginationResult<OrderDTO> getOrders(String token, int pageNo, int pageSize);
	PaginationResult<OrderDTO> getAllOrders(int pageNo, int pageSize);
	PaginationResult<OrderDTO> findByOrderStatus(String status, int pageNo);
	OrderDTO getOneOrderFromUser(String token, long orderId);
	OrderDTO getLatestOrder(String token);
	OrderDTO adminGetOrder(Long orderId);
	HashMap<String, Long> countOrders();
	List<Object[]> getTotalPriceInDateRange(Date startDate, Date endDate);
	List<Object[]> getTotalPriceByMonthInYear(int year);
}
