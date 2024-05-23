package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.ShoppingCartServiceImpl;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/shopping-cart")
@Slf4j
public class ShoppingCartController {

	@Autowired
	private ShoppingCartServiceImpl shoppingCartService;

	@PostMapping("/add-book/{productId}/{quantity}")
	public ResponseData<?> addBookToCart(@RequestHeader("Authorization") String token,
			@PathVariable("productId") long productId, @PathVariable("quantity") int quantity) {
		try {
			log.info("Add book {} to cart quantity {}", productId, quantity);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Add success",
					shoppingCartService.addProductToCart(productId, quantity, jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PutMapping("/update-quantity/{productId}/{quantity}")
	public ResponseData<?> updateQuantityBook(@RequestHeader("Authorization") String token,
			@PathVariable("productId") long productId, @PathVariable("quantity") int quantity) {
		try {
			log.info("Update quantity {} book {}", quantity, productId);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Quantity " + quantity,
					shoppingCartService.updateQuantityProduct(productId, jwtToken, quantity));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-cart")
	public ResponseData<?> getCartFromUser(@RequestHeader("Authorization") String token) {
		try {
			log.info("Get cart");
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success.",
					shoppingCartService.getCartFromUser(jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}

	}

	@DeleteMapping("/remove-book/{productId}")
	public ResponseData<?> removeBookFromCart(@RequestHeader("Authorization") String token,
			@PathVariable("productId") long id) {
		try {
			log.info("Remove book {} from cart.", id);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), shoppingCartService.removeProductFromCart(id, jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}

	}

	@GetMapping("/get-cart-items")
	public ResponseData<?> getCartItemsFromUser(@RequestHeader("Authorization") String token) {
		try {
			log.info("Get cart items.");
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success", shoppingCartService.getCartItems(jwtToken));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}

	}
}
