/*
설명: 사용자 예외 처리 Mapper
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************


*/

package wizard.eVC.wizLog.exception;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.wizLog.exception.dto.UserExceptionDto;

@Mapper
public interface UserExceptionMapper {
    UserExceptionDto xp_iErrLog(UserExceptionDto userExceptionDto);

    UserExceptionDto xp_iErrLogSub(UserExceptionDto userExceptionDto);

}
