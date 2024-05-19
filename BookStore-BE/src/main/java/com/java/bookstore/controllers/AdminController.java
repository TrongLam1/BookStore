package com.java.bookstore.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.dtos.UserDTO;
import com.java.bookstore.requests.SignUpRequest;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.CloudinaryService;
import com.java.bookstore.services.impl.AuthenticationServiceImpl;
import com.java.bookstore.services.impl.BookServiceImpl;
import com.java.bookstore.services.impl.OrderServiceImpl;
import com.java.bookstore.services.impl.UserServiceImpl;
import com.java.bookstore.utils.ExcelUtility;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/admin")
@Slf4j
public class AdminController {

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private BookServiceImpl bookService;

	@Autowired
	private OrderServiceImpl orderService;
	
	@Autowired
	private AuthenticationServiceImpl authenticationServiceImpl;

	@Autowired
	private CloudinaryService cloudService;

	@PostMapping("/excel/new-books")
	public ResponseData<?> importBooksFromExcel(@RequestHeader("Authorization") String token,
			@RequestParam("file") MultipartFile file) {
		try {
			log.info("Import from file Excel.");

			if (ExcelUtility.hasExcelFormat(file)) {
				bookService.importFromExcel(file);
				return new ResponseData<>(HttpStatus.CREATED.value(), "Import data from file excel successfully.");
			} else {
				return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "File format is incorrect");
			}
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PostMapping("/add-new-book")
	public ResponseData<?> addNewBook(@Valid @ModelAttribute BookDTO book,
			@RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
		try {
			if (file == null) {
				log.info("Update book id: {}", book.getId());
				return new ResponseData<>(HttpStatus.CREATED.value(), "Success add new book id: " + book.getId(),
						bookService.addNewBook(book));
			} else {
				log.info("Add new book id: {}", book.getId());
				Map result = cloudService.upload(file);
				book.setImage_url((String) result.get("url"));
				book.setImage_id((String) result.get("public_id"));
				return new ResponseData<>(HttpStatus.CREATED.value(), "Success add new book id: " + book.getId(),
						bookService.addNewBook(book));
			}
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PostMapping("/change-img-book")
	public ResponseData<?> changeImgBook(@RequestParam("bookId") long id,
			@RequestParam(value = "file") MultipartFile file) throws IOException {
		try {
			Map result = cloudService.upload(file);
			String img_url = (String) result.get("url");
			String img_id = (String) result.get("public_id");
			String mess = bookService.updateImgBook(id, img_url, img_id);
			return new ResponseData<>(HttpStatus.OK.value(), mess);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Update img's book failed.");
		}
	}

	@GetMapping("/admin-get-order/{orderId}")
	public ResponseData<?> getOrder(@PathVariable("orderId") long id) {
		try {
			log.info("Data's order id: {}", id);
			OrderDTO result = orderService.adminGetOrder(id);
			return new ResponseData<>(HttpStatus.OK.value(), "Success", result);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PutMapping("/change-status-book")
	public ResponseData<?> changeStatusBook(@RequestParam("id") long id, @RequestParam("status") String status) {
		try {
			log.info("Change order's status: {}, {}", id, status);
			String mess = bookService.changeStatusBook(id, status);
			return new ResponseData<>(HttpStatus.OK.value(), mess);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), "Change order's status failed.");
		}
	}

	@GetMapping("/get-all-users")
	public ResponseData<?> getAllUsers(@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
		try {
			log.info("Get all users.");
			PaginationResult<UserDTO> results = userService.getAllUsers(pageNo, pageSize);
			return new ResponseData<>(HttpStatus.OK.value(), "List all users", results);
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-all-books")
	public ResponseData<?> getAllBooks(@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
		try {
			log.info("Get all books");
			return new ResponseData<>(HttpStatus.OK.value(), "List all books",
					bookService.getAllBook(pageNo, pageSize, "id", "ASC"));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-all-orders")
	public ResponseData<?> getAllOrders(
			@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "10") int pageSize) {
		try {
			log.info("Get all orders");
			return new ResponseData<>(HttpStatus.OK.value(), "List all orders",
					orderService.getAllOrders(pageNo, pageSize));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PutMapping("/change-order-status")
	public ResponseData<?> updateStatusOrder(@RequestHeader("Authorization") String token,
			@RequestParam("orderId") long orderId, @RequestParam("status") String status) {
		try {
			log.info("Change order's status: {}, {}", orderId, status);
			return new ResponseData<>(HttpStatus.OK.value(), orderService.changeOrderStatus(orderId, status));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/count-orders")
	public ResponseData<?> countOrders(@RequestHeader("Authorization") String token) {
		try {
			log.info("Count orders.");
			return new ResponseData<>(HttpStatus.OK.value(), "Count orders", orderService.countOrders());
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-orders-by-status/{status}/{page}")
	public ResponseData<?> getOrdersByStatus(@RequestHeader("Authorization") String token,
			@PathVariable("status") String status, @PathVariable("page") int pageNo) {
		try {
			log.info("Get orders by status: {}, page {}", status, pageNo);
			return new ResponseData<>(HttpStatus.OK.value(), "List orders status: " + status,
					orderService.findByOrderStatus(status, pageNo));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/getTotalPricesByRange")
	public ResponseData<?> getTotalPricesByRange(@RequestHeader("Authorization") String token,
			@RequestParam("startDate") String stStartDate, @RequestParam("endDate") String stEndDate) {
		try {
			log.info("Chart for total prices by range.");

			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
			String start = stStartDate;
			String end = stEndDate;

			Date startDate = dateFormat.parse(start);
			Date endDate = dateFormat.parse(end);

			return new ResponseData<>(HttpStatus.OK.value(), "Chart total prices by range",
					orderService.getTotalPriceInDateRange(startDate, endDate));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/getTotalPriceInYear/{year}")
	public ResponseData<?> getTotalPriceInYear(@RequestHeader("Authorization") String token,
			@PathVariable("year") int year) {
		try {
			log.info("Chart for total price in {}", year);
			return new ResponseData<>(HttpStatus.OK.value(), "Chart total price " + year,
					orderService.getTotalPriceByMonthInYear(year));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/find-order-id/{id}")
	public ResponseData<?> findOrderById(@RequestHeader("Authorization") String token, @PathVariable("id") long id) {
		try {
			log.info("Find order id: {}", id);
			return new ResponseData<>(HttpStatus.OK.value(), "Order id: " + id, orderService.findById(id));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/find-user/{email}")
	public ResponseData<?> findUserByEmail(@RequestHeader("Authorization") String token,
			@PathVariable("email") String email) {
		try {
			log.info("Find email: {}", email);
			return new ResponseData<>(HttpStatus.OK.value(), "User email: " + email, userService.getUserByEmail(email));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-users-by-role")
	public ResponseData<?> getUsersByRole(@RequestHeader("Authorization") String token,
			@RequestParam(value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", defaultValue = "10") int pageSize, @RequestParam("role") String role) {
		try {
			log.info("Get users role {}", role);
			return new ResponseData<>(HttpStatus.OK.value(), "Users role" + role,
					userService.getUsersByRole(pageNo, pageSize, role));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
	
	@GetMapping("/locked-account")
	public ResponseData<?> lockedAccount(
			@RequestHeader("Authorization") String token, 
			@RequestParam("email") String email,
			@RequestParam("locked") boolean locked) {
		try {
			log.info("Locked email {}", email);
			return new ResponseData<>(HttpStatus.OK.value(), authenticationServiceImpl.lockedAccount(email, locked));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
	
	@PostMapping("/create-acc-admin")
	public ResponseData<?> createAccAdmin(
			@RequestHeader("Authorization") String token,
			@Valid @RequestBody SignUpRequest request) {
		try {
			log.info("Create account admin {}", request.getEmail());
			return new ResponseData<>(HttpStatus.OK.value(), authenticationServiceImpl.createAccRoleAdmin(request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
}
