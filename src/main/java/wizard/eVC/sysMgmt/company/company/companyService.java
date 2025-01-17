package wizard.eVC.sysMgmt.company.company;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wizard.eVC.sysMgmt.company.company.dto.companyDTO;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.sysMgmt.company
 * fileName         : companyService
 * author           : daehyun
 * date             : 2024-11-22
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-11-22       Daehyun             최초 생성
 */

@Service
@Transactional
public class companyService {

    @Autowired
    private companyMapper mapper;

    @Transactional(readOnly = true)
    public List<companyDTO> getCompanyList(Map<String, Object> param) {return mapper.getCompanyList(param); }

    @Transactional(readOnly = true)
    companyDTO getCompanyDetail(String sCompanyID, String sRPYN, String sUseYN) {return mapper.getCompanyDetail(sCompanyID, sRPYN, sUseYN); }

    public void saveCompanyDetail(companyDTO companydto) {mapper.saveCompanyDetail(companydto);  }
    public int deleteCompanyDetail(String sCompanyID) { return mapper.deleteCompanyDetail(sCompanyID);}
}
