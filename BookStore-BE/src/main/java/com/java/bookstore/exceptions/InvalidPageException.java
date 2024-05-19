package com.java.bookstore.exceptions;

public class InvalidPageException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public InvalidPageException(String mess) {
		super(mess);
	}
}
