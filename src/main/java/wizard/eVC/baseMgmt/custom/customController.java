package wizard.eVC.baseMgmt.custom;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.custom.dto.customDTO;
import wizard.eVC.common.CMService;
import wizard.eVC.common.dto.CMCode;

import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;


@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/custom")
public class customController {
    @Autowired
    private customService service;
    private CMService cmService;

    @ModelAttribute
    public void getCboCustom(Model model){

        List<CMCode> cboTradeID = cmService.getCmCode("CMMTRAD"); //거래구분
        List<CMCode> cboOrgGbn = cmService.getCmCode("CSTOrgGbn"); //기관구분
        List<CMCode> cboZoneGbn = cmService.getCmCode("CSTZneGbn"); //지역구분
        List<CMCode> cboCtPath = cmService.getCmCode("CSTCTPath"); //상담경로

        //fta 중점 cbo
//        model.addAttribute("cboFtaMgrYN", Arrays.asList(
//                new CMCode() {{ codeID="Y"; codeName="Y"; }},
//                new CMCode() {{ codeID="N"; codeName="N"; }}
//        ));

        customDTO customdto = new customDTO();
        customdto.setUseYN("Y");

        model.addAttribute("customdto", customdto);
        model.addAttribute("cboTradeID", cboTradeID);
        model.addAttribute("cboOrgGbn", cboOrgGbn);
        model.addAttribute("cboZoneGbn", cboZoneGbn);
        model.addAttribute("cboCtPath", cboCtPath);
    }

    @GetMapping("")
    public String custom() {
        return "pages/baseMgmt/custom/custom";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<customDTO> getBasecodeList(@RequestBody Map<String, Object> param) {
        List<customDTO> data = service.getCustomList(param);
        return data;
    }

    @PostMapping("/add")
    public String add(Model model) {
        List<CMCode> cboRegYear = getYearRange(Year.now().getValue(), 40 , 25);


        model.addAttribute("cboRegYear", cboRegYear);
        return "pages/baseMgmt/custom/customDetail";
    }

    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute customDTO customdto) {
        String customNo = customdto.customNo.replace("-","");
        customdto.setCustomNo(customNo);
        service.saveCustomDetail(customdto);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute customDTO customdto){
        String customNo = customdto.customNo.replace("-","");
        customdto.setCustomNo(customNo);
        service.updateCustomDetail(customdto);
    }

    @PostMapping("/detail")
    public String searchDetail(@RequestParam Map<String, Object> param,
                               Model model) {

        int regYear = 0;
        if(param.containsKey("regYear")){
            regYear = Integer.parseInt((String)param.get("regYear"));
        }
        String[] params = {"chkKCustom", "chkOrganGbn", "chkTradeID",
                "chkChief", "chkDamdang", "chkDamdangComments", "chkComments", "chkUseYN"};

        for(String key : params) {
            if(param.containsKey(key)) {
                param.put(key, Integer.parseInt((String)param.get(key)));
            }
        }
        List<CMCode> cboRegYear = getYearRange(regYear, 40 , 25);
        customDTO customdto = service.getCustomDetail(param);
        if(customdto.customNo != null && !customdto.customNo.isEmpty()){
            customdto.setCustomNo(customdto.customNo.replaceAll("(\\d{3})(\\d{2})(\\d{5})", "$1-$2-$3"));
        }
        model.addAttribute("customdto", customdto);
        model.addAttribute("cboRegYear", cboRegYear);

        return "pages/baseMgmt/custom/customDetail";
    }

    @PostMapping("/delete")
    @ResponseBody
    public String delete(@RequestBody String sCustomID ) {
        try {
            return service.deleteCustomDetail(sCustomID);
        } catch (IllegalStateException e) {
            return e.getMessage();
        }
    }

    @PostMapping("/check")


    //등록년도 콤보박스 범위 구하기
    private List<CMCode> getYearRange(int currentYear, int yearMinus, int yearPlus) {

        //currentYear에서 yearMinus , yearPlus하여 범위를 정합니다.
        int minYear = currentYear - yearMinus;
        int maxYear = currentYear + yearPlus;

        int thisYear = Year.now().getValue();
        int yearDiff = thisYear - currentYear;

        if (yearDiff > 0) {  //파라미터 값 연도가 올해보다 과거일때 최대연도를 올해기준에서 늘려주기
            maxYear = thisYear + yearPlus;
        } else if (yearDiff < 0) { //혹시나 파라미터값 연도가 올해보다 훨씬 미래일때 올해기준으로 최소연도 지정
            minYear = thisYear - yearMinus;
        }

        return IntStream.rangeClosed(minYear, maxYear)
                .mapToObj(year -> {
                    CMCode code = new CMCode();
                    code.setCodeID(String.valueOf(year));
                    code.setCodeName(Integer.toString(year));
                    return code;
                }).toList();
    }


}
