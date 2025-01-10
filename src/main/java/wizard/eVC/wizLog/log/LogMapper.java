/*
설명: log 맵퍼
작성일: 2024.11.20
개발자: KDH
********************************************************
수정일자       수정자          요청자     요청내용
********************************************************

-*/

package wizard.eVC.wizLog.log;

import org.apache.ibatis.annotations.Mapper;
import wizard.eVC.wizLog.log.dto.LogDto;

@Mapper
public interface LogMapper {

    //WizLog 로그
    LogDto xp_iLog(LogDto logDto);

    //화면 사용 로그
    LogDto xp_iWorkLogWeb(LogDto logDto);

}
