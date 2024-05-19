package com.java.bookstore.responses;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseValidCoupon {

	private String message;
	
	private boolean statusValid;
}
