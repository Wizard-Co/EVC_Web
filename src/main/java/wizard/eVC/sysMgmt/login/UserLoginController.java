package wizard.eVC.sysMgmt.login;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import wizard.eVC.sysMgmt.login.Dto.LoginDto;
import wizard.eVC.sysMgmt.userlog.DTO.Utils;


import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
/**
 * packageName      : wizard.naDaum.sysMgmt.login
 * fileName         : loginController
 * author           : 이준협
 * date             : 2025-01-14
 * ======================================================
 * DATE             AUTHOR               NOTE
 * ------------------------------------------------------
 * 2025-01-14         이준협             최초 생성
 * 2025-01-15        sooJeong          로직 수정
 */
@Controller
@AllArgsConstructor
@RequestMapping("/sysMgmt/userLogin")
public class UserLoginController {
    private UserLoginService service;
    private LoginManager loginManager;

    @PostMapping("/Login")
    public String loginProc(HttpSession session, Model model, String userID, String password, HttpServletResponse response, HttpServletRequest request) throws IOException {
        String returnURL = "";

        System.out.println("userID: " + userID);

        System.out.println("password: " + password);

        // 세션에서 실패 횟수 가져오기 (기본값 0)
        Integer failedAttempts = (Integer) session.getAttribute("failedAttempts");
        if (failedAttempts == null) {
            failedAttempts = 0; // 첫 로그인 시 0으로 초기화
        }

        // 로그인 시도 횟수가 5번 이상이면 계정 잠금 처리
        if (failedAttempts >= 5) {
            // 계정 잠금 처리
            Utils.alertAndBackPage(response, "로그인 시도가 너무 많습니다. 계정이 잠겼습니다.");
//            User lockedUser = service.personLock(userID);
//            if (lockedUser != null) {
//                Utils.alertAndBackPage(response, "로그인 시도가 너무 많습니다. 계정이 잠겼습니다.");
//            } else {
//                Utils.alertAndBackPage(response, "계정 잠금 처리 중 오류가 발생했습니다.");
//            }
            return returnURL;
        }
        try{
            LoginDto dto = service.xp_Common_Login(userID, password);
            String error = dto.getResult();
            System.out.println(error);
//        if (error == null || error.equals("")) {
            // 로그인 성공

            service.setLoginUser(userID);

            model.addAttribute("user", loginManager.getLoginUser());
            request.getSession().setAttribute("userId", loginManager.getPersonID());

            session.setAttribute("UserID", userID);
            session.setAttribute("Password", password);
            session.setMaxInactiveInterval(-1);



            // 파일로 저장하는 대신 레지스트리 사용
//        File sessionFile = new File("session.txt");
//        try (BufferedWriter writer = new BufferedWriter(new FileWriter(sessionFile))) {
//            writer.write("userID=" + userID);
//            writer.write("\nPassword=" + password);  // 비밀번호도 같이 저장 (암호화 고려 필요)
//            writer.flush();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
            // 로그인 성공 시 세션에서 실패 횟수 초기화
            //session.setAttribute("failedAttempts", 0);

            // 리디렉션 URL을 JSON으로 반환
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().write("{\"redirectUrl\":\"/\"}");
            return null; // 반환값이 없으므로 바로 응답을 보냄
//        } else {
            // 로그인 실패 시 실패 횟수 증가
//            failedAttempts++;
//            session.setAttribute("failedAttempts", failedAttempts); // 세션에 실패 횟수 업데이트
//
//            // 로그인 실패 메시지 및 실패 횟수 반환
//            response.setStatus(HttpServletResponse.SC_OK); // HTTP 상태 코드 200으로 설정
//            response.setContentType("application/json");
//            response.getWriter().write("{\"error\":\"" + error + "\", \"failedAttempts\":" + failedAttempts + "}");
//            return null; // 반환값이 없으므로 바로 응답을 보냄
//        }
        }catch (RuntimeException e){
            e.printStackTrace();
        }
        // 로그인 검증
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.getWriter().write("{\"redirectUrl\":\"/\"}");
        return null; // 반환값이 없으므로 바로 응답을 보냄
    }

    @GetMapping("/getSessionInfo")
    public ResponseEntity<Map<String, String>> getSessionInfo(HttpSession session) {
        // 세션에서 userID와 password 가져오기
        String userID = (String) session.getAttribute("userID");
        String password = (String) session.getAttribute("Password");

        // 세션에 값이 없으면 빈 객체로 반환
        if (userID == null || password == null) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(new HashMap<>());
        }

        // 세션에서 가져온 값을 Map에 담아서 반환
        Map<String, String> sessionInfo = new HashMap<>();
        sessionInfo.put("userID", userID);
        sessionInfo.put("Password", password);
        return ResponseEntity.ok(sessionInfo);
    }
}
