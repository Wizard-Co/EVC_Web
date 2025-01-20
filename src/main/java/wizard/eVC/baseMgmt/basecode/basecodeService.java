package wizard.eVC.baseMgmt.basecode;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.basecode.dto.basecodeDTO;
import wizard.eVC.baseMgmt.basecode.dto.tableDataDTO;

import java.util.List;
import java.util.Map;


@Service
@AllArgsConstructor
public class basecodeService {

    private final  basecodeMapper mapper;

    public void updateBasecodeDetail(basecodeDTO basecodedto) {mapper.updateBasecodeDetail(basecodedto);}
    public void addBasecodeDetail(basecodeDTO basecodedto) {mapper.addBasecodeDetail(basecodedto);}
    public void deleteBasecodeDetail(String codeTypeID, String codeID) {mapper.deleteBasecodeDetail(codeTypeID, codeID);}


}


