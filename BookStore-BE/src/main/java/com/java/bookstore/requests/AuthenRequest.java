package com.java.bookstore.requests;

import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthenRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 386569114807607012L;

	@Email(message = "Enter email")
	@NotBlank(message = "Email is mandatory.")
	private String email;
	
	@NotBlank(message = "Enter password")
	private String password;
}
