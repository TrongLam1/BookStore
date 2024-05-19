package com.java.bookstore.responses;

import java.io.Serializable;
import java.util.Date;

import com.java.bookstore.entities.Role;

import lombok.Data;

@Data
public class JwtAuthenticationResponse implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8423612549921956208L;

	private String token;
	
	private String refreshToken;

	private String name;
	
	private Date expiredTime;
	
	private Role role;
}
