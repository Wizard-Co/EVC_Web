/*
설명: 사용자 예외 처리 Controller
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.exception;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import wizard.eVC.wizLog.exception.dto.UserExceptionDto;

@Controller
@AllArgsConstructor
public class UserExceptionController {

    private UserExceptionService userExceptionService;

    @ExceptionHandler(UserException.class)
    public ResponseEntity<UserException> handleUserNotFoundException(UserException e){
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
            UserException exErrorResponse = new UserException("오류 발생",ex.getMessage());
            return new ResponseEntity<>(exErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 기타 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<UserException> handleGeneralException(Exception e) {
        UserException errorResponse = new UserException("오류",e.getMessage(), "", System.getProperty("user.name"), "admin", "");

        UserExceptionDto userExceptionDto = new UserExceptionDto();

        userExceptionDto.setNErrID(0);
        userExceptionDto.setSComputer(System.getProperty("user.name"));
        userExceptionDto.setSUserID("admin");
        userExceptionDto.setNErrNO(0);              //HttpStatus.INTERNAL_SERVER_ERROR.value()
        userExceptionDto.setSErrMsg(e.getMessage());
        userExceptionDto.setNErrIndex(0);

        //컴퓨터ID, userID, Errno Errindex ErrMsg
        Integer errid = userExceptionService.insertErrLog(userExceptionDto);
        userExceptionDto.setNErrID(errid);

        userExceptionDto.setNErrSeq(0);
        userExceptionDto.setSErrData(e.getMessage());

        userExceptionService.insertErrLogSub(userExceptionDto);

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
