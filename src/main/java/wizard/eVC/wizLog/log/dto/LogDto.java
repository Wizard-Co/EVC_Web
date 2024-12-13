/*
설명: log DTO
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.log.dto;

import lombok.Data;

@Data
public class LogDto {
    //log
    public String ComputerID;   //컴퓨터이름
    public String UserID;       //로그인 ID
    public String LogData;      //로그 데이터

    //화면 log
    public String sCompanyID;       //회사ID
    public String sMenuID;          //menuID
    public String sWorkFlag;        //C 추가 R 조회 U 수정 D 삭제
    public String sWorkDate;        //이벤트일자
    public String sWorkTime;        //이벤트시간
    public String sUserID;          //로그인 ID
    public String sWorkComputer;    //컴퓨터이름
    public String sWorkComputerIP;  //컴퓨터IP
    public String sWorkLog;         //화면이름
    public String sProgramID;       //화면이름 mt_menu programID
}
