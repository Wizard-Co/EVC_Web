/*
설명: 공지사항 조회 컨트롤러
작성일: 2024.11.01
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoSearch;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.common.util.Excel;
import wizard.eVC.infoMgmt.infoAdd.InfoAddService;
import wizard.eVC.infoMgmt.infoSearch.dto.InfoSearchDto;
import wizard.eVC.common.util.FTP;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.List;
import java.util.Map;


import org.springframework.http.ResponseEntity;
import wizard.eVC.wizLog.log.LogService;

@Controller
public class InfoSearchController {

    @Autowired
    private InfoAddService ifaService;

    @Autowired
    private InfoSearchService ifsService;

    @Autowired
    private LogService logService;

    @Autowired
    private FTP ftp;

    @Autowired
    private Excel excel;

    private Date searchDate;

    /*화면*/
    @GetMapping("/pages/infoMgmt/infoSearch/infoSearch")
    public String search() throws UnknownHostException {
        //로그 남기기
        logService.logSave("xp_info_sinfo_all", "S", "Win_com_Info", "");
        return "pages/infoMgmt/infoSearch/infoSearch";
    }

    /*화면*/
    @PostMapping("/pages/infoMgmt/infoSearch/infoSearch/close")
    public ResponseEntity<Void>  searchClose() throws UnknownHostException {
        //로그 남기기
        logService.logSave("xp_info_sinfo_all", "S", "Win_com_Info", "");
        return ResponseEntity.noContent().build();  // 상태 코드만 반환하고 템플릿은 사용하지 않음
    }

    /*전체 공지*/
    @PostMapping(value = "/infoMgmt/infoSearch/search/all")
    @ResponseBody
    public List<InfoSearchDto> getInfoAllData(@RequestBody Map<String, Object> param, HttpServletRequest request, HttpServletResponse response) {
        searchDate = new Date();
        List<InfoSearchDto> infoAllData = ifsService.getInfoSearchAllDataList();

        //조회수 계산
        for(int i = 0; i < infoAllData.size(); i++) {
            ifsService.setHitCount(infoAllData.get(i), request, response);
        }

        return infoAllData;
    }

    /*개별 공지*/
    @PostMapping(value = "/infoMgmt/infoSearch/search/person")
    @ResponseBody
    public List<InfoSearchDto> getInfoPersonData(@RequestBody Map<String, Object> param, HttpServletRequest request, HttpServletResponse response) {
        searchDate = new Date();
        List<InfoSearchDto> infoPersonData = ifsService.getInfoSearchPersonDataList(param.get("userID").toString());

        //조회수 계산
        for(int i = 0; i < infoPersonData.size(); i++) {
            ifsService.setHitCount(infoPersonData.get(i), request, response);
        }

        return infoPersonData;
    }

    /*첨부 문서*/
    @PostMapping(value = "/infoMgmt/infoSearch/search/attachFile")
    @ResponseBody
    public List<InfoSearchDto> getInfoattachFileData(@RequestBody Map<String, Object> param, HttpServletRequest request, HttpServletResponse response) {
        searchDate = new Date();
        List<InfoSearchDto> infoAttachFileData = ifsService.getInfoSearchAttachFileDataList(param.get("userID").toString());
        ifsService.getDateSet(infoAttachFileData);

//        //조회수 계산
//        for(int i = 0; i < infoAttachFileData.size(); i++) {
//            ifsService.setHitCount(infoAttachFileData.get(i), request, response);
//        }

        return infoAttachFileData;
    }

    /*다운 로드*/
    @GetMapping("/infoMgmt/infoSearch/download")
    public void download(HttpServletResponse response,
                         @RequestParam(name = "filePath") String filePath,
                         @RequestParam(name = "fileName") String fileName) throws IOException {

        ftp.httpDownload(fileName, filePath, response);

    }

    /* TODO 엑셀 필요함*/
    /* TODO 로그 확인(확인 후 변경사항이 있으면 화면에서 메세지창 보이게 하기 위해)*/
    /*공지 로그(로그에 c 추가 u 수정 d 삭제가 있는 경우 메세지창 보여주기)*/
    @PostMapping(value = "/infoMgmt/infoSearch/search/log")
    @ResponseBody
    public InfoSearchDto getInfoLog(@RequestBody Map<String, Object> param) {
        // 날짜 포맷 설정 (밀리초까지 포함)
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        // 날짜를 지정한 형식으로 변환
        String formattedDate = dateFormat.format(searchDate);
        InfoSearchDto infoLogData = ifsService.getInfoSearchlog(formattedDate);

        return infoLogData;
    }

    //TODO 엑셀 하나로 처리하기
    //엑셀 다운로드
    @PostMapping("/infoMgmt/infoSearch/excel")
    @ResponseBody
    public  ResponseEntity<byte[]>ExcelDownload(HttpServletResponse response, @RequestBody Excel.DataTableRequest headerdata) {
        try {

            List<String> header = headerdata.getHeaders();
            List<Object> data = headerdata.getData();

            byte[] exceldata = excel.excelDownload(response, header, data, "infoSearch");

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=infoSearch.xlsx");

            return new ResponseEntity<>(exceldata, headers, HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


}

