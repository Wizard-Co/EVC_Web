package wizard.eVC.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Controller
public class CMController {
    int nLarge = 0;

    @Autowired
    private CMService service;

    @GetMapping("pages/common/plusFinder")
    public String Search(Model model, @RequestParam(value = "nLarge", defaultValue = "0") int nLarge,
                         @RequestParam(value = "sMiddle", defaultValue = "") String sMiddle) {

        HashMap<String, Object> params = new HashMap<>();
        params.put("nLarge", nLarge);
        params.put("sMiddle", sMiddle);

        List<HashMap<String, Object>> lstpf = service.getPlusFinder(params);

        if (lstpf.size() != 0) {
            List<String> lstColName = new ArrayList<>();
            HashMap<String, Object> firstItem = lstpf.get(0);

            for (String key : firstItem.keySet()) {
                lstColName.add(key.trim());
            }
            model.addAttribute("lstpf", lstpf);
            model.addAttribute("lstColName", lstColName);
        } else {

        }

        return "pages/common/plusFinder";
    }
}
