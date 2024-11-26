
package wizard.eVC.baseMgmt.depart;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import wizard.eVC.baseMgmt.depart.DTO.Depart;

import java.io.IOException;
import java.util.List;
import java.util.Map;



@Controller
@AllArgsConstructor
@RequestMapping("/baseMgmt/depart")
public class DepartController {

    private  DepartService service;

    @ModelAttribute
    public void setting(Model model)
    {
        Depart depart = new Depart();
        depart.setUseClss("Y");

        model.addAttribute("depart",depart);
    }


    @GetMapping("")
    public String home() {

        return "/pages/baseMgmt/depart/depart";
    }

    @PostMapping(value = "/search")
    @ResponseBody
    public List<Depart> getDepartData(@RequestBody Map<String, Object> param) {
        List<Depart> data = service.getDepartList(param);
        return data;
    }


    @PostMapping("/detail")
    public String searchDetail(@RequestParam(name = "departID",required = true) String departID,
                               Model model)
    {
        Depart depart = service.getDepartDetail(departID);
        boolean update = true;

        model.addAttribute("depart",depart);
        model.addAttribute("update",update);

        return "/pages/baseMgmt/depart/departDetail";
    }


    @PostMapping("/add")
    public String add()
    {
        return "/pages/baseMgmt/depart/departDetail";
    }


    @PostMapping("/save")
    @ResponseBody
    public void save(@ModelAttribute Depart depart)
    {
        service.saveDepart(depart);
    }

    @PostMapping("/update")
    @ResponseBody
    public void update(@ModelAttribute Depart depart)
    {
        service.udpateDepart(depart);
    }


    //삭제허셈
    @GetMapping("/delete")
    @ResponseBody
    public ResponseEntity<Object> delete(@RequestParam String departID)
    {
        try {
            service.deleteDepart(departID);
            return ResponseEntity.ok().build();
        }catch (IOException ex)
        {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
        }
    }




}
