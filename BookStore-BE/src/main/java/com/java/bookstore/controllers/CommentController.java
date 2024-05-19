package com.java.bookstore.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.bookstore.requests.CommentRequest;
import com.java.bookstore.responses.ResponseData;
import com.java.bookstore.responses.ResponseError;
import com.java.bookstore.services.impl.CommentServiceImpl;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class CommentController {

	@Autowired
	private CommentServiceImpl commentService;

	@PostMapping("/user/post-comment/{productId}")
	public ResponseData<?> postCommentByUser(@RequestHeader("Authorization") String token,
			@PathVariable("productId") long productId, @RequestBody CommentRequest request) {
		try {
			log.info("Post comment product: {}", productId);
			String jwtToken = token.substring(7);
			return new ResponseData<>(HttpStatus.CREATED.value(), "Post success",
					commentService.postCommentByUser(jwtToken, productId, request));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/book/get-list-comments-book/{productId}/{pageNo}")
	public ResponseData<?> getListCommentsForBook(@PathVariable("productId") long productId,
			@PathVariable(value = "pageNo") int pageNo) {
		try {
			log.info("List comments product: {}, page {}", productId, pageNo);
			return new ResponseData<>(HttpStatus.OK.value(), "Get success",
					commentService.getCommentsForProduct(productId, pageNo));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}

	@GetMapping("/book/get-average-rating/{productId}")
	public ResponseData<?> getAverageBook(@PathVariable("productId") long productId) {
		try {
			log.info("Average rating product: {}", productId);
			return new ResponseData<>(HttpStatus.OK.value(), "Average rating",
					commentService.averageRatingProduct(productId));
		} catch (Exception e) {
			log.error("errorMessage={}", e.getMessage(), e.getCause());
			return new ResponseError<>(HttpStatus.BAD_REQUEST.value(), e.getMessage());
		}
	}
}
