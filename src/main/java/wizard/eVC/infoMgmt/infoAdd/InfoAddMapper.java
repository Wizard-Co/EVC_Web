/*
설명: 공지사항 추가 맵퍼
작성일: 2024.10.30
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoAdd;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDto;

import java.util.List;
import java.util.Map;

@Mapper
public interface InfoAddMapper {

    //공지사항 List 조회
    List<InfoAddDto> xp_info_sInfo(Map<String, Object> param);

    //공지사항 상세조회
    InfoAddDetailDto xp_info_sInfo_detail(String infoID);

    //공지사항 삭제
    InfoAddDetailDto xp_info_dInfo(String infoID);

    //공지사항 조회수
    InfoAddDetailDto xp_info_uinfo_hitCount(InfoAddDetailDto infoAddDetailDto);
}
