package wizard.eVC.sysMgmt.userlog;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import wizard.eVC.sysMgmt.userlog.DTO.Userlog;

import java.util.List;
import java.util.Map;

/**
 *설명          :
 *작성일         : 2024.11월.05일
 *개발자         : jhd
 *======================================================
 *DATE             AUTHOR               NOTE
 *------------------------------------------------------
 *2024.11월.05일           jhd             최초 생성
 **/
@Service
@AllArgsConstructor
public class UserlogService {

    private UserlogMapper mapper;

    public List<Userlog> getUserlogList(Map<String, Object> param)
    {
        return  mapper.getUserlogList(param);
    }



}
