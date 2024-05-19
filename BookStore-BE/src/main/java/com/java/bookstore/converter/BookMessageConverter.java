package com.java.bookstore.converter;

import java.util.Collections;

import org.springframework.kafka.support.converter.JsonMessageConverter;
import org.springframework.kafka.support.mapping.DefaultJackson2JavaTypeMapper;
import org.springframework.kafka.support.mapping.Jackson2JavaTypeMapper;
import org.springframework.stereotype.Component;

import com.java.bookstore.dtos.BookDTO;

@Component
public class BookMessageConverter extends JsonMessageConverter {

	public BookMessageConverter() {
		super();
		DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
		typeMapper.setTypePrecedence(Jackson2JavaTypeMapper.TypePrecedence.TYPE_ID);
		typeMapper.addTrustedPackages("com.java.bookstore");
		typeMapper.setIdClassMapping(Collections.singletonMap("book", BookDTO.class));
		this.setTypeMapper(typeMapper);
	}
}
