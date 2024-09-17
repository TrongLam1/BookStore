import { HttpException, HttpStatus } from '@nestjs/common';

export class NotEnoughBookException extends HttpException {
    constructor(message: string = 'Số lượng sách còn lại không đủ.') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundBookException extends HttpException {
    constructor(message: string = 'Không tìm thấy thông tin sách.') {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
