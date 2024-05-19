package com.java.bookstore.exceptions;

public class InvalidTokenException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public InvalidTokenException(String mess) {
		super(mess);
	}
}
