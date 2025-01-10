package wizard.eVC.sysMgmt.company.company;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.sysMgmt.company.company.dto.companyDTO;

import java.util.List;
import java.util.Map;

/**
 * packageName      : wizard.naDaum.sysMgmt.company
 * fileName         : companyMapper
 * author           : daehyun
 * date             : 2024-11-22
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-11-22       Daehyun             최초 생성
 */

@Mapper
public interface companyMapper {
    List<companyDTO> getCompanyList(Map<String, Object> param);
    companyDTO getCompanyDetail(String sCompanyID, String sRPYN, String sUseYN);
    void saveCompanyDetail(companyDTO companydto);
    int deleteCompanyDetail(String sCompanyID);
}
