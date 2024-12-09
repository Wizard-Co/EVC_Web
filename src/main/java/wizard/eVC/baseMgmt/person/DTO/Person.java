package wizard.eVC.baseMgmt.person.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;
import wizard.eVC.common.dto.Menu;

import java.util.List;

/**
 * packageName      : wizard.eVC.baseMgmt.person.DTO
 * fileName         : Person
 * author           : sooJeong
 * date             : 2024-10-21
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2024-10-21         sooJeong             최초 생성
 */

@NoArgsConstructor
@Getter
@Setter
public class Person {
    public String personID;
    public String name;
    public String loginID;
    public String password;
    public String departID;
    public String depart;
    public String registNo;
    public String birth;
    public String solarTypeID;
    public String solar;
    public String positionID;
    public String position;
    public String dutyID;
    public String duty;
    public String insaDutyDTLID;
    public String insaDutyDTL;
    public String insaAreaID;
    public String insaArea;
    public String zipCode;
    public String address;
    public String addressDetail;
    public String addressJibun;
    public String fileName;
    public String filePath;
    public MultipartFile file;
    public String remark;
    public String bankAccount;
    public String email;
    public String startDate;
    public String endDate;
    public String handPhone;
    public String phone;
    public String endReason;
    public String qualifyHistory;
    public String trainingHistory;
    public String observeHistory;
    public String classHistory;
    public String useYN;
    public String mainWorkYN;
    public String passwordChangeDate;
    public String sexTypeID;
    public String createDate;
    public String createUserID;
    public String lastUpdateDate;
    public String lastUpdateUserID;

    public List<Menu> menuList;
}
