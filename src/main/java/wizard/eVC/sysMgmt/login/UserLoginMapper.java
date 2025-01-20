package wizard.eVC.sysMgmt.login;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.sysMgmt.login.Dto.LoginDto;


@Mapper
public interface UserLoginMapper {

    LoginDto xp_Common_Login(String userID, String password);

}
