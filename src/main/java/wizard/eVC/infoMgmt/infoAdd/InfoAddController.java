/*
설명: 공지사항 추가 컨트롤러
작성일: 2024.10.08
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoAdd;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.common.util.Excel;
import wizard.eVC.common.util.FTP;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDto;
import wizard.eVC.sysMgmt.login.LoginManager;
import wizard.eVC.wizLog.log.LogService;
import wizard.eVC.baseMgmt.person.DTO.Person;

import java.net.UnknownHostException;
import java.util.List;
import java.util.Map;

@Controller
public class InfoAddController {

    @Autowired
    private InfoAddService ifaService;

    @Autowired
    private LogService logService;

    @Autowired
    private Excel excel;

    @Autowired
    private FTP ftp;

    @Autowired
    private LoginManager loginManager;

    //삭제할 폴더 위치
    String FTPPATH = "/ImageData/info/";

    /*화면*/
    @GetMapping("/pages/infoMgmt/infoAdd/infoAdd")
    public String infoAdd() throws UnknownHostException {
        //로그 남기기
        logService.logSave("xp_info_sInfo", "S", "Win_com_InfoSet", "");

        return "/pages/infoMgmt/infoAdd/infoAdd";
    }

    /*화면 닫기 로그*/
    @PostMapping("/pages/infoMgmt/infoAdd/infoAdd/close")
    public ResponseEntity<Void> infoAddClose() throws UnknownHostException {
        //로그 남기기
        logService.logSave("xp_info_sInfo", "S", "Win_com_InfoSet", "");
        return ResponseEntity.noContent().build();  // 상태 코드만 반환하고 템플릿은 사용하지 않음
    }

    /*조회*/
    @PostMapping(value = "/infoMgmt/infoAdd/search")
    @ResponseBody
    public List<InfoAddDto> getInfoData(@RequestBody Map<String, Object> param) {
            List<InfoAddDto> data = ifaService.getInfoDataList(param);
            ifaService.getDateSet(data);
            return data;
    }

    //추가
    @PostMapping("/infoMgmt/infoAdd/add")
    public String add(Model model) {
        InfoAddDetailDto infoAddDetailDto = new InfoAddDetailDto();
        infoAddDetailDto.setUserID(loginManager.getPersonID());
        model.addAttribute("InfoAddDetailDto", infoAddDetailDto);
 
        return "/pages/infoMgmt/infoAdd/infoAddDetail";
    }

    //상세, 수정
    @PostMapping("/infoMgmt/infoAdd/update")
    public String update(@RequestParam Map<String, String> param, Model model){

        InfoAddDetailDto infoAddDetailDto = ifaService.getInfoDataDetailList(param.get("infoID"));

        //조회수 증가
        ifaService.setHitCount(infoAddDetailDto);

        //th:field 데이터 타입 및 양식 맞추기
        ifaService.getDataTypeSet(infoAddDetailDto);
        //삭제나 수정여부를 알기 위해 기존 파일이름을 가져감
        infoAddDetailDto.setDeleteAttachFile(infoAddDetailDto.getAttachFile());
        infoAddDetailDto.setUserID(loginManager.getPersonID());//로그인한 personID
        model.addAttribute("InfoAddDetailDto", infoAddDetailDto);

        return "/pages/infoMgmt/infoAdd/infoAddDetail";

    }

    //삭제
    @GetMapping("/infoMgmt/infoAdd/delete")
    @ResponseBody
    public String delete(@RequestParam(name = "infoID") String infoID){
        //TODO 로그 남길 경우 로그인한 personID
        ifaService.deleteInfo(infoID);
        ftp.deleteDirectory(FTPPATH + infoID);

        return "/pages/infoMgmt/infoAdd/infoAdd";

    }

    //로그인한 ID의 권한 가져오기
    //infoAdd, infoDetail, infoSearch 같이 사용
    @PostMapping("/infoMgmt/infoAdd/add/userCheck")
    @ResponseBody
    public Person getLoginID() {
        if(loginManager.getPersonID() != null){
            return loginManager.getLoginUser();
        }
        else{
            return null;
        }
    }

    //엑셀 다운로드
    @PostMapping("/infoMgmt/infoAdd/excel")
    @ResponseBody
    public  ResponseEntity<byte[]>ExcelDownload(HttpServletResponse response, @RequestBody Excel.DataTableRequest headerdata) {
        try {

            List<String> header = headerdata.getHeaders();
            List<Object> data = headerdata.getData();

            byte[] exceldata = excel.excelDownload(response, header, data, "infoAdd");

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=infoAdd.xlsx");

           return new ResponseEntity<>(exceldata, headers, HttpStatus.OK);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}