package wizard.eVC.sysMgmt.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wizard.eVC.baseMgmt.person.DTO.Person;
import wizard.eVC.baseMgmt.person.PersonService;
import wizard.eVC.sysMgmt.login.Dto.LoginDto;
import wizard.eVC.common.dto.Menu;

import java.util.List;

/**
 *설명          :
 *작성일         : 2024.11월.05일
 *개발자         : jhd
 *======================================================
 *DATE             AUTHOR               NOTE
 *------------------------------------------------------
 *2025.01월.07일           LJH             최초 생성
 * 2025-01-15       sooJeong        로그인 관련 추가
 **/
@Service
public class UserLoginService {

    private final LoginManager loginManager;
    private final PersonService personService;
    @Autowired
    private UserLoginMapper mapper;

    @Autowired
    public UserLoginService(LoginManager loginManager, PersonService personService) {
        this.loginManager = loginManager;
        this.personService = personService;
    }

    public Person setLoginUser(String userID) {
        Person loginUser = personService.getPersonDetail(userID);
        List<Menu> menuList = personService.getPersonMenu(userID);
        loginUser.setMenuList(menuList);

        loginManager.setLoginUser(loginUser);
        return loginUser;
    }
    public LoginDto xp_Common_Login(String loginId, String password) {
        return mapper.xp_Common_Login(loginId, password);
    }

}
