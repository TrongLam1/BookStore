package com.java.bookstore.dtos;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 150677617299274588L;

	private Long id;
	
	private int quantity;

	private double totalPrice;
	
	private BookDTO book;
}
