package com.java.bookstore.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.converter.BookMessageConverter;
import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.BookServiceImpl;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/book")
@Slf4j
public class BookController {

	@Autowired
	private BookServiceImpl bookService;

	@Autowired
	private KafkaTemplate<String, BookDTO> kafkaTemplate;

	@GetMapping("/find-by-id")
	public ResponseData<?> findById(@RequestParam("id") Long id) {
		try {
			log.info("Find book id: {}", id);
			return new ResponseData<>(HttpStatus.OK.value(), "Book id " + id, bookService.findById(id));
		} catch (Exception e) {
			e.printStackTrace();
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-top-5")
	public ResponseData<?> getTop5Books() {
		try {
			log.info("Get top 5 books.");
			return new ResponseData<>(HttpStatus.OK.value(), "Top 5 books", bookService.getTop5Books());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-top-5-by-type")
	public ResponseData<?> getTop5BooksByType(@RequestParam("type") String type) {
		try {
			log.info("Get top 5 books by: {}", type);
			return new ResponseData<>(HttpStatus.OK.value(), "Top 5 books " + type,
					bookService.getTop5BooksByType(type));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/find-by-name")
	public ResponseData<?> findByNameContaining(@RequestParam("name") String name) {
		try {
			log.info("Books name contain {}", name);
			return new ResponseData<>(HttpStatus.OK.value(), "Books name contain " + name,
					bookService.findByNameContaining(name));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-types-branches-book-category")
	public ResponseData<?> getAllTypesAndBranchesOfCategory(@RequestParam("category") String category) {
		try {
			log.info("Get books category: {}", category);
			return new ResponseData<>(HttpStatus.OK.value(), "Books category " + category,
					bookService.getDistinctTypesAndBranchesOfCategory(category));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-all-types-branches-book")
	public ResponseData<?> getAllTypesAndBranches() {
		try {
			log.info("List types and branches of all books");
			return new ResponseData<>(HttpStatus.OK.value(), "Distinc types and branches",
					bookService.getDistinctAllTypesAndBranches());
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-all-categories-book")
	public ResponseData<?> getAllCategories() {
		try {
			log.info("All categories.");
			return new ResponseData<>(HttpStatus.OK.value(), "Categories", bookService.getDistinctAllCategories());
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-all-books")
	public ResponseData<?> getAllBooks(@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "5") int pageSize,
			@RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
			@RequestParam(value = "sortDirection", required = false, defaultValue = "ASC") String sortDirection) {
		try {
			log.info("All books with {}, {}, {}", pageNo, sortBy, sortDirection);
			return new ResponseData<>(HttpStatus.OK.value(), "All books",
					bookService.getAllBook(pageNo, pageSize, sortBy, sortDirection));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-books-by-category")
	public ResponseData<?> getBooksByCategory(
			@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "5") int pageSize,
			@RequestParam("category") String category,
			@RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
			@RequestParam(value = "sortDirection", required = false, defaultValue = "ASC") String sortDirection) {
		try {
			log.info("Books with {}, {}, {}, {}", pageNo, category, sortBy, sortDirection);
			return new ResponseData<>(HttpStatus.OK.value(), "Success",
					bookService.getBooksByCategory(pageNo, pageSize, category, sortBy, sortDirection));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-books-by-category-types-branches")
	public ResponseData<?> getBooksByCategoryAndTypesAndBranches(
			@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "8") int pageSize,
			@RequestParam(value = "category", required = true) String category,
			@RequestParam("types") List<String> types, @RequestParam("branches") List<String> branches,
			@RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
			@RequestParam(value = "sortDirection", required = false, defaultValue = "ASC") String sortDirection) {
		try {
			log.info("Books with {}, {}, {}, {}", pageNo, category, types, branches);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success",
					bookService.getBooksByCategoryAndTypesAndBranches(pageNo, pageSize, category, types, branches,
							sortBy, sortDirection));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/get-books-by-types-branches")
	public ResponseData<?> getBooksByTypesAndBranches(
			@RequestParam(value = "pageNo", required = false, defaultValue = "1") int pageNo,
			@RequestParam(value = "pageSize", required = false, defaultValue = "8") int pageSize,
			@RequestParam("types") List<String> types, @RequestParam("branches") List<String> branches,
			@RequestParam(value = "sortBy", required = false, defaultValue = "id") String sortBy,
			@RequestParam(value = "sortDirection", required = false, defaultValue = "ASC") String sortDirection) {
		try {
			log.info("Books with {}, {}, {}", pageNo, types, branches);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success",
					bookService.getBooksByTypesAndBranches(pageNo, pageSize, types, branches, sortBy, sortDirection));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@PostMapping("/kafka")
	public ResponseData<String> findBook(@RequestBody BookDTO book) {
		kafkaTemplate.send("insert-new-book", book);
		kafkaTemplate.setMessageConverter(new BookMessageConverter());
		return new ResponseData<>(HttpStatus.OK.value(), "Message queued successfully as JSON: " + book.toString());
	}
	
	@GetMapping("/random-book/{category}")
	public ResponseData<?> getRandomBooks(@PathVariable("category") String category) {
		try {
			log.info("Get random books by {}", category);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success", bookService.getRandomBooksByCategory(category));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@RequestMapping("/down")
	public ResponseEntity<Resource> download() throws IOException {
		log.info("Download file excel");
		String filename = "books.xlsx";
		ByteArrayInputStream actualData = bookService.getActualData();
		InputStreamResource file = new InputStreamResource(actualData);

		ResponseEntity<Resource> body = ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
				.contentType(MediaType.parseMediaType("application/vnd.ms-excel")).body(file);

		return body;
	}
}
