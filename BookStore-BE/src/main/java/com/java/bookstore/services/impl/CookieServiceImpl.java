package com.java.bookstore.services.impl;

import java.util.Arrays;
import java.util.Base64;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.dtos.CartItemDTO;
import com.java.bookstore.dtos.ShoppingCartDTO;
import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.BookStatus;
import com.java.bookstore.entities.CartItemEntity;
import com.java.bookstore.entities.ShoppingCartEntity;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CartItemRepository;
import com.java.bookstore.repositories.ShoppingCartRepository;
import com.java.bookstore.services.ICookieService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class CookieServiceImpl implements ICookieService {
	
	private final ObjectMapper objectMapper = new ObjectMapper();
	
	@Autowired
	private AccountRepository accountRepo;

	@Autowired
	private ShoppingCartRepository shoppingCartRepo;

	@Autowired
	private BookRepository bookRepo;

	@Autowired
	private CartItemRepository cartItemRepo;

	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private ModelMapper mapper;
	
	private BookEntity checkValidBook(Long productId) {
		try {
			BookEntity book = bookRepo.findById(productId).orElseThrow(() -> new NotFoundException("Not found book."));
			if (book.getInventory_quantity() < 1 || !book.getStatus().equals(BookStatus.Availabled)) {
				throw new RuntimeException("Not valid book.");
			}
			return book;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
	
	private void updateCartTotal(ShoppingCartEntity cart) {
		int totalItems = 0;
		double totalPrice = 0.0;

		for (CartItemEntity cartItem : cart.getCartItems()) {
			totalItems += cartItem.getQuantity();
			totalPrice += cartItem.getTotalPrice();
		}

		cart.setTotalItems(totalItems);
		cart.setTotalPrice(totalPrice);
	}

	private void addBook(ShoppingCartEntity shoppingCart, CartItemEntity cartItem, 
			AccountEntity account, BookEntity book, int quantity) {
		if (shoppingCart == null) {
			shoppingCart = new ShoppingCartEntity();
			shoppingCart.setUser(account.getUser());
			shoppingCart.setTotalItems(0);
			shoppingCart.setTotalPrice(0);
			shoppingCartRepo.save(shoppingCart);

			cartItem.setBook(book);
			cartItem.setQuantity(quantity);
			cartItem.setTotalPrice(book.getSalePrice() * quantity);
			cartItem.setShoppingCart(shoppingCart);
			shoppingCart.getCartItems().add(cartItem);

			cartItemRepo.save(cartItem);
			updateCartTotal(shoppingCart);
			shoppingCartRepo.save(shoppingCart);
		} else {
			Optional<CartItemEntity> existingCartItem = shoppingCart.getCartItems().stream()
					.filter(item -> item.getBook().getId().equals(book.getId())).findFirst();

			if (existingCartItem.isPresent()) {
				cartItem = existingCartItem.get();
				cartItem.setQuantity(cartItem.getQuantity() + quantity);
				cartItem.setTotalPrice(book.getSalePrice() * cartItem.getQuantity());
				shoppingCart.getCartItems().add(cartItem);
			} else {
				cartItem.setBook(book);
				cartItem.setQuantity(quantity);
				cartItem.setTotalPrice(book.getSalePrice() * quantity);
				cartItem.setShoppingCart(shoppingCart);
				shoppingCart.getCartItems().add(cartItem);
			}

			cartItemRepo.save(cartItem);
			updateCartTotal(shoppingCart);
			shoppingCartRepo.save(shoppingCart);
		}
	}
	
	@Override
	public String addProductFromCookieToCart(String token, HttpServletRequest request) {
		try {
			ShoppingCartDTO shoppingCartDTO = getShoppingCartFromCookie(request);
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user"));
			
			ShoppingCartEntity shoppingCartCookie = mapper.map(shoppingCartDTO, ShoppingCartEntity.class);
			
			Set<CartItemEntity> cartItemsCookie = shoppingCartCookie.getCartItems();

			ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();

			CartItemEntity cartItem = new CartItemEntity();

			if (cartItemsCookie.size() > 0) {
				for (CartItemEntity cartItemCookie : cartItemsCookie) {
					addBook(shoppingCart, cartItem, account, cartItemCookie.getBook(), cartItemCookie.getQuantity());
				}
			} else {
				return "No book from cookie.";
			}

			return "Add book from cookie successfully.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public ShoppingCartDTO getShoppingCartFromCookie(HttpServletRequest request) {
		try {
			Optional<Cookie> cartCookie = Arrays.stream(Optional.ofNullable(request.getCookies()).orElse(new Cookie[0]))
					.filter(cookie -> "cart".equals(cookie.getName())).findFirst();

			ShoppingCartDTO shoppingCart = new ShoppingCartDTO();

			if (cartCookie.isPresent()) {
				// Decode the Base64 encoded value
				String decodedCartJson = new String(Base64.getUrlDecoder().decode(cartCookie.get().getValue()));
				// Convert JSON to list of CartItemDTO
				shoppingCart = objectMapper.readValue(decodedCartJson, ShoppingCartDTO.class);
			} else {
				shoppingCart.setTotalItems(0);
				shoppingCart.setTotalPrice(0);
				shoppingCart.setCartItems(new HashSet<CartItemDTO>());
			}

			return shoppingCart;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public Cookie addProductToCartCookie(Long productId, int quantity, HttpServletRequest request) {
		try {
			ShoppingCartDTO shoppingCart = getShoppingCartFromCookie(request);
			Set<CartItemDTO> listCartItems = shoppingCart.getCartItems();
			BookEntity book = checkValidBook(productId);

			CartItemDTO cartItem = new CartItemDTO();

			Optional<CartItemDTO> existingCartItem = listCartItems.stream()
					.filter(item -> item.getBook().getId().equals(productId)).findFirst();

			if (existingCartItem.isPresent()) {
				cartItem = existingCartItem.get();
				cartItem.setQuantity(cartItem.getQuantity() + quantity);
				cartItem.setTotalPrice(book.getSalePrice() * cartItem.getQuantity());
				listCartItems.add(cartItem);
			} else {
				cartItem.setBook(mapper.map(book, BookDTO.class));
				cartItem.setQuantity(quantity);
				cartItem.setTotalPrice(book.getSalePrice() * quantity);
				listCartItems.add(cartItem);
			}

			shoppingCart.setCartItems(listCartItems);
			ShoppingCartEntity shoppingCartEntity = mapper.map(shoppingCart, ShoppingCartEntity.class);
			updateCartTotal(shoppingCartEntity);
			mapper.map(shoppingCartEntity, shoppingCart);

			String cartJson = objectMapper.writeValueAsString(shoppingCart);
			// Encode JSON using Base64
			String encodedCartJson = Base64.getUrlEncoder().encodeToString(cartJson.getBytes());

			// Create and set cookie
			Cookie cartCookie = new Cookie("cart", encodedCartJson);
			cartCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
			cartCookie.setHttpOnly(true);
			cartCookie.setPath("/");

			return cartCookie;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public Cookie removeProductFromCartCookie(Long productId, HttpServletRequest request) {
		try {
			ShoppingCartDTO shoppingCart = getShoppingCartFromCookie(request);

			Set<CartItemDTO> listCartItems = shoppingCart.getCartItems();

			listCartItems.removeIf(item -> item.getBook().getId().equals(productId));

			shoppingCart.setCartItems(listCartItems);
			ShoppingCartEntity shoppingCartEntity = mapper.map(shoppingCart, ShoppingCartEntity.class);
			updateCartTotal(shoppingCartEntity);
			mapper.map(shoppingCartEntity, shoppingCart);

			String cartJson = objectMapper.writeValueAsString(shoppingCart);
			String encodedCartJson = Base64.getUrlEncoder().encodeToString(cartJson.getBytes());
			Cookie cartCookie = new Cookie("cart", encodedCartJson);
			cartCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
			cartCookie.setHttpOnly(true);
			cartCookie.setPath("/");

			return cartCookie;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public Set<CartItemDTO> getCartItemsCookie(HttpServletRequest request) {
		try {
			ShoppingCartDTO shoppingCart = getShoppingCartFromCookie(request);
			Set<CartItemDTO> listCartItems = shoppingCart.getCartItems();
			return listCartItems;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public Cookie updateQuantityProductCookie(Long productId, int quantity, HttpServletRequest request) {
		try {
			ShoppingCartDTO shoppingCart = getShoppingCartFromCookie(request);
			Set<CartItemDTO> listCartItems = shoppingCart.getCartItems();

			BookEntity book = checkValidBook(productId);

			Optional<CartItemDTO> existingCartItem = listCartItems.stream()
					.filter(cartItem -> cartItem.getBook().getId().equals(productId)).findFirst();

			CartItemDTO cartItem = new CartItemDTO();

			cartItem = existingCartItem.get();
			cartItem.setQuantity(quantity);
			cartItem.setTotalPrice(book.getSalePrice() * quantity);
			listCartItems.add(cartItem);

			shoppingCart.setCartItems(listCartItems);
			ShoppingCartEntity shoppingCartEntity = mapper.map(shoppingCart, ShoppingCartEntity.class);
			updateCartTotal(shoppingCartEntity);
			mapper.map(shoppingCartEntity, shoppingCart);

			String cartJson = objectMapper.writeValueAsString(shoppingCart);

			String encodedCartJson = Base64.getUrlEncoder().encodeToString(cartJson.getBytes());

			Cookie cartCookie = new Cookie("cart", encodedCartJson);
			cartCookie.setMaxAge(7 * 24 * 60 * 60);
			cartCookie.setHttpOnly(true);
			cartCookie.setPath("/");

			return cartCookie;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public boolean checkExistedCookie(HttpServletRequest request) {
		try {
			Cookie[] cookies = request.getCookies();
	        if (cookies != null) {
	            for (Cookie cookie : cookies) {
	                if ("cart".equals(cookie.getName())) {
	                    return true;
	                }
	            }
	        }
	        return false;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}
}
