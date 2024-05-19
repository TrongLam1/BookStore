package com.java.bookstore.consumer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.java.bookstore.dtos.BookDTO;
import com.java.bookstore.entities.BookEntity;
import com.java.bookstore.services.impl.BookServiceImpl;

import lombok.extern.slf4j.Slf4j;

//@Component
//@Slf4j
//public class KafkaConsumer {
//	
//	@Autowired
//	private BookServiceImpl bookService;
//	
//	@Autowired
//	private SimpMessagingTemplate messagingTemplate;
//
//	@KafkaListener(topics = {"insert-new-book"}, groupId = "groupA")
//	public void consumeGetBook(BookDTO book) {
//		log.info("Consuming message book id: " + book.toString());
//		messagingTemplate.convertAndSend("topic/public", book);
//	}
//}
