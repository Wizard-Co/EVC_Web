/*
설명: 공지사항 추가 상세 컨트롤러
작성일: 2024.10.18
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.infoMgmt.infoAdd;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wizard.eVC.infoMgmt.infoAdd.dto.InfoAddDetailDto;
import wizard.eVC.common.util.FTP;
import wizard.eVC.sysMgmt.login.LoginManager;

import java.io.IOException;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

@Controller
public class InfoAddDetailController {

    @Autowired
    private InfoAddDetailService ifadService;

    @Autowired
    private FTP ftp;

    //업로드할 폴더 위치
    String FTPPATH = "/ImageData/info";

    //저장
    @PostMapping("/infoMgmt/infoAddDetail/save")
    @ResponseBody
    public void save(@ModelAttribute InfoAddDetailDto infoAddDetailDto) {
        String infoID = "";

        // attachFileDetail file 타입 file upload 저장
        // attachFile string 타입 DB 저장
        //파일이름 입력 안 하면 true, 파일이름 입력하면 false
        if(!infoAddDetailDto.getAttachFile().isEmpty()){
            infoAddDetailDto.setAttachFile(infoAddDetailDto.getAttachFileDetail().getOriginalFilename());
            infoAddDetailDto.setAttachPath(FTPPATH + "/");
        }
        else{
            infoAddDetailDto.setAttachFile("");
            infoAddDetailDto.setAttachPath("");
        }

        //저장후 output으로 infoID 가져와야 됨
        infoID = ifadService.saveInfo(infoAddDetailDto);

        //개별인 경우 사원 저장
        if(infoAddDetailDto.allYN.equals("N")){
            for(int i = 0; i < infoAddDetailDto.personIDList.size(); i++) {
                ifadService.savePersonInfo(infoID, infoAddDetailDto.personIDList.get(i), infoAddDetailDto.userID);
            }
        }

        //파일이름 입력 안 하면 true, 파일이름 입력하면 false
        if(!infoAddDetailDto.getAttachFileDetail().isEmpty()){
            ftp.uploadFile(infoAddDetailDto.getAttachFileDetail(),FTPPATH + "/" + infoID);
        }

    }

    //수정
    @PostMapping("/infoMgmt/infoAddDetail/update")
    @ResponseBody
    public void update(@ModelAttribute InfoAddDetailDto infoAddDetailDto) throws IOException {
        //수정할 infoID
        String infoID = infoAddDetailDto.infoID;

        // attachFileDetail file 타입 file upload 저장
        // attachFile string 타입 DB 저장
        // attachPath string 타입 DB 저장
        // infoAddDetailDto.getAttachFileDetail().isEmpty() 파일이름 입력 안 하면 true, 파일이름 입력하면 false
        // true면 파일 수정 안 함, false면 파일 수정 함
        // 삭제는 deleteAttachFile 값이 빈칸이면 삭제

        //수정여부 확인
        if(!infoAddDetailDto.getAttachFileDetail().isEmpty() && !infoAddDetailDto.getAttachFile().isEmpty()) {
            //수정한 경우 수정한 값 입력
            infoAddDetailDto.setAttachFile(infoAddDetailDto.getAttachFileDetail().getOriginalFilename());
            infoAddDetailDto.setAttachPath(FTPPATH + "/" + infoID + "/");
            //파일이 있는 경우 기존 파일 삭제 TODO
            ftp.deleteFile(infoAddDetailDto.getDeleteAttachFile(),FTPPATH + "/" + infoID + "/");
        }
        else{
            //수정 안 했으면 삭제 여부 확인
            //빈칸이면 삭제로 판단
            if(infoAddDetailDto.getAttachFile().isEmpty() && !infoAddDetailDto.getDeleteAttachFile().isEmpty()){
                //파일 삭제
                infoAddDetailDto.setAttachFile("");
                infoAddDetailDto.setAttachPath("");
                ftp.deleteFile(infoAddDetailDto.getDeleteAttachFile(),FTPPATH + "/" + infoID + "/");
            }
            else{
                //수정 안 했으면 기존값 저장
                infoAddDetailDto.setAttachFile(infoAddDetailDto.getAttachFile());
                infoAddDetailDto.setAttachPath(FTPPATH + "/" + infoID + "/");
            }
        }


        //TODO 수정할 경우 수정자는 로그인한 ID로 처리
        //수정
        ifadService.updateInfo(infoAddDetailDto);


        //개별인 경우 사원 저장
        if(infoAddDetailDto.allYN.equals("N")){
            for(int i = 0; i < infoAddDetailDto.personIDList.size(); i++) {
                ifadService.savePersonInfo(infoID, infoAddDetailDto.personIDList.get(i), infoAddDetailDto.userID);
            }
        }

        //파일이름 입력 안 하면 true, 파일이름 입력하면 false
        if(!infoAddDetailDto.getAttachFileDetail().isEmpty() && !infoAddDetailDto.getAttachFile().isEmpty()){
            ftp.uploadFile(infoAddDetailDto.getAttachFileDetail(),FTPPATH + "/" + infoID + "/");
        }

    }

    //왼쪽 그리드
    @PostMapping("/infoLeftPersonData")
    @ResponseBody
    public List<InfoAddDetailDto> getInfoLeftPersonData() {
        List<InfoAddDetailDto> getInfoLeftPersonData = ifadService.getInfoLeftPersonDataList();
        return getInfoLeftPersonData;
    }

    //오른쪽 그리드
    @PostMapping("/infoRightPersonData")
    @ResponseBody
    public List<InfoAddDetailDto> getInfoRightPersonData(@RequestBody Map<String, Object> param) {
        List<InfoAddDetailDto> getInfoRightPersonData = ifadService.getInfoRightPersonDataList(param);
        return getInfoRightPersonData;
    }
}
