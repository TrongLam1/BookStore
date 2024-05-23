package com.java.bookstore.services;

import java.util.List;

import com.java.bookstore.dtos.CartItemDTO;
import com.java.bookstore.dtos.ShoppingCartDTO;

public interface IShoppingCartService {

	String addProductToCart(Long productId, int quantity, String token);
	String updateQuantityProduct(Long productId, String token, int quantity);
	String removeProductFromCart(Long productId, String token);
	ShoppingCartDTO getCartFromUser(String token);
	List<CartItemDTO> getCartItems(String token);
}
