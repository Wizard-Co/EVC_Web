package wizard.eVC.sysMgmt.login;

import jakarta.servlet.http.HttpSession;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import wizard.eVC.baseMgmt.person.DTO.Person;


/**
 * packageName      : wizard.naDaum.sysMgmt.login.Dto
 * fileName         : LoginManager
 * author           : sooJeong
 * date             : 2025-01-14
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-14         sooJeong             최초 생성
 */
@Component
@NoArgsConstructor
public class LoginManager {
    @Autowired
    private HttpSession hs;
    private Person loginUser;

    public void setLoginUser(Person loginUser) {
        this.loginUser = loginUser;
        hs.setAttribute("loginUser", loginUser);
    }

    public Person getLoginUser() {
        return (Person) hs.getAttribute("loginUser");
    }
    public String getPersonID(){
        return loginUser.getPersonID().trim();
    }

}
