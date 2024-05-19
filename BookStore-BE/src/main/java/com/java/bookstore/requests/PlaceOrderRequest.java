package com.java.bookstore.requests;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PlaceOrderRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8103805635964576302L;

	@NotBlank
	private String username;
	
	@NotBlank
	private String phone;
	
	@NotBlank
	private String address;
	
	@NotBlank
	private String paymentMethod;
}
