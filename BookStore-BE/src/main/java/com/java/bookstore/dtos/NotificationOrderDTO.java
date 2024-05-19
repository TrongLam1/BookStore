package com.java.bookstore.dtos;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NotificationOrderDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3862261622233743765L;
	
	private long orderId;
	private String time;
}
