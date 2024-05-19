package com.java.bookstore.requests;

import java.io.Serializable;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class ChangePasswordRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@NotBlank(message = "oldPass không được để trống.")
	@Min(8)
	private String oldPass;
	
	@NotBlank(message = "newPass không được để trống.")
	@Min(8)
	private String newPass;
}
