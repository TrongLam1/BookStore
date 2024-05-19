package com.java.bookstore.services;

import com.java.bookstore.dtos.CommentDTO;
import com.java.bookstore.requests.CommentRequest;
import com.java.bookstore.responses.PaginationResult;

public interface ICommentService {

	String postCommentByUser(String token, Long productId, CommentRequest request);
	PaginationResult<CommentDTO> getCommentsForProduct(Long productId, int pageNo);
	double averageRatingProduct(Long productId);
}
