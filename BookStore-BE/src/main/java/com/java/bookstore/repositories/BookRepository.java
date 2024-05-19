package com.java.bookstore.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.entities.BookStatus;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long> {

	Optional<BookEntity> findByName(String name);

	Optional<BookEntity> findById(Long id);

	@Query(value = "SELECT * FROM bookstore.book WHERE inventory > 0 AND status = 1 AND category = :category ORDER BY RAND() LIMIT 5", nativeQuery = true)
	List<BookEntity> findRandomBooksByCategory(@Param("category") String category);

	@Query("SELECT b FROM BookEntity b WHERE b.inventory_quantity > 0 AND b.status = :status")
	Page<BookEntity> findTop5ByStatus(@Param("status") BookStatus status, Pageable pageable);

	@Query("SELECT b FROM BookEntity b WHERE b.inventory_quantity > 0 AND b.type = :type AND b.status = :status ORDER BY b.type")
	Page<BookEntity> findTop5ByTypeAndStatusOrderByType(@Param("type") String type, @Param("status") BookStatus status,
			Pageable pageable);

	List<BookEntity> findByNameContainingAndStatus(String name, BookStatus status);

	@Query("SELECT DISTINCT b.type FROM BookEntity b WHERE b.category = :category")
	List<String> findDistinctTypeByCategory(@Param("category") String category);

	@Query("SELECT DISTINCT b.branch FROM BookEntity b WHERE b.category = :category")
	List<String> findDistinctBranchByCategory(@Param("category") String category);

	@Query("SELECT DISTINCT b.category FROM BookEntity b")
	List<String> findDistinctCategory();

	@Query("SELECT DISTINCT b.type FROM BookEntity b")
	List<String> findDistinctType();

	@Query("SELECT DISTINCT b.branch FROM BookEntity b")
	List<String> findDistinctBranch();

	@Query("SELECT b FROM BookEntity b WHERE b.status = :valid")
	Page<BookEntity> findAllValidBook(@Param("valid") BookStatus valid, Pageable pageable);

	Page<BookEntity> findByCategoryAndStatus(String name, BookStatus status, Pageable pageable);

	// ------------------------------ Find category ----------------------------

	@Query("SELECT b FROM BookEntity b WHERE b.category = :category AND b.type IN :types AND "
			+ "b.branch IN :branches AND b.status = :valid")
	Page<BookEntity> findByCategoryAndTypeInAndBranchInAndStatus(@Param("types") List<String> types,
			@Param("branches") List<String> branches, @Param("valid") BookStatus valid,
			@Param("category") String category, Pageable pageable);

	@Query("SELECT b FROM BookEntity b WHERE b.category = :category AND b.type IN :types AND " + "b.status = :valid")
	Page<BookEntity> findByCategoryAndTypeInAndStatus(@Param("types") List<String> types,
			@Param("valid") BookStatus valid, @Param("category") String category, Pageable pageable);

	@Query("SELECT b FROM BookEntity b WHERE b.category = :category AND b.branch IN :branches AND "
			+ "b.status = :valid")
	Page<BookEntity> findByCategoryAndBranchInAndStatus(@Param("branches") List<String> branches,
			@Param("valid") BookStatus valid, @Param("category") String category, Pageable pageable);

	// ------------------------------ Find not category ----------------------------

	@Query("SELECT b FROM BookEntity b WHERE b.type IN :types AND b.branch IN :branches AND b.status = :valid")
	Page<BookEntity> findByTypeInAndBranchInAndStatus(@Param("types") List<String> types,
			@Param("branches") List<String> branches, @Param("valid") BookStatus valid, Pageable pageable);

	@Query("SELECT b FROM BookEntity b WHERE  b.type IN :types AND b.status = :valid")
	Page<BookEntity> findByTypeInAndStatus(@Param("types") List<String> types, @Param("valid") BookStatus valid,
			Pageable pageable);

	@Query("SELECT b FROM BookEntity b WHERE b.branch IN :branches AND b.status = :valid")
	Page<BookEntity> findByBranchInAndStatus(@Param("branches") List<String> branches, @Param("valid") BookStatus valid,
			Pageable pageable);
}
