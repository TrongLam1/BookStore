package com.java.bookstore.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.bookstore.entities.CommentEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

	@Query("SELECT c FROM CommentEntity c WHERE c.book.id = :bookId")
	Page<CommentEntity> findByBookId(@Param("bookId") Long productId, Pageable pageable);

	@Query("SELECT AVG(c.rating) FROM CommentEntity c WHERE c.book.id = :bookId")
	Double getAverageRatingForBook(@Param("bookId") long bookId);
}
