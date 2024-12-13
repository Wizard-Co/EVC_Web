/*
설명: 공지사항조회 DTO
작성일: 2024.11.01
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.infoMgmt.infoSearch.dto;

import lombok.Data;
import java.util.Date;


@Data
public class InfoSearchDto {

    //js, mapper, 프로시저 조회 값과 같아야 됨
    public String rn;               //순번(infoID 기준으로 순번 부여)
    public String infoID;           //공지번호
    public String allYN;            //구분ID
    public String allYNName;        //구분이름
    public String fromDate;         //시작일
    public String toDate;           //종료일
    public String info;             //공지내용
    public String attachFile;       //첨부문서
    public String attachPath;       //첨부문서경로
    public String topNotifyYN;      //상단게시글여부
    public long hitCount;           //조회수 여부
    public long infoCount;          //공지수
    public long updateCount;        //수정여부
}
