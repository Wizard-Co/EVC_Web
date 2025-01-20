package wizard.eVC.sysMgmt.userlog.DTO;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

@Component
public class Utils {

    public String getToday(){
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return now.format(formatter);
    } // 오늘날짜를 2022-11-23 형식으로 불러옴

    public String getToday8(){
        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return now.format(formatter);
    } // 오늘날짜를 20221123 형식으로 불러옴


    public Date addMonth(Date date, int months) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, months);
        return cal.getTime();
    }

    public String get3MonthBefore() {

        Date date = new Date();
        SimpleDateFormat sdformat = new SimpleDateFormat("yyyy-MM-dd");

        Date before3Mon = addMonth(date,-3);

        return sdformat.format(before3Mon);
    } // 3달 전 날짜를 2022-11-23 형식으로 불러옴

    public String get3MonthBefore8() {

        Date date = new Date();
        SimpleDateFormat sdformat = new SimpleDateFormat("yyyyMMdd");

        Date before3Mon = addMonth(date,-3);

        return sdformat.format(before3Mon);
    }  // 3달 전 날짜를 20221123 형식으로 불러옴

    // JS ALERT 창 띄우기
    public static void init(HttpServletResponse response) {
        response.setContentType("text/html; charset=euc-kr");
        response.setCharacterEncoding("euc-kr");
    }

    public static void alert(HttpServletResponse response, String alertText) throws IOException {
        init(response);
        PrintWriter out = response.getWriter();
        out.println("<script>alert('" + alertText + "');</script> ");
        out.flush();
    }

    public static void alertAndMovePage(HttpServletResponse response, String alertText, String nextPage)
            throws IOException {
        init(response);
        PrintWriter out = response.getWriter();
        out.println("<script>alert('" + alertText + "'); location.href='" + nextPage + "';</script> ");
        out.flush();
    }

    public static void alertAndBackPage(HttpServletResponse response, String alertText) throws IOException {
        init(response);
        PrintWriter out = response.getWriter();
        out.println("<script>alert('" + alertText + "'); history.go(-1);</script>");
        out.flush();
    }

    //null or '' -> ""으로 변경

    public String isNullOrApostrophe(String id) {

        if (id == null) {
            id = "";
        }
        id = id.replaceAll("''", "");

        return id;
    }
}
