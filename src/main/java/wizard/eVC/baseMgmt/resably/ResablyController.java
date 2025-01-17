package wizard.eVC.baseMgmt.resably;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.resably.DTO.Resably;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/resably")
public class ResablyController {

    private ResablyService service;

    @ModelAttribute
    public void setting(Model model)
    {
        Resably resably = new Resably();
        resably.setUseYN("Y");

        model.addAttribute("resably",resably);
    }


    @GetMapping("")
    public String home(){

        return "/pages/baseMgmt/resably/resably";
    }


    @PostMapping(value = "/search")
    @ResponseBody
    public List<Resably> getResablyData(@RequestBody Map<String, Object> param) {
        List<Resably> data = service.getResablyList(param);
        return data;
    }



    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "resablyID",required = true) String resablyID,
                               Model model)
    {
        Resably resably = service.getResablyDetail(resablyID);
        boolean update = true;

        //모델에 속성추가 attributeName = 속성명 = 컬럼명
        model.addAttribute("resably",resably);
        model.addAttribute("comments",resably);
        model.addAttribute("useYN",resably);
        model.addAttribute("update",update);

        return "/pages/baseMgmt/resably/resablyDetail";
    }

    @PostMapping("/add")
    public String add()
    {
        return  "/pages/baseMgmt/resably/resablyDetail";
    }

    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute Resably resably)
    {
        service.saveResably(resably);
    }

//    public ResponseEntity<Resably> save(@ModelAttribute Resably resably) {
//        try {
//            service.saveResably(resably);
//            return ResponseEntity.ok(resably); // Resably 객체를 JSON으로 반환
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Resably resably){
        service.updateResably(resably);
    }

    @GetMapping("/delete")
    @ResponseBody
    public ResponseEntity<Object> delete(@RequestParam String resablyID)
    {
        try {
            service.deleteResably(resablyID);
            return ResponseEntity.ok().build();
        }catch (IOException ex)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }

}
