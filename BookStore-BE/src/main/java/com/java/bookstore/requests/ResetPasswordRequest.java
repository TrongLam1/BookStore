package com.java.bookstore.requests;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -1513279297509877582L;

	@NotBlank
	private String otp;
	
	@NotBlank
	private String email;
	
	@NotBlank
	private String newpass;
}
