package com.java.bookstore.dtos;

import java.io.Serializable;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 8726325628682976991L;

	private Long id;

	private String email;
	
	private String userName;
	
	private String phone;
	
	private boolean isAccountLocked;
	
	private Set<String> listCouponsUsed;
}
