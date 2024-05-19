package com.java.bookstore.dtos;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MailDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8806074845302642276L;
	private String subject;
	private String message;
}
