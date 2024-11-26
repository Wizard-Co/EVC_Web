package wizard.eVC.baseMgmt.depart;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.baseMgmt.depart.DTO.Depart;

import java.util.List;
import java.util.Map;

@Mapper
public interface DepartMapper {
    List<Depart> getDepartList (Map<String, Object> params);
    Depart saveDepart(Depart depart);
    Depart updateDepart(Depart depart);

    void deleteDepart(Map<String, Object> params);

    String chkDeleteDepart(Map<String, Object> params);

    Depart getDepartDetail(String departID);

}
