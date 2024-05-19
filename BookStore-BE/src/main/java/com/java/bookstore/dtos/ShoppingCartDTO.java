package com.java.bookstore.dtos;

import java.io.Serializable;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCartDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -5849459266961107990L;

	private Long id;

	private double totalPrice;

	private int totalItems;
	
	private UserDTO user;
	
	private Set<CartItemDTO> cartItems;
}
