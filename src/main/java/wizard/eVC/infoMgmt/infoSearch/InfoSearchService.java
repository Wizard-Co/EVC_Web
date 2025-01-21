/*
설명: 공지사항 조회 서비스
작성일: 2024.11.01
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoSearch;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.common.util.Date;
import wizard.eVC.infoMgmt.infoSearch.dto.InfoSearchDto;
import wizard.eVC.wizLog.exception.UserException;
import wizard.eVC.wizLog.log.LogService;

import java.util.List;


@Service
public class InfoSearchService {

    @Autowired
    private InfoSearchMapper ifsMapper;

    @Autowired
    private LogService logService;

    @Autowired
    public Date customDate;

    //전체 공지사항 조회
    @Transactional
    public List<InfoSearchDto> getInfoSearchAllDataList() {
        try {
            List<InfoSearchDto> infoAllData = ifsMapper.xp_info_sinfo_all();
            //로그 남기기
            logService.logSave("xp_info_sinfo_all", "R", "Win_com_Info", "");
            return infoAllData;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sinfo_all", System.getProperty("user.name") ,"admin","");
        }
    }

    //개별 공지사항 조회
    @Transactional
    public List<InfoSearchDto> getInfoSearchPersonDataList(String userID) {
        try {
            List<InfoSearchDto> infoPersonData = ifsMapper.xp_info_sinfo_person(userID);
            return infoPersonData;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sinfo_person", System.getProperty("user.name") ,"admin",userID);
        }

    }

    //공지사항 첨부문서 조회
    @Transactional
    public List<InfoSearchDto> getInfoSearchAttachFileDataList(String userID) {
        try {
            List<InfoSearchDto> infoAttachFileData = ifsMapper.xp_info_sinfo_attachFile(userID);
            return infoAttachFileData;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sinfo_attachFile", System.getProperty("user.name") ,"admin",userID);
        }
    }

    //공지사항 조회수 (쿠키)
    @Transactional
    public void setHitCount(InfoSearchDto infoSearchDto, HttpServletRequest request, HttpServletResponse response) {

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

            infoSearchDto.setHitCount(infoSearchDto.getHitCount() + 1);
            ifsMapper.xp_info_uinfo_hitCount(infoSearchDto);

//        }

    }

    //로그 조회하여 공지사항에 c 추가 u 수정 d 삭제 여부 확인
    @Transactional
    public InfoSearchDto getInfoSearchlog(String searchDate) {
        try {
            InfoSearchDto infoLog = ifsMapper.xp_info_sinfo_log(searchDate);
            return infoLog;
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"xp_info_sinfo_log", System.getProperty("user.name") ,"admin",searchDate);
        }
    }


    //일자 yyyymmdd을 yyyy-mm-dd로 변환
    public void getDateSet(List<InfoSearchDto> lstInfoAdd) {
        for (int i = 0; i < lstInfoAdd.size(); i++) {
            String fromdate = lstInfoAdd.get(i).getFromDate();
            String _fromdate = customDate.StringDateFormat(fromdate);
            String toDate = lstInfoAdd.get(i).getToDate();
            String _toDate = customDate.StringDateFormat(toDate);
            lstInfoAdd.get(i).setFromDate(_fromdate);
            lstInfoAdd.get(i).setToDate(_toDate);
        }
    }

}
