/*
설명: 사용자 예외 처리 Controller
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import wizard.eVC.wizLog.exception.dto.UserExceptionDto;

@ControllerAdvice
public class UserExceptionController {

    @Autowired
    private UserExceptionService userExceptionService;

    @ExceptionHandler(UserException.class)
    public ResponseEntity<UserException> handleUserNotFoundException(UserException e) throws JsonProcessingException {
        try {
            UserException errorResponse = new UserException(e.getUserMessage(),e.getMessage(), e.getMapping(), e.getComID(), e.getUserID(), e.getParam());

            UserExceptionDto userExceptionDto = new UserExceptionDto();

            userExceptionDto.setNErrID(0);
            userExceptionDto.setSComputer(e.getComID());
            userExceptionDto.setSUserID(e.getUserID());
            userExceptionDto.setNErrNO(0);              //HttpStatus.INTERNAL_SERVER_ERROR.value()
            userExceptionDto.setSErrMsg(e.getMessage());
            userExceptionDto.setNErrIndex(0);

            //컴퓨터ID, userID, Errno Errindex ErrMsg
            Integer errid = userExceptionService.insertErrLog(userExceptionDto);
            userExceptionDto.setNErrID(errid);

            userExceptionDto.setNErrSeq(0);
            userExceptionDto.setSErrData(e.getMapping() +" "+ e.getParam());

            userExceptionService.insertErrLogSub(userExceptionDto);

            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch (Exception ex){
            UserException exErrorResponse = new UserException("ERROR",ex.getMessage());
            System.out.println(exErrorResponse);
            return new ResponseEntity<>(exErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<UserException> handleGeneralException(Exception e) {
        UserException exError = new UserException("ERROR","","","","",null);
        return new ResponseEntity<>(exError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
