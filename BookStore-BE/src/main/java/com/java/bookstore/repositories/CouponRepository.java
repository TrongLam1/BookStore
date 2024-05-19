package com.java.bookstore.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.java.bookstore.entities.CouponEntity;

@Repository
public interface CouponRepository extends JpaRepository<CouponEntity, Long> {

	Optional<CouponEntity> findByName(String name);

	@Query("SELECT c FROM CouponEntity c WHERE c.expiredDate > CURRENT_DATE AND c.quantity > 0")
	List<CouponEntity> findValidCoupons();
}
