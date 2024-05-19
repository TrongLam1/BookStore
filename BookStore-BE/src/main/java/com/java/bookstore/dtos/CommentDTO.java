package com.java.bookstore.dtos;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 4673148438866141904L;

	private Long id;

	@JsonFormat(pattern = "HH:mm yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
	private Date createdDate;

	private String content;

	private UserDTO user;

	private int rating;
}
