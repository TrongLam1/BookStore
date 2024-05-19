package com.java.bookstore.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.java.bookstore.dtos.CommentDTO;
import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.CommentEntity;
import com.java.bookstore.exceptions.InvalidPageException;
import com.java.bookstore.exceptions.NotFoundException;
import com.java.bookstore.repositories.AccountRepository;
import com.java.bookstore.repositories.BookRepository;
import com.java.bookstore.repositories.CommentRepository;
import com.java.bookstore.requests.CommentRequest;
import com.java.bookstore.responses.PaginationResult;
import com.java.bookstore.services.ICommentService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CommentServiceImpl extends BaseRedisServiceImpl implements ICommentService {

	@Autowired
	private CommentRepository commentRepo;

	@Autowired
	private AccountRepository accountRepo;

	@Autowired
	private BookRepository bookRepo;
	
	@Autowired
	private JwtServiceImpl jwtService;

	@Autowired
	private ModelMapper mapper;
	
	private final static String DATA_TYPE = "comments";

	@Override
	public String postCommentByUser(String token, Long productId, CommentRequest request) {
		try {
			String email = jwtService.extractUsername(token);
			AccountEntity account = accountRepo.findByEmail(email)
					.orElseThrow(() -> new NotFoundException("Not found email " + email));
			BookEntity book = bookRepo.findById(productId).orElseThrow(() -> new NotFoundException("Not found book."));
			
			CommentEntity comment = new CommentEntity();
			comment.setContent(request.getContent());
			comment.setRating(request.getRating());
			comment.setBook(book);
			comment.setUser(account.getUser());
			
			commentRepo.save(comment);
			
			book.getListComments().add(comment);
			
			bookRepo.save(book);
			
			return "Post comment success.";
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public PaginationResult<CommentDTO> getCommentsForProduct(Long productId, int pageNo) {
		try {
			if (pageNo < 1) {
				throw new InvalidPageException("Invalid page.");
			}
			
			BookEntity book = bookRepo.findById(productId)
					.orElseThrow(() -> new NotFoundException("Not found book."));
			PaginationResult<CommentDTO> results = new PaginationResult<>();
			long totalItems;
			int totalPages;
			
			if (isRedisAvailable()) {
				String key = getKeyFromList(DATA_TYPE, "bookId:" + book.getId(), pageNo, "id", "ASC");
				results = readList(key, CommentDTO.class);
				
				if (results == null) {
					results = new PaginationResult<>();
					Pageable pageable = PageRequest.of(pageNo - 1, 15, Sort.by(Sort.Direction.ASC, "id"));
					Page<CommentEntity> listComments = commentRepo.findByBookId(book.getId(), pageable);
					List<CommentDTO> listCommentsDTO = listComments.getContent()
							.stream()
							.map(item -> mapper.map(item, CommentDTO.class))
							.collect(Collectors.toList());
					totalItems = listComments.getTotalElements();
					totalPages = listComments.getTotalPages();
					
					results.setData(listCommentsDTO);
					results.setTotalItems(totalItems);
					results.setTotalPages(totalPages);
					
					saveList(results, key);
				}
			} else {
				Pageable pageable = PageRequest.of(pageNo - 1, 15, Sort.by(Sort.Direction.ASC, "id"));
				Page<CommentEntity> listComments = commentRepo.findByBookId(book.getId(), pageable);
				List<CommentDTO> listCommentsDTO = listComments.getContent().stream()
						.map(item -> mapper.map(item, CommentDTO.class))
						.collect(Collectors.toList());
				totalItems = listComments.getTotalElements();
				totalPages = listComments.getTotalPages();
				
				results.setData(listCommentsDTO);
				results.setTotalItems(totalItems);
				results.setTotalPages(totalPages);
			}
			
			return results;
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

	@Override
	public double averageRatingProduct(Long productId) {
		try {
			return commentRepo.getAverageRatingForBook(productId);
		} catch (Exception e) {
			throw new RuntimeException("Error: " + e.toString());
		}
	}

}
