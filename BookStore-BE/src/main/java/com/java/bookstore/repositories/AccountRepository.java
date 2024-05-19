package com.java.bookstore.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.entities.Role;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

	Optional<AccountEntity> findByEmail(String email);
	Optional<AccountEntity> findFirstByRole(Role role);
	Optional<AccountEntity> findByRefreshToken(String token);
}
