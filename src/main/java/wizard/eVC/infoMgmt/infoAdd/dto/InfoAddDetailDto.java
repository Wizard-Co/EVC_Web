/*
설명: 공지사항등록, 상세조회 DTO
작성일: 2024.10.18
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.infoMgmt.infoAdd.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;

import java.util.Date;

@Data
public class InfoAddDetailDto {
    //js, mapper, 프로시저 조회 값과 같아야 됨
    //개별 공지등록시 사용할 사원 그리드 데이터
    public String depart;              //부서
    public String person;              //사원
    public String departID;            //부서ID
    public String personID;            //사원ID

    //저장시 사용할 데이터
    public String infoID;           //공지사항번호
    public String companyID;        //회사ID
    public String allYN;            //구분(전체, 개별)
    public String topNotifyYN;      //상단게시글 여부
    public String fromDate;         //시작일
    public String toDate;           //종료일
    public String info;             //공지사항내용
    public String attachFile;       //첨부문서
    public String attachPath;       //첨부문서경로
    public String userID;           //작성자
    public ArrayList<String> personIDList; //사원ID(여러명의 사원을 추가 할수있어 리스트로 처리)

    //트리구조에서 사용하는 데이터
    public String dpID;     //부서ID or 사원ID
    public String dpName;   //부서이름 or 사원이름
    public String dpParentID; //부서인 경우 #, 사원인 경우 소속된 부서 ID
    public String mainWorkYN; //주강사 여부

    //th:field를 사용하여 타입이 다른 경우 타입을 같게 하기 위해 같은 타입 데이터
    public boolean topNotifyYNDetail;       //상단게시글 여부
    public MultipartFile attachFileDetail;  //첨부문서
    public String deleteAttachFile; //수정, 삭제 여부 판단하는 변수

    //조회수에서 사용할 데이터
    public long hitCount;           //조회수 여부
}
