/*
설명: 사용자 예외 처리 DTO
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/
package wizard.eVC.wizLog.exception.dto;

import lombok.Data;

@Data
public class UserExceptionDto {
    //ErrLog
    public int nErrID;          //ErrID
    public String sComputer;    //컴퓨터 이름
    public String sUserID;      //로그인 ID
    public int nErrNO;          //ErrNO
    public int nErrIndex;       //ErrIndex
    public String sErrMsg;      //ErrMsg
    //ErrLogSub
    public String sErrData;     //ErrData
    public int nErrSeq;         //ErrSeq
}
