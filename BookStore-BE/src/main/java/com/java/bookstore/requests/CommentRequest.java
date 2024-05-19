package com.java.bookstore.requests;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 573526177380550828L;

	private String content;
	
	private int rating;
}
