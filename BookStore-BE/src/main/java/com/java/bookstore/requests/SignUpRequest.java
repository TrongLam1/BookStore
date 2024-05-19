package com.java.bookstore.requests;

import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5744268003014495529L;

	@Email
	@NotBlank(message = "Email is mandatory.")
	private String email;
	
	@NotBlank(message = "Password is mandatory.")
	private String password;
}
