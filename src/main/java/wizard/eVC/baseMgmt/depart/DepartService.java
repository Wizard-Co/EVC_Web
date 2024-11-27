package wizard.eVC.baseMgmt.depart;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.depart.DTO.Depart;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
  *설명          :
  *작성일         : 2024.11월.05일
  *개발자         : jhd
  *======================================================
  *DATE             AUTHOR               NOTE
  *------------------------------------------------------
  *2024.11월.05일           jhd             최초 생성zz
**/
@Service
@AllArgsConstructor
public class DepartService {

    private  DepartMapper mapper;

    //조회 가져옴
    public List<Depart> getDepartList(Map<String, Object> param)
    {
        return  mapper.getDepartList(param);
    }

    public Depart getDepartDetail(String departID)
    {
        return  mapper.getDepartDetail(departID);
    }

    // 저장하셈
    public void saveDepart(Depart depart)
    {
        if (depart.depart == null || depart.depart.isBlank())
            return;

        depart.setCreateUserID("admin");

        mapper.saveDepart(depart);
        String departID = depart.getDepartID(); // 필요함?

    }

    public void udpateDepart(Depart depart)
    {
        if (depart.departID == null || depart.departID.isBlank()) return;

        depart.setLastUpdateUserID("admin");

        mapper.updateDepart(depart);
        String departID = depart.getDepartID(); // 필요함?

    }


    //삭제하셈
    public void deleteDepart(String departID) throws IOException
    {
        Map<String, Object> params = new HashMap<>();
        params.put("departID",departID);

        //삭제전 체크
//        String message = mapper.chkDeleteDepart(params);
//        if (message != null) {
//            throw  new IOException(message);
//        }
        //삭제매퍼
        mapper.deleteDepart(params);

    }





}

