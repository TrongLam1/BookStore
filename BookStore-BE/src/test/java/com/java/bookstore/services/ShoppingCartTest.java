package com.java.bookstore.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.CartItemEntity;
import com.java.bookstore.entities.ShoppingCartEntity;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CartItemRepository;
import com.java.bookstore.repositories.ShoppingCartRepository;
import com.java.bookstore.services.impl.JwtServiceImpl;
import com.java.bookstore.services.impl.ShoppingCartServiceImpl;

@ExtendWith(MockitoExtension.class)
public class ShoppingCartTest {

	@Mock
	private AccountRepository accountRepo;

	@Mock
	private ShoppingCartRepository shoppingCartRepo;

	@Mock
	private BookRepository bookRepo;

	@Mock
	private CartItemRepository cartItemRepo;

	@Mock
	private JwtServiceImpl jwtService;

	@Mock
	private ModelMapper mapper;

	@InjectMocks
	private ShoppingCartServiceImpl shoppingCartService;

	@Test
	public void testAddProductToCart_Success() {
		String token = "validToken";
		String email = "test@gmail.com";
		BookEntity bookEntity = BookEntity.builder().id(1L).inventory_quantity(10).build();
		UserEntity userEntity = UserEntity.builder().id(1L).email(email).shoppingCart(new ShoppingCartEntity()).build();
		AccountEntity accountEntity = AccountEntity.builder().id(1L).email(email).user(userEntity).build();
		CartItemEntity cartItem = CartItemEntity.builder().id(1L).book(bookEntity)
				.shoppingCart(userEntity.getShoppingCart()).build();
		userEntity.getShoppingCart().getCartItems().add(cartItem);
		userEntity.setAccount(accountEntity);

		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));
		when(bookRepo.findById(1L)).thenReturn(Optional.of(bookEntity));

		String result = shoppingCartService.addProductToCart(1L, 1, token);

		assertEquals("Add book successfully.", result);
	}

	@Test
	public void testAddProductToCart_NotFoundAccount() {
		String token = "validToken";
		String email = "test@gmail.com";
		when(accountRepo.findByEmail(email)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class, () -> shoppingCartService.addProductToCart(1L, 1, token));
	}

	@Test
	public void testAddProductToCart_NotFoundBook() {
		String token = "validToken";
		String email = "test@gmail.com";
		AccountEntity accountEntity = AccountEntity.builder().id(1L).email(email).build();
		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));
		when(bookRepo.findById(1L)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> shoppingCartService.addProductToCart(1L, 1, token));
	}

	@Test
	public void testUpdateQuanityProduct_Success() {
		String token = "validToken";
		String email = "test@gmail.com";
		AccountEntity accountEntity = AccountEntity.builder().id(1L).email(email).build();
		UserEntity userEntity = UserEntity.builder().id(1L).account(accountEntity)
				.shoppingCart(new ShoppingCartEntity()).build();
		BookEntity bookEntity = BookEntity.builder().id(1L).inventory_quantity(10).build();
		CartItemEntity cartItem = CartItemEntity.builder().id(1L).book(bookEntity)
				.shoppingCart(userEntity.getShoppingCart()).build();
		userEntity.getShoppingCart().getCartItems().add(cartItem);
		accountEntity.setUser(userEntity);

		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));
		when(bookRepo.findById(1L)).thenReturn(Optional.of(bookEntity));

		String result = shoppingCartService.updateQuanityProduct(1L, token, 1);

		assertEquals("Update successfully.", result);
	}

	@Test
	public void testUpdateQuanityProduct_NotFoundAccount() {
		String token = "validToken";
		String email = "test@gmail.com";
		when(accountRepo.findByEmail(email)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class, () -> shoppingCartService.updateQuanityProduct(1L, token, 1));
	}

	@Test
	public void testUpdateQuanityProduct_NotFoundBook() {
		String token = "validToken";
		String email = "test@gmail.com";
		AccountEntity accountEntity = AccountEntity.builder().id(1L).email(email).build();
		UserEntity userEntity = UserEntity.builder().id(1L).account(accountEntity)
				.shoppingCart(new ShoppingCartEntity()).build();
		accountEntity.setUser(userEntity);
		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));
		when(bookRepo.findById(1L)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> shoppingCartService.updateQuanityProduct(1L, token, 1));
	}

	@Test
	public void testRemoveProductFromCart_Success() {
		String token = "validToken";
		String email = "test@gmail.com";
		AccountEntity accountEntity = AccountEntity.builder().id(1L).email(email).build();
		UserEntity userEntity = UserEntity.builder().id(1L).account(accountEntity)
				.shoppingCart(new ShoppingCartEntity()).build();
		BookEntity bookEntity = BookEntity.builder().id(1L).inventory_quantity(10).build();
		CartItemEntity cartItem = CartItemEntity.builder().id(1L).book(bookEntity)
				.shoppingCart(userEntity.getShoppingCart()).build();
		userEntity.getShoppingCart().getCartItems().add(cartItem);
		accountEntity.setUser(userEntity);

		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));

		String result = shoppingCartService.removeProductFromCart(1L, token);
		assertEquals("Remove book successfully.", result);
		verify(cartItemRepo).delete(cartItem);
	}

	@Test
	public void testRemoveProductFromCart_NotFoundAccount() {
		String token = "validToken";
		String email = "test@gmail.com";
		when(accountRepo.findByEmail(email)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class, () -> shoppingCartService.removeProductFromCart(1L, token));
	}
}
