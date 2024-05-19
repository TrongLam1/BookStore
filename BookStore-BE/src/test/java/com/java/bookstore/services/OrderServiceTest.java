package com.java.bookstore.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.java.bookstore.controllers.SocketController;
import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.entities.OrderEntity;
import com.java.bookstore.entities.OrderStatus;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CartItemRepository;
import com.java.bookstore.repositories.OrderItemRepository;
import com.java.bookstore.repositories.OrderRepository;
import com.java.bookstore.repositories.ShoppingCartRepository;
import com.java.bookstore.repositories.UserRepository;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.impl.JwtServiceImpl;
import com.java.bookstore.services.impl.OrderServiceImpl;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

	@Mock
	private OrderRepository orderRepo;

	@Mock
	private UserRepository userRepo;

	@Mock
	private OrderItemRepository orderItemRepo;

	@Mock
	private CartItemRepository cartItemRepo;

	@Mock
	private ShoppingCartRepository shoppingCartRepo;

	@Mock
	private BookRepository bookRepo;

	@Mock
	private JwtServiceImpl jwtService;

	@Mock
	private ModelMapper mapper;
	
	@InjectMocks
	private SocketController socketController;

	@InjectMocks
	private OrderServiceImpl orderService;

	@Test
	public void testGetOrders_Success() {
		// Arrange
		String token = "validToken";
		int pageNo = 1;
		int pageSize = 10;

		// Mock user
		UserEntity userEntity = new UserEntity();
		userEntity.setEmail("test@example.com");
		when(jwtService.extractUsername(token)).thenReturn(userEntity.getEmail());
		when(userRepo.findByEmail(userEntity.getEmail())).thenReturn(Optional.of(userEntity));

		// Mock orders
		List<OrderEntity> orderEntities = new ArrayList<>();
		OrderEntity orderEntity = new OrderEntity();
		orderEntity.setId(1L);
		orderEntities.add(orderEntity);
		Page<OrderEntity> page = new PageImpl<>(orderEntities);
		when(orderRepo.findByUser(any(UserEntity.class), any(Pageable.class))).thenReturn(page);

		// Mock mapper
		OrderDTO orderDTO = new OrderDTO();
		when(mapper.map(any(OrderEntity.class), eq(OrderDTO.class))).thenReturn(orderDTO);

		// Act
		PaginationResult<OrderDTO> result = orderService.getOrders(token, pageNo, pageSize);

		// Assert
		assertEquals(1, result.getData().size());
		assertEquals(1, result.getTotalItems());
		assertEquals(1, result.getTotalPages());
	}

	@Test
	public void testGetOrders_InvalidPageException() {
		String token = "validToken";
		int invalidPageNo = 0;

		RuntimeException exception = assertThrows(RuntimeException.class,
				() -> orderService.getOrders(token, invalidPageNo, 10));
		assertTrue(exception.getMessage().contains("Invalid Page"));
	}

	@Test
	public void testGetOrders_NotFoundException() {
		String token = "invalidToken";

		when(jwtService.extractUsername(token)).thenReturn("nonexistentUser");
		when(userRepo.findByEmail("nonexistentUser")).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> orderService.getOrders(token, 1, 10));
	}

	@Test
	public void testGetOneOrderFromUser_Success() {
		String token = "validToken";
		long orderId = 1L;

		UserEntity userEntity = new UserEntity();
		userEntity.setEmail("test@example.com");
		OrderEntity orderEntity = new OrderEntity();
		orderEntity.setId(orderId);

		List<OrderEntity> listOrders = userEntity.getListOrders();
		listOrders.add(orderEntity);

		OrderDTO dto = new OrderDTO();
		dto.setId(orderId);

		when(jwtService.extractUsername(token)).thenReturn("test@example.com");
		when(userRepo.findByEmail("test@example.com")).thenReturn(Optional.of(userEntity));
		when(orderService.getOneOrderFromUser(token, orderId)).thenReturn(dto);

		OrderDTO result = orderService.getOneOrderFromUser(token, orderId);

		assertEquals(orderId, result.getId());
		verify(userRepo, atLeastOnce()).findByEmail("test@example.com");
	}

	@Test
	public void testGetOneOrderFromUser_InvalidToken_ExceptionThrown() {
		String token = "invalidToken";
		long orderId = 1L;

		when(userRepo.findByEmail("invalidEmail")).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> orderService.getOneOrderFromUser(token, orderId));
	}

	@Test
	public void testGetLatestOrder_Success() {
		String token = "valid";
		String email = "test@gmail.com";
		UserEntity user = UserEntity.builder().id(1L).email(email).listOrders(new ArrayList<>()).build();
		OrderEntity order = OrderEntity.builder().id(1L).user(user).build();
		OrderDTO orderDTO = OrderDTO.builder().id(1L).build();

		when(jwtService.extractUsername(token)).thenReturn(email);
		when(userRepo.findByEmail(email)).thenReturn(Optional.of(user));
		when(orderRepo.findLatestOrder(user)).thenReturn(Optional.of(order));
		when(orderService.getLatestOrder(token)).thenReturn(orderDTO);

		OrderDTO result = orderService.getLatestOrder(token);

		assertNotNull(result);
		verify(orderRepo, atLeastOnce()).findLatestOrder(Optional.of(user).get());
	}

	@Test
	public void testGetLatestOrder_NotFoundUser() {
		String token = "invalid";
		String email = "test@gmail.com";

		when(userRepo.findByEmail(email)).thenThrow(NotFoundException.class);

		assertThrows(RuntimeException.class, () -> orderService.getLatestOrder(token));
	}

	@Test
	public void testGetAllOrders_Success() {
		int pageNo = 1;
		int pageSize = 10;
		Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "id"));

		List<OrderEntity> mockList = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			OrderEntity order = OrderEntity.builder().id(Long.valueOf(i)).build();
			mockList.add(order);
		}

		when(orderRepo.findAll(pageable)).thenReturn(new PageImpl<>(mockList));

		PaginationResult<OrderDTO> results = orderService.getAllOrders(pageNo, pageSize);

		assertEquals(mockList.size(), results.getData().size());
		verify(orderRepo, atLeastOnce()).findAll(pageable);
	}

	@Test
	public void testGetAllOrders_InvalidPage() {
		int pageNo = 0;
		int pageSize = 10;

		assertThrows(RuntimeException.class, () -> orderService.getAllOrders(pageNo, pageSize));
	}

	@Test
	public void testFindByOrderStatus_Success() {
		int pageNo = 1;
		int pageSize = 10;
		String status = "confirmed";

		Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "id"));

		List<OrderEntity> mockList = new ArrayList<>();
		for (int i = 0; i < 5; i++) {
			OrderEntity order = OrderEntity.builder().id(Long.valueOf(i)).build();
			mockList.add(order);
		}

		when(orderRepo.findByStatus(OrderStatus.Confirmed, pageable)).thenReturn(new PageImpl<>(mockList));

		PaginationResult<OrderDTO> results = orderService.findByOrderStatus(status, pageNo);

		assertEquals(mockList.size(), results.getData().size());
		verify(orderRepo, atLeastOnce()).findByStatus(OrderStatus.Confirmed, pageable);
	}

	@Test
	public void testFindByOrderStatus_InvalidPage() {
		int pageNo = 0;

		assertThrows(RuntimeException.class, () -> orderService.findByOrderStatus("confirmed", pageNo));
	}

	@Test
	public void testFindById_Success() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
		orderService.findById(1L);

		verify(orderRepo, atLeastOnce()).findById(1L);
	}

	@Test
	public void testFindById_ThrowException() {
		when(orderRepo.findById(1L)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class, () -> orderService.findById(1L));
	}

	@Test
	public void testAdminGetOrder_Success() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		when(orderRepo.findById(1L)).thenReturn(Optional.of(order));
		orderService.findById(1L);

		verify(orderRepo, atLeastOnce()).findById(1L);
	}

	@Test
	public void testAdminGetOrder_ThrowException() {
		when(orderRepo.findById(1L)).thenReturn(Optional.empty());
		assertThrows(RuntimeException.class, () -> orderService.findById(1L));
	}
}
