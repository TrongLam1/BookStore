package com.java.bookstore.services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.java.bookstore.entities.AccountEntity;

public interface IAccountService {

	UserDetailsService userDetailsService();
	Optional<AccountEntity> findByEmail(String email);
}
