package com.java.bookstore.exceptions;

public class InvalidCouponException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6834848221359367628L;

	public InvalidCouponException(String mess) {
		super(mess);
	}
}
