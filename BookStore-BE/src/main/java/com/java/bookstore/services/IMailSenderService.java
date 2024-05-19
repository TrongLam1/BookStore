package com.java.bookstore.services;

import org.springframework.scheduling.annotation.EnableAsync;

import com.java.bookstore.dtos.MailDTO;
import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.entities.AccountEntity;

import jakarta.mail.MessagingException;

@EnableAsync
public interface IMailSenderService {

	void mailSenderResetPassword(String mail, MailDTO mailDTO) throws MessagingException;
	void mailSenderSignUp(AccountEntity account);
	void mailSenderPlaceOrder(OrderDTO order, String email);
}
