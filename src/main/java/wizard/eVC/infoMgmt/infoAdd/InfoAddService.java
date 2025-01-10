/*
설명: 공지사항 추가 서비스
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
import wizard.eVC.common.util.Date;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDto;
import wizard.eVC.wizLog.exception.UserException;
import wizard.eVC.wizLog.log.LogService;

import java.util.List;
import java.util.Map;

@Service
public class InfoAddService {

    @Autowired
    private InfoAddMapper ifaMapper;

    @Autowired
    private LogService logService;

    @Autowired
    public Date date;

    //조회
    @Transactional
    public List<InfoAddDto> getInfoDataList(Map<String, Object> param){
        try {
            List<InfoAddDto> list = ifaMapper.xp_info_sInfo(param);
            //로그 남기기
            logService.logSave("xp_info_sInfo", "R", "Win_com_InfoSet", param);
            return list;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sInfo", System.getProperty("user.name") ,"admin",param);
        }
    }

    //상세조회
    @Transactional
    public InfoAddDetailDto getInfoDataDetailList(String infoID) {
        try {
            InfoAddDetailDto infoAddDetailDto = ifaMapper.xp_info_sInfo_detail(infoID);
            //로그 남기기
            logService.logSave("xp_info_sInfo_detail", "R", "Win_com_InfoSet", infoID);
            return infoAddDetailDto;
        }
        catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sInfo_detail", System.getProperty("user.name") ,"admin", infoID);
        }
    }

    //삭제
    @Transactional
    public void deleteInfo(String infoID) {
        try {
            ifaMapper.xp_info_dInfo(infoID);
            //로그 남기기
            logService.logSave("xp_info_dInfo", "D", "Win_com_InfoSet", infoID);
        }
        catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_dInfo", System.getProperty("user.name") ,"admin", infoID);
        }
    }

    //공지사항 조회수 (쿠키)
    @Transactional
    public void setHitCount(InfoAddDetailDto infoAddDetailDto) {

        //쿠키는 브라우저가 전부 종료한 뒤에 다시 접속하면 쿠키가 삭제되어 조회수가 다시 증가함
//        boolean hasViewed = false;
//        Cookie[] cookies = request.getCookies();
//
//        //쿠키 존재 여부 확인
//        //infoID로 확인
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                if (("viewed_" + infoSearchDto.getInfoID()).equals(cookie.getName())) {
//                    hasViewed = true;
//                    break;
//                }
//            }
//        }
//
//        // 쿠키가 없는 경우 생성 후 조회수 +1
//        // 조회한 적이 없는 경우
//        if (!hasViewed) {
//            // 쿠키 생성
//            Cookie viewedCookie = new Cookie("viewed_" + infoSearchDto.getInfoID(), "true");
//            response.addCookie(viewedCookie);

        infoAddDetailDto.setHitCount(infoAddDetailDto.getHitCount() + 1);
        ifaMapper.xp_info_uinfo_hitCount(infoAddDetailDto);

//        }

    }


    //일자 yyyymmdd을 yyyy-mm-dd로 변환
    public void getDateSet(List<InfoAddDto> lstInfoAdd) {
        for (int i = 0; i < lstInfoAdd.size(); i++) {
            String fromdate = lstInfoAdd.get(i).getFromDate();
            String _fromdate = date.StringDateFormat(fromdate);
            String toDate = lstInfoAdd.get(i).getToDate();
            String _toDate = date.StringDateFormat(toDate);
            String createDate = lstInfoAdd.get(i).getCreateDate();
            String _createDate = date.StringDateFormat(createDate);
            lstInfoAdd.get(i).setFromDate(_fromdate);
            lstInfoAdd.get(i).setToDate(_toDate);
            lstInfoAdd.get(i).setCreateDate(_createDate);
        }
    }

    public void getDataTypeSet(InfoAddDetailDto infoAddDetailDto) {
        //일자 형식을 yyyy-mm-dd로 수정
        String fromdate = infoAddDetailDto.getFromDate();
        String _fromdate = date.StringDateFormat(fromdate);
        String toDate = infoAddDetailDto.getToDate();
        String _toDate = date.StringDateFormat(toDate);

        //checkbox 체크표시하기 위해 true, false 입력
        if(infoAddDetailDto.getTopNotifyYN().equals("Y")){
            infoAddDetailDto.setTopNotifyYNDetail(true);
        }
        else{
            infoAddDetailDto.setTopNotifyYNDetail(false);
        }

        infoAddDetailDto.setFromDate(_fromdate);
        infoAddDetailDto.setToDate(_toDate);



    }

}
