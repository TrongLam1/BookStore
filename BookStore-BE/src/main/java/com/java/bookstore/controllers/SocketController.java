package com.java.bookstore.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.java.bookstore.dtos.NotificationOrderDTO;
import com.java.bookstore.responses.ResponseData;

import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/api/v1/socket/ws")
@CrossOrigin("http://localhost:3000")
@Slf4j
public class SocketController {
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@PostMapping("/noti/{orderId}")
	@ResponseBody
	public ResponseData<?> notificationNewOrder(@PathVariable("orderId") long orderId) {
		log.info("Send noti for new order {}", orderId);
		String time = new SimpleDateFormat("HH:mm").format(new Date());
		NotificationOrderDTO noti = new NotificationOrderDTO(orderId, time);
	    messagingTemplate.convertAndSend("/topic/public", noti);
	    return new ResponseData<>(HttpStatus.OK.value(), "Send success");
	}
}
