package com.java.bookstore.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.java.bookstore.entities.OrderEntity;
import com.java.bookstore.entities.OrderStatus;
import com.java.bookstore.entities.UserEntity;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

	Optional<OrderEntity> findById(Long id);
	
	long countByUser(UserEntity user);
	
	Page<OrderEntity> findByUser(UserEntity user, Pageable pageable);
	
	Optional<OrderEntity> findByPaymentCode(String paymentCode);
	
	Page<OrderEntity> findByStatus(OrderStatus status, Pageable pageable);
	
	@Query("SELECT o FROM OrderEntity o WHERE o.user = :user ORDER BY o.createdDate DESC LIMIT 1")
	Optional<OrderEntity> findLatestOrder(@Param("user") UserEntity user);
	
	@Query(value = "SELECT COUNT(*) FROM orders WHERE orders.status = '2'", nativeQuery = true)
    Long countDeliveredOrders();

    @Query(value = "SELECT COUNT(*) FROM orders WHERE orders.status = '0'", nativeQuery = true)
    Long countCanceledOrders();
    
    @Query(value = "SELECT COUNT(*) FROM orders WHERE orders.status = '1'", nativeQuery = true)
    Long countNotYetDeliveredOrders();
    
    @Query(value = "SELECT SUM(orders.total_prices_order) FROM orders WHERE orders.status = '2'", nativeQuery = true)
    Long totalRevenue();
    
    @Query(value = "SELECT MONTH(created_date) as month, SUM(total_prices_order) as total "
    		+ "FROM bookstore.orders WHERE YEAR(created_date) = :year AND status = '2' "
    		+ "GROUP BY MONTH(created_date) ORDER BY MONTH(created_date)", nativeQuery = true)
    List<Object[]> getTotalPriceByMonthInYear(@Param("year") int year);
    
    @Query(value = "SELECT DATE_FORMAT(created_date, '%Y-%m-%d') as date, SUM(total_prices_order) as total "
    		+ "FROM bookstore.orders WHERE created_date BETWEEN :startDate AND :endDate AND status = '2' "
    		+ "GROUP BY DATE_FORMAT(created_date, '%Y-%m-%d') ORDER BY created_date", nativeQuery = true)
    List<Object[]> getTotalPriceInDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
