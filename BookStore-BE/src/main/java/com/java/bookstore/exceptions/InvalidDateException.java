package com.java.bookstore.exceptions;

public class InvalidDateException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8948551623788160321L;
	
	public InvalidDateException(String mess) {
		super(mess);
	}

}
