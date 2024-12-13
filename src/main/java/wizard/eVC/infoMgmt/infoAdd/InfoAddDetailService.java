/*
설명: 공지사항 추가 상세 서비스
작성일: 2024.10.30
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoAdd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.wizLog.exception.UserException;
import wizard.eVC.wizLog.log.LogService;

import java.util.List;
import java.util.Map;

@Service
public class InfoAddDetailService {

    @Autowired
    private InfoAddDetailMapper ifadMapper;

    @Autowired
    private LogService logService;

    //저장
    @Transactional
    public String saveInfo(InfoAddDetailDto infoAddDetailDto) {
        try {
            ifadMapper.xp_info_iInfo(infoAddDetailDto);
            //로그 남기기
            logService.logSave("xp_info_iInfo", "C", "Win_com_InfoSet", infoAddDetailDto);
            return infoAddDetailDto.getInfoID();
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_iInfo", System.getProperty("user.name") ,"admin",infoAddDetailDto);
        }
    }

    //수정
    @Transactional
    public void updateInfo(InfoAddDetailDto infoAddDetailDto) {
        try {
            ifadMapper.xp_info_uInfo(infoAddDetailDto);
            //로그 남기기
            logService.logSave("xp_info_uInfo", "U", "Win_com_InfoSet", infoAddDetailDto);
        } catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_uInfo", System.getProperty("user.name") ,"admin",infoAddDetailDto);
        }
    }

    //개별사원저장
    @Transactional
    public void savePersonInfo(String infoID ,String personIDList, String userID) {
        try {
            ifadMapper.xp_infoUS_iInfoUS(infoID, personIDList, userID);
        }catch (Exception e) {
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_infoUS_iInfoUS", System.getProperty("user.name") ,"admin", infoID);
        }
    }

    //왼쪽 그리드
    @Transactional
    public List<InfoAddDetailDto> getInfoLeftPersonDataList(Map<String, Object> param) {
        try {
            List<InfoAddDetailDto> list = ifadMapper.xp_person_sPerson_infoSave(param);
            return list;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_person_sPerson_infoSave", System.getProperty("user.name") ,"admin", param);
        }
    }

    //오른쪽 그리드
    @Transactional
    public List<InfoAddDetailDto> getInfoRightPersonDataList(Map<String, Object> param) {
        try {
            List<InfoAddDetailDto> list = ifadMapper.xp_infoUS_sinfoUS_infoSave(param);
            return list;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_infoUS_sinfoUS_infoSave", System.getProperty("user.name") ,"admin", param);
        }
    }

}
