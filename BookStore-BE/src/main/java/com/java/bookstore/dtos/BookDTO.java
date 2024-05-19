package com.java.bookstore.dtos;

import java.io.Serializable;

import com.java.bookstore.entities.BookStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class BookDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7447455868577845953L;

	private Long id;

	@NotBlank(message = "Book's name is mandatory")
	private String name;

	@NotBlank(message = "Book's category is mandatory")
	private String category;
	
	@NotBlank(message = "Book's type is mandatory")
	private String type;

	@NotBlank(message = "Book's branch is mandatory")
	private String branch;

	private String description;

	@Min(value = 0)
	@NotNull
	private Integer price;

	@Min(value = 0)
	private int sale;

	@Min(value = 0)
	private double salePrice;

	@Min(value = 0)
	private int inventory_quantity;

	private String image_url;
	
	private String image_id;

	private BookStatus status;
	
	private double rating;
}
