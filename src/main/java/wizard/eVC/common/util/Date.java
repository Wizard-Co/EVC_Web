package wizard.eVC.common.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.function.Consumer;

/**
 * 날짜 관련 포맷 , 메서드 등이 있는 클래스
 *
 * @author 김수정
 */
@Component
public class Date {

    /**
     * 날짜 형식 String 포맷으로 변환 (yyyy-MM-dd / yy-MM-dd)
     *
     * @param
     * @return
     * @author 김수정
     */
    public String StringDateFormat(String date) {
        String year;
        String month;
        String day;
        if (!date.isBlank()) {
            if(date.length() == 6){
                year = date.substring(0, 2);
                month = date.substring(2, 4);
                day = date.substring(4, 6);

                return year + "-" + month + "-" + day;
            } else {
                year = date.substring(0, 4);
                month = date.substring(4, 6);
                day = date.substring(6, 8);

                return year + "-" + month + "-" + day;
            }
        }
        return date;
    }

    /**
     * -이 포함되어있는 문자에 -를 제거
     *
     * @param date
     * @return
     * @author 김수정
     */
    public String DBDateFormat(String date) {

        if (date.contains("-")) {
            date = date.replace("-", "");
            return date;
        } else {
            return date;
        }

    }

    /**
     * DBDateFormat을 적용하는 제네릭 메서드
     *
     * @param obj    객체
     * @param value  바꿀 필드
     * @param setter 필드의 setter
     * @param <T>    제네릭 타입
     * @author 김수정
     */
    public <T> void AllStringFormat(T obj, String value, Consumer<String> setter) {
        String format_property = DBDateFormat(value);
        setter.accept(format_property);
    }

    /**
     * 오늘 날짜를 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringToday() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now());
        return date;
    }

    /**
     * 어제 날짜를 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringYesterday() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now().minusDays(1));
        return date;
    }

    /**
     * 내일 날짜를 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringTomorrow() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now().plusDays(1));
        return date;
    }

    /**
     * 오늘으로 부터 1년 뒤를 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringNextYear() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now().plusYears(1));
        return date;
    }

    /**
     * 오늘으로 부터 1년 전을 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringBeforeYear() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDateTime.now().minusYears(1));
        return date;
    }

    /**
     * 이번 달의 1일을 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringFirstDay() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now().withDayOfMonth(1));
        return date;
    }

    /**
     * 이번 달의 마지막일을 반환
     *
     * @return String
     * @author 김수정
     */
    public String getStringLastDay() {
        String date;
        date = DateTimeFormatter.ofPattern("yyyyMMdd").format(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));
        return date;
    }

    public String setStringDate(LocalDateTime date) {
        String sdate = DateTimeFormatter.ofPattern("yyyyMMdd").format(date);
        return sdate;
    }

}
