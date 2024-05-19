package com.java.bookstore.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.java.bookstore.dtos.CartItemDTO;
import com.java.bookstore.dtos.ShoppingCartDTO;
import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.CartItemEntity;
import com.java.bookstore.entities.ShoppingCartEntity;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CartItemRepository;
import com.java.bookstore.repositories.ShoppingCartRepository;
import com.java.bookstore.services.IShoppingCartService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ShoppingCartServiceImpl extends BaseRedisServiceImpl implements IShoppingCartService {

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
	
	private final static String DATA_TYPE = "shopping_cart";

	@Override
	public String addProductToCart(Long productId, int quantity, String token) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user"));
			
			BookEntity book = bookRepo.findById(productId).orElseThrow(() -> new NotFoundException("Not found book."));

			ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();
			
			CartItemEntity cartItem = new CartItemEntity();
			
			if (shoppingCart == null) {
				ShoppingCartEntity newShoppingCart = new ShoppingCartEntity();
				newShoppingCart.setUser(account.getUser());
				newShoppingCart.setTotalItems(0);
				newShoppingCart.setTotalPrice(0);
				shoppingCartRepo.save(newShoppingCart);
				
				cartItem.setBook(book);
				cartItem.setQuantity(quantity);
				cartItem.setTotalPrice(book.getSalePrice() * quantity);
				cartItem.setShoppingCart(newShoppingCart);
				newShoppingCart.getCartItems().add(cartItem);
				
				cartItemRepo.save(cartItem);
				updateCartTotal(newShoppingCart);
				shoppingCartRepo.save(newShoppingCart);
			} else {
				Optional<CartItemEntity> existingCartItem = shoppingCart.getCartItems().stream()
						.filter(item -> item.getBook().getId().equals(productId)).findFirst();

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
			
			if (isRedisAvailable()) {
				String prefix = DATA_TYPE + ":" + account.getEmail();
				clearCacheWithPrefix(prefix);
			}
			
			return "Add book successfully.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
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
	
	private void checkInventoryBook(ShoppingCartEntity cart) {
		for (CartItemEntity cartItem : cart.getCartItems()) {
			BookEntity book = bookRepo.findById(cartItem.getBook().getId()).get();
			if (book.getInventory_quantity() == 0) {
				cartItemRepo.delete(cartItem);
			}
		}
		updateCartTotal(cart);
	}

	@Override
	public String removeProductFromCart(Long productId, String token) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user."));
	        ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();
	        Set<CartItemEntity> cartItems = shoppingCart.getCartItems();
	        Set<CartItemEntity> itemsToRemove = new HashSet<>();

	        for (CartItemEntity cartItem : cartItems) {
	            if (cartItem.getBook().getId().equals(productId)) {
	                itemsToRemove.add(cartItem);
	            }
	        }

	        for (CartItemEntity cartItem : itemsToRemove) {
	            cartItemRepo.delete(cartItem);
	            shoppingCart.getCartItems().remove(cartItem);
	        }

	        updateCartTotal(shoppingCart);
	        shoppingCartRepo.save(shoppingCart);
	        
	        if (isRedisAvailable()) {
	        	String prefix = DATA_TYPE + ":" + account.getEmail();
				clearCacheWithPrefix(prefix);
	        }

	        return "Remove book successfully.";
	    } catch (Exception e) {
	        throw new RuntimeException("Error: " + e.toString());
	    }
	}

	@Override
	public ShoppingCartDTO getCartFromUser(String token) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user."));
			checkInventoryBook(account.getUser().getShoppingCart());
			ShoppingCartDTO shoppingCart = mapper.map(account.getUser().getShoppingCart(), ShoppingCartDTO.class);
			return shoppingCart;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public List<CartItemDTO> getCartItems(String token) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user."));
			
			List<CartItemDTO> results = new ArrayList<>();
			if (isRedisAvailable()) {
				String key = getKeyFromOne(DATA_TYPE, account.getEmail(), account.getId());
				results = readListData(key, CartItemDTO.class);
				
				if (results == null) {
					results = new ArrayList<>();
					ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();

					results = new HashSet<>(shoppingCart.getCartItems()).stream()
							.map(cartItem -> mapper.map(cartItem, CartItemDTO.class)).collect(Collectors.toList());
				}
			} else {
				ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();

				results = new HashSet<>(shoppingCart.getCartItems()).stream()
						.map(cartItem -> mapper.map(cartItem, CartItemDTO.class)).collect(Collectors.toList());
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public String updateQuanityProduct(Long productId, String token, int quantity) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found user."));

			ShoppingCartEntity shoppingCart = account.getUser().getShoppingCart();

			BookEntity book = bookRepo.findById(productId).orElseThrow(() -> new NotFoundException("Not found book."));

			Optional<CartItemEntity> existingCartItem = shoppingCart.getCartItems().stream()
					.filter(cartItem -> cartItem.getBook().getId().equals(productId)).findFirst();

			CartItemEntity cartItem = new CartItemEntity();

			cartItem = existingCartItem.get();
			cartItem.setQuantity(quantity);
			cartItem.setTotalPrice(book.getSalePrice() * quantity);
			shoppingCart.getCartItems().add(cartItem);

			cartItemRepo.save(cartItem);
			updateCartTotal(shoppingCart);
			shoppingCartRepo.save(shoppingCart);
			
			if (isRedisAvailable()) {
				String prefix = DATA_TYPE + ":" + account.getEmail();
				clearCacheWithPrefix(prefix);
			}

			return "Update successfully.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
}
