package com.java.bookstore.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
import org.springframework.data.domain.Sort;

import com.java.bookstore.dtos.CommentDTO;
import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.CommentEntity;
import com.java.bookstore.entities.Role;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CommentRepository;
import com.java.bookstore.requests.CommentRequest;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.impl.CommentServiceImpl;
import com.java.bookstore.services.impl.JwtServiceImpl;

@ExtendWith(MockitoExtension.class)
public class CommentServiceTest {

	@Mock
	private CommentRepository commentRepo;

	@Mock
	private AccountRepository accountRepo;

	@Mock
	private BookRepository bookRepo;

	@Mock
	private JwtServiceImpl jwtService;

	@Mock
	private ModelMapper mapper;

	@InjectMocks
	private CommentServiceImpl commentService;

	@Test
	public void testPostCommentByUser_Success() {
		String token = "validToken";
		Long productId = 1L;
		CommentRequest request = new CommentRequest();
		request.setContent("Great book!");
		request.setRating(5);

		String email = "test@example.com";
		AccountEntity accountEntity = new AccountEntity();
		accountEntity.setEmail(email);
		accountEntity.setRole(Role.USER);

		when(jwtService.extractUsername(token)).thenReturn(email);
		when(accountRepo.findByEmail(email)).thenReturn(Optional.of(accountEntity));

		BookEntity bookEntity = BookEntity.builder().id(productId).name("test").listComments(new ArrayList<>()).build();

		when(bookRepo.findById(productId)).thenReturn(Optional.of(bookEntity));

		String result = commentService.postCommentByUser(token, productId, request);

		assertEquals("Post comment success.", result);
	}

	@Test
	public void testPostCommentByUser_InvalidToken_ExceptionThrown() {
		String token = "invalidToken";
		Long productId = 1L;
		CommentRequest request = new CommentRequest();
		request.setContent("Great book!");
		request.setRating(5);

		when(jwtService.extractUsername(token)).thenThrow(new NotFoundException("Not found email invalidToken"));

		assertThrows(RuntimeException.class, () -> commentService.postCommentByUser(token, productId, request));
	}

	@Test
	public void testGetCommentsForProduct_Success() {
		Long productId = 1L;
		int pageNo = 1;

		BookEntity bookEntity = BookEntity.builder().id(productId).name("test").listComments(new ArrayList<>()).build();
		when(bookRepo.findById(productId)).thenReturn(Optional.of(bookEntity));

		CommentEntity commentEntity1 = CommentEntity.builder().id(1L).build();
		CommentEntity commentEntity2 = CommentEntity.builder().id(2L).build();
		List<CommentEntity> listComments = new ArrayList<>();
		listComments.add(commentEntity1);
		listComments.add(commentEntity2);

		Page<CommentEntity> mockPage = new PageImpl<>(listComments);

		when(mapper.map(any(CommentEntity.class), eq(CommentDTO.class))).thenReturn(new CommentDTO());
		when(commentRepo.findByBookId(productId, PageRequest.of(pageNo, 15, Sort.by(Sort.Direction.ASC, "id"))))
				.thenReturn(mockPage);

		PaginationResult<CommentDTO> result = commentService.getCommentsForProduct(productId, pageNo);

		assertEquals(2, result.getTotalItems());
		assertEquals(1, result.getTotalPages());
		assertEquals(2, result.getData().size());
	}

	@Test
	public void testGetCommentsForProduct_InvalidPage_ExceptionThrown() {
		Long productId = 1L;
		int pageNo = 0;

		assertThrows(RuntimeException.class, () -> commentService.getCommentsForProduct(productId, pageNo));
	}

	@Test
	public void testGetCommentsForProduct_InvalidProductId_ExceptionThrown() {
		// Arrange
		Long productId = 1L;
		int pageNo = 1;

		when(bookRepo.findById(productId)).thenReturn(Optional.empty());

		// Act & Assert
		assertThrows(RuntimeException.class, () -> commentService.getCommentsForProduct(productId, pageNo));
	}
}
