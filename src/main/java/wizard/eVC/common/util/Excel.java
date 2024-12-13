/*
설명: 공통 엑셀 내보내기
작성일: 2024.11.26
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.common.util;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;
import wizard.eVC.wizLog.exception.UserException;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Component
public class Excel {

    //엑셀 데이터 내보내기 Dto
    @Data
    public static class DataTableRequest {
        private List<String> headers;  // 헤더 리스트
        private List<Object> data;     // 데이터 리스트
    }

    //엑셀 다운로드
    //TODO 예외처리 해야 됨
    @SuppressWarnings("unchecked") //없으면 메세지창 나타남, 추후 클래스로 처리 할 수도 있음
    @Transactional
    public byte[] excelDownload(HttpServletResponse response, @RequestParam List<String> header , @RequestParam List<Object> data, String fileName) throws IOException {
        try {
            // 새로운 워크북 생성
            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet(fileName);

            // 헤더 생성
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < header.size(); i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(header.get(i));  // 헤더 값 설정
            }

            // 데이터 행 생성
            for (int i = 0; i < data.size(); i++) {
                List<String> valuesList = new ArrayList<>();
                Row row = sheet.createRow(i + 1);  // 1번째 행부터 데이터 입력
                Object excelValue = "";     //엑셀에 보여줄 값
                Object obj = data.get(i);  // 예시: LinkedHashMap이 Object로 전달됨

                // Object 타입이 실제로 LinkedHashMap인지 확인 후 변환
                if (obj instanceof LinkedHashMap) {
                    // LinkedHashMap으로 변환
                    LinkedHashMap<String, Object> map = (LinkedHashMap<String, Object>) obj;

                    // LinkedHashMap의 값만 추출
                    for (Object value : map.values()) {
                        valuesList.add(String.valueOf(value));  // 값이 Object일 수 있으므로 String으로 변환
                    }

                } else {
                    System.out.println("Object는 LinkedHashMap이 아닙니다.");
                }

                for (int j = 0; j < header.size(); j++) {
                    Cell cell = row.createCell(j);
                    excelValue = valuesList.get(j);
                    // 셀에 데이터 값을 설정 (문자열로 변환)
                    if (excelValue != null) {
                        cell.setCellValue(excelValue.toString());
                    } else {
                        cell.setCellValue("");  // null 값 처리
                    }
                }
            }

            // 각 열의 너비를 데이터에 맞게 자동으로 조정
            for (int i = 0; i < header.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            // 엑셀 파일을 ByteArrayOutputStream에 작성
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                workbook.write(outputStream);
                return outputStream.toByteArray();  // 바이트 배열 반환
            } finally {
                workbook.close();
            }
        }catch (Exception e){
            throw new UserException("오류 관리자에게 문의",e.getCause().toString(),"엑셀", System.getProperty("user.name") ,"admin","");
        }
    }
}
