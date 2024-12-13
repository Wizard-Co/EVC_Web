/*
설명: 사용자 예외 처리 생성자
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

@Data
@EqualsAndHashCode(callSuper=false)
public class UserException extends RuntimeException{
    public String userMessage;  //사용자 메세지
    public String message;      //오류 메세지
    public String mapping;      //프로시저이름
    public String comID;        //컴퓨터 이름
    public String userID;       //로그인한 ID
    public Object param;        //프로시저 파라미터

    // 기본 생성자
    public UserException(String userMessage, String message, String mapping, String comID, String userID, Object param ) {
        this.userMessage = userMessage;
        this.message = message;
        this.mapping = mapping;
        this.comID = comID;
        this.userID = userID;
        this.param = param;
    }

    //이외의 오류
    public UserException(String userMessage, String message) {
        this.userMessage = userMessage;
        this.message = message;
    }
}
