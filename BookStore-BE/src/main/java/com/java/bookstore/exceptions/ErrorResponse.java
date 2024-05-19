package com.java.bookstore.exceptions;

import java.io.Serializable;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 3910309918666492105L;
	
	private Date timestamp;
	
    private int status;
    
    private String path;
    
    private String error;
    
    private String message;

}
