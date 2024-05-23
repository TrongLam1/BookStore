package com.java.bookstore.services;

import java.util.Set;

import com.java.bookstore.dtos.CartItemDTO;
import com.java.bookstore.dtos.ShoppingCartDTO;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public interface ICookieService {

	boolean checkExistedCookie(HttpServletRequest request);
	String addProductFromCookieToCart(String token, HttpServletRequest request);
	ShoppingCartDTO getShoppingCartFromCookie(HttpServletRequest request);
	Cookie addProductToCartCookie(Long productId, int quantity, HttpServletRequest request);
	Cookie removeProductFromCartCookie(Long productId, HttpServletRequest request);
	Set<CartItemDTO> getCartItemsCookie(HttpServletRequest request);
	Cookie updateQuantityProductCookie(Long productId, int quantity, HttpServletRequest request);
}
