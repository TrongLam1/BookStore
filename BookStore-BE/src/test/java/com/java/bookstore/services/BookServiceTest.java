package com.java.bookstore.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
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

import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.BookStatus;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.impl.BookServiceImpl;

@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

	@Mock
	private ModelMapper mapper;

	@Mock
	private BookRepository bookRepo;

	@InjectMocks
	private CloudinaryService cloudinaryService;

	@InjectMocks
	private BookServiceImpl bookService;

	private BookDTO createTestBookDTO() {
		BookDTO bookDTO = new BookDTO();
		bookDTO.setId(1L);
		bookDTO.setName("Test Book");
		bookDTO.setCategory("Test Category");
		bookDTO.setType("Test Type");
		bookDTO.setBranch("Test Branch");
		bookDTO.setDescription("Test Description");
		bookDTO.setPrice(100);
		bookDTO.setSale(10);
		bookDTO.setSalePrice(90.0);
		bookDTO.setInventory_quantity(50);
		bookDTO.setImage_url("test_image_url");
		bookDTO.setImage_id("test_image_id");
		bookDTO.setRating(4.5);
		bookDTO.setStatus(BookStatus.Availabled);
		return bookDTO;
	}

	@Test
	public void testAddNewBook_Success() {
		// Create test book DTO
		BookDTO bookDTO = createTestBookDTO();
		bookDTO.setId(null);

		// Mocking behavior of mapper
		when(mapper.map(any(BookDTO.class), any())).thenReturn(new BookEntity());

		// Mocking behavior of bookRepo
		when(bookRepo.save(any(BookEntity.class))).thenReturn(new BookEntity());

		// Call the method to test
		String result = bookService.addNewBook(bookDTO);

		// Verify the result
		assertEquals("Add success.", result);
//        assertEquals(bookDTO.getId(), result.getId());
//        assertEquals(bookDTO.getName(), result.getName());
//        assertEquals(bookDTO.getCategory(), result.getCategory());
//        assertEquals(bookDTO.getType(), result.getType());
//        assertEquals(bookDTO.getBranch(), result.getBranch());
//        assertEquals(bookDTO.getDescription(), result.getDescription());
//        assertEquals(bookDTO.getPrice(), result.getPrice()); //result.getPrice()
//        assertEquals(bookDTO.getSale(), result.getSale());
//        assertEquals(bookDTO.getSalePrice(), result.getSalePrice(), 0.001);
//        assertEquals(bookDTO.getInventory_quantity(), result.getInventory_quantity());
//        assertEquals(bookDTO.getImage_url(), result.getImage_url());
//        assertEquals(bookDTO.getImage_id(), result.getImage_id());
//        assertEquals(bookDTO.getStatus(), result.getStatus());
//        assertEquals(bookDTO.getRating(), result.getRating(), 0.001);
	}

	@Test
	public void testAddNewBook_ExceptionThrown() {
		// Arrange
		BookDTO bookDTO = new BookDTO();
		when(mapper.map(any(BookDTO.class), eq(BookEntity.class))).thenThrow(new RuntimeException("Test exception"));

		// Act & Assert
		try {
			bookService.addNewBook(bookDTO);
			// Nếu không có ngoại lệ được ném ra, test sẽ thất bại
			fail("Expected RuntimeException to be thrown");
		} catch (RuntimeException e) {
			// Kiểm tra xem ngoại lệ có chứa thông điệp mong muốn không
			assertTrue(e.getMessage().contains("Test exception"));
		}

		// Kiểm tra rằng không có lệnh nào được gọi trên bookRepo sau khi có ngoại lệ
		// được ném ra
		verifyNoInteractions(bookRepo);
	}

	@Test
	public void testUpdateImgBook_ExceptionThrown() {
		// Arrange
		Long id = 1L;
		when(bookRepo.findById(id)).thenThrow(new RuntimeException("Test exception"));

		// Act & Assert
		assertThrows(RuntimeException.class, () -> {
			bookService.updateImgBook(id, "imageUrl", "imageId");
		});
	}

	@Test
	public void testChangeStatusBook_Success() {
		// Arrange
		BookEntity mockBook = new BookEntity();
		mockBook.setId(1L);
		mockBook.setStatus(BookStatus.Availabled);

		when(bookRepo.findById(1L)).thenReturn(Optional.of(mockBook));

		// Act
		String result = bookService.changeStatusBook(1L, "SoldOut");

		// Assert
		assertEquals("Change success.", result);
		assertEquals(BookStatus.SoldOut, mockBook.getStatus());
		verify(bookRepo, times(1)).save(any(BookEntity.class));
	}

	@Test
    public void testChangeStatusBook_BookNotFound() {
        when(bookRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> bookService.changeStatusBook(1L, "Sold out"));
    }

	@Test
	public void testGetTop5Books_NoCachedResults() {
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));
		List<BookEntity> mockBookEntities = new ArrayList<>();
		for (int i = 1; i <= 5; i++) {
			BookEntity bookEntity = new BookEntity();
			bookEntity.setId((long) i);
			mockBookEntities.add(bookEntity);
		}
		Page<BookEntity> mockPage = new PageImpl<>(mockBookEntities);
		when(bookRepo.findTop5ByStatus(BookStatus.Availabled, pageable)).thenReturn(mockPage);

		// Act
		PaginationResult<BookDTO> result = bookService.getTop5Books();

		// Assert
		assertNotNull(result);
		assertEquals(5, result.getTotalItems());
		assertEquals(1, result.getTotalPages());
		assertEquals(5, result.getData().size());
	}

	@Test
    public void testGetTop5Books_ExceptionThrown() {
        when(bookRepo.findTop5ByStatus(BookStatus.Availabled, PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"))))
                .thenThrow(new NotFoundException("Books not found."));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> bookService.getTop5Books());
    }

	@Test
	public void testFindById_Success() {
		Long bookId = 1L;
		BookEntity mockBookEntity = new BookEntity();
		mockBookEntity.setId(bookId);
		mockBookEntity.setName("Test Book");
		mockBookEntity.setStatus(BookStatus.Availabled);

		BookDTO mockBook = new BookDTO();
		mockBook.setId(bookId);
		mockBook.setName("Test Book");
		mockBook.setStatus(BookStatus.Availabled);

		when(bookRepo.findById(bookId)).thenReturn(Optional.of(mockBookEntity));
		when(bookService.findById(bookId)).thenReturn(mockBook);

		// Act
		BookDTO result = bookService.findById(bookId);

		// Assert
		assertEquals(mockBookEntity.getId(), result.getId());
		assertEquals(mockBookEntity.getName(), result.getName());
		assertEquals(mockBookEntity.getStatus(), BookStatus.Availabled);
	}

	@Test
	public void testFindById_ExceptionThrown() {
		// Arrange
		Long bookId = 1L;
		when(bookRepo.findById(bookId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(RuntimeException.class, () -> bookService.findById(bookId));
	}

	@Test
	public void testGetTop5BooksByType_Success() {
		String type = "fiction";

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").type(type).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").type(type).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").type(type).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").type(type).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").type(type).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findTop5ByTypeAndStatusOrderByType(type, BookStatus.Availabled, pageable)).thenReturn(page);

		// Act
		PaginationResult<BookDTO> result = bookService.getTop5BooksByType(type);

		// Assert
		assertEquals(5, result.getData().size());
		assertEquals(5, result.getTotalItems());
		assertEquals(1, result.getTotalPages());
	}

	@Test
	public void testGetTop5BooksByType_NotFoundExceptionThrown() {
		// Arrange
		String type = "nonexistent";
		when(bookRepo.findTop5ByTypeAndStatusOrderByType(type, BookStatus.Availabled, PageRequest.of(0, 5)))
				.thenReturn(new PageImpl<>(Collections.emptyList()));

		// Act & Assert
		assertThrows(RuntimeException.class, () -> bookService.getTop5BooksByType(type));
	}

	@Test
	public void testFindByNameContaining_Success() {
		// Arrange
		String name = "Harry Potter";
		BookEntity book1 = BookEntity.builder().id(1L).name(name + " 1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name(name + " 2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name(name + " 3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name(name + " 4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name(name + " 5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		when(bookRepo.findByNameContainingAndStatus(name, BookStatus.Availabled)).thenReturn(listBooks);

		// Act
		PaginationResult<BookDTO> result = bookService.findByNameContaining(name);

		// Assert
		assertEquals(5, result.getData().size());
		assertEquals(5, result.getTotalItems());
		assertEquals(1, result.getTotalPages());
	}

	@Test
	public void testFindByNameContaining_NotFoundExceptionThrown() {
		// Arrange
		String name = "Nonexistent";
		when(bookRepo.findByNameContainingAndStatus(name, BookStatus.Availabled))
				.thenReturn(new ArrayList<>(Collections.emptyList()));

		// Act & Assert
		assertThrows(RuntimeException.class, () -> bookService.findByNameContaining(name));
	}

	@Test
	public void testGetDistinctTypesAndBranchesOfCategory_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("type1");
		branches.add("branches1");

		when(bookRepo.findDistinctTypeByCategory("test")).thenReturn(types);
		when(bookRepo.findDistinctBranchByCategory("test")).thenReturn(branches);

		List<List<String>> results = bookService.getDistinctTypesAndBranchesOfCategory("test");

		assertNotNull(results);
		assertEquals(results.size(), 2);
	}

	@Test
	public void testGetDistinctTypesAndBranchesOfCategory_ThrowException() {
		when(bookService.getDistinctTypesAndBranchesOfCategory("test")).thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class, () -> bookService.getDistinctTypesAndBranchesOfCategory("test"));
	}

	@Test
	public void testGetDistinctAllTypesAndBranches_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("type1");
		branches.add("branches1");

		when(bookRepo.findDistinctType()).thenReturn(types);
		when(bookRepo.findDistinctBranch()).thenReturn(branches);

		List<List<String>> results = bookService.getDistinctAllTypesAndBranches();

		assertNotNull(results);
		assertEquals(results.size(), 2);
	}

	@Test
	public void testGetDistinctAllTypesAndBranches_ThrowException() {
		when(bookService.getDistinctAllTypesAndBranches()).thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class, () -> bookService.getDistinctAllTypesAndBranches());
	}

	@Test
	public void testGetDistinctAllCategories_Success() {
		List<String> categories = new ArrayList<>();

		categories.add("test");

		when(bookRepo.findDistinctCategory()).thenReturn(categories);

		List<String> results = bookService.getDistinctAllCategories();

		assertNotNull(results);
		assertEquals(results.size(), 1);
	}

	@Test
	public void testGetDistinctAllCategories_ThrowException() {
		when(bookService.getDistinctAllCategories()).thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class, () -> bookService.getDistinctAllCategories());
	}

	@Test
	public void testGetAllBook_Success() {
		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findAllValidBook(BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getAllBook(1, 5, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetAllBook_InvalidPage() {
		int page = 0;
		RuntimeException exception = assertThrows(RuntimeException.class,
				() -> bookService.getAllBook(page, 10, "id", "ASC"));
		assertTrue(exception.getMessage().contains("Invalid Page"));
	}

	@Test
	public void testGetAllBook_ThrowException() {
		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findAllValidBook(BookStatus.Availabled, pageable)).thenReturn(page);
		when(bookService.getAllBook(1, 5, "id", "ASC")).thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class, () -> bookService.getAllBook(1, 5, "id", "ASC"));
	}

	@Test
	public void testGetBooksByCategory_Success() {
		String category = "test";
		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByCategory(1, 5, category, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByCategory_InvalidPage() {
		int page = 0;
		String category = "test";
		RuntimeException exception = assertThrows(RuntimeException.class,
				() -> bookService.getBooksByCategory(page, 5, category, "id", "ASC"));
		assertTrue(exception.getMessage().contains("Invalid Page"));
	}

	@Test
	public void testGetBooksByCategory_ThrowException() {
		String category = "test";
		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable)).thenReturn(page);
		when(bookService.getBooksByCategory(1, 5, category, "id", "ASC")).thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class, () -> bookService.getBooksByCategory(1, 5, category, "id", "ASC"));
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_TypesBranchesNotNull_Success() {
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, category,
				pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types,
				branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_TypesNotNull_Success() {
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndTypeInAndStatus(types, BookStatus.Availabled, category, pageable))
				.thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types,
				branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_BranchesNotNull_Success() {
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndBranchInAndStatus(branches, BookStatus.Availabled, category, pageable))
				.thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types,
				branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_TypesBranchesNull_Success() {
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndStatus(category, BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types,
				branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_InvalidPage() {
		int page = 0;
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		RuntimeException exception = assertThrows(RuntimeException.class, () -> bookService
				.getBooksByCategoryAndTypesAndBranches(page, 5, category, types, branches, "id", "ASC"));
		assertTrue(exception.getMessage().contains("Invalid Page"));
	}

	@Test
	public void testGetBooksByCategoryAndTypesAndBranches_ThrowException() {
		String category = "test";
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").category(category).build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").category(category).build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").category(category).build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").category(category).build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").category(category).build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByCategoryAndTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, category,
				pageable)).thenReturn(page);

		when(bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types, branches, "id", "ASC"))
				.thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class,
				() -> bookService.getBooksByCategoryAndTypesAndBranches(1, 5, category, types, branches, "id", "ASC"));
	}

	// ---------------
	@Test
	public void testGetBooksByTypesAndBranches_TypesBranchesNotNull_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, pageable))
				.thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByTypesAndBranches_TypesNotNull_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByTypeInAndStatus(types, BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByTypesAndBranches_BranchesNotNull_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByBranchInAndStatus(branches, BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByTypesAndBranches_TypesBranchesNull_Success() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findAllValidBook(BookStatus.Availabled, pageable)).thenReturn(page);

		PaginationResult<BookDTO> results = bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC");

		assertNotNull(results);
		assertEquals(5, results.getData().size());
		assertEquals(5, results.getTotalItems());
		assertEquals(1, results.getTotalPages());
	}

	@Test
	public void testGetBooksByTypesAndBranches_InvalidPage() {
		int page = 0;
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		RuntimeException exception = assertThrows(RuntimeException.class,
				() -> bookService.getBooksByTypesAndBranches(page, 5, types, branches, "id", "ASC"));
		assertTrue(exception.getMessage().contains("Invalid Page"));
	}

	@Test
	public void testGetBooksByTypesAndBranches_ThrowException() {
		List<String> types = new ArrayList<>();
		List<String> branches = new ArrayList<>();

		types.add("test");
		branches.add("test");

		BookEntity book1 = BookEntity.builder().id(1L).name("test1").build();
		BookEntity book2 = BookEntity.builder().id(2L).name("test2").build();
		BookEntity book3 = BookEntity.builder().id(3L).name("test3").build();
		BookEntity book4 = BookEntity.builder().id(4L).name("test4").build();
		BookEntity book5 = BookEntity.builder().id(5L).name("test5").build();

		List<BookEntity> listBooks = new ArrayList<>();
		listBooks.add(book1);
		listBooks.add(book2);
		listBooks.add(book3);
		listBooks.add(book4);
		listBooks.add(book5);

		Page<BookEntity> page = new PageImpl<>(listBooks);
		Pageable pageable = PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "id"));

		when(bookRepo.findByTypeInAndBranchInAndStatus(types, branches, BookStatus.Availabled, pageable)).thenReturn(page);

		when(bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC"))
				.thenThrow(RuntimeException.class);
		assertThrows(RuntimeException.class,
				() -> bookService.getBooksByTypesAndBranches(1, 5, types, branches, "id", "ASC"));
	}
}
