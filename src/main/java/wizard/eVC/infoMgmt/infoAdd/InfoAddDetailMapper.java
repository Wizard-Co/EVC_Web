/*
설명: 공지사항 추가 상세 맵퍼
작성일: 2024.10.30
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoAdd;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;

import java.util.List;
import java.util.Map;

@Mapper
public interface InfoAddDetailMapper {
    //저장
    InfoAddDetailDto xp_info_iInfo(InfoAddDetailDto infoAddDetailDto);

    //수정
    InfoAddDetailDto xp_info_uInfo(InfoAddDetailDto infoAddDetailDto);

    //개별사원저장
    InfoAddDetailDto xp_infoUS_iInfoUS(String infoID, String personID, String userID);

    //왼쪽 그리드
    List<InfoAddDetailDto> xp_person_sPerson_infoSave(Map<String, Object> param);

    //오른쪽 그리드
    List<InfoAddDetailDto> xp_infoUS_sinfoUS_infoSave(Map<String, Object> param);


}
