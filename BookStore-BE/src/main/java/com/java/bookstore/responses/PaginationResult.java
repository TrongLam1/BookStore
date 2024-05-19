package com.java.bookstore.responses;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaginationResult<T> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 3985331280877346245L;

	private List<T> data;

	private int totalPages;

	private Long totalItems;
}
