/*
설명: 공지사항 조회 맵퍼
작성일: 2024.11.01
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoSearch;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.infoMgmt.infoSearch.dto.InfoSearchDto;


import java.util.Date;
import java.util.List;
import java.util.Map;


@Mapper
public interface InfoSearchMapper {

    //공지사항 전체 조회
    List<InfoSearchDto> xp_info_sinfo_all();

    //공지사항 개별 조회
    List<InfoSearchDto> xp_info_sinfo_person(String userID);

    //공지사항 첨부문서 조회
    List<InfoSearchDto> xp_info_sinfo_attachFile(String userID);

    //공지사항 조회수
    InfoAddDetailDto xp_info_uinfo_hitCount(InfoSearchDto infoSearchDto);

    InfoSearchDto xp_info_sinfo_log(String searchDate);
}
