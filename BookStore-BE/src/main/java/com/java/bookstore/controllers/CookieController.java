package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.CookieServiceImpl;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/cookie")
@Slf4j
public class CookieController {

	@Autowired
	private CookieServiceImpl cookieService;
		
	@GetMapping("/check-existed-cookie")
	public ResponseData<?> checkExistedCookie(HttpServletRequest request) {
		try {
			log.info("Check cookie.");
			return new ResponseData<>(HttpStatus.OK.value(), "Check cookie",
					cookieService.checkExistedCookie(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-shopping-cart")
	public ResponseData<?> getShoppingCartFromCookie(HttpServletRequest request, HttpServletResponse response) {
		try {
			log.info("Get shopping cart from cookie.");
			return new ResponseData<>(HttpStatus.OK.value(), "Get shopping cart cookie",
					cookieService.getShoppingCartFromCookie(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-cart")
	public ResponseData<?> getCartFromCookie(HttpServletRequest request) {
		try {
			log.info("Get cart from cookie.");
			return new ResponseData<>(HttpStatus.OK.value(), "Get cart cookie",
					cookieService.getCartItemsCookie(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PostMapping("/add-product")
	public ResponseData<?> addProduct(@RequestParam("productId") Long productId, @RequestParam("quantity") int quantity,
			HttpServletRequest request, HttpServletResponse response) {
		try {
			log.info("Add product cookie");
			Cookie cart = cookieService.addProductToCartCookie(productId, quantity, request);
			response.addCookie(cart);
			return new ResponseData<>(HttpStatus.OK.value(), "Success");
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
	
	@PutMapping("/update-quantity/{productId}/{quantity}")
	public ResponseData<?> updateQuantityFromCookie(@PathVariable("productId") Long productId, @PathVariable("quantity") int quantity, 
			HttpServletRequest request, HttpServletResponse response) {
		try {
			log.info("Update quantity product cookie");
			Cookie cart = cookieService.updateQuantityProductCookie(productId, quantity, request);
			response.addCookie(cart);
			return new ResponseData<>(HttpStatus.OK.value(), "Update cookie success");
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/remove-product")
	public ResponseData<?> removeProduct(@RequestParam("productId") Long productId, HttpServletRequest request,
			HttpServletResponse response) {
		try {
			log.info("Remove product cookie");
			Cookie cart = cookieService.removeProductFromCartCookie(productId, request);
			response.addCookie(cart);
			return new ResponseData<>(HttpStatus.OK.value(), "Remove success.");
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
	
	@PostMapping("/move-book-from-cookie-to-carts")
	public ResponseData<?> moveBookFromCookieToCarts(@RequestHeader("Authorization") String token, 
			HttpServletRequest request, HttpServletResponse response) {
		try {
			log.info("Move cart items from cookie.");
			String jwtToken = token.substring(7);
			String result = cookieService.addProductFromCookieToCart(jwtToken, request);
			Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if (cookie.getName().equals("cart")) { 
                        cookie.setMaxAge(0); 
                        cookie.setPath("/"); 
                        response.addCookie(cookie);
                        break; 
                    }
                }
            }
			return new ResponseData<>(HttpStatus.OK.value(), "Move success", result);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
}
