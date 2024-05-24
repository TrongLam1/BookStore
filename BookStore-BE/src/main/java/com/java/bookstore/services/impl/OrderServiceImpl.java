package com.java.bookstore.services.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Service;

import com.java.bookstore.controllers.SocketController;
import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.CartItemEntity;
import com.java.bookstore.entities.OrderEntity;
import com.java.bookstore.entities.OrderItemEntity;
import com.java.bookstore.entities.OrderStatus;
import com.java.bookstore.entities.ShoppingCartEntity;
import com.java.bookstore.entities.UserEntity;
import com.java.bookstore.exceptions.InvalidPageException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CartItemRepository;
import com.java.bookstore.repositories.OrderItemRepository;
import com.java.bookstore.repositories.OrderRepository;
import com.java.bookstore.repositories.ShoppingCartRepository;
import com.java.bookstore.repositories.UserRepository;
import com.java.bookstore.requests.PlaceOrderRequest;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.IOrderService;

import jakarta.persistence.LockModeType;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class OrderServiceImpl extends BaseRedisServiceImpl implements IOrderService {

	@Autowired
	private OrderRepository orderRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private OrderItemRepository orderItemRepo;

	@Autowired
	private CartItemRepository cartItemRepo;

	@Autowired
	private ShoppingCartRepository shoppingCartRepo;

	@Autowired
	private BookRepository bookRepo;

	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private SocketController socketController;

	@Autowired
	private MailSenderServiceImpl mailSender;

	private final static String DATA_TYPE = "order";

	@Lock(LockModeType.PESSIMISTIC_FORCE_INCREMENT)
	@Override
	public Long placeOrder(String token, PlaceOrderRequest request, int valueCoupon) {
		try {
			String email = jwtService.extractUsername(token);
			UserEntity user = userRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found email " + email));
			ShoppingCartEntity shoppingCart = user.getShoppingCart();

			OrderEntity newOrder = new OrderEntity();
			Set<CartItemEntity> cartItems = shoppingCart.getCartItems();
			if (cartItems.size() == 0) {
				throw new NotFoundException("Not found items to order.");
			}

			Set<OrderItemEntity> orderItems = new HashSet<>();

			for (CartItemEntity cartItem : cartItems) {
				OrderItemEntity orderItem = new OrderItemEntity();
				BookEntity book = new BookEntity();

				orderItem.setBook(cartItem.getBook());
				orderItem.setQuantity(cartItem.getQuantity());
				orderItem.setTotalPrice(cartItem.getTotalPrice());
				orderItem.setCurrentPrice(cartItem.getBook().getSalePrice());
				orderItem.setOrder(newOrder);

				orderItems.add(orderItem);

				book = cartItem.getBook();
				book.setInventory_quantity(book.getInventory_quantity() - cartItem.getQuantity());

				orderItemRepo.save(orderItem);

				cartItemRepo.delete(cartItem);

				bookRepo.save(book);
			}

			newOrder.setStatus(OrderStatus.Confirmed);
			newOrder.setAddress(request.getAddress());
			newOrder.setPhone(request.getPhone());
			newOrder.setUsername(request.getUsername());
			newOrder.setPaymentMethod(request.getPaymentMethod());
			newOrder.setPaymentStatus("Unpaid");
			newOrder.setUser(user);
			newOrder.setOrderItems(orderItems);
			newOrder.setOrderAmt(shoppingCart.getTotalItems());
			newOrder.setTotalPricesOrder(shoppingCart.getTotalPrice() - valueCoupon);
			newOrder.setValueCoupon(valueCoupon);
			orderRepo.save(newOrder);

			shoppingCart.setTotalItems(0);
			shoppingCart.setTotalPrice(0);

			shoppingCartRepo.save(shoppingCart);

			socketController.notificationNewOrder(newOrder.getId());

			mailSender.mailSenderPlaceOrder(mapper.map(newOrder, OrderDTO.class), email);

			if (isRedisAvailable()) {
				String prefix = DATA_TYPE + ":" + user.getEmail();
				clearCacheWithPrefix(prefix);
			}

			return newOrder.getId();
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public PaginationResult<OrderDTO> getOrders(String token, int pageNo, int pageSize) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}

			UserEntity user = userRepo.findByEmail(jwtService.extractUsername(token))
					.orElseThrow(() -> new NotFoundException("Not found user."));

			PaginationResult<OrderDTO> results = new PaginationResult<>();

			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE, user.getEmail(), pageNo, "id", "ASC");
				results = readList(key, OrderDTO.class);
				if (results == null) {
					results = new PaginationResult<>();

					Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.ASC, "id"));

					long totalItems;

					Page<OrderEntity> listOrders = orderRepo.findByUser(user, pageable);

					List<OrderDTO> listOrdersDTO = listOrders.stream().map(item -> mapper.map(item, OrderDTO.class))
							.collect(Collectors.toList());

					totalItems = listOrders.getTotalElements();
					int totalPages = listOrders.getTotalPages();

					results.setData(listOrdersDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);

					saveList(results, key);
				}
			} else {
				Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.ASC, "id"));

				long totalItems;

				Page<OrderEntity> listOrders = orderRepo.findByUser(user, pageable);

				List<OrderDTO> listOrdersDTO = listOrders.stream().map(item -> mapper.map(item, OrderDTO.class))
						.collect(Collectors.toList());

				totalItems = listOrders.getTotalElements();
				int totalPages = listOrders.getTotalPages();

				results.setData(listOrdersDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}

			return results;
		} catch (Exception e) {

			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public OrderDTO getOneOrderFromUser(String token, long orderId) {
		try {
			String email = jwtService.extractUsername(token);
			UserEntity user = userRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found email " + email));
			List<OrderEntity> orders = user.getListOrders();

			OrderDTO orderDTO = new OrderDTO();

			for (OrderEntity order : orders) {
				if (order.getId().equals(orderId)) {
					orderDTO = mapper.map(order, OrderDTO.class);
				}
			}
			return orderDTO;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public OrderDTO getLatestOrder(String token) {
		try {
			String email = jwtService.extractUsername(token);
			UserEntity user = userRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found " + email));
			OrderEntity order = orderRepo.findLatestOrder(user).get();
			OrderDTO dto = mapper.map(order, OrderDTO.class);
			return dto;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<OrderDTO> getAllOrders(int pageNo, int pageSize) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}

			PaginationResult<OrderDTO> results = new PaginationResult<>();

			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE, "all", pageNo, "id", "DESC");
				results = readList(key, OrderDTO.class);
				if (results == null) {
					results = new PaginationResult<>();

					Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "id"));
					long totalItems;

					Page<OrderEntity> listOrders = orderRepo.findAll(pageable);
					List<OrderDTO> listOrdersDTO = listOrders.getContent().stream()
							.map(item -> mapper.map(item, OrderDTO.class)).collect(Collectors.toList());

					totalItems = listOrders.getTotalElements();
					int totalPages = listOrders.getTotalPages();

					results.setData(listOrdersDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);

					saveList(results, key);
				}
			} else {
				Pageable pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "id"));
				long totalItems;

				Page<OrderEntity> listOrders = orderRepo.findAll(pageable);
				List<OrderDTO> listOrdersDTO = listOrders.getContent().stream()
						.map(item -> mapper.map(item, OrderDTO.class)).collect(Collectors.toList());

				totalItems = listOrders.getTotalElements();
				int totalPages = listOrders.getTotalPages();

				results.setData(listOrdersDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}

			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public String changeOrderStatus(Long orderId, String status) {
		try {
			OrderEntity order = orderRepo.findById(orderId)
					.orElseThrow(() -> new NotFoundException("Not found order."));

			if (status.equals("Cancel")) {
				Set<OrderItemEntity> listItems = order.getOrderItems();
				listItems.stream().forEach(item -> {
					BookEntity book = item.getBook();
					book.setInventory_quantity(book.getInventory_quantity() + item.getQuantity());
					bookRepo.save(book);
				});
				order.setStatus(OrderStatus.Cancelled);
				orderRepo.save(order);
			} else {
				order.setStatus(OrderStatus.Delivered);
				order.setPaymentStatus("Paid");
				orderRepo.save(order);
			}

			if (isRedisAvailable()) {
				String prefix = DATA_TYPE + ":" + order.getUser().getEmail();
				clearCacheWithPrefix(prefix);
			}

			return "Update order status success.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public OrderDTO adminGetOrder(Long orderId) {
		try {
			OrderEntity order = orderRepo.findById(orderId)
					.orElseThrow(() -> new NotFoundException("Not found order."));
			return mapper.map(order, OrderDTO.class);
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public HashMap<String, Long> countOrders() {
		try {
			HashMap<String, Long> results = new HashMap<>();
			Long cancelOrders = orderRepo.countCanceledOrders();
			Long deliveredOrders = orderRepo.countDeliveredOrders();
			Long notYetOrders = orderRepo.countNotYetDeliveredOrders();
			Long totalRevenue = orderRepo.totalRevenue() != null ? orderRepo.totalRevenue() : 0L;
			results.put("Cancel", cancelOrders);
			results.put("Delivered", deliveredOrders);
			results.put("Another", notYetOrders);
			results.put("Revenue", totalRevenue);

			return results;
		} catch (Exception e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	public List<Object[]> getTotalPriceInDateRange(Date startDate, Date endDate) {
		try {
			List<Object[]> results = orderRepo.getTotalPriceInDateRange(startDate, endDate);
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public List<Object[]> getTotalPriceByMonthInYear(int year) {
		try {
			List<Object[]> results = orderRepo.getTotalPriceByMonthInYear(year);
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public OrderDTO findById(Long id) {
		try {
			OrderEntity order = orderRepo.findById(id)
					.orElseThrow(() -> new NotFoundException("Not found order id " + id));
			return mapper.map(order, OrderDTO.class);
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<OrderDTO> findByOrderStatus(String status, int pageNo) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid Page.");
			}

			OrderStatus orderStatus = null;
			if (status.equals("confirmed")) {
				orderStatus = OrderStatus.Confirmed;
			} else {
				orderStatus = OrderStatus.Delivered;
			}

			PaginationResult<OrderDTO> results = new PaginationResult<>();

			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE, status, pageNo, "id", "DESC");
				results = readList(key, OrderDTO.class);

				if (results == null) {
					results = new PaginationResult<>();

					Pageable pageable = PageRequest.of(pageNo - 1, 10, Sort.by(Sort.Direction.DESC, "id"));
					long totalItems;

					Page<OrderEntity> listOrders = orderRepo.findByStatus(orderStatus, pageable);
					List<OrderDTO> listOrdersDTO = listOrders.getContent().stream()
							.map(item -> mapper.map(item, OrderDTO.class)).collect(Collectors.toList());

					totalItems = listOrders.getTotalElements();
					int totalPages = listOrders.getTotalPages();

					results.setData(listOrdersDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);

					saveList(results, key);
				}
			} else {
				Pageable pageable = PageRequest.of(pageNo - 1, 10, Sort.by(Sort.Direction.DESC, "id"));
				long totalItems;

				Page<OrderEntity> listOrders = orderRepo.findByStatus(orderStatus, pageable);
				List<OrderDTO> listOrdersDTO = listOrders.getContent().stream()
						.map(item -> mapper.map(item, OrderDTO.class)).collect(Collectors.toList());

				totalItems = listOrders.getTotalElements();
				int totalPages = listOrders.getTotalPages();

				results.setData(listOrdersDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}

			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}
}
