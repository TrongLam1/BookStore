package com.java.bookstore.services.impl;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.java.bookstore.dtos.MailDTO;
import com.java.bookstore.dtos.OrderDTO;
import com.java.bookstore.entities.AccountEntity;
import com.java.bookstore.services.IMailSenderService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class MailSenderServiceImpl implements IMailSenderService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String fromMail;
	
	@Autowired
	private TemplateEngine templateEngine;

	@Override
	@Async
	public void mailSenderResetPassword(String mail, MailDTO mailDTO) throws MessagingException {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
		
		simpleMailMessage.setFrom(fromMail);
		simpleMailMessage.setSubject(mailDTO.getSubject());
		simpleMailMessage.setText(mailDTO.getMessage());
		simpleMailMessage.setTo(mail);

		mailSender.send(simpleMailMessage);
	}

	@Override
	@Async
	public void mailSenderSignUp(AccountEntity account) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			
			Map<String, Object> model = new HashMap<>();
			model.put("name", account.getEmail());
			model.put("content", "Bạn đã đăng kí tài khoản thành công!");
			String content = templateEngine.process("mail", new Context(Locale.getDefault(), model));
			
			helper.setFrom(fromMail);
			helper.setSubject("Đăng kí tài khoản");
			helper.setText(content, true);
			helper.setTo(account.getEmail());

			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new RuntimeException(e.toString());
		}
	}

	@Override
	@Async
	public void mailSenderPlaceOrder(OrderDTO order, String email) {
		try {
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
			
			Map<String, Object> model = new HashMap<>();
			model.put("id", order.getId());
			model.put("items", order.getOrderItems());
			model.put("totalPricesOrder", order.getTotalPricesOrder());
			String content = templateEngine.process("mail-new-order", new Context(Locale.getDefault(), model));
			
			helper.setFrom(fromMail);
			helper.setSubject("Đơn hàng #" + order.getId() + " đã được đặt thành công.");
			helper.setText(content, true);
			helper.setTo(email);

			mailSender.send(mimeMessage);
		} catch (MessagingException e) {
			throw new RuntimeException(e.toString());
		}
	}
}
