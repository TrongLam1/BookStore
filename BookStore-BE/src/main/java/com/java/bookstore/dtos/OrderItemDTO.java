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
public class OrderItemDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 482664827978474349L;

	private Long id;

	private int quantity;

	private double totalPrice;
	
	private double currentPrice;
	
	private BookDTO book;
}
